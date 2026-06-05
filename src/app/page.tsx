import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import NoticeTicker from '@/components/home/NoticeTicker';
import FeaturesSection from '@/components/home/FeaturesSection';
import TeacherPreview from '@/components/home/TeacherPreview';
import PortalCards from '@/components/home/PortalCards';
import NewsSection from '@/components/home/NewsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <NoticeTicker />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PortalCards />
        <TeacherPreview />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
