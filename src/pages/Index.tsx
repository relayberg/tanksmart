import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TipsSection } from "@/components/landing/TipsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="TankSmart24.de - Heizöl Preisvergleich | Günstig Heizöl kaufen"
        description="Deutschlands führendes Heizöl-Preisvergleichsportal. Vergleichen Sie über 200 geprüfte Anbieter und sparen Sie bis zu 30% bei Ihrer nächsten Heizölbestellung."
        canonical="https://tanksmart24.de"
      />
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TipsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
