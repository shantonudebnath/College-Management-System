'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES, MADRASHA_CLASSES, STUDENTS, COLLEGE_INFO } from '@/lib/data';
import { PRINCIPAL_SIGN } from '@/components/ui/StudentIdCard';
import type { Student } from '@/lib/types';
import { IdCard, Trash2, Printer, X, Users, CheckCircle, AlertCircle, ChevronDown, Settings, RefreshCw } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import type { Fee } from '@/lib/types';
import { kvGet, kvSet } from '@/lib/supabase/kv';
import { useStudents } from '@/context/StudentsContext';
import { useFees } from '@/context/FeesContext';

const EXAMS_KEY = 'nim_exams_v1';
const ENTRIES_KEY = 'nim_exam_entries_v1';
const HALLS_KEY = 'nim_halls_v1';
const SEATS_KEY = 'nim_seats_v1';

export interface AdmitCardConfig {
  id: string;
  examId?: string;
  examName: string;
  examYear?: string;
  class: string;
  requiredFeeTypes: string[];
  issued: boolean;
  createdAt: string;
  specialRecommendations: string[];
}

interface Exam { id: string; name: string; year: string; }
interface ExamEntry { id: string; examId: string; classIds: string[]; subject: string; date: string; startTime: string; endTime: string; }
interface Hall { id: string; examId: string; hallName: string; capacity: number; guardName?: string; }
interface SeatAssignment { examId: string; hallId: string; studentId: string; seatNumber: number; }
interface ScheduleItem { subject: string; date: string; startTime: string; endTime: string; }
interface SeatInfo { hallName: string; seatNumber: number; guardName?: string; }

export default function AdminAdmitCardsPage() {
  const { students: ctxStudents } = useStudents();
  const { fees: ctxFees } = useFees();
  const allStudents = ctxStudents.length > 0 ? ctxStudents : STUDENTS;
  const allFees: Fee[] = ctxFees.length > 0 ? ctxFees : FEES;
  const feeTypes = [...new Set(allFees.map(f => f.feeType))];

  const [cards, setCards] = useState<AdmitCardConfig[]>([]);
  const cardsLoaded = useRef(false);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [allEntries, setAllEntries] = useState<ExamEntry[]>([]);
  const [allHalls, setAllHalls] = useState<Hall[]>([]);
  const [allSeats, setAllSeats] = useState<SeatAssignment[]>([]);

  const [mounted, setMounted] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [editFeeCard, setEditFeeCard] = useState<AdmitCardConfig | null>(null);
  const [bulkFeeExamId, setBulkFeeExamId] = useState<string | null>(null);
  const [bulkFeeTypes, setBulkFeeTypes] = useState<string[]>([]);
  const [detailCard, setDetailCard] = useState<AdmitCardConfig | null>(null);
  const [printCard, setPrintCard] = useState<AdmitCardConfig | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!cardsLoaded.current) { cardsLoaded.current = true; return; }
    kvSet('admit_cards_store', cards);
  }, [cards]);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      kvGet<AdmitCardConfig[]>('admit_cards_store'),
      kvGet<Exam[]>(EXAMS_KEY),
      kvGet<ExamEntry[]>(ENTRIES_KEY),
      kvGet<Hall[]>(HALLS_KEY),
      kvGet<SeatAssignment[]>(SEATS_KEY),
    ]).then(([cardsData, examsData, entriesData, hallsData, seatsData]) => {
      if (cardsData) setCards(cardsData);
      if (examsData) { setAllExams(examsData); if (examsData.length > 0) setSelectedExamId(examsData[0].id); }
      if (entriesData) setAllEntries(entriesData);
      if (hallsData) setAllHalls(hallsData);
      if (seatsData) setAllSeats(seatsData);
    });
  }, []);

  const isStudentEligible = (studentId: string, card: AdmitCardConfig) => {
    if ((card.specialRecommendations ?? []).includes(studentId)) return true;
    if (card.requiredFeeTypes.length === 0) return true;
    const sf = allFees.filter(f => f.studentId === studentId);
    return card.requiredFeeTypes.every(ft => sf.some(f => f.feeType === ft && f.status === 'paid'));
  };

  const toggleSpecialRec = (cardId: string, studentId: string) => {
    setCards(p => p.map(c => {
      if (c.id !== cardId) return c;
      const recs = c.specialRecommendations ?? [];
      return { ...c, specialRecommendations: recs.includes(studentId) ? recs.filter(id => id !== studentId) : [...recs, studentId] };
    }));
  };

  const getSchedule = (card: AdmitCardConfig): ScheduleItem[] => {
    if (!card.examId) return [];
    return allEntries.filter(e => e.examId === card.examId && e.classIds.includes(card.class)).sort((a, b) => a.date.localeCompare(b.date));
  };

  const getSeatInfo = (studentId: string, examId?: string): SeatInfo | null => {
    if (!examId) return null;
    const seat = allSeats.find(s => s.examId === examId && s.studentId === studentId);
    if (!seat) return null;
    const hall = allHalls.find(h => h.id === seat.hallId);
    if (!hall) return null;
    return { hallName: hall.hallName, seatNumber: seat.seatNumber, guardName: hall.guardName };
  };

  const toggleIssued = (id: string) => setCards(p => p.map(c => c.id === id ? { ...c, issued: !c.issued } : c));

  const issueAll = (examId: string) => setCards(p => p.map(c => c.examId === examId ? { ...c, issued: true } : c));
  const unissueAll = (examId: string) => setCards(p => p.map(c => c.examId === examId ? { ...c, issued: false } : c));

  const saveFeeEdit = (newFees: string[]) => {
    if (!editFeeCard) return;
    setCards(p => p.map(c => c.id === editFeeCard.id ? { ...c, requiredFeeTypes: newFees } : c));
    setEditFeeCard(null);
  };

  const saveBulkFee = () => {
    if (!bulkFeeExamId) return;
    setCards(p => p.map(c => c.examId === bulkFeeExamId ? { ...c, requiredFeeTypes: bulkFeeTypes } : c));
    setBulkFeeExamId(null);
  };

  const generateCardsForExam = (exam: Exam) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = cards.filter(c => c.examId !== exam.id);
    const newCards: AdmitCardConfig[] = MADRASHA_CLASSES.map(cls => ({
      id: `ac_${exam.id}_${cls.id}_${Date.now()}`,
      examId: exam.id, examName: exam.name, examYear: exam.year,
      class: cls.id, requiredFeeTypes: [], issued: false, createdAt: today, specialRecommendations: [],
    }));
    setCards([...newCards, ...existing]);
  };

  const printStudents = printCard ? allStudents.filter(s => s.class === printCard.class) : [];
  const printSchedule = printCard ? getSchedule(printCard) : [];

  const examCards = allExams.map(exam => ({
    exam,
    cards: cards.filter(c => c.examId === exam.id).sort((a, b) => {
      const ai = MADRASHA_CLASSES.findIndex(c => c.id === a.class);
      const bi = MADRASHA_CLASSES.findIndex(c => c.id === b.class);
      return ai - bi;
    }),
  }));

  const orphanCards = cards.filter(c => !c.examId || !allExams.find(e => e.id === c.examId));

  return (
    <div>
      <DashboardHeader title="এডমিট কার্ড ব্যবস্থাপনা" subtitle="পরীক্ষার প্রবেশপত্র কনফিগার ও ইস্যু করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {allExams.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <IdCard size={44} className="mx-auto mb-3 opacity-25" />
            <p className="font-medium text-sm">কোনো পরীক্ষা তৈরি হয়নি</p>
            <p className="text-xs mt-1">পরীক্ষা সময়সূচী পাতা থেকে পরীক্ষা তৈরি করলে এখানে এডমিট কার্ড স্বয়ংক্রিয়ভাবে তৈরি হবে।</p>
          </div>
        )}

        {examCards.map(({ exam, cards: examCardList }) => (
          <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Exam header */}
            <div className="bg-[#1e1b4b] text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold text-base">{exam.name}</h2>
                <p className="text-purple-300 text-xs mt-0.5">{exam.year} · {examCardList.length}টি শ্রেণি</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {examCardList.length === 0 ? (
                  <button onClick={() => generateCardsForExam(exam)}
                    className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs px-3 py-2 rounded-lg font-semibold">
                    <RefreshCw size={13} /> কার্ড তৈরি করুন
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setBulkFeeExamId(exam.id); setBulkFeeTypes(examCardList[0]?.requiredFeeTypes ?? []); }}
                      className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium">
                      <Settings size={13} /> ফি শর্ত (সব)
                    </button>
                    <button onClick={() => issueAll(exam.id)}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-semibold">
                      <CheckCircle size={13} /> সব ইস্যু
                    </button>
                    <button onClick={() => unissueAll(exam.id)}
                      className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium">
                      <X size={13} /> ইস্যু বাতিল
                    </button>
                  </>
                )}
              </div>
            </div>

            {examCardList.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                কোনো এডমিট কার্ড নেই — উপরে &quot;কার্ড তৈরি করুন&quot; ক্লিক করুন।
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {examCardList.map(card => {
                  const classInfo = MADRASHA_CLASSES.find(c => c.id === card.class);
                  const classStudents = allStudents.filter(s => s.class === card.class);
                  const eligibleCount = classStudents.filter(s => isStudentEligible(s.id, card)).length;
                  const cardSchedule = getSchedule(card);
                  const hasSeats = classStudents.some(s => getSeatInfo(s.id, card.examId) !== null);
                  const isOpen = detailCard?.id === card.id;

                  return (
                    <div key={card.id}>
                      <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.issued ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <IdCard size={18} className={card.issued ? 'text-green-600' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{classInfo?.nameBn ?? card.class}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.issued ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {card.issued ? '✓ ইস্যু হয়েছে' : 'ড্রাফট'}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={11} /> {classStudents.length} জন</span>
                            {card.issued && <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle size={10} /> {eligibleCount} জন পাবে</span>}
                            {cardSchedule.length > 0 && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">📅 {cardSchedule.length}টি বিষয়</span>}
                            {hasSeats && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🪑 আসন বরাদ্দ</span>}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {card.requiredFeeTypes.length > 0
                              ? card.requiredFeeTypes.map(ft => <span key={ft} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{ft}</span>)
                              : <span className="text-[10px] text-gray-400">কোনো ফি শর্ত নেই</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                          <button onClick={() => { setEditFeeCard(card); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-semibold">
                            <Settings size={12} /> ফি
                          </button>
                          <button onClick={() => setDetailCard(isOpen ? null : card)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-semibold">
                            <Users size={12} /> তালিকা
                            <ChevronDown size={11} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          <button onClick={() => setPrintCard(card)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold">
                            <Printer size={12} /> প্রিন্ট
                          </button>
                          <button onClick={() => toggleIssued(card.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${card.issued ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                            {card.issued ? 'বাতিল' : 'ইস্যু'}
                          </button>
                          <button onClick={() => setDeleteTarget({ id: card.id, name: `${exam.name} — ${classInfo?.nameBn ?? card.class}` })}
                            className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="border-t border-gray-100 px-5 pb-4 pt-3 bg-gray-50/40">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">শিক্ষার্থী তালিকা — {classInfo?.nameBn}</p>
                          {classStudents.length === 0
                            ? <p className="text-xs text-gray-400 italic">এই শ্রেণিতে কোনো শিক্ষার্থী নেই।</p>
                            : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {classStudents.map(s => {
                                  const hasRec = (card.specialRecommendations ?? []).includes(s.id);
                                  const sf = allFees.filter(f => f.studentId === s.id);
                                  const feesPaid = card.requiredFeeTypes.length === 0 || card.requiredFeeTypes.every(ft => sf.some(f => f.feeType === ft && f.status === 'paid'));
                                  const eligible = hasRec || feesPaid;
                                  const pendingFees = card.requiredFeeTypes.filter(ft => !sf.some(f => f.feeType === ft && f.status === 'paid'));
                                  const si = getSeatInfo(s.id, card.examId);
                                  return (
                                    <div key={s.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${hasRec ? 'border-amber-300 bg-amber-50/60' : eligible ? 'border-green-200 bg-green-50/50' : 'border-red-100 bg-red-50/30'}`}>
                                      <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-purple-100 flex items-center justify-center mt-0.5">
                                        {s.image ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" /> : <span className="text-[9px] font-bold text-purple-600">{s.name[0]}</span>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 flex-wrap">
                                          <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                                          {hasRec && <span className="text-[9px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">বিশেষ</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400">রোল: {s.roll}</p>
                                        {si && <p className="text-[10px] text-purple-600 font-semibold">আসন: {si.seatNumber} | হল: {si.hallName}</p>}
                                        {!feesPaid && !hasRec && pendingFees.length > 0 && <p className="text-[10px] text-red-500 truncate">বকেয়া: {pendingFees.join(', ')}</p>}
                                        {!feesPaid && (
                                          <button onClick={() => toggleSpecialRec(card.id, s.id)}
                                            className={`mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-colors ${hasRec ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-700'}`}>
                                            {hasRec ? '✕ প্রত্যাহার' : '★ বিশেষ সুপারিশ'}
                                          </button>
                                        )}
                                      </div>
                                      {eligible ? <CheckCircle size={14} className={`shrink-0 mt-0.5 ${hasRec ? 'text-amber-500' : 'text-green-500'}`} />
                                        : <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Orphan cards (old ones without examId) */}
        {orphanCards.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700">
            <p className="font-semibold mb-1">পুরাতন এডমিট কার্ড ({orphanCards.length}টি) — পরীক্ষার সাথে সংযুক্ত নয়</p>
            <div className="flex flex-wrap gap-1.5">
              {orphanCards.map(c => (
                <span key={c.id} className="flex items-center gap-1 bg-white border border-amber-200 rounded-lg px-2 py-1">
                  {c.examName} — {MADRASHA_CLASSES.find(cl => cl.id === c.class)?.nameBn ?? c.class}
                  <button onClick={() => setDeleteTarget({ id: c.id, name: c.examName })} className="ml-1 text-red-400 hover:text-red-600"><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fee edit modal (single card) */}
      {editFeeCard && (
        <FeeModal
          title={`ফি শর্ত — ${MADRASHA_CLASSES.find(c => c.id === editFeeCard.class)?.nameBn ?? editFeeCard.class}`}
          feeTypes={feeTypes}
          initial={editFeeCard.requiredFeeTypes}
          onSave={saveFeeEdit}
          onClose={() => setEditFeeCard(null)}
        />
      )}

      {/* Bulk fee modal (all classes of exam) */}
      {bulkFeeExamId && (
        <FeeModal
          title={`ফি শর্ত — সব শ্রেণি (${allExams.find(e => e.id === bulkFeeExamId)?.name ?? ''})`}
          feeTypes={feeTypes}
          initial={bulkFeeTypes}
          onSave={saveBulkFee}
          onClose={() => setBulkFeeExamId(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { setCards(p => p.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {printCard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-100 rounded-2xl w-full max-w-5xl my-4 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-white rounded-t-2xl border-b border-gray-200">
              <div>
                <h2 className="font-semibold text-gray-900">{printCard.examName} — প্রিন্ট প্রিভিউ</h2>
                <p className="text-xs text-gray-400 mt-0.5">{MADRASHA_CLASSES.find(c => c.id === printCard.class)?.nameBn} — {printStudents.length} জন</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                  <Printer size={15} /> প্রিন্ট করুন
                </button>
                <button onClick={() => setPrintCard(null)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <p className="text-xs text-gray-400 mb-3 text-center">প্রিভিউ (প্রতিটি A4 পাতায় ২টি করে কার্ড)</p>
              <PreviewGrid students={printStudents} card={printCard} schedule={printSchedule} getSeatInfo={(sid) => getSeatInfo(sid, printCard.examId)} />
            </div>
          </div>
        </div>
      )}

      {printCard && mounted && createPortal(
        <div id="admit-print-area">
          <style>{`
            @media screen { #admit-print-area { display: none !important; } }
            @media print {
              @page { size: A4 portrait; margin: 8mm; }
              body > *:not(#admit-print-area) { display: none !important; }
              #admit-print-area { display: block !important; }
              body { margin: 0 !important; padding: 0 !important; }
              .admit-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4mm;
                margin-bottom: 4mm;
                page-break-inside: avoid;
                break-inside: avoid;
              }
            }
          `}</style>
          <PrintGrid students={printStudents} card={printCard} schedule={printSchedule} getSeatInfo={(sid) => getSeatInfo(sid, printCard.examId)} />
        </div>,
        document.body
      )}
    </div>
  );
}

function FeeModal({ title, feeTypes, initial, onSave, onClose }: {
  title: string; feeTypes: string[]; initial: string[];
  onSave: (fees: string[]) => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = (ft: string) => setSelected(p => p.includes(ft) ? p.filter(f => f !== ft) : [...p, ft]);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-500">এই ফিগুলো পরিশোধ না করলে শিক্ষার্থী এডমিট কার্ড পাবে না।</p>
          {feeTypes.length === 0
            ? <p className="text-xs text-gray-400 italic bg-gray-50 rounded-xl p-3">কোনো ফি যোগ করা হয়নি।</p>
            : (
              <div className="grid grid-cols-1 gap-2">
                {feeTypes.map(ft => (
                  <label key={ft} className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${selected.includes(ft) ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                    <input type="checkbox" checked={selected.includes(ft)} onChange={() => toggle(ft)} className="accent-purple-600 shrink-0" />
                    <span className="text-sm text-gray-700">{ft}</span>
                  </label>
                ))}
              </div>
            )}
          {selected.length === 0 && feeTypes.length > 0 && (
            <p className="text-[11px] text-amber-600">⚠ শর্ত না দিলে সবাই ডাউনলোড করতে পারবে।</p>
          )}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={() => onSave(selected)} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">সংরক্ষণ করুন</button>
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
        </div>
      </div>
    </div>
  );
}

interface MiniCardGridProps {
  students: typeof STUDENTS;
  card: AdmitCardConfig;
  schedule: ScheduleItem[];
  getSeatInfo: (studentId: string) => SeatInfo | null;
}

function MiniCard({ student, card, schedule, seatInfo }: { student: (typeof STUDENTS)[0]; card: AdmitCardConfig; schedule: ScheduleItem[]; seatInfo: SeatInfo | null }) {
  const cls = MADRASHA_CLASSES.find(c => c.id === student.class)?.nameBn ?? student.class;
  const B = (v: string) => <strong style={{ fontWeight: 700 }}>{v}</strong>;
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.2mm' }}>
      <span style={{ minWidth: '17mm', fontSize: '6.5pt', color: '#333', flexShrink: 0 }}>{label} :</span>
      <span style={{ flex: 1, fontWeight: 700, fontSize: '7pt', borderBottom: '0.8px solid #555', paddingBottom: '0.3mm', minWidth: '20mm' }}>{value}</span>
    </div>
  );
  return (
    <div style={{ border: '2.5px solid #000', fontFamily: "'Noto Serif Bengali', 'Vrinda', serif", fontSize: '7pt', pageBreakInside: 'avoid', breakInside: 'avoid', overflow: 'hidden', background: '#fff', position: 'relative' }}>
      {/* Logo watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80px', opacity: 0.06, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ margin: '2px', border: '1px solid #000', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ borderBottom: '1.5px solid #000', padding: '1.5mm 3mm', textAlign: 'center', background: '#f9f9f9' }}>
          <div style={{ fontWeight: 900, fontSize: '9.5pt', lineHeight: 1.3 }}>{COLLEGE_INFO.nameBn}</div>
          <div style={{ fontSize: '6pt', color: '#555', marginTop: '0.5mm' }}>{COLLEGE_INFO.address}</div>
          <div style={{ fontSize: '5.5pt', color: '#666' }}>ইআইআইএন: {COLLEGE_INFO.eiin} &nbsp;|&nbsp; ফোন: {COLLEGE_INFO.phone}</div>
        </div>

        {/* Title bar */}
        <div style={{ borderBottom: '1.5px solid #000', padding: '1mm 3mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', color: '#fff' }}>
          <span style={{ fontWeight: 700, fontSize: '8pt', letterSpacing: '1px' }}>প্রবেশপত্র</span>
          <span style={{ fontSize: '6pt', letterSpacing: '0.5px' }}>ADMIT CARD</span>
          <span style={{ fontWeight: 700, fontSize: '7pt' }}>{card.examName} — {card.examYear ?? ''}</span>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Info */}
          <div style={{ flex: 1, padding: '2mm 3mm 2mm', borderRight: '1px solid #000' }}>
            <Row label="নাম" value={student.name} />
            <Row label="পিতার নাম" value={student.fatherName} />
            <Row label="মাতার নাম" value={student.motherName || '—'} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2mm' }}>
              <Row label="শ্রেণি" value={cls} />
              <Row label="শাখা" value={student.section || '—'} />
              <Row label="রোল নং" value={String(student.roll)} />
              <Row label="সেশন" value={student.session || '—'} />
            </div>
            <Row label="রেজি. নং" value={student.studentId} />
          </div>
          {/* Photo */}
          <div style={{ width: '22mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2mm', gap: '1.5mm' }}>
            <div style={{ width: '18mm', height: '22mm', border: '1px solid #777', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#aaa', fontSize: '5.5pt', textAlign: 'center', overflow: 'hidden' }}>
              {student.image
                ? <img src={student.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <><div style={{ fontSize: '16pt', lineHeight: 1, color: '#ddd' }}>☐</div><span>ছবি</span></>}
            </div>
            <div style={{ fontSize: '5.5pt', color: '#666', textAlign: 'center', lineHeight: 1.3 }}>সত্যায়িত<br/>ছবি</div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ borderTop: '1.5px solid #000', display: 'flex', justifyContent: 'space-between', padding: '2.5mm 4mm 2mm', fontSize: '6pt', color: '#333' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '7mm' }} />
            <div style={{ borderTop: '0.8px solid #333', paddingTop: '0.5mm', minWidth: '24mm' }}>পরীক্ষার্থীর স্বাক্ষর</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '7mm' }} />
            <div style={{ borderTop: '0.8px solid #333', paddingTop: '0.5mm', minWidth: '24mm' }}>শ্রেণী শিক্ষকের স্বাক্ষর</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRINCIPAL_SIGN} alt="" style={{ height: '7mm', maxWidth: '28mm', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
            <div style={{ borderTop: '0.8px solid #333', paddingTop: '0.5mm', minWidth: '24mm' }}>অধ্যক্ষ / প্রধান শিক্ষক</div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PreviewGrid({ students, card, schedule, getSeatInfo }: MiniCardGridProps) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>{students.map(s => <MiniCard key={s.id} student={s} card={card} schedule={schedule} seatInfo={getSeatInfo(s.id)} />)}</div>;
}

function PrintGrid({ students, card, schedule, getSeatInfo }: MiniCardGridProps) {
  const pairs: Student[][] = [];
  for (let i = 0; i < students.length; i += 2) pairs.push(students.slice(i, i + 2));
  return (
    <div style={{ width: '100%' }}>
      {pairs.map((pair, i) => (
        <div key={i} className="admit-row">
          {pair.map(s => <MiniCard key={s.id} student={s} card={card} schedule={schedule} seatInfo={getSeatInfo(s.id)} />)}
        </div>
      ))}
    </div>
  );
}
