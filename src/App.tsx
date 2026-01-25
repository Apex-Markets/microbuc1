import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ImpactCalculator } from "@/components/ImpactCalculator";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { setCookie, getCookie, removeCookie } from "@/lib/cookies";
import CookieBanner from "@/components/CookieBanner";




const Index = () => {
  useEffect(() => {
  // Smooth scroll setup (your existing code)
  document.documentElement.style.scrollBehavior = 'smooth';

  // ----- Cookie logic starts here -----

  // 1. Track referrer if present in URL (e.g., /?ref=ad123)
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref && !getCookie("referrer")) {
    setCookie("referrer", ref, 7);
  }

  // 2. Count page visits (could be your basic analytics)
  setCookie("visitCount", String(Number(getCookie("visitCount") || 0) + 1), 365);

  // 3. Apply user theme preference if stored in cookie
  const theme = getCookie("theme");
  if (theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  // Clean up
  return () => {
    document.documentElement.style.scrollBehavior = 'auto';
  };
}, []);

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <ImpactCalculator />
        <Features />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
<CookieBanner userId={null} email={null} name={null} />
      <Footer />
    </div>
  );
};

export default Index;
