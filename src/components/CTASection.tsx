import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "No hidden fees, ever",
  "Cancel anytime",
  "Bank-level security",
];

export const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to crush
            <br />
            <span className="gradient-text">your debt?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of people who've discovered the power of spare change. 
            Start your journey to financial freedom today.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="hero" size="xl">
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl">
              Download the app
            </Button>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
