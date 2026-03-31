import { SEOHead } from "./components/SEOHead";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { TrustSection } from "./components/TrustSection";
import { CaseStudiesSection } from "./components/CaseStudiesSection";
import { ProcessSection } from "./components/ProcessSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { YouTubeSection } from "./components/YouTubeSection";
import { DocumentsSection } from "./components/DocumentsSection";
import { ConsultationForm } from "./components/ConsultationForm";
import { Footer } from "./components/Footer";

export default function App() {
  const scrollToConsult = () => {
    const el = document.getElementById("consult");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-white">
        <Navbar onConsultClick={scrollToConsult} />
        <main>
          <HeroSection onConsultClick={scrollToConsult} />
          <ServicesSection onConsultClick={scrollToConsult} />
          <TrustSection />
          <CaseStudiesSection />
          <ProcessSection />
          <ComparisonSection />
          <TestimonialsSection />
          <YouTubeSection />
          <DocumentsSection />
          <ConsultationForm />
        </main>
        <Footer />

        {/* Mobile bottom bar — safe area 대응 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-sm border-t border-zinc-100 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 flex gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <a
            href="tel:010-9892-1927"
            className="flex-1 border border-zinc-200 text-zinc-700 text-sm sm:text-base font-medium py-3.5 text-center active:bg-zinc-50 transition-colors rounded-sm"
          >
            전화 상담
          </a>
          <button
            onClick={scrollToConsult}
            className="flex-1 bg-zinc-950 text-white text-sm sm:text-base font-bold py-3.5 active:bg-zinc-800 transition-colors rounded-sm"
          >
            무료 상담 신청
          </button>
        </div>

        {/* 하단바 높이만큼 여백 확보 */}
        <div className="lg:hidden h-[calc(4rem+env(safe-area-inset-bottom))]" />
      </div>
    </>
  );
}