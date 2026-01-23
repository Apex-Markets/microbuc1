import { motion } from "framer-motion";
import { Shield, Zap, PieChart, Bell, Lock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-level security",
    description: "256-bit encryption and secure API connections. Your data never touches our servers.",
  },
  {
    icon: Zap,
    title: "Instant round-ups",
    description: "Transactions are rounded in real-time. No delays, no batching.",
  },
  {
    icon: PieChart,
    title: "Progress tracking",
    description: "Beautiful dashboards showing your debt shrinking over time.",
  },
  {
    icon: Bell,
    title: "Smart notifications",
    description: "Celebrate milestones and get weekly progress updates.",
  },
  {
    icon: Lock,
    title: "Pause anytime",
    description: "Need a break? Pause round-ups with one tap. No questions asked.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "iOS, Android, and web. Your progress syncs across all devices.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary font-semibold mb-4">Features</p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Built for the</span>
            <span className="gradient-text"> modern debtor</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We've thought of everything so you don't have to think at all.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
<h3
  className={
    "text-lg font-bold mb-2" +
    (feature.title === "Pause anytime" ? " text-white" : "")
  }
>
  {feature.title}
</h3>                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};