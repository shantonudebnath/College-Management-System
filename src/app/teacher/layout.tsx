import TeacherSidebar from '@/components/layout/TeacherSidebar';
import { CurrentTeacherProvider } from '@/context/CurrentTeacherContext';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentTeacherProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8f7ff]">
        <TeacherSidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </CurrentTeacherProvider>
  );
}
