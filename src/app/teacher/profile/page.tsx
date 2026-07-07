'use client';
import { useState, useRef, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useTeachers } from '@/context/TeachersContext';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { User, Phone, BookOpen, Edit3, Save, X, Camera, Award, Hash, Loader2 } from 'lucide-react';

type ProfileForm = { phone: string; email: string; address: string; };

const compressImage = (file: File, maxSide = 400, quality = 0.75): Promise<string> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxSide / img.width, maxSide / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

export default function TeacherProfilePage() {
  const { teachers, updateTeacher } = useTeachers();
  const { currentTeacherId, setCurrentTeacher } = useCurrentTeacher();

  // Resolve session → match teacher
  useEffect(() => {
    if (teachers.length === 0) return;
    fetch('/api/session')
      .then(r => r.ok ? r.json() : null)
      .then((s: { id: string; role: string } | null) => {
        if (!s || s.role !== 'teacher') return;
        const matched = teachers.find(t => t.teacherId === s.id);
        if (matched && matched.id !== currentTeacherId) setCurrentTeacher(matched.id);
      })
      .catch(() => {});
  }, [teachers]);

  const teacher = teachers.find(t => t.id === currentTeacherId) ?? null;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ phone: '', email: '', address: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [profileImg, setProfileImg] = useState<string | undefined>(undefined);
  const photoRef = useRef<HTMLInputElement>(null);

  // Initialize form with teacher's actual data when it loads
  useEffect(() => {
    if (teacher) {
      setForm({
        phone: teacher.phone ?? '',
        email: teacher.email ?? '',
        address: teacher.address ?? '',
      });
      if (teacher.image) setProfileImg(teacher.image);
    }
  }, [teacher?.id]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teacher) return;
    setPhotoSaving(true);
    try {
      const compressed = await compressImage(file, 400, 0.75);
      setProfileImg(compressed);
      await updateTeacher({ ...teacher, image: compressed });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setPhotoSaving(false);
      if (photoRef.current) photoRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!teacher) return;
    setSaving(true);
    try {
      await updateTeacher({
        ...teacher,
        phone: form.phone,
        email: form.email,
        address: form.address,
        image: profileImg ?? teacher.image,
      });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!teacher) return <div className="p-6 text-gray-400">শিক্ষকের তথ্য পাওয়া যাচ্ছে না।</div>;

  return (
    <div>
      <DashboardHeader title="আমার প্রোফাইল" subtitle="শিক্ষকের ব্যক্তিগত তথ্য" userName={teacher.name} role="শিক্ষক" userImage={profileImg} />
      <div className="p-6 space-y-6 max-w-4xl">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={15} /> তথ্য সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}

        {/* Profile card */}
        <div className="gradient-primary text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10 flex items-center gap-5 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30 overflow-hidden">
                {profileImg
                  ? <img src={profileImg} alt={teacher.name} className="w-full h-full object-cover" />
                  : teacher.name[0]
                }
              </div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <button onClick={() => photoRef.current?.click()} disabled={photoSaving} className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors disabled:opacity-60" title="ছবি পরিবর্তন করুন">
                {photoSaving ? <Loader2 size={13} className="text-purple-700 animate-spin" /> : <Camera size={13} className="text-purple-700" />}
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{teacher.name}</h2>
              <p className="text-purple-200 text-sm">{teacher.nameBn}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {Array.isArray(teacher.subject) ? teacher.subject.join(', ') : teacher.subject}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Award size={11} /> {teacher.designation}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Hash size={11} /> {teacher.teacherId}</span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              {editing ? <X size={14} /> : <Edit3 size={14} />}
              {editing ? 'বাতিল' : 'এডিট করুন'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Professional info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={16} className="text-purple-600" /> পেশাগত তথ্য
            </h3>
            <div className="space-y-3">
              {[
                ['শিক্ষক আইডি', teacher.teacherId],
                ['বিষয়', Array.isArray(teacher.subject) ? teacher.subject.join(', ') : teacher.subject],
                ['পদবি', teacher.designation],
                ['বিভাগ', teacher.department],
                ['যোগদানের তারিখ', teacher.joinDate],
                ['শ্রেণি দায়িত্ব', teacher.classes?.join(', ') ?? '—'],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-purple-600" /> ব্যক্তিগত তথ্য
            </h3>
            <div className="space-y-3">
              {[
                ['যোগ্যতা', teacher.qualification ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={16} className="text-purple-600" /> যোগাযোগের তথ্য
              {editing && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-auto">সম্পাদনাযোগ্য</span>}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['phone', 'email', 'address'] as const).map((key) => {
                const labels: Record<string, string> = { phone: 'মোবাইল নম্বর', email: 'ইমেইল', address: 'ঠিকানা' };
                return (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{labels[key]}</label>
                    {editing ? (
                      <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{form[key] || '—'}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {editing && (
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        )}
      </div>
    </div>
  );
}
