import TeacherSidebar from '@/components/layout/TeacherSidebar';
import { CurrentTeacherProvider } from '@/context/CurrentTeacherContext';
import DevFooter from '@/components/layout/DevFooter';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentTeacherProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8f7ff]">
        <TeacherSidebar />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1">{children}</div>
          <DevFooter />
        </div>
      </div>
    </CurrentTeacherProvider>
  );
}
