import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SliderSection from '@/components/home/SliderSection';
import NoticeTicker from '@/components/home/NoticeTicker';
import StatsSection from '@/components/home/StatsSection';
import AdmissionBanner from '@/components/home/AdmissionBanner';
import GallerySection from '@/components/home/GallerySection';
import TeacherPreview from '@/components/home/TeacherPreview';
import ImportantLinks from '@/components/home/ImportantLinks';
import NewsSection from '@/components/home/NewsSection';
import FaqSection from '@/components/home/FaqSection';
import AppDownload from '@/components/home/AppDownload';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <SliderSection />
        <NoticeTicker />
        <StatsSection />
        <NewsSection />
        <AdmissionBanner />
        <GallerySection />
        <TeacherPreview />
        <ImportantLinks />
        <FaqSection />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
}
