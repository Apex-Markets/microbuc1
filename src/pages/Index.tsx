import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ImpactCalculator } from "@/components/ImpactCalculator";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <ImpactCalculator />
        <Features />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
