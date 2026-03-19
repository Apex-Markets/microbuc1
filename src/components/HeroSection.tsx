import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingDown, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Cashier Scene Animation ──────────────────────────────────────────────────
const CashierScene = () => {
  const [phase, setPhase] = useState<
    "idle" | "scan" | "charge" | "roundup" | "notify" | "done"
  >("idle");

  useEffect(() => {
    const sequence = async () => {
      await delay(800);
      setPhase("scan");
      await delay(1000);
      setPhase("charge");
      await delay(1200);
      setPhase("roundup");
      await delay(900);
      setPhase("notify");
      await delay(3200);
      setPhase("done");
      await delay(1200);
      setPhase("idle");
    };

    const loop = setInterval(() => {
      sequence();
    }, 9000);

    sequence();
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#0ea5e9]/8 rounded-full blur-[80px]" />
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#a78bfa]/6 rounded-full blur-[60px]" />
      </div>

      {/* Scene container */}
      <div className="relative w-full max-w-[520px] mx-auto">
        {/* Counter / Cashier Desk */}
        <CounterScene phase={phase} />

        {/* Floating Phone Notification */}
        <PhoneNotification phase={phase} />

        {/* Floating transaction badge */}
        <TransactionBadge phase={phase} />
      </div>
    </div>
  );
};

const CounterScene = ({
  phase,
}: {
  phase: "idle" | "scan" | "charge" | "roundup" | "notify" | "done";
}) => {
  const isActive = phase !== "idle";

  return (
    <div className="relative w-full" style={{ height: 340 }}>
      <svg
        viewBox="0 0 520 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* ── Counter ── */}
        <rect
          x="80"
          y="240"
          width="360"
          height="80"
          rx="16"
          fill="hsl(220 25% 10%)"
          stroke="hsl(220 20% 18%)"
          strokeWidth="1.5"
        />
        <rect
          x="80"
          y="238"
          width="360"
          height="12"
          rx="6"
          fill="hsl(220 20% 16%)"
        />
        {/* Counter surface shine */}
        <rect
          x="100"
          y="242"
          width="200"
          height="2"
          rx="1"
          fill="hsl(220 20% 24%)"
          opacity="0.6"
        />

        {/* ── POS Terminal ── */}
        <rect
          x="215"
          y="188"
          width="90"
          height="58"
          rx="10"
          fill="hsl(220 20% 14%)"
          stroke="hsl(220 20% 22%)"
          strokeWidth="1.5"
        />
        {/* Terminal screen */}
        <rect x="223" y="196" width="74" height="38" rx="6" fill="hsl(220 30% 8%)" />
        {/* Screen content */}
        <AnimatePresence mode="wait">
          {(phase === "idle" || phase === "done") && (
            <motion.g
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <text
                x="260"
                y="214"
                textAnchor="middle"
                fill="hsl(220 15% 45%)"
                fontSize="7"
                fontFamily="monospace"
                fontWeight="600"
              >
                READY
              </text>
              <text
                x="260"
                y="226"
                textAnchor="middle"
                fill="hsl(220 15% 30%)"
                fontSize="6"
                fontFamily="monospace"
              >
                Tap or swipe
              </text>
            </motion.g>
          )}
          {phase === "scan" && (
            <motion.g
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <text
                x="260"
                y="212"
                textAnchor="middle"
                fill="#0ea5e9"
                fontSize="6.5"
                fontFamily="monospace"
                fontWeight="700"
              >
                SCANNING...
              </text>
              {/* animated scan line */}
              <motion.rect
                x="228"
                y="218"
                width="64"
                height="1.5"
                rx="1"
                fill="#0ea5e9"
                opacity="0.8"
                animate={{ y: [218, 230, 218] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.g>
          )}
          {(phase === "charge" || phase === "roundup") && (
            <motion.g
              key="amount"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <text
                x="260"
                y="210"
                textAnchor="middle"
                fill="hsl(220 15% 55%)"
                fontSize="6"
                fontFamily="monospace"
              >
                TOTAL
              </text>
              <text
                x="260"
                y="226"
                textAnchor="middle"
                fill="#f0f6ff"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="700"
              >
                $4.67
              </text>
            </motion.g>
          )}
          {phase === "notify" && (
            <motion.g
              key="paid"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <circle cx="260" cy="209" r="7" fill="#22c55e" opacity="0.15" />
              <text
                x="260"
                y="212"
                textAnchor="middle"
                fill="#22c55e"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="700"
              >
                ✓ PAID
              </text>
              <text
                x="260"
                y="224"
                textAnchor="middle"
                fill="#22c55e"
                fontSize="6"
                fontFamily="monospace"
                opacity="0.7"
              >
                $4.67 charged
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        {/* Terminal base */}
        <rect
          x="248"
          y="246"
          width="24"
          height="6"
          rx="3"
          fill="hsl(220 20% 18%)"
        />

        {/* ── Cashier (left person) ── */}
        <CashierPerson x={130} phase={phase} side="left" />

        {/* ── Customer (right person) ── */}
        <CashierPerson x={370} phase={phase} side="right" />

        {/* ── Products on counter ── */}
        <rect
          x="155"
          y="218"
          width="22"
          height="26"
          rx="4"
          fill="hsl(30 70% 50%)"
          opacity="0.8"
        />
        <rect
          x="183"
          y="224"
          width="18"
          height="20"
          rx="3"
          fill="hsl(200 70% 45%)"
          opacity="0.8"
        />
        <rect
          x="163"
          y="215"
          width="14"
          height="14"
          rx="3"
          fill="hsl(340 65% 50%)"
          opacity="0.7"
        />

        {/* ── Floor shadow ── */}
        <ellipse
          cx="260"
          cy="330"
          rx="160"
          ry="8"
          fill="hsl(220 30% 4%)"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

const CashierPerson = ({
  x,
  phase,
  side,
}: {
  x: number;
  phase: string;
  side: "left" | "right";
}) => {
  const isRight = side === "right";
  const color = isRight ? "hsl(220 60% 65%)" : "hsl(280 50% 65%)";
  const skinTone = isRight ? "hsl(30 60% 72%)" : "hsl(25 50% 65%)";
  const clothColor = isRight ? "hsl(215 55% 35%)" : "hsl(160 40% 30%)";

  return (
    <g>
      {/* Body */}
      <motion.g
        animate={
          phase === "scan"
            ? { x: isRight ? 0 : 8, y: -3 }
            : phase === "charge"
            ? { x: isRight ? -5 : 0, y: -2 }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Torso */}
        <rect
          x={x - 22}
          y={150}
          width={44}
          height={90}
          rx={14}
          fill={clothColor}
        />
        {/* Shirt collar */}
        <path
          d={`M${x - 8} 153 Q${x} 162 ${x + 8} 153`}
          stroke="hsl(0 0% 90%)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* Head */}
        <circle cx={x} cy={130} r={26} fill={skinTone} />
        {/* Hair */}
        <path
          d={
            isRight
              ? `M${x - 22} 120 Q${x - 18} 105 ${x} 104 Q${x + 18} 105 ${x + 22} 120`
              : `M${x - 22} 118 Q${x - 16} 103 ${x} 103 Q${x + 18} 104 ${x + 22} 118`
          }
          fill={isRight ? "hsl(220 20% 20%)" : "hsl(30 50% 30%)"}
        />
        {/* Eyes */}
        <circle cx={x - 8} cy={128} r={3} fill="hsl(220 20% 20%)" />
        <circle cx={x + 8} cy={128} r={3} fill="hsl(220 20% 20%)" />
        {/* Eye shine */}
        <circle cx={x - 7} cy={127} r={1} fill="white" opacity="0.7" />
        <circle cx={x + 9} cy={127} r={1} fill="white" opacity="0.7" />
        {/* Smile */}
        <motion.path
          d={`M${x - 7} 138 Q${x} 145 ${x + 7} 138`}
          stroke="hsl(220 20% 25%)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={
            phase === "notify"
              ? { d: `M${x - 9} 136 Q${x} 146 ${x + 9} 136` }
              : {}
          }
          transition={{ duration: 0.4 }}
        />

        {/* Arms */}
        <motion.rect
          x={isRight ? x - 40 : x + 18}
          y={165}
          width={20}
          height={60}
          rx={8}
          fill={clothColor}
          animate={
            isRight && phase === "scan"
              ? { rotate: -15, x: -5 }
              : isRight && phase === "charge"
              ? { rotate: -20, y: -5 }
              : {}
          }
          style={{ transformOrigin: `${x}px 165px` }}
        />
        <motion.rect
          x={isRight ? x + 18 : x - 40}
          y={165}
          width={20}
          height={60}
          rx={8}
          fill={clothColor}
        />

        {/* Hands */}
        <motion.circle
          cx={isRight ? x - 28 : x + 28}
          cy={226}
          r={10}
          fill={skinTone}
          animate={
            isRight && (phase === "charge" || phase === "notify")
              ? { cx: x - 30, cy: 222 }
              : {}
          }
          transition={{ duration: 0.4 }}
        />
        <circle cx={isRight ? x + 28 : x - 28} cy={226} r={10} fill={skinTone} />
      </motion.g>
    </g>
  );
};

const PhoneNotification = ({ phase }: { phase: string }) => {
  const show = phase === "notify" || phase === "done";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="phone-notif"
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="absolute"
          style={{ top: -18, right: -12, zIndex: 20, width: 220 }}
        >
          {/* Phone frame */}
          <div
            className="relative rounded-[24px] overflow-hidden"
            style={{
              background: "hsl(220 25% 8%)",
              border: "1.5px solid hsl(220 20% 20%)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px hsl(220 20% 14%), inset 0 1px 0 hsl(220 20% 22%)",
              padding: "18px 14px 16px",
            }}
          >
            {/* Notch */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 rounded-b-xl"
              style={{ background: "hsl(220 25% 8%)", zIndex: 2 }}
            />

            {/* Lock screen time */}
            <div className="text-center mb-3 mt-1">
              <p
                className="text-[10px]"
                style={{ color: "hsl(220 15% 45%)", fontFamily: "monospace" }}
              >
                2:47 PM
              </p>
            </div>

            {/* Notification card */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-2xl p-3"
              style={{
                background: "hsl(220 20% 12%)",
                border: "1px solid hsl(220 20% 20%)",
              }}
            >
              <div className="flex items-start gap-2.5">
                {/* App icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M9 2L11.5 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H6.5L9 2Z"
                      fill="white"
                      opacity="0.9"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className="text-[10px] font-semibold"
                      style={{ color: "hsl(220 15% 65%)" }}
                    >
                      RoundUp
                    </p>
                    <p
                      className="text-[9px]"
                      style={{ color: "hsl(220 15% 40%)" }}
                    >
                      now
                    </p>
                  </div>
                  <p
                    className="text-[11px] font-bold leading-tight"
                    style={{ color: "#f0f6ff" }}
                  >
                    Round-up applied! 🎉
                  </p>
                  <p
                    className="text-[10px] leading-tight mt-0.5"
                    style={{ color: "hsl(220 15% 55%)" }}
                  >
                    $0.33 sent to{" "}
                    <span style={{ color: "#0ea5e9", fontWeight: 600 }}>
                      Car Loan
                    </span>
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <p
                        className="text-[9px]"
                        style={{ color: "hsl(220 15% 40%)" }}
                      >
                        Monthly goal
                      </p>
                      <p
                        className="text-[9px] font-semibold"
                        style={{ color: "#0ea5e9" }}
                      >
                        $67 / $80
                      </p>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "hsl(220 20% 18%)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #0ea5e9, #6366f1)",
                        }}
                        initial={{ width: "80%" }}
                        animate={{ width: "83.75%" }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom home indicator */}
            <div
              className="mx-auto mt-3 rounded-full"
              style={{
                width: 48,
                height: 4,
                background: "hsl(220 15% 30%)",
              }}
            />
          </div>

          {/* Phone glow */}
          <div
            className="absolute inset-0 rounded-[24px] pointer-events-none"
            style={{
              boxShadow: "0 0 40px rgba(14,165,233,0.15)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TransactionBadge = ({ phase }: { phase: string }) => {
  const show = phase === "charge" || phase === "roundup";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="txn-badge"
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute flex flex-col gap-1.5"
          style={{ bottom: 20, right: -8, zIndex: 15 }}
        >
          {/* Original amount */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "hsl(220 25% 10%)",
              border: "1px solid hsl(220 20% 20%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "hsl(220 15% 40%)" }}
            />
            <p
              className="text-[11px]"
              style={{ color: "hsl(220 15% 60%)", fontFamily: "monospace" }}
            >
              Coffee
            </p>
            <p
              className="text-[12px] font-bold"
              style={{ color: "#f0f6ff", fontFamily: "monospace" }}
            >
              $4.67
            </p>
          </div>

          {/* Round-up arrow */}
          <AnimatePresence>
            {phase === "roundup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(220 60% 12%), hsl(250 50% 12%))",
                  border: "1px solid hsl(220 60% 25%)",
                  boxShadow: "0 8px 24px rgba(14,165,233,0.15)",
                }}
              >
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                  }}
                />
                <p
                  className="text-[11px]"
                  style={{ color: "hsl(220 60% 70%)", fontFamily: "monospace" }}
                >
                  Round-up
                </p>
                <p
                  className="text-[12px] font-bold"
                  style={{
                    background: "linear-gradient(90deg, #0ea5e9, #6366f1)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "monospace",
                  }}
                >
                  +$0.33
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── Main Hero Section ────────────────────────────────────────────────────────
export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(210 100% 50% / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Accent orbs */}
      <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-primary/4 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/5 w-56 h-56 bg-violet-500/4 rounded-full blur-[80px]" />

      <div className="container relative z-10 py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center min-h-[80vh]">
          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-9 lg:py-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                border: "1px solid hsl(var(--primary) / 0.18)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Debt-free on autopilot
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <h1 className="font-bold leading-[1.08] tracking-[-0.03em]"
                style={{ fontSize: "clamp(2.6rem, 5vw, 4.2rem)" }}>
                <span className="text-foreground">Every purchase</span>
                <br />
                <span className="gradient-text">chips away</span>
                <br />
                <span className="text-foreground">at your debt.</span>
              </h1>
              <p
                className="text-lg leading-relaxed max-w-md"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                We round up every transaction to the nearest dollar and route
                the spare change straight to your loans — automatically.
              </p>
            </motion.div>

            {/* Metric row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-stretch gap-6"
            >
              {[
                { value: "$847", label: "avg. saved / year" },
                { value: "2.3 yrs", label: "faster payoff" },
                { value: "0 effort", label: "fully automatic" },
              ].map((stat, i) => (
                <div key={i} className="flex items-stretch gap-6">
                  {i > 0 && (
                    <div
                      className="w-px self-stretch"
                      style={{ background: "hsl(var(--border))" }}
                    />
                  )}
                  <div>
                    <p
                      className="text-2xl font-bold font-mono"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--primary)), hsl(250 90% 70%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3.5"
            >
              <Button variant="hero" size="xl" className="group">
                Start saving now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="text-white"
                onClick={() =>
                  document
                    .querySelector("#how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See how it works
              </Button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex items-center gap-5 pt-1"
            >
              <div className="flex -space-x-2.5">
                {["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: color, zIndex: 4 - i }}
                    >
                      {["A", "M", "J", "S"][i]}
                    </div>
                  )
                )}
              </div>
              <p
                className="text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <span className="text-foreground font-semibold">12,400+</span>{" "}
                people paying off debt faster
              </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: Shield, label: "Bank-level encryption" },
                { icon: Zap, label: "Instant round-ups" },
                { icon: TrendingDown, label: "Any loan or card" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "hsl(var(--muted) / 0.5)",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Cashier animation ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:py-16"
          >
            {/* Card frame */}
            <div
              className="relative w-full max-w-[500px] rounded-3xl overflow-visible"
              style={{
                background:
                  "linear-gradient(160deg, hsl(220 25% 9%), hsl(220 20% 7%))",
                border: "1.5px solid hsl(220 20% 16%)",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 hsl(220 20% 22%)",
                padding: "32px 28px 24px",
              }}
            >
              {/* Card header label */}
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: "hsl(220 15% 40%)" }}
                >
                  Live Demo
                </p>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#22c55e" }}
                  />
                  <p
                    className="text-[11px]"
                    style={{ color: "hsl(220 15% 40%)" }}
                  >
                    Auto-applying
                  </p>
                </div>
              </div>

              <CashierScene />

              {/* Card footer */}
              <div
                className="mt-4 pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid hsl(220 20% 14%)" }}
              >
                <p
                  className="text-[11px]"
                  style={{ color: "hsl(220 15% 35%)" }}
                >
                  Every transaction. Every cent.
                </p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      className="w-1 h-1 rounded-full"
                      style={{ background: "hsl(220 60% 60%)" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative corner glow */}
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, hsl(250 80% 60% / 0.08), transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};