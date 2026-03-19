import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Clock, Percent, ArrowRight, TrendingDown,
  Car, GraduationCap, CreditCard, Home, Landmark, BarChart3,
  Sparkles, Check,
} from "lucide-react";

// ─── Types & Constants ───────────────────────────────────────────────────────
type DebtCategory = {
  id: string;
  label: string;
  icon: React.ElementType;
  apr: number;
  color: string;
  accent: string;
  minPaymentRate: number; // % of balance as min monthly payment
};

const DEBT_TYPES: DebtCategory[] = [
  { id: "cc",      label: "Credit Card",  icon: CreditCard,    apr: 29.99, color: "#f87171", accent: "hsl(0 60% 12%)",   minPaymentRate: 0.02 },
  { id: "car",     label: "Car Loan",     icon: Car,           apr: 9.0,   color: "#0ea5e9", accent: "hsl(200 85% 12%)", minPaymentRate: 0.022 },
  { id: "student", label: "Student Loan", icon: GraduationCap, apr: 7.0,   color: "#a78bfa", accent: "hsl(258 60% 12%)", minPaymentRate: 0.01 },
  { id: "mortgage",label: "Mortgage",     icon: Home,          apr: 6.8,   color: "#34d399", accent: "hsl(160 60% 10%)", minPaymentRate: 0.005 },
  { id: "401k",    label: "401(k) Boost", icon: Landmark,      apr: 0,     color: "#f59e0b", accent: "hsl(38 80% 10%)",  minPaymentRate: 0 },
];

// ─── Animated number counter ─────────────────────────────────────────────────
const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) => {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(start + (end - start) * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else prevRef.current = end;
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value]);

  const formatted = displayed.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span className={className}>{prefix}{formatted}{suffix}</span>;
};

// ─── Debt payoff amortization ────────────────────────────────────────────────
function calcPayoff(balance: number, apr: number, monthlyExtra: number): {
  monthsBase: number;
  monthsAccelerated: number;
  interestBase: number;
  interestAccelerated: number;
} {
  if (apr === 0) {
    // Investment / 401k mode — project growth instead
    return { monthsBase: 0, monthsAccelerated: 0, interestBase: 0, interestAccelerated: 0 };
  }
  const monthlyRate = apr / 100 / 12;
  const minPayment = Math.max(balance * 0.02, 25);

  const simulate = (extra: number) => {
    let b = balance, months = 0, totalInterest = 0;
    while (b > 0 && months < 600) {
      const interest = b * monthlyRate;
      totalInterest += interest;
      b = b + interest - minPayment - extra;
      months++;
    }
    return { months, totalInterest };
  };

  const base = simulate(0);
  const accel = simulate(monthlyExtra);
  return {
    monthsBase: base.months,
    monthsAccelerated: accel.months,
    interestBase: base.totalInterest,
    interestAccelerated: accel.totalInterest,
  };
}

// ─── Sparkline chart ─────────────────────────────────────────────────────────
const SparklineChart = ({
  monthsBase,
  monthsAccel,
  color,
}: {
  monthsBase: number;
  monthsAccel: number;
  color: string;
}) => {
  const W = 280, H = 80;
  const pts = (months: number, startBalance: number = 15000) =>
    Array.from({ length: Math.min(months + 1, 60) }, (_, i) => {
      const progress = i / Math.min(months, 59);
      const decay = 1 - Math.pow(progress, 0.6);
      return `${(i / 59) * W},${H - decay * (H - 4)}`;
    }).join(" ");

  const baseM = Math.min(monthsBase, 59);
  const accelM = Math.min(monthsAccel, 59);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} y1={H * f} x2={W} y2={H * f}
          stroke="hsl(220 18% 16%)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      {/* Base line */}
      <polyline
        points={pts(baseM)}
        fill="none"
        stroke="hsl(220 15% 28%)"
        strokeWidth="1.5"
        strokeDasharray="5 3"
      />
      {/* Accelerated line */}
      <motion.polyline
        points={pts(accelM)}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      {/* Area fill */}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={`0,${H} ${pts(accelM)} ${(accelM / 59) * W},${H}`}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      {/* Labels */}
      <text x="2" y={H - 2} fontSize="8" fill="hsl(220 15% 35%)" fontFamily="monospace">0</text>
      <text x={W - 20} y={H - 2} fontSize="8" fill="hsl(220 15% 35%)" fontFamily="monospace">60mo</text>
    </svg>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const ImpactCalculator = () => {
  const [transactions, setTransactions] = useState([28]);
  const [avgRoundup, setAvgRoundup] = useState([0.5]);
  const [debtAmount, setDebtAmount] = useState([15000]);
  const [debtTypeIdx, setDebtTypeIdx] = useState(1); // Car Loan default

  const dt = DEBT_TYPES[debtTypeIdx];
  const daily = transactions[0] * avgRoundup[0];
  const monthly = daily * 30;
  const yearly = monthly * 12;

  const { monthsBase, monthsAccelerated, interestBase, interestAccelerated } =
    calcPayoff(debtAmount[0], dt.apr, monthly);

  const monthsFaster = Math.max(0, monthsBase - monthsAccelerated);
  const interestSaved = Math.max(0, interestBase - interestAccelerated);

  const is401k = dt.id === "401k";
  // For 401k: project 7% average annual return over 20 years
  const projectedGrowth = is401k
    ? yearly * ((Math.pow(1 + 0.07 / 12, 240) - 1) / (0.07 / 12))
    : 0;

  return (
    <section id="calculator" className="relative py-28 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "hsl(220 22% 6%)" }} />
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(220 18% 20%), transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(220 18% 20%), transparent)" }} />
      {/* Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-40"
        style={{ background: `radial-gradient(ellipse, ${dt.color}0a 0%, transparent 65%)`, transition: "background 0.5s" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-25"
        style={{ background: "radial-gradient(ellipse, hsl(215 80% 50% / 0.08) 0%, transparent 65%)" }} />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-full"
            style={{ background: "hsl(var(--primary)/0.08)", border: "1px solid hsl(var(--primary)/0.15)", color: "hsl(var(--primary))" }}>
            <Sparkles className="w-3 h-3" /> See the math
          </span>
          <h2 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            Small change.
            <br />
            <span className="gradient-text">Massive difference.</span>
          </h2>
          <p className="text-[1.05rem] leading-relaxed" style={{ color: "hsl(220 15% 52%)" }}>
            Adjust the sliders to match your spending and see exactly how fast
            round-ups compound against your debt — or toward your investments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 xl:gap-14 items-start">

          {/* ── Left: Calculator inputs ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(155deg, hsl(220 22% 9%), hsl(220 18% 7%))",
                border: "1.5px solid hsl(220 18% 15%)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 hsl(220 18% 18%)",
              }}>

              {/* Card header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-6"
                style={{ borderBottom: "1px solid hsl(220 18% 13%)" }}>
                <div>
                  <p className="text-[15px] font-bold text-white">Impact Calculator</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "hsl(220 15% 40%)" }}>Personalize your projection</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(220 18% 12%)", border: "1px solid hsl(220 18% 18%)" }}>
                  <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                  <span className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: "hsl(220 15% 40%)" }}>
                    Live
                  </span>
                </div>
              </div>

              <div className="px-7 py-6 space-y-7">
                {/* Debt/account type selector */}
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "hsl(220 15% 45%)" }}>
                    Goal type
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {DEBT_TYPES.map((t, idx) => {
                      const Icon = t.icon;
                      const active = idx === debtTypeIdx;
                      return (
                        <motion.button
                          key={t.id}
                          onClick={() => setDebtTypeIdx(idx)}
                          whileTap={{ scale: 0.95 }}
                          className="relative flex flex-col items-center gap-1.5 rounded-2xl py-2.5 px-1 transition-all duration-200"
                          style={{
                            background: active ? t.accent : "hsl(220 22% 10%)",
                            border: `1px solid ${active ? t.color + "50" : "hsl(220 18% 16%)"}`,
                            boxShadow: active ? `0 0 16px ${t.color}18` : "none",
                          }}
                        >
                          <Icon className="w-4 h-4" style={{ color: active ? t.color : "hsl(220 15% 38%)" }} />
                          <span className="text-[9px] font-semibold text-center leading-tight"
                            style={{ color: active ? "#f0f6ff" : "hsl(220 15% 38%)" }}>
                            {t.label.split(" ")[0]}
                          </span>
                          {active && (
                            <motion.div layoutId="goalActive"
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              style={{ boxShadow: `inset 0 0 0 1px ${t.color}40` }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={dt.id}
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: dt.accent, border: `1px solid ${dt.color}30` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: dt.color }} />
                      {is401k ? (
                        <p className="text-[11px]" style={{ color: dt.color }}>
                          Projected at <span className="font-bold">7% avg. annual return</span> over 20 years
                        </p>
                      ) : (
                        <p className="text-[11px]" style={{ color: dt.color }}>
                          <span className="font-bold">{dt.apr.toFixed(2)}%</span> avg. APR for {dt.label}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Slider: Daily transactions */}
                <SliderRow
                  label="Daily transactions"
                  value={transactions[0]}
                  display={`${transactions[0]}`}
                  color={dt.color}
                >
                  <Slider value={transactions} onValueChange={setTransactions} min={5} max={50} step={1} className="py-1" />
                </SliderRow>

                {/* Slider: Avg round-up */}
                <SliderRow
                  label="Avg. round-up amount"
                  value={avgRoundup[0]}
                  display={`$${avgRoundup[0].toFixed(2)}`}
                  color={dt.color}
                >
                  <Slider value={avgRoundup} onValueChange={setAvgRoundup} min={0.01} max={0.99} step={0.01} className="py-1" />
                </SliderRow>

                {/* Slider: Debt/goal amount */}
                <SliderRow
                  label={is401k ? "Monthly contribution goal" : "Total debt balance"}
                  value={debtAmount[0]}
                  display={`$${debtAmount[0].toLocaleString()}`}
                  color={dt.color}
                >
                  <Slider value={debtAmount} onValueChange={setDebtAmount} min={1000} max={100000} step={500} className="py-1" />
                </SliderRow>

                {/* Mini daily/monthly/yearly summary */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { label: "Daily", value: daily, decimals: 2 },
                    { label: "Monthly", value: monthly, decimals: 0 },
                    { label: "Yearly", value: yearly, decimals: 0 },
                  ].map(({ label, value, decimals }) => (
                    <div key={label} className="rounded-2xl py-3 text-center"
                      style={{ background: "hsl(220 22% 11%)", border: "1px solid hsl(220 18% 17%)" }}>
                      <p className="text-[15px] font-bold font-mono"
                        style={{ background: `linear-gradient(130deg, ${dt.color}, ${dt.color}99)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        <AnimatedNumber value={value} prefix="$" decimals={decimals} />
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "hsl(220 15% 36%)" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Impact results ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Big impact numbers */}
            <AnimatePresence mode="wait">
              <motion.div key={`${debtTypeIdx}-${Math.round(monthly)}-${debtAmount[0]}`}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl p-6 lg:p-7 space-y-5"
                style={{
                  background: "linear-gradient(155deg, hsl(220 22% 9%), hsl(220 18% 7%))",
                  border: `1.5px solid ${dt.color}22`,
                  boxShadow: `0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px hsl(220 18% 14%), inset 0 1px 0 hsl(220 18% 18%)`,
                }}>

                {/* Result header */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                    style={{ background: dt.color + "18" }}>
                    <TrendingDown className="w-4.5 h-4.5" style={{ color: dt.color }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">Your impact projection</p>
                    <p className="text-[11px]" style={{ color: "hsl(220 15% 40%)" }}>{dt.label} · {is401k ? "7% avg return" : `${dt.apr}% APR`}</p>
                  </div>
                </div>

                {/* Main metrics */}
                {is401k ? (
                  <div className="space-y-3">
                    <MetricRow
                      icon={<DollarSign className="w-4 h-4" style={{ color: dt.color }} />}
                      iconBg={dt.color + "18"}
                      label="Projected 20-year growth"
                      value={projectedGrowth}
                      prefix="$"
                      decimals={0}
                      color={dt.color}
                      large
                    />
                    <MetricRow
                      icon={<BarChart3 className="w-4 h-4" style={{ color: dt.color }} />}
                      iconBg={dt.color + "18"}
                      label="Total contributions over 20 years"
                      value={yearly * 20}
                      prefix="$"
                      decimals={0}
                      color={dt.color}
                    />
                    <MetricRow
                      icon={<Sparkles className="w-4 h-4" style={{ color: dt.color }} />}
                      iconBg={dt.color + "18"}
                      label="Investment gains from round-ups"
                      value={projectedGrowth - yearly * 20}
                      prefix="$"
                      decimals={0}
                      color={dt.color}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <MetricRow
                      icon={<Clock className="w-4 h-4" style={{ color: dt.color }} />}
                      iconBg={dt.color + "18"}
                      label="Months faster to debt freedom"
                      value={monthsFaster}
                      suffix=" mo"
                      color={dt.color}
                      large
                    />
                    <MetricRow
                      icon={<Percent className="w-4 h-4" style={{ color: dt.color }} />}
                      iconBg={dt.color + "18"}
                      label="Interest saved in total"
                      value={interestSaved}
                      prefix="$"
                      decimals={0}
                      color={dt.color}
                    />
                    <MetricRow
                      icon={<DollarSign className="w-4 h-4" style={{ color: dt.color }} />}
                      iconBg={dt.color + "18"}
                      label="Round-up contributions per year"
                      value={yearly}
                      prefix="$"
                      decimals={0}
                      color={dt.color}
                    />
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: 1, background: "hsl(220 18% 13%)" }} />

                {/* Sparkline */}
                {!is401k && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold" style={{ color: "hsl(220 15% 40%)" }}>Debt balance over time</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-px" style={{ background: "hsl(220 15% 28%)", borderTop: "1px dashed" }} />
                          <span className="text-[9.5px]" style={{ color: "hsl(220 15% 35%)" }}>Without</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-0.5 rounded" style={{ background: dt.color }} />
                          <span className="text-[9.5px]" style={{ color: "hsl(220 15% 45%)" }}>With round-ups</span>
                        </div>
                      </div>
                    </div>
                    <SparklineChart monthsBase={monthsBase} monthsAccel={monthsAccelerated} color={dt.color} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Payoff milestone callout */}
            <AnimatePresence mode="wait">
              {!is401k && monthsFaster > 0 && (
                <motion.div
                  key={`callout-${monthsFaster}`}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl px-6 py-5 flex items-center gap-4"
                  style={{
                    background: `linear-gradient(135deg, ${dt.accent}, hsl(220 22% 9%))`,
                    border: `1px solid ${dt.color}30`,
                    boxShadow: `0 8px 32px ${dt.color}10`,
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: dt.color + "18" }}>
                    <dt.icon className="w-5 h-5" style={{ color: dt.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-white">
                      At $<AnimatedNumber value={monthly} decimals={0} />/mo,{" "}
                      your {dt.label} is gone{" "}
                      <span style={{ color: dt.color }}>
                        <AnimatedNumber value={monthsFaster} suffix=" months" /> sooner.
                      </span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "hsl(220 15% 45%)" }}>
                      That's <AnimatedNumber value={interestSaved} prefix="$" decimals={0} /> in interest you'll never pay.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Checklist */}
            <div className="rounded-3xl px-6 py-5 space-y-3"
              style={{
                background: "linear-gradient(155deg, hsl(220 22% 9%), hsl(220 18% 7%))",
                border: "1.5px solid hsl(220 18% 15%)",
              }}>
              <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "hsl(220 15% 38%)" }}>
                Included with every plan
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Automatic round-ups",
                  "AI goal coaching",
                  "Multi-account routing",
                  "Weekly progress reports",
                  "Milestone notifications",
                  "Cancel anytime",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: "#22c55e18" }}>
                      <Check className="w-2.5 h-2.5" style={{ color: "#22c55e" }} strokeWidth={3} />
                    </div>
                    <span className="text-[11.5px]" style={{ color: "hsl(220 15% 50%)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button variant="hero" size="xl" className="group w-full justify-center">
              Start building wealth today
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-center text-[11px]" style={{ color: "hsl(220 15% 30%)" }}>
              Free to start · No credit check · Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Helper sub-components ────────────────────────────────────────────────────
const SliderRow = ({
  label,
  value,
  display,
  color,
  children,
}: {
  label: string;
  value: number;
  display: string;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-[12px] font-semibold" style={{ color: "hsl(220 15% 50%)" }}>
        {label}
      </label>
      <motion.span
        key={display}
        initial={{ opacity: 0, y: -4, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="text-[13px] font-bold font-mono px-2.5 py-0.5 rounded-lg"
        style={{ background: color + "14", color: color, border: `1px solid ${color}28` }}
      >
        {display}
      </motion.span>
    </div>
    {children}
  </div>
);

const MetricRow = ({
  icon,
  iconBg,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  color,
  large = false,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color: string;
  large?: boolean;
}) => (
  <div className="flex items-center gap-3.5 rounded-2xl px-4 py-3"
    style={{ background: "hsl(220 22% 11%)", border: "1px solid hsl(220 18% 17%)" }}>
    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] leading-tight" style={{ color: "hsl(220 15% 42%)" }}>{label}</p>
    </div>
    <p className={`font-bold font-mono shrink-0 ${large ? "text-[20px]" : "text-[15px]"}`}
      style={{ background: `linear-gradient(130deg, ${color}, ${color}bb)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
    </p>
  </div>
);