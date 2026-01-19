import { motion } from "framer-motion";
import { CreditCard, ArrowRightLeft, TrendingDown, Check } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    step: "01",
    title: "Connect your cards",
    description: "Securely link your debit or credit cards. We use bank-level encryption to keep your data safe.",
  },
  {
    icon: ArrowRightLeft,
    step: "02",
    title: "We round up purchases",
    description: "Every transaction gets rounded to the nearest dollar. $8.99 becomes $9.00 — that's $0.01 saved.",
  },
  {
    icon: TrendingDown,
    step: "03",
    title: "Watch your debt shrink",
    description: "Round-ups are automatically applied to your debt. No effort required — just live your life.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-24"
        >
          <p className="text-primary font-semibold mb-4">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
  <span className="text-white">Three steps to</span>
  <span className="gradient-text"> debt freedom</span>
</h2>
          <p className="text-lg text-muted-foreground">
            Set it once, forget it forever. Micropay works silently in the background 
            while you focus on what matters.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="glass-card p-8 lg:p-10 h-full hover-lift relative overflow-hidden">
                {/* Gradient accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Step number */}
               <span className="text-6xl font-extrabold font-mono absolute top-4 right-6 text-primary/70 drop-shadow">
  {step.step}
</span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Checkmark */}
                <div className="mt-6 flex items-center gap-2 text-sm text-primary">
                  <Check className="w-4 h-4" />
                  <span>Takes 2 minutes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines (desktop only) */}
        <div className="hidden md:flex justify-center items-center mt-12 gap-4">
          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <div className="h-0.5 w-32 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};
