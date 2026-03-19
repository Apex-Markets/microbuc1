import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  CreditCard, Sparkles, Target, Bell, TrendingUp,
  Car, GraduationCap, Home, BarChart3, Landmark,
  Bot, ChevronRight, ArrowUpRight, Check, Zap,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Destination = {
  id: string;
  icon: React.ElementType;
  label: string;
  sub: string;
  color: string;
  accent: string;
  progress: number;
  amount: string;
  monthly: string;
};

// ─── Data ───────────────────────────────────────────────────────────────────
const destinations: Destination[] = [
  { id: "car",    icon: Car,          label: "Car Loan",      sub: "Toyota Financial",  color: "#0ea5e9", accent: "hsl(200 85% 12%)", progress: 67, amount: "$8,240",  monthly: "$67.33" },
  { id: "401k",   icon: Landmark,     label: "401(k)",        sub: "Fidelity",          color: "#a78bfa", accent: "hsl(258 60% 12%)", progress: 42, amount: "$14,820", monthly: "$41.20" },
  { id: "roth",   icon: TrendingUp,   label: "Roth IRA",      sub: "Vanguard",          color: "#34d399", accent: "hsl(160 60% 10%)", progress: 28, amount: "$6,100",  monthly: "$28.80" },
  { id: "broker", icon: BarChart3,    label: "Brokerage",     sub: "Schwab",            color: "#f59e0b", accent: "hsl(38 80% 10%)",  progress: 55, amount: "$22,410", monthly: "$55.00" },
  { id: "student",icon: GraduationCap,label: "Student Loan",  sub: "Navient",           color: "#f87171", accent: "hsl(0 60% 12%)",   progress: 33, amount: "$18,500", monthly: "$33.45" },
  { id: "mortgage",icon: Home,        label: "Mortgage",      sub: "Wells Fargo",       color: "#60a5fa", accent: "hsl(215 70% 11%)", progress: 12, amount: "$287,000",monthly: "$12.90" },
];

const aiMessages = [
  { role: "ai",   text: "Based on your spending, you could be debt-free 2.3 years sooner by allocating 60% to your car loan." },
  { role: "user", text: "What if I split between car loan and 401k?" },
  { role: "ai",   text: "Smart move! That balances debt payoff with compound growth. I'll optimize the split based on interest rates." },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-full"
    style={{ background: "hsl(var(--primary)/0.08)", border: "1px solid hsl(var(--primary)/0.15)", color: "hsl(var(--primary))" }}
  >
    {children}
  </span>
);

// ── Step 1 visual: Connect cards ──────────────────────────────────────────
const ConnectVisual = () => {
  const cards = [
    { label: "Chase Sapphire", last4: "4821", color: "linear-gradient(135deg, hsl(220 50% 22%), hsl(215 60% 32%))", chip: "#f0b429" },
    { label: "Apple Card",     last4: "9034", color: "linear-gradient(135deg, hsl(0 0% 18%), hsl(0 0% 26%))",      chip: "#e5e7eb" },
    { label: "Amex Gold",      last4: "1192", color: "linear-gradient(135deg, hsl(38 65% 35%), hsl(42 70% 45%))",  chip: "#fef3c7" },
  ];
  return (
    <div className="relative flex flex-col gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl p-4 flex items-center gap-4 overflow-hidden"
          style={{ background: c.color, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
        >
          {/* EMV chip */}
          <div className="w-8 h-6 rounded-md shrink-0" style={{ background: c.chip, opacity: 0.85 }}>
            <div className="w-full h-full rounded-md grid grid-cols-2 gap-px p-0.5 opacity-60">
              {[...Array(4)].map((_,j)=> <div key={j} className="rounded-sm" style={{background:"rgba(0,0,0,0.25)"}} />)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/90 truncate">{c.label}</p>
            <p className="text-[11px] text-white/50 font-mono">•••• {c.last4}</p>
          </div>
          {/* Connected badge */}
          <motion.div
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.12, type: "spring", stiffness: 400, damping: 18 }}
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#22c55e" }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
          {/* Shimmer */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)" }} />
        </motion.div>
      ))}
      {/* Bank-level security badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 20% 18%)" }}
      >
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1L8.5 2.5V5C8.5 7 5 9 5 9C5 9 1.5 7 1.5 5V2.5L5 1Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        <p className="text-[11px]" style={{ color: "hsl(220 15% 55%)" }}>
          256-bit encryption · Plaid-powered · Read-only access
        </p>
      </motion.div>
    </div>
  );
};

// ── Step 2 visual: Destination picker ────────────────────────────────────
const DestinationVisual = () => {
  const [selected, setSelected] = useState("car");
  const dest = destinations.find(d => d.id === selected)!;

  return (
    <div className="space-y-2.5">
      {/* Picker grid */}
      <div className="grid grid-cols-3 gap-2">
        {destinations.map((d) => {
          const Icon = d.icon;
          const active = d.id === selected;
          return (
            <motion.button
              key={d.id}
              onClick={() => setSelected(d.id)}
              whileTap={{ scale: 0.96 }}
              className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-200 text-center"
              style={{
                background: active ? d.accent : "hsl(220 22% 10%)",
                border: `1px solid ${active ? d.color + "55" : "hsl(220 18% 17%)"}`,
                boxShadow: active ? `0 0 20px ${d.color}18` : "none",
              }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: active ? d.color + "22" : "hsl(220 18% 14%)" }}>
                <Icon className="w-4 h-4" style={{ color: active ? d.color : "hsl(220 15% 40%)" }} />
              </div>
              <span className="text-[10px] font-semibold leading-tight"
                style={{ color: active ? "#f0f6ff" : "hsl(220 15% 42%)" }}>
                {d.label}
              </span>
              {active && (
                <motion.div layoutId="destDot"
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: d.color }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected account detail */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-4"
        style={{ background: dest.accent, border: `1px solid ${dest.color}33` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[12px] font-bold" style={{ color: "#f0f6ff" }}>{dest.label}</p>
            <p className="text-[10px]" style={{ color: "hsl(220 15% 50%)" }}>{dest.sub}</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-bold font-mono" style={{ color: dest.color }}>{dest.amount}</p>
            <p className="text-[10px]" style={{ color: "hsl(220 15% 45%)" }}>balance</p>
          </div>
        </div>
        {/* Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: "hsl(220 15% 40%)" }}>Round-up progress</span>
            <span className="text-[10px] font-semibold" style={{ color: dest.color }}>{dest.monthly}/mo</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(220 20% 14%)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${dest.color}, ${dest.color}99)` }}
              initial={{ width: 0 }} animate={{ width: `${dest.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      <p className="text-[10.5px] text-center" style={{ color: "hsl(220 15% 35%)" }}>
        Split across multiple accounts anytime
      </p>
    </div>
  );
};

// ── Step 3 visual: AI goal advisor ────────────────────────────────────────
const AIGoalVisual = () => {
  const [shown, setShown] = useState(0);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // Reveal messages sequentially
  const [visCount, setVisCount] = useState(0);
  if (inView && visCount === 0) {
    setTimeout(() => setVisCount(1), 400);
    setTimeout(() => setVisCount(2), 1600);
    setTimeout(() => setVisCount(3), 2600);
  }

  return (
    <div ref={ref} className="space-y-3">
      {/* Goal cards */}
      <div className="grid grid-cols-2 gap-2 mb-1">
        {[
          { label: "Debt-free date", value: "Mar 2027", icon: Target, color: "#0ea5e9" },
          { label: "Monthly round-ups", value: "$68.40", icon: Zap, color: "#a78bfa" },
          { label: "Total saved", value: "$1,240", icon: TrendingUp, color: "#34d399" },
          { label: "Payoff acceleration", value: "2.3 yrs", icon: ArrowUpRight, color: "#f59e0b" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.35 }}
            className="rounded-2xl p-3"
            style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 17%)" }}
          >
            <Icon className="w-4 h-4 mb-1.5" style={{ color }} />
            <p className="text-[13px] font-bold font-mono" style={{ color: "#f0f6ff" }}>{value}</p>
            <p className="text-[10px] leading-tight" style={{ color: "hsl(220 15% 40%)" }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Chat */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(220 22% 9%)", border: "1px solid hsl(220 18% 16%)" }}>
        <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ borderBottom: "1px solid hsl(220 18% 14%)" }}>
          <div className="w-5 h-5 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#a78bfa)" }}>
            <Bot className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-semibold" style={{ color: "hsl(220 15% 55%)" }}>AI Financial Advisor</span>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
        </div>
        <div className="p-3 space-y-2.5" style={{ minHeight: 120 }}>
          {aiMessages.slice(0, visCount).map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%] rounded-xl px-3 py-2"
                style={{
                  background: m.role === "ai"
                    ? "linear-gradient(135deg, hsl(215 55% 13%), hsl(255 45% 13%))"
                    : "hsl(220 22% 14%)",
                  border: `1px solid ${m.role === "ai" ? "hsl(215 50% 22%)" : "hsl(220 18% 20%)"}`,
                }}>
                <p className="text-[10.5px] leading-relaxed" style={{ color: m.role === "ai" ? "#d1e8ff" : "hsl(220 15% 60%)" }}>
                  {m.text}
                </p>
              </div>
            </motion.div>
          ))}
          {/* Typing indicator */}
          {visCount < aiMessages.length && visCount > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-2">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y: [-2, 2, -2] }} transition={{ duration: 0.7, delay: i*0.15, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: "#0ea5e9", opacity: 0.6 }} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Step 4 visual: Round-up in action ────────────────────────────────────
const RoundupVisual = () => {
  const txns = [
    { merchant: "Starbucks",    amount: "$4.67", roundup: "$0.33", icon: "☕" },
    { merchant: "Uber",         amount: "$12.40", roundup: "$0.60", icon: "🚗" },
    { merchant: "Whole Foods",  amount: "$38.12", roundup: "$0.88", icon: "🛒" },
    { merchant: "Netflix",      amount: "$15.99", roundup: "$0.01", icon: "📺" },
  ];
  return (
    <div className="space-y-2">
      {txns.map((t, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 17%)" }}
        >
          <span className="text-lg">{t.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold" style={{ color: "#f0f6ff" }}>{t.merchant}</p>
            <p className="text-[10px] font-mono" style={{ color: "hsl(220 15% 42%)" }}>{t.amount} charged</p>
          </div>
          <div className="text-right">
            <motion.p className="text-[12px] font-bold font-mono"
              style={{ background: "linear-gradient(90deg,#0ea5e9,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.09, type: "spring", stiffness: 300 }}
            >
              +{t.roundup}
            </motion.p>
            <p className="text-[10px]" style={{ color: "hsl(220 15% 35%)" }}>round-up</p>
          </div>
        </motion.div>
      ))}
      {/* Total row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center justify-between rounded-2xl px-4 py-3 mt-1"
        style={{
          background: "linear-gradient(135deg, hsl(215 55% 11%), hsl(255 45% 11%))",
          border: "1px solid hsl(215 50% 22%)",
          boxShadow: "0 4px 24px rgba(14,165,233,0.12)",
        }}
      >
        <p className="text-[12px] font-semibold" style={{ color: "hsl(215 60% 70%)" }}>Today's total round-up</p>
        <p className="text-[15px] font-bold font-mono"
          style={{ background: "linear-gradient(90deg,#0ea5e9,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          +$1.82
        </p>
      </motion.div>
    </div>
  );
};

// ── Step 5 visual: Progress & notifications ───────────────────────────────
const NotificationsVisual = () => {
  const notifs = [
    { title: "Weekly recap 📊", body: "You saved $12.40 this week. On track for March 2027 payoff!", time: "2h ago",   color: "#0ea5e9" },
    { title: "Milestone hit 🎉", body: "You've paid $500 extra toward your Car Loan this year!",      time: "2d ago",   color: "#34d399" },
    { title: "AI insight 🤖",   body: "Raising your round-up cap to $1.00 would cut payoff by 4 months.", time: "5d ago", color: "#a78bfa" },
  ];

  return (
    <div className="space-y-2.5">
      {/* Progress ring + stat */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-4 flex items-center gap-5"
        style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 17%)" }}
      >
        {/* Ring */}
        <div className="relative shrink-0" style={{ width: 72, height: 72 }}>
          <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
            <circle cx="36" cy="36" r="28" fill="none" stroke="hsl(220 18% 16%)" strokeWidth="6" />
            <motion.circle cx="36" cy="36" r="28" fill="none"
              stroke="url(#ringGrad)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={175.9}
              initial={{ strokeDashoffset: 175.9 }}
              whileInView={{ strokeDashoffset: 175.9 * (1 - 0.67) }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[14px] font-bold font-mono" style={{ color: "#f0f6ff" }}>67%</p>
          </div>
        </div>
        <div>
          <p className="text-[13px] font-bold" style={{ color: "#f0f6ff" }}>Car Loan payoff</p>
          <p className="text-[11px]" style={{ color: "hsl(220 15% 42%)" }}>$5,480 remaining</p>
          <p className="text-[10.5px] mt-1" style={{ color: "#0ea5e9" }}>On track · Mar 2027</p>
        </div>
      </motion.div>

      {/* Notification cards */}
      {notifs.map((n, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1, duration: 0.45, ease: [0.16,1,0.3,1] }}
          className="rounded-2xl px-3.5 py-3 flex items-start gap-3"
          style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 17%)" }}
        >
          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[11px] font-semibold" style={{ color: "#f0f6ff" }}>{n.title}</p>
              <p className="text-[9.5px]" style={{ color: "hsl(220 15% 35%)" }}>{n.time}</p>
            </div>
            <p className="text-[10.5px] leading-snug" style={{ color: "hsl(220 15% 48%)" }}>{n.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Steps config ────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: CreditCard,
    label: "Connect",
    title: "Link your cards & accounts",
    description: "Securely connect every card and bank account you use daily. We use Mastercard Open banking API — we never touch your money, only observe transactions.",
    bullets: ["Debit & credit cards", "Checking accounts", "Instant verification", "256-bit AES encryption"],
    visual: <ConnectVisual />,
    color: "#0ea5e9",
  },
  {
    number: "02",
    icon: Target,
    label: "Choose destination",
    title: "Pick where your cents go",
    description: "Direct your round-ups to any financial goal — debt payoff, retirement, investing, or multiple accounts at once. Change anytime.",
    bullets: ["Car, student, mortgage loans", "401(k) & Roth IRA", "Brokerage accounts", "Split across multiple goals"],
    visual: <DestinationVisual />,
    color: "#a78bfa",
  },
  {
    number: "03",
    icon: Bot,
    label: "AI goals",
    title: "Let AI build your payoff plan",
    description: "Our AI advisor analyzes your spending, interest rates, and income to build a personalized roadmap — then adjusts it as your life changes.",
    bullets: ["Payoff date projections", "Smart allocation tips", "Interest rate optimization", "Chat with your advisor anytime"],
    visual: <AIGoalVisual />,
    color: "#34d399",
  },
  {
    number: "04",
    icon: Sparkles,
    label: "Auto round-ups",
    title: "Every purchase does the work",
    description: "Every time you spend, the difference to the next dollar silently routes to your goal. You keep living normally — the micro-payments stack up faster than you'd think.",
    bullets: ["Works on every transaction", "No minimum balance needed", "Instant processing", "Configurable max per transaction"],
    visual: <RoundupVisual />,
    color: "#f59e0b",
  },
  {
    number: "05",
    icon: Bell,
    label: "Track & grow",
    title: "AI keeps you on track",
    description: "Weekly snapshots, milestone celebrations, and proactive AI nudges keep you motivated and informed. See exactly how every cent compounds toward freedom.",
    bullets: ["Weekly progress recaps", "Milestone notifications", "AI-powered insights", "Projected debt-free date"],
    visual: <NotificationsVisual />,
    color: "#f87171",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-28 lg:py-40 overflow-hidden scroll-mt-20">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "hsl(220 22% 5%)" }} />
      {/* Gradient overlays */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(220 18% 20%), transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(220 18% 20%), transparent)" }} />
      {/* Radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse, hsl(215 80% 50% / 0.06) 0%, transparent 65%)" }} />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20 lg:mb-28 space-y-5"
        >
          <SectionLabel><Sparkles className="w-3 h-3" /> How it works</SectionLabel>
          <h2 className="text-4xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            Five steps from setup
            <br />
            <span className="gradient-text">to financially free</span>
          </h2>
          <p className="text-[1.05rem] leading-relaxed" style={{ color: "hsl(220 15% 52%)" }}>
            Built for people who are busy. You configure once, then forget about it —
            while your AI advisor quietly works in the background.
          </p>
        </motion.div>

        {/* Steps — alternating layout */}
        <div className="space-y-20 lg:space-y-28">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className={`grid lg:grid-cols-2 gap-10 xl:gap-20 items-center ${!isEven ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                {/* Content side */}
                <div className="space-y-7">
                  {/* Step label */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: step.color + "18", border: `1px solid ${step.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold tracking-[0.12em] uppercase"
                        style={{ color: step.color }}>{step.label}</span>
                      <span className="w-px h-3" style={{ background: "hsl(220 18% 22%)" }} />
                      <span className="text-[11px] font-mono" style={{ color: "hsl(220 15% 35%)" }}>{step.number} / 05</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl lg:text-[2rem] font-bold leading-[1.15] tracking-[-0.025em] text-white">
                      {step.title}
                    </h3>
                    <p className="text-[1rem] leading-relaxed" style={{ color: "hsl(220 15% 50%)" }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2.5">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: step.color + "18" }}>
                          <Check className="w-3 h-3" style={{ color: step.color }} strokeWidth={2.5} />
                        </div>
                        <span className="text-[13px]" style={{ color: "hsl(220 15% 55%)" }}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA link */}
                  <motion.button
                    className="flex items-center gap-1.5 text-[12px] font-semibold group"
                    style={{ color: step.color }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    Learn more
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </div>

                {/* Visual side */}
                <div className="relative">
                  {/* Glow behind card */}
                  <div className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${step.color}0a, transparent 70%)`, transform: "scale(1.1)" }} />

                  <div className="relative rounded-3xl p-6 lg:p-7"
                    style={{
                      background: "linear-gradient(155deg, hsl(220 22% 9%), hsl(220 18% 7%))",
                      border: "1.5px solid hsl(220 18% 15%)",
                      boxShadow: `0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 hsl(220 18% 18%)`,
                    }}
                  >
                    {/* Card top bar */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1.5">
                        {["#f87171", "#fbbf24", "#34d399"].map((c) => (
                          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.6 }} />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{ background: "hsl(220 18% 12%)", border: "1px solid hsl(220 18% 18%)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: step.color }} />
                        <span className="text-[9.5px] font-semibold uppercase tracking-wider"
                          style={{ color: "hsl(220 15% 40%)" }}>{step.label}</span>
                      </div>
                    </div>

                    {step.visual}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mt-24 lg:mt-32 space-y-4"
        >
          <p className="text-[13px]" style={{ color: "hsl(220 15% 38%)" }}>
            Setup takes less than 3 minutes
          </p>
          <div className="flex items-center justify-center gap-6">
            {["No credit check", "Cancel anytime", "FDIC-insured partners"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[12px]" style={{ color: "hsl(220 15% 42%)" }}>
                <Check className="w-3.5 h-3.5" style={{ color: "#34d399" }} strokeWidth={2.5} />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
