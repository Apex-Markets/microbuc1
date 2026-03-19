import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Clock, Percent, ArrowRight, TrendingDown,
  Car, GraduationCap, CreditCard, Home, Landmark, BarChart3,
  Sparkles, Check,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type DebtCategory = {
  id: string; label: string; icon: React.ElementType;
  apr: number; color: string; accent: string;
};

const DEBT_TYPES: DebtCategory[] = [
  { id: "cc",       label: "Credit Card",  icon: CreditCard,    apr: 29.99, color: "#f87171", accent: "hsl(0 60% 12%)"   },
  { id: "car",      label: "Car Loan",     icon: Car,           apr: 9.0,   color: "#0ea5e9", accent: "hsl(200 85% 12%)" },
  { id: "student",  label: "Student Loan", icon: GraduationCap, apr: 7.0,   color: "#a78bfa", accent: "hsl(258 60% 12%)" },
  { id: "mortgage", label: "Mortgage",     icon: Home,          apr: 6.8,   color: "#34d399", accent: "hsl(160 60% 10%)" },
  { id: "401k",     label: "401(k) Boost", icon: Landmark,      apr: 0,     color: "#f59e0b", accent: "hsl(38 80% 10%)"  },
];

// ─── Animated number ──────────────────────────────────────────────────────────
const AnimatedNumber = ({
  value, prefix = "", suffix = "", decimals = 0,
}: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);
  const frameRef = useRef<number | null>(null);
  useEffect(() => {
    const start = prevRef.current, end = value, t0 = performance.now();
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 550, 1);
      setDisplayed(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value]);
  return (
    <span>{prefix}{displayed.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
  );
};

// ─── Fixed amortization ───────────────────────────────────────────────────────
// The KEY fix: minimum payment = monthly interest + 1% of principal (not just 2% of balance).
// This guarantees the balance always decreases so we never get infinite loops or billion-dollar numbers.
function calcPayoff(balance: number, apr: number, monthlyExtra: number) {
  if (apr === 0 || balance <= 0) {
    return { monthsBase: 0, monthsAccelerated: 0, interestBase: 0, interestAccelerated: 0, monthsFaster: 0, interestSaved: 0 };
  }
  const r = apr / 100 / 12;
  // Min payment always covers full monthly interest + 1% of principal — guaranteed payoff
  const minPmt = balance * r + balance * 0.01;

  const simulate = (extra: number) => {
    let b = balance, months = 0, totalInterest = 0;
    while (b > 0.01 && months < 600) {
      const interest = b * r;
      totalInterest += interest;
      b = b + interest - minPmt - extra;
      months++;
    }
    return { months, totalInterest };
  };

  const base  = simulate(0);
  const accel = simulate(monthlyExtra);
  const monthsFaster  = Math.max(0, base.months  - accel.months);
  const interestSaved = Math.max(0, base.totalInterest - accel.totalInterest);

  return {
    monthsBase: base.months, monthsAccelerated: accel.months,
    interestBase: base.totalInterest, interestAccelerated: accel.totalInterest,
    monthsFaster, interestSaved,
  };
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
// Builds the actual month-by-month balance curve — no faking it with Math.pow
const SparklineChart = ({
  balance, apr, monthlyExtra, color,
}: { balance: number; apr: number; monthlyExtra: number; color: string }) => {
  const W = 280, H = 80, WINDOW = 60;
  const r = apr / 100 / 12;
  const minPmt = balance * r + balance * 0.01;

  const buildPts = (extra: number) => {
    let b = balance;
    return Array.from({ length: WINDOW + 1 }, (_, i) => {
      const x = (i / WINDOW) * W;
      const y = H - 4 - Math.max(0, Math.min(b / balance, 1)) * (H - 8);
      if (b > 0) {
        const interest = b * r;
        b = Math.max(0, b + interest - minPmt - extra);
      }
      return `${x},${y}`;
    }).join(" ");
  };

  const basePts  = buildPts(0);
  const accelPts = buildPts(monthlyExtra);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <defs>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} y1={H * f} x2={W} y2={H * f}
          stroke="hsl(220 18% 16%)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      {/* Base (no extra) — dashed */}
      <polyline points={basePts} fill="none" stroke="hsl(220 15% 28%)" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Accelerated fill */}
      <motion.polygon points={`0,${H} ${accelPts} ${W},${H}`} fill="url(#fillGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      {/* Accelerated line */}
      <motion.polyline key={`${balance}-${Math.round(monthlyExtra)}-${apr}`}
        points={accelPts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />
      <text x="2"    y={H - 2} fontSize="8" fill="hsl(220 15% 35%)" fontFamily="monospace">Now</text>
      <text x={W-28} y={H - 2} fontSize="8" fill="hsl(220 15% 35%)" fontFamily="monospace">60 mo</text>
    </svg>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const ImpactCalculator = () => {
  const [transactions, setTransactions] = useState([28]);
  const [avgRoundup,   setAvgRoundup]   = useState([0.5]);
  const [debtAmount,   setDebtAmount]   = useState([15000]);
  const [debtTypeIdx,  setDebtTypeIdx]  = useState(1);

  const dt = DEBT_TYPES[debtTypeIdx];
  const daily   = transactions[0] * avgRoundup[0];
  const monthly = daily * 30;
  const yearly  = monthly * 12;
  const is401k  = dt.id === "401k";

  const { monthsFaster, interestSaved } = calcPayoff(debtAmount[0], dt.apr, monthly);

  const projectedGrowth = is401k
    ? yearly * ((Math.pow(1 + 0.07 / 12, 240) - 1) / (0.07 / 12))
    : 0;

  return (
    <section id="calculator" className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "hsl(220 22% 6%)" }} />
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,hsl(220 18% 20%),transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,hsl(220 18% 20%),transparent)" }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-40"
        style={{ background: `radial-gradient(ellipse,${dt.color}0a 0%,transparent 65%)`, transition: "background 0.5s" }} />

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
            Small change.<br />
            <span className="gradient-text">Massive difference.</span>
          </h2>
          <p className="text-[1.05rem] leading-relaxed" style={{ color: "hsl(220 15% 52%)" }}>
            Adjust the sliders to match your spending and see exactly how fast
            round-ups compound against your debt — or toward your investments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-14 items-start">
          {/* ── Left: Inputs ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(155deg,hsl(220 22% 9%),hsl(220 18% 7%))",
                border: "1.5px solid hsl(220 18% 15%)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5),inset 0 1px 0 hsl(220 18% 18%)",
              }}>
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
                  <span className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: "hsl(220 15% 40%)" }}>Live</span>
                </div>
              </div>

              <div className="px-7 py-6 space-y-7">
                {/* Goal type */}
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "hsl(220 15% 45%)" }}>Goal type</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {DEBT_TYPES.map((t, idx) => {
                      const Icon = t.icon;
                      const active = idx === debtTypeIdx;
                      return (
                        <motion.button key={t.id} onClick={() => setDebtTypeIdx(idx)} whileTap={{ scale: 0.95 }}
                          className="relative flex flex-col items-center gap-1.5 rounded-2xl py-2.5 px-1 transition-all duration-200"
                          style={{
                            background: active ? t.accent : "hsl(220 22% 10%)",
                            border: `1px solid ${active ? t.color + "50" : "hsl(220 18% 16%)"}`,
                            boxShadow: active ? `0 0 16px ${t.color}18` : "none",
                          }}>
                          <Icon className="w-4 h-4" style={{ color: active ? t.color : "hsl(220 15% 38%)" }} />
                          <span className="text-[9px] font-semibold text-center leading-tight"
                            style={{ color: active ? "#f0f6ff" : "hsl(220 15% 38%)" }}>
                            {t.label.split(" ")[0]}
                          </span>
                          {active && (
                            <motion.div layoutId="goalActive"
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              style={{ boxShadow: `inset 0 0 0 1px ${t.color}40` }} />
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
                      <p className="text-[11px]" style={{ color: dt.color }}>
                        {is401k
                          ? <><span className="font-bold">7% avg. annual return</span> projected over 20 years</>
                          : <><span className="font-bold">{dt.apr.toFixed(2)}% APR</span> · min payment covers interest + 1% principal</>
                        }
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <SliderRow label="Daily transactions" display={`${transactions[0]}`} color={dt.color}>
                  <Slider value={transactions} onValueChange={setTransactions} min={5} max={50} step={1} className="py-1" />
                </SliderRow>
                <SliderRow label="Avg. round-up amount" display={`$${avgRoundup[0].toFixed(2)}`} color={dt.color}>
                  <Slider value={avgRoundup} onValueChange={setAvgRoundup} min={0.01} max={0.99} step={0.01} className="py-1" />
                </SliderRow>
                <SliderRow label={is401k ? "Annual contribution goal" : "Total debt balance"} display={`$${debtAmount[0].toLocaleString()}`} color={dt.color}>
                  <Slider value={debtAmount} onValueChange={setDebtAmount} min={1000} max={100000} step={500} className="py-1" />
                </SliderRow>

                {/* Summary row */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { label: "Daily",   val: daily,   dec: 2 },
                    { label: "Monthly", val: monthly, dec: 0 },
                    { label: "Yearly",  val: yearly,  dec: 0 },
                  ].map(({ label, val, dec }) => (
                    <div key={label} className="rounded-2xl py-3 text-center"
                      style={{ background: "hsl(220 22% 11%)", border: "1px solid hsl(220 18% 17%)" }}>
                      <p className="text-[15px] font-bold font-mono"
                        style={{ background: `linear-gradient(130deg,${dt.color},${dt.color}99)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        <AnimatedNumber value={val} prefix="$" decimals={dec} />
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "hsl(220 15% 36%)" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Results ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Projection card */}
            <div className="rounded-3xl p-6 lg:p-7 space-y-5"
              style={{
                background: "linear-gradient(155deg,hsl(220 22% 9%),hsl(220 18% 7%))",
                border: `1.5px solid ${dt.color}22`,
                boxShadow: `0 24px 60px rgba(0,0,0,0.4),inset 0 1px 0 hsl(220 18% 18%)`,
              }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: dt.color + "18" }}>
                  <TrendingDown className="w-[18px] h-[18px]" style={{ color: dt.color }} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">Your impact projection</p>
                  <p className="text-[11px]" style={{ color: "hsl(220 15% 40%)" }}>
                    {dt.label} · {is401k ? "7% avg return" : `${dt.apr}% APR`}
                  </p>
                </div>
              </div>

              {is401k ? (
                <div className="space-y-3">
                  <MetricRow icon={<DollarSign className="w-4 h-4" style={{ color: dt.color }} />} iconBg={dt.color + "18"}
                    label="Projected 20-year growth" color={dt.color} large>
                    <AnimatedNumber value={projectedGrowth} prefix="$" />
                  </MetricRow>
                  <MetricRow icon={<BarChart3 className="w-4 h-4" style={{ color: dt.color }} />} iconBg={dt.color + "18"}
                    label="Total contributions over 20 years" color={dt.color}>
                    <AnimatedNumber value={yearly * 20} prefix="$" />
                  </MetricRow>
                  <MetricRow icon={<Sparkles className="w-4 h-4" style={{ color: dt.color }} />} iconBg={dt.color + "18"}
                    label="Compound gains from round-ups alone" color={dt.color}>
                    <AnimatedNumber value={Math.max(0, projectedGrowth - yearly * 20)} prefix="$" />
                  </MetricRow>
                </div>
              ) : (
                <div className="space-y-3">
                  <MetricRow icon={<Clock className="w-4 h-4" style={{ color: dt.color }} />} iconBg={dt.color + "18"}
                    label="Months faster to debt freedom" color={dt.color} large>
                    <AnimatedNumber value={monthsFaster} suffix=" mo" />
                  </MetricRow>
                  <MetricRow icon={<Percent className="w-4 h-4" style={{ color: dt.color }} />} iconBg={dt.color + "18"}
                    label="Total interest saved" color={dt.color}>
                    <AnimatedNumber value={interestSaved} prefix="$" />
                  </MetricRow>
                  <MetricRow icon={<DollarSign className="w-4 h-4" style={{ color: dt.color }} />} iconBg={dt.color + "18"}
                    label="Round-up contributions per year" color={dt.color}>
                    <AnimatedNumber value={yearly} prefix="$" />
                  </MetricRow>
                </div>
              )}

              <div style={{ height: 1, background: "hsl(220 18% 13%)" }} />

              {!is401k && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold" style={{ color: "hsl(220 15% 40%)" }}>Balance over 60 months</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 border-t border-dashed" style={{ borderColor: "hsl(220 15% 28%)" }} />
                        <span className="text-[9.5px]" style={{ color: "hsl(220 15% 35%)" }}>Without</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-0.5 rounded" style={{ background: dt.color }} />
                        <span className="text-[9.5px]" style={{ color: "hsl(220 15% 45%)" }}>With round-ups</span>
                      </div>
                    </div>
                  </div>
                  <SparklineChart
                    key={`${debtTypeIdx}-${debtAmount[0]}-${Math.round(monthly * 100)}`}
                    balance={debtAmount[0]} apr={dt.apr} monthlyExtra={monthly} color={dt.color}
                  />
                </div>
              )}
            </div>

            {/* Callout */}
            <AnimatePresence mode="wait">
              {!is401k && monthsFaster > 0 && (
                <motion.div key={`${Math.round(monthsFaster)}-${debtTypeIdx}`}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl px-6 py-5 flex items-center gap-4"
                  style={{
                    background: `linear-gradient(135deg,${dt.accent},hsl(220 22% 9%))`,
                    border: `1px solid ${dt.color}30`,
                    boxShadow: `0 8px 32px ${dt.color}10`,
                  }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: dt.color + "18" }}>
                    <dt.icon className="w-5 h-5" style={{ color: dt.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-white">
                      At <span style={{ color: dt.color }}>${Math.round(monthly)}/mo</span>, your {dt.label} is gone{" "}
                      <span style={{ color: dt.color }}>{Math.round(monthsFaster)} months sooner.</span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "hsl(220 15% 45%)" }}>
                      That's <span style={{ color: dt.color, fontWeight: 600 }}>${Math.round(interestSaved).toLocaleString()}</span> in interest you'll never pay.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature checklist */}
            <div className="rounded-3xl px-6 py-5 space-y-3"
              style={{ background: "linear-gradient(155deg,hsl(220 22% 9%),hsl(220 18% 7%))", border: "1.5px solid hsl(220 18% 15%)" }}>
              <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "hsl(220 15% 38%)" }}>
                Included with every plan
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["Automatic round-ups", "AI goal coaching", "Multi-account routing", "Weekly progress reports", "Milestone notifications", "Cancel anytime"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0" style={{ background: "#22c55e18" }}>
                      <Check className="w-2.5 h-2.5" style={{ color: "#22c55e" }} strokeWidth={3} />
                    </div>
                    <span className="text-[11.5px]" style={{ color: "hsl(220 15% 50%)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SliderRow = ({ label, display, color, children }: {
  label: string; display: string; color: string; children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-[12px] font-semibold" style={{ color: "hsl(220 15% 50%)" }}>{label}</label>
      <motion.span key={display}
        initial={{ opacity: 0, y: -4, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="text-[13px] font-bold font-mono px-2.5 py-0.5 rounded-lg"
        style={{ background: color + "14", color, border: `1px solid ${color}28` }}>
        {display}
      </motion.span>
    </div>
    {children}
  </div>
);

const MetricRow = ({ icon, iconBg, label, color, large = false, children }: {
  icon: React.ReactNode; iconBg: string; label: string;
  color: string; large?: boolean; children: React.ReactNode;
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
      style={{ background: `linear-gradient(130deg,${color},${color}bb)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {children}
    </p>
  </div>
);