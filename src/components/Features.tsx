import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield, Zap, PieChart, Bell, Lock, Smartphone,
  Bot, Target, ArrowUpRight, Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    label: "Security",
    title: "Bank-level protection",
    description: "256-bit AES encryption and read-only API access. Your credentials never touch our servers — ever.",
    color: "#0ea5e9",
    accent: "hsl(200 85% 12%)",
    stat: "256-bit",
    statLabel: "encryption",
    span: false,
  },
  {
    icon: Zap,
    label: "Speed",
    title: "Real-time round-ups",
    description: "The moment a transaction clears, your round-up routes to your goal. No batching, no delays, no manual steps.",
    color: "#f59e0b",
    accent: "hsl(38 80% 10%)",
    stat: "<1s",
    statLabel: "processing",
    span: false,
  },
  {
    icon: Bot,
    label: "AI",
    title: "Your personal AI advisor",
    description: "Chat with your AI to optimize allocation, forecast payoff dates, and get proactive tips based on your actual spending patterns.",
    color: "#a78bfa",
    accent: "hsl(258 60% 12%)",
    stat: "24/7",
    statLabel: "AI guidance",
    span: true, // wide card
  },
  {
    icon: PieChart,
    label: "Analytics",
    title: "Beautiful progress dashboards",
    description: "Watch your debt shrink in real time with charts, streaks, and milestone tracking that actually motivates you.",
    color: "#34d399",
    accent: "hsl(160 60% 10%)",
    stat: "Live",
    statLabel: "dashboards",
    span: false,
  },
  {
    icon: Bell,
    label: "Notifications",
    title: "Smart milestone alerts",
    description: "Weekly recaps, debt-free countdowns, and AI insights pushed straight to your phone when they matter most.",
    color: "#f87171",
    accent: "hsl(0 60% 12%)",
    stat: "Weekly",
    statLabel: "recaps",
    span: false,
  },
  {
    icon: Target,
    label: "Goals",
    title: "Route to any account",
    description: "Car loan, student debt, mortgage, 401(k), Roth IRA, brokerage — split across multiple goals however you want.",
    color: "#60a5fa",
    accent: "hsl(215 70% 11%)",
    stat: "10+",
    statLabel: "account types",
    span: false,
  },
  {
    icon: Lock,
    label: "Control",
    title: "Pause or adjust anytime",
    description: "Change your destination, set a max per transaction, or pause entirely. One tap. No friction. No questions asked.",
    color: "#e879f9",
    accent: "hsl(295 60% 11%)",
    stat: "1 tap",
    statLabel: "to pause",
    span: false,
  },
  {
    icon: Smartphone,
    label: "Platform",
    title: "Every device, always in sync",
    description: "Native iOS and Android apps plus a full web dashboard. Your round-ups and progress sync instantly everywhere.",
    color: "#4ade80",
    accent: "hsl(142 60% 10%)",
    stat: "iOS + Android",
    statLabel: "+ Web",
    span: false,
  },
];

// ─── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const Icon = feature.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={feature.span ? "md:col-span-2 lg:col-span-2" : ""}
    >
      <div
        className="group relative h-full rounded-3xl p-6 overflow-hidden cursor-default transition-all duration-300"
        style={{
          background: "linear-gradient(155deg, hsl(220 22% 9%), hsl(220 18% 7%))",
          border: "1.5px solid hsl(220 18% 15%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.border = `1.5px solid ${feature.color}35`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${feature.color}15`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.border = "1.5px solid hsl(220 18% 15%)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
        }}
      >
        {/* Ambient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
          style={{ background: `radial-gradient(ellipse at 0% 0%, ${feature.color}08, transparent 60%)` }}
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: feature.accent, border: `1px solid ${feature.color}30` }}
            >
              <Icon className="w-5 h-5" style={{ color: feature.color }} />
            </div>
            {/* Label */}
            <span
              className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: feature.color + "12", color: feature.color, border: `1px solid ${feature.color}22` }}
            >
              {feature.label}
            </span>
          </div>

          {/* Stat badge */}
          <div className="text-right">
            <p className="text-[15px] font-bold font-mono leading-none" style={{ color: feature.color }}>
              {feature.stat}
            </p>
            <p className="text-[9.5px] mt-0.5" style={{ color: "hsl(220 15% 38%)" }}>
              {feature.statLabel}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-2 ${feature.span ? "max-w-lg" : ""}`}>
          <h3 className="text-[15px] font-bold leading-snug tracking-[-0.01em] text-white">
            {feature.title}
          </h3>
          <p className="text-[13px] leading-relaxed" style={{ color: "hsl(220 15% 48%)" }}>
            {feature.description}
          </p>
        </div>

        {/* Arrow — appears on hover */}
        <div
          className="absolute bottom-5 right-5 w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
          style={{ background: feature.color + "18" }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: feature.color }} />
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}50, transparent)` }}
        />
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const Features = () => {
  return (
    <section id="features" className="relative py-28 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "hsl(220 22% 7%)" }} />
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(220 18% 20%), transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(220 18% 20%), transparent)" }} />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse, hsl(215 80% 50% / 0.07) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, hsl(258 60% 60% / 0.07) 0%, transparent 65%)" }} />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-full"
            style={{ background: "hsl(var(--primary)/0.08)", border: "1px solid hsl(var(--primary)/0.15)", color: "hsl(var(--primary))" }}>
            <Sparkles className="w-3 h-3" /> Everything you need
          </span>
          <h2 className="text-4xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            Built for the way
            <br />
            <span className="gradient-text">real people spend</span>
          </h2>
          <p className="text-[1.05rem] leading-relaxed" style={{ color: "hsl(220 15% 52%)" }}>
            Every detail is designed to work quietly in the background —
            so you stay focused on life, not finances.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14 lg:mb-18"
        >
          {[
            { value: "12,400+", label: "Active users" },
            { value: "$2.1M",   label: "Debt eliminated" },
            { value: "4.9★",    label: "App Store rating" },
          ].map((s) => (
            <div key={s.label} className="text-center rounded-2xl py-4 px-3"
              style={{ background: "hsl(220 22% 9%)", border: "1px solid hsl(220 18% 16%)" }}>
              <p className="text-[20px] font-bold font-mono"
                style={{ background: "linear-gradient(130deg, hsl(var(--primary)), hsl(250 88% 68%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.value}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "hsl(220 15% 38%)" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};