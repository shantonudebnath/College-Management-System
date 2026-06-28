import StudentSidebar from '@/components/layout/StudentSidebar';
import DevFooter from '@/components/layout/DevFooter';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7ff]">
      <StudentSidebar />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">{children}</div>
        <DevFooter />
      </div>
    </div>
  );
}
