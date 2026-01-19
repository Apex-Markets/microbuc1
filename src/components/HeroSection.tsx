import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RoundUpAnimation } from "./RoundUpAnimation";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Debt-free on autopilot</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Every cent</span>
                <br />
                <span className="gradient-text">counts towards</span>
                <br />
                <span className="text-foreground">freedom</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Your $4.67 coffee becomes $5.00. That extra $0.33 goes straight to your debt. 
                Small changes, massive impact.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold font-mono gradient-text">$847</p>
                <p className="text-sm text-muted-foreground">avg. saved yearly</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold font-mono gradient-text">2.3 yrs</p>
                <p className="text-sm text-muted-foreground">faster debt-free</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Start saving now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" className="text-white border-white hover:bg-white/10">
  See how it works
</Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">12,000+</span> users crushing their debt
              </p>
            </div>
          </motion.div>

          {/* Right content - Phone animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="lg:pl-8"
          >
            <RoundUpAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
