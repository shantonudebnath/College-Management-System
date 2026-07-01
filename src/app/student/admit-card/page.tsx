'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { COLLEGE_INFO, FEES } from '@/lib/data';
import { useStudentSession } from '@/hooks/useStudentSession';
import { IdCard, Printer, CheckCircle, AlertCircle, X, Lock, MapPin } from 'lucide-react';
import type { Fee } from '@/lib/types';
import { kvGet } from '@/lib/supabase/kv';
import { useFees } from '@/context/FeesContext';

interface AdmitCardConfig {
  id: string;
  examId?: string;
  examName: string;
  examYear?: string;
  class: string;
  requiredFeeTypes: string[];
  issued: boolean;
  createdAt: string;
  specialRecommendations?: string[];
}

interface ExamEntry {
  id: string;
  examId: string;
  classIds: string[];
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Hall { id: string; hallName: string; guardName: string; }
interface SeatAssignment { examId: string; hallId: string; studentId: string; seatNumber: number; branchNumber?: number; seatInBranch?: number; }

export default function AdmitCardPage() {
  const { student, loading: sessionLoading } = useStudentSession();
  const { fees: ctxFees } = useFees();
  const STUDENT_ID = student?.id ?? '';
  const [admitCards, setAdmitCards] = useState<AdmitCardConfig[]>([]);
  const allFees: Fee[] = ctxFees.length > 0 ? ctxFees : FEES;
  const [allEntries, setAllEntries] = useState<ExamEntry[]>([]);
  const [allHalls, setAllHalls] = useState<Hall[]>([]);
  const [allSeats, setAllSeats] = useState<SeatAssignment[]>([]);
  const [selectedCard, setSelectedCard] = useState<AdmitCardConfig | null>(null);

  useEffect(() => {
    Promise.all([
      kvGet<AdmitCardConfig[]>('admit_cards_store'),
      kvGet<ExamEntry[]>('nim_exam_entries_v1'),
      kvGet<Hall[]>('nim_halls_v1'),
      kvGet<SeatAssignment[]>('nim_seats_v1'),
    ]).then(([cardsData, entriesData, hallsData, seatsData]) => {
      if (cardsData) setAdmitCards(cardsData);
      if (entriesData) setAllEntries(entriesData);
      if (hallsData) setAllHalls(hallsData);
      if (seatsData) setAllSeats(seatsData);
    });
  }, []);

  const studentFees = allFees.filter(f => f.studentId === STUDENT_ID);

  const isEligible = (card: AdmitCardConfig) => {
    if ((card.specialRecommendations ?? []).includes(STUDENT_ID)) return true;
    if (card.requiredFeeTypes.length === 0) return true;
    return card.requiredFeeTypes.every(ft =>
      studentFees.some(f => f.feeType === ft && f.status === 'paid')
    );
  };

  const hasSpecialRec = (card: AdmitCardConfig) =>
    (card.specialRecommendations ?? []).includes(STUDENT_ID);

  const getPendingFees = (card: AdmitCardConfig) =>
    card.requiredFeeTypes.filter(ft =>
      !studentFees.some(f => f.feeType === ft && f.status === 'paid')
    );

  const myAdmitCards = admitCards.filter(c => c.issued && c.class === (student?.class ?? ''));

  // Dynamic schedule from nim_exam_entries_v1
  const getSchedule = (card: AdmitCardConfig) => {
    if (!card.examId) return [];
    return allEntries
      .filter(e => e.examId === card.examId && e.classIds.includes(card.class))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Seat info for this student
  const getSeatInfo = (examId?: string) => {
    if (!examId) return null;
    const seat = allSeats.find(s => s.examId === examId && s.studentId === STUDENT_ID);
    if (!seat) return null;
    const hall = allHalls.find(h => h.id === seat.hallId);
    if (!hall) return null;
    return { hallName: hall.hallName, seatNumber: seat.seatInBranch ?? seat.seatNumber, branchNumber: seat.branchNumber, guardName: hall.guardName };
  };

  const cardSchedule = selectedCard ? getSchedule(selectedCard) : [];
  const cardSeat = selectedCard ? getSeatInfo(selectedCard.examId) : null;

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #admit-card, #admit-card * { visibility: visible !important; }
          #admit-card {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <DashboardHeader title="এডমিট কার্ড" subtitle="পরীক্ষার প্রবেশপত্র" userName={student?.nameBn ?? student?.name ?? 'শিক্ষার্থী'} role="ছাত্র" />
      <div className="p-6 space-y-4">
        {myAdmitCards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <IdCard size={44} className="mx-auto mb-3 opacity-25" />
            <p className="font-medium text-sm">এখনো কোনো এডমিট কার্ড ইস্যু করা হয়নি</p>
            <p className="text-xs mt-1 text-gray-400">প্রশাসন কর্তৃক ইস্যু করা হলে এখানে দেখা যাবে।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAdmitCards.map(card => {
              const eligible = isEligible(card);
              const pendingFees = getPendingFees(card);
              const seatInfo = getSeatInfo(card.examId);
              return (
                <div key={card.id} className={`bg-white rounded-2xl border p-5 ${eligible ? 'border-green-200' : 'border-red-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${eligible ? 'bg-green-100' : 'bg-red-50'}`}>
                      {eligible
                        ? <CheckCircle size={22} className="text-green-600" />
                        : <Lock size={22} className="text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{card.examName}</h3>
                      {card.examYear && <p className="text-xs text-gray-400 mt-0.5">{card.examYear}</p>}
                      {eligible ? (
                        <p className="text-xs mt-0.5 font-medium text-green-600">
                          {hasSpecialRec(card) && !card.requiredFeeTypes.every(ft => studentFees.some(f => f.feeType === ft && f.status === 'paid'))
                            ? '★ বিশেষ সুপারিশে প্রবেশপত্র পাওয়ার অনুমতি দেওয়া হয়েছে'
                            : 'সকল ফি পরিশোধিত — প্রবেশপত্র ডাউনলোড করতে পারবেন'}
                        </p>
                      ) : (
                        <div className="mt-1">
                          <p className="text-xs text-red-600 font-semibold">বকেয়া ফি রয়েছে — প্রবেশপত্র পাওয়া যাবে না</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {pendingFees.map(ft => (
                              <span key={ft} className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                                <AlertCircle size={9} /> {ft}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {seatInfo && eligible && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-700 font-semibold">
                          <MapPin size={12} className="text-purple-500" />
                          হল: {seatInfo.hallName}
                          {seatInfo.branchNumber && <span>| বেঞ্চ: {seatInfo.branchNumber}</span>}
                          <span>| আসন: {seatInfo.seatNumber}</span>
                          {seatInfo.guardName && <span className="text-gray-500 font-normal">| পরিদর্শক: {seatInfo.guardName}</span>}
                        </div>
                      )}
                    </div>
                    {eligible && (
                      <button
                        onClick={() => setSelectedCard(card)}
                        className="flex items-center gap-1.5 btn-primary px-4 py-2 rounded-xl text-xs font-semibold shrink-0">
                        <IdCard size={14} /> প্রবেশপত্র দেখুন
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-100 rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="font-semibold text-gray-900">{selectedCard.examName} — প্রবেশপত্র</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors">
                  <Printer size={13} /> প্রিন্ট
                </button>
                <button onClick={() => setSelectedCard(null)} className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div id="admit-card" className="bg-white mx-4 mb-4 rounded-2xl border-2 border-gray-300 overflow-hidden shadow-lg">
              {/* Header */}
              <div className="gradient-hero text-white p-5 text-center">
                <h2 className="text-lg font-bold">{COLLEGE_INFO.nameBn}</h2>
                <p className="text-purple-200 text-xs">{COLLEGE_INFO.name}</p>
                <p className="text-purple-200 text-xs mt-0.5">{COLLEGE_INFO.address}</p>
                <div className="mt-3 bg-white/20 rounded-xl px-5 py-2 inline-block">
                  <p className="font-bold text-base">প্রবেশপত্র (Admit Card)</p>
                  <p className="text-purple-200 text-xs">{selectedCard.examName}{selectedCard.examYear ? ` — ${selectedCard.examYear}` : ''}</p>
                </div>
              </div>

              <div className="p-6">
                {/* Seat info banner */}
                {cardSeat && (
                  <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <MapPin size={18} className="text-purple-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-purple-800">
                        হল: {cardSeat.hallName}
                        {cardSeat.branchNumber && <> &nbsp;|&nbsp; বেঞ্চ: {cardSeat.branchNumber}</>}
                        &nbsp;|&nbsp; আসন: {cardSeat.seatNumber}
                      </p>
                      {cardSeat.guardName && (
                        <p className="text-xs text-purple-600 mt-0.5">পরিদর্শক: {cardSeat.guardName}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Student info */}
                <div className="flex gap-5">
                  <div className="w-24 h-28 bg-gray-100 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shrink-0 text-gray-300 text-xs">
                    <div className="text-3xl mb-1">👤</div>
                    ছবি
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      ['শিক্ষার্থীর নাম', student?.name ?? '—'],
                      ['বাংলা নাম', student?.nameBn ?? '—'],
                      ['পিতার নাম', student?.fatherName ?? '—'],
                      ['মাতার নাম', student?.motherName ?? '—'],
                      ['রোল নম্বর', String(student?.roll ?? '—')],
                      ['রেজি. নম্বর', student?.studentId ?? '—'],
                      ['শ্রেণি', student?.class ?? '—'],
                      ['শাখা', student?.section ?? '—'],
                      ['সেশন', student?.session ?? '—'],
                      ['জন্ম তারিখ', student?.dob ?? '—'],
                    ].map(([label, value]) => (
                      <div key={label} className="border-b border-gray-100 pb-1">
                        <p className="text-[9px] text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="text-xs font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam schedule */}
                {cardSchedule.length > 0 && (
                  <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 border-b border-gray-200">
                      পরীক্ষার সময়সূচী
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-gray-400 uppercase mb-2">
                        <div>বিষয়</div><div>তারিখ</div><div>সময়</div>
                      </div>
                      {cardSchedule.map((e, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs py-1.5 border-t border-gray-50">
                          <div className="font-medium text-gray-800">{e.subject}</div>
                          <div className="text-gray-500">{e.date}</div>
                          <div className="text-gray-500">{e.startTime}–{e.endTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <div className="text-center text-xs text-gray-400">
                    <div className="w-28 border-t border-gray-400 pt-1">শিক্ষার্থীর স্বাক্ষর</div>
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/principal-sign.jpg" alt="" style={{ height: '28px', maxWidth: '112px', objectFit: 'contain', display: 'block', margin: '0 auto 2px' }} />
                    <div className="w-28 border-t border-gray-400 pt-1">প্রধান শিক্ষকের স্বাক্ষর</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
