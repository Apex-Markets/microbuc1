import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingDown, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
type Phase = "idle" | "raise" | "tap" | "success" | "roundup" | "notify" | "reset";

// ─── NFC Arc Waves ──────────────────────────────────────────────────────────
const NfcWaves = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active &&
      [0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M 292 ${202} Q ${296 + i * 3} ${196 - i * 5} 292 ${190}`}
          stroke="#0ea5e9"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: [0, 0.85, 0], x: [-4, -20 - i * 9] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, delay: i * 0.24, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
  </AnimatePresence>
);

// ─── Phone Screen Content ───────────────────────────────────────────────────
const PhoneScreen = ({ phase }: { phase: Phase }) => {
  if (phase === "idle" || phase === "raise") {
    return (
      <g>
        <rect x="276" y="198" width="18" height="30" rx="2" fill="hsl(220 30% 6%)" />
        <circle cx="285" cy="210" r="3.5" fill="hsl(220 20% 22%)" />
        <rect x="280" y="217" width="10" height="1.5" rx="1" fill="hsl(220 20% 20%)" />
        <rect x="281" y="221" width="8" height="1.5" rx="1" fill="hsl(220 20% 18%)" />
      </g>
    );
  }
  if (phase === "tap") {
    return (
      <g>
        <rect x="276" y="198" width="18" height="30" rx="2" fill="hsl(220 40% 7%)" />
        <rect x="278" y="202" width="14" height="9" rx="1.5" fill="hsl(215 55% 30%)" />
        <rect x="278" y="202" width="14" height="3.5" rx="1.5" fill="hsl(215 60% 38%)" />
        <circle cx="280.5" cy="210" r="1.2" fill="hsl(50 80% 60%)" opacity="0.8" />
        <text x="285" y="219" textAnchor="middle" fill="#0ea5e9" fontSize="3.5" fontWeight="700" fontFamily="monospace">TAP</text>
        <text x="285" y="224" textAnchor="middle" fill="hsl(220 15% 45%)" fontSize="3" fontFamily="monospace">TO PAY</text>
      </g>
    );
  }
  if (phase === "success" || phase === "roundup") {
    return (
      <g>
        <rect x="276" y="198" width="18" height="30" rx="2" fill="hsl(145 40% 7%)" />
        <motion.circle cx="285" cy="210" r="5" fill="hsl(145 60% 12%)" stroke="#22c55e" strokeWidth="1"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} />
        <motion.path d="M282 210 L284.5 212.5 L288.5 207.5" stroke="#22c55e" strokeWidth="1.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15, duration: 0.4 }} />
        <text x="285" y="221.5" textAnchor="middle" fill="#22c55e" fontSize="3.2" fontWeight="700" fontFamily="monospace">$4.67</text>
        <text x="285" y="225.5" textAnchor="middle" fill="hsl(145 30% 35%)" fontSize="2.8" fontFamily="monospace">PAID</text>
      </g>
    );
  }
  if (phase === "notify") {
    return (
      <g>
        <rect x="276" y="198" width="18" height="30" rx="2" fill="hsl(220 30% 6%)" />
        <rect x="277.5" y="202" width="15" height="12" rx="1.5" fill="hsl(220 25% 11%)" stroke="hsl(220 20% 18%)" strokeWidth="0.5" />
        <rect x="279" y="203.5" width="3.5" height="3.5" rx="0.8" fill="url(#phoneGrad)" />
        <text x="286.5" y="206" fill="hsl(220 15% 60%)" fontSize="2.5" fontFamily="monospace">RoundUp</text>
        <text x="279" y="210.5" fill="#f0f6ff" fontSize="2.8" fontWeight="700" fontFamily="monospace">+$0.33</text>
        <text x="279" y="213.5" fill="#0ea5e9" fontSize="2.5" fontFamily="monospace">Car Loan ↑</text>
        <rect x="279" y="215.5" width="12" height="1.5" rx="0.75" fill="hsl(220 20% 16%)" />
        <motion.rect x="279" y="215.5" width="9" height="1.5" rx="0.75" fill="url(#barGrad)"
          initial={{ width: 9 }} animate={{ width: 10 }} transition={{ delay: 0.4, duration: 0.6 }} />
      </g>
    );
  }
  return null;
};

// ─── POS Terminal Screen ────────────────────────────────────────────────────
const TerminalScreen = ({ phase }: { phase: Phase }) => (
  <AnimatePresence mode="wait">
    {(phase === "idle" || phase === "raise") && (
      <motion.g key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        <text x="253" y="214" textAnchor="middle" fill="hsl(220 15% 38%)" fontSize="6.5" fontFamily="monospace" fontWeight="600">READY</text>
        <text x="253" y="224" textAnchor="middle" fill="hsl(220 15% 26%)" fontSize="5.5" fontFamily="monospace">tap or insert</text>
      </motion.g>
    )}
    {phase === "tap" && (
      <motion.g key="tap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <text x="253" y="211" textAnchor="middle" fill="#0ea5e9" fontSize="6" fontFamily="monospace" fontWeight="700">NFC</text>
        <motion.rect x="228" y="215" width="50" height="1.5" rx="1" fill="#0ea5e9" opacity="0.5"
          animate={{ opacity: [0.5, 0.15, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
        <text x="253" y="226" textAnchor="middle" fill="#0ea5e9" fontSize="5.5" fontFamily="monospace" opacity="0.55">reading...</text>
      </motion.g>
    )}
    {(phase === "success" || phase === "roundup") && (
      <motion.g key="amount" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <text x="253" y="209" textAnchor="middle" fill="hsl(220 15% 48%)" fontSize="5.5" fontFamily="monospace">TOTAL</text>
        <text x="253" y="222" textAnchor="middle" fill="#f0f6ff" fontSize="12" fontFamily="monospace" fontWeight="700">$4.67</text>
      </motion.g>
    )}
    {phase === "notify" && (
      <motion.g key="paid" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <circle cx="253" cy="208" r="6" fill="#22c55e" opacity="0.12" />
        <text x="253" y="211" textAnchor="middle" fill="#22c55e" fontSize="7.5" fontFamily="monospace" fontWeight="700">✓ PAID</text>
        <text x="253" y="222" textAnchor="middle" fill="#22c55e" fontSize="5.5" fontFamily="monospace" opacity="0.6">$4.67 approved</text>
      </motion.g>
    )}
  </AnimatePresence>
);

// ─── Cashier (left) ─────────────────────────────────────────────────────────
const Cashier = ({ phase }: { phase: Phase }) => {
  const x = 112;
  const skin = "hsl(28 52% 67%)";
  const cloth = "hsl(160 38% 28%)";
  const hair = "hsl(25 45% 22%)";
  const leaning = phase === "tap" || phase === "success";
  return (
    <motion.g animate={leaning ? { x: 6, y: -2 } : { x: 0, y: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
      <rect x={x - 20} y={152} width={40} height={88} rx={12} fill={cloth} />
      <rect x={x - 10} y={158} width={20} height={70} rx={6} fill="hsl(160 30% 22%)" opacity="0.5" />
      <path d={`M${x - 7} 155 Q${x} 163 ${x + 7} 155`} stroke="hsl(0 0% 88%)" strokeWidth="1.8" fill="none" opacity="0.45" />
      <circle cx={x} cy={128} r={24} fill={skin} />
      <path d={`M${x - 21} 119 Q${x - 16} 105 ${x} 104 Q${x + 16} 105 ${x + 21} 119`} fill={hair} />
      <ellipse cx={x - 7} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <ellipse cx={x + 7} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <circle cx={x - 6} cy={126} r={1} fill="white" opacity="0.7" />
      <circle cx={x + 8} cy={126} r={1} fill="white" opacity="0.7" />
      <path d={`M${x - 10} 121 Q${x - 7} 119 ${x - 4} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M${x + 4} 121 Q${x + 7} 119 ${x + 10} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <motion.path
        d={`M${x - 6} 137 Q${x} 143 ${x + 6} 137`}
        stroke="hsl(220 20% 24%)" strokeWidth="2.2" fill="none" strokeLinecap="round"
        animate={phase === "notify" ? { d: `M${x - 8} 136 Q${x} 145 ${x + 8} 136` } : {}}
        transition={{ duration: 0.35 }}
      />
      <path d={`M${x + 18} 168 Q${x + 30} 190 ${x + 28} 230`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none" />
      <circle cx={x + 27} cy={232} r={9} fill={skin} />
      <path d={`M${x - 18} 168 Q${x - 30} 195 ${x - 26} 232`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none" />
      <circle cx={x - 25} cy={234} r={9} fill={skin} />
    </motion.g>
  );
};

// ─── Customer (right) — raises phone ────────────────────────────────────────
const Customer = ({ phase }: { phase: Phase }) => {
  const x = 388;
  const skin = "hsl(32 55% 74%)";
  const cloth = "hsl(215 50% 32%)";
  const hair = "hsl(220 18% 18%)";
  const armUp = phase !== "idle" && phase !== "reset";

  return (
    <g>
      {/* Torso */}
      <rect x={x - 20} y={152} width={40} height={88} rx={12} fill={cloth} />
      <path d={`M${x - 7} 155 Q${x} 164 ${x + 7} 155`} stroke="hsl(0 0% 88%)" strokeWidth="1.8" fill="none" opacity="0.4" />
      {/* Head */}
      <circle cx={x} cy={128} r={24} fill={skin} />
      <path d={`M${x - 22} 117 Q${x - 16} 102 ${x} 102 Q${x + 16} 102 ${x + 22} 117`} fill={hair} />
      {/* Eyes looking left */}
      <ellipse cx={x - 7.5} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <ellipse cx={x + 6.5} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <circle cx={x - 8.5} cy={127} r={1.2} fill="hsl(25 60% 15%)" />
      <circle cx={x + 5.5} cy={127} r={1.2} fill="hsl(25 60% 15%)" />
      <circle cx={x - 7.5} cy={126} r={0.9} fill="white" opacity="0.6" />
      <circle cx={x + 6.5} cy={126} r={0.9} fill="white" opacity="0.6" />
      <path d={`M${x - 11} 121 Q${x - 7.5} 119 ${x - 4} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M${x + 3} 121 Q${x + 6.5} 119 ${x + 10} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <motion.path
        d={`M${x - 5} 137 Q${x} 141 ${x + 5} 137`}
        stroke="hsl(25 35% 30%)" strokeWidth="2" fill="none" strokeLinecap="round"
        animate={phase === "notify" ? { d: `M${x - 7} 136 Q${x} 144 ${x + 7} 136` } : {}}
        transition={{ duration: 0.35 }}
      />

      {/* Right arm resting (fades when arm raises) */}
      <motion.path
        d={`M${x + 18} 168 Q${x + 28} 195 ${x + 24} 234`}
        stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none"
        animate={armUp ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.22 }}
      />
      <motion.circle cx={x + 23} cy={235} r={9} fill={skin}
        animate={armUp ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.22 }}
      />

      {/* RAISED ARM — upper arm extending left toward terminal */}
      <motion.path
        d={`M${x - 18} 168 Q${x - 54} 162 ${x - 80} 178`}
        stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none"
        initial={{ opacity: 0 }}
        animate={armUp ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.48 }}
      />
      {/* Forearm */}
      <motion.path
        d={`M${x - 80} 178 Q${x - 95} 190 ${x - 97} 206`}
        stroke={cloth} strokeWidth="15" strokeLinecap="round" fill="none"
        initial={{ opacity: 0 }}
        animate={armUp ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.48, delay: 0.06 }}
      />
      {/* Hand */}
      <motion.circle cx={x - 99} cy={210} r={9} fill={skin}
        initial={{ opacity: 0 }}
        animate={armUp ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      {/* Thumb wrap around phone */}
      <motion.path
        d={`M${x - 107} 206 Q${x - 111} 210 ${x - 107} 215`}
        stroke={skin} strokeWidth="4.5" strokeLinecap="round" fill="none"
        initial={{ opacity: 0 }}
        animate={armUp ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
      />

      {/* PHONE in raised hand */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={armUp ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.14 }}
      >
        {/* Shadow */}
        <rect x="272" y="196" width="26" height="42" rx="5" fill="hsl(220 30% 4%)" opacity="0.35" transform="translate(2,3)" />
        {/* Chassis */}
        <rect x="272" y="196" width="26" height="42" rx="5" fill="hsl(220 15% 13%)" stroke="hsl(220 20% 25%)" strokeWidth="1.2" />
        {/* Buttons */}
        <rect x="298" y="206" width="1.5" height="8" rx="0.75" fill="hsl(220 15% 27%)" />
        <rect x="270.5" y="204" width="1.5" height="5" rx="0.75" fill="hsl(220 15% 27%)" />
        <rect x="270.5" y="211" width="1.5" height="5" rx="0.75" fill="hsl(220 15% 27%)" />
        {/* Dynamic island / notch */}
        <rect x="281" y="197.5" width="6" height="3" rx="1.5" fill="hsl(220 15% 9%)" />
        {/* Screen */}
        <rect x="274.5" y="200" width="21" height="35" rx="3" fill="hsl(220 35% 7%)" />
        <PhoneScreen phase={phase} />
        {/* Home bar */}
        <rect x="281" y="233.5" width="8" height="1.5" rx="0.75" fill="hsl(220 15% 24%)" />
      </motion.g>

      {/* Left arm (other side, stays down, slightly faded) */}
      <motion.path
        d={`M${x + 18} 168 Q${x + 28} 198 ${x + 22} 234`}
        stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none"
        animate={armUp ? { opacity: 0.35 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.circle cx={x + 21} cy={235} r={9} fill={skin}
        animate={armUp ? { opacity: 0.35 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </g>
  );
};

// ─── Round-up Badge ─────────────────────────────────────────────────────────
const RoundUpBadge = ({ phase }: { phase: Phase }) => {
  const show = phase === "roundup" || phase === "notify";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="badge"
          initial={{ opacity: 0, y: 10, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="absolute flex flex-col gap-1.5"
          style={{ bottom: 14, left: 0, zIndex: 20 }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl"
            style={{ background: "hsl(220 22% 11%)", border: "1px solid hsl(220 20% 20%)", boxShadow: "0 8px 28px rgba(0,0,0,0.45)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] font-mono" style={{ color: "hsl(220 15% 55%)" }}>Charged</span>
            <span className="text-[12px] font-bold font-mono" style={{ color: "#f0f6ff" }}>$4.67</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scaleY: 0.4 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 24 }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(215 55% 11%), hsl(250 45% 11%))",
              border: "1px solid hsl(220 55% 22%)",
              boxShadow: "0 8px 28px rgba(14,165,233,0.18)",
            }}
          >
            <motion.div
              animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 1.1, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            />
            <span className="text-[11px] font-mono" style={{ color: "hsl(215 55% 65%)" }}>Round-up →</span>
            <span className="text-[12px] font-bold font-mono"
              style={{ background: "linear-gradient(90deg, #0ea5e9, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              +$0.33
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Notification Panel ─────────────────────────────────────────────────────
const NotificationPanel = ({ phase }: { phase: Phase }) => (
  <AnimatePresence>
    {phase === "notify" && (
      <motion.div
        key="notif"
        initial={{ opacity: 0, x: 20, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 16, scale: 0.93 }}
        transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.18 }}
        className="absolute rounded-2xl p-3.5"
        style={{
          top: -12, right: -8, zIndex: 25, width: 208,
          background: "hsl(220 22% 10%)",
          border: "1px solid hsl(220 20% 18%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 hsl(220 20% 20%)",
        }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.8 4.5H11.5L8.5 7L9.5 11L6 9L2.5 11L3.5 7L0.5 4.5H4.2L6 1Z" fill="white" opacity="0.92" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: "hsl(220 15% 58%)" }}>RoundUp</span>
          </div>
          <span className="text-[9px]" style={{ color: "hsl(220 15% 34%)" }}>now</span>
        </div>
        <p className="text-[12px] font-bold mb-0.5" style={{ color: "#f0f6ff" }}>Round-up applied 🎉</p>
        <p className="text-[10.5px] leading-snug" style={{ color: "hsl(220 15% 50%)" }}>
          <span style={{ color: "#0ea5e9", fontWeight: 600 }}>$0.33</span> sent to your{" "}
          <span style={{ color: "#818cf8", fontWeight: 600 }}>Car Loan</span>
        </p>
        <div className="my-2.5" style={{ height: 1, background: "hsl(220 18% 15%)" }} />
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9.5px]" style={{ color: "hsl(220 15% 40%)" }}>Monthly goal</span>
          <span className="text-[9.5px] font-semibold" style={{ color: "#0ea5e9" }}>$67.33 / $80</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 5, background: "hsl(220 20% 15%)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)" }}
            initial={{ width: "84%" }} animate={{ width: "84.2%" }}
            transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
          />
        </div>
        <p className="text-[9px] mt-2" style={{ color: "hsl(220 15% 30%)" }}>
          <span style={{ color: "hsl(220 15% 42%)", fontWeight: 600 }}>$12.67</span> saved this month
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Scene Canvas ────────────────────────────────────────────────────────────
const SceneCanvas = ({ phase }: { phase: Phase }) => {
  const terminalGlow = phase === "tap" || phase === "success" || phase === "notify";
  return (
    <div className="relative w-full select-none" style={{ height: 295 }}>
      <AnimatePresence>
        {terminalGlow && (
          <motion.div key="tglow" className="absolute pointer-events-none"
            style={{ width: 110, height: 70, top: "40%", left: "40%",
              background: "radial-gradient(ellipse, rgba(14,165,233,0.16) 0%, transparent 70%)", filter: "blur(14px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
      <svg viewBox="0 0 520 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Counter */}
        <rect x="70" y="235" width="380" height="65" rx="16" fill="hsl(220 22% 10%)" stroke="hsl(220 18% 17%)" strokeWidth="1.5" />
        <rect x="70" y="233" width="380" height="11" rx="5" fill="hsl(220 18% 15%)" />
        <rect x="90" y="237" width="180" height="2" rx="1" fill="hsl(220 18% 22%)" opacity="0.55" />
        <ellipse cx="260" cy="306" rx="170" ry="7" fill="hsl(220 28% 4%)" opacity="0.5" />

        {/* POS Terminal */}
        <rect x="210" y="183" width="86" height="56" rx="11" fill="hsl(220 18% 13%)" stroke="hsl(220 18% 21%)" strokeWidth="1.5" />
        <rect x="218" y="191" width="70" height="36" rx="6" fill="hsl(220 28% 7%)" />
        {/* NFC indicator arcs on terminal right edge */}
        <path d="M296 200 Q302 209.5 296 219" stroke={terminalGlow ? "#0ea5e9" : "hsl(220 15% 28%)"} strokeWidth="2" fill="none" strokeLinecap="round" opacity={terminalGlow ? 0.75 : 1} />
        <path d="M299 203.5 Q307 209.5 299 215.5" stroke={terminalGlow ? "#0ea5e9" : "hsl(220 15% 22%)"} strokeWidth="2" fill="none" strokeLinecap="round" opacity={terminalGlow ? 0.45 : 1} />
        <rect x="244" y="239" width="22" height="5" rx="2.5" fill="hsl(220 18% 17%)" />
        <rect x="222" y="236" width="62" height="3.5" rx="1.5" fill="hsl(220 28% 6%)" stroke="hsl(220 18% 18%)" strokeWidth="0.8" />
        <TerminalScreen phase={phase} />

        {/* NFC Waves */}
        <NfcWaves active={phase === "tap"} />

        {/* Characters */}
        <Cashier phase={phase} />
        <Customer phase={phase} />

        {/* Counter items: coffee cup */}
        <path d="M148 225 Q149 218 157 218 Q165 218 166 225 L164 238 Q163 242 157 242 Q151 242 150 238 Z" fill="hsl(25 55% 38%)" />
        <rect x="150" y="218" width="14" height="4" rx="2" fill="hsl(25 55% 44%)" />
        <path d="M166 224 Q172 224 172 229 Q172 234 166 234" stroke="hsl(25 45% 40%)" strokeWidth="2.5" fill="none" />
        {/* Small product box */}
        <rect x="172" y="222" width="20" height="18" rx="3" fill="hsl(200 60% 38%)" />
        <rect x="172" y="222" width="20" height="6" rx="3" fill="hsl(200 65% 44%)" />
        {/* Paper bag */}
        <path d="M133 218 Q135 210 143 210 Q151 210 153 218 L155 238 Q154 243 143 243 Q132 243 131 238 Z" fill="hsl(340 50% 38%)" opacity="0.85" />
        <path d="M137 210 Q143 205 149 210" stroke="hsl(340 40% 48%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <RoundUpBadge phase={phase} />
    </div>
  );
};

// ─── Hero Section ────────────────────────────────────────────────────────────
export const HeroSection = () => {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const run = async () => {
      setPhase("idle");    await delay(900);
      setPhase("raise");   await delay(860);
      setPhase("tap");     await delay(1250);
      setPhase("success"); await delay(680);
      setPhase("roundup"); await delay(860);
      setPhase("notify");  await delay(3400);
      setPhase("reset");   await delay(550);
    };
    run();
    const id = setInterval(run, 9500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 opacity-[0.016]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[860px] h-[420px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(210 100% 50% / 0.055) 0%, transparent 68%)" }}
      />
      <div className="absolute top-1/3 left-[12%] w-64 h-64 bg-primary/[0.038] rounded-full blur-[90px]" />
      <div className="absolute bottom-1/4 right-[10%] w-52 h-52 bg-violet-500/[0.038] rounded-full blur-[80px]" />

      <div className="container relative z-10 py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[82vh]">

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 lg:py-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.52 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "hsl(var(--primary) / 0.07)", border: "1px solid hsl(var(--primary) / 0.15)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-primary tracking-[0.1em] uppercase">Debt-free on autopilot</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.66, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="font-bold leading-[1.07] tracking-[-0.03em]"
                style={{ fontSize: "clamp(2.5rem, 4.8vw, 4rem)" }}>
                <span className="text-foreground">Every purchase</span><br />
                <span className="gradient-text">chips away</span><br />
                <span className="text-foreground">at your debt.</span>
              </h1>
              <p className="text-[1.04rem] leading-relaxed max-w-[415px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                We round up every tap-to-pay to the nearest dollar and route the
                spare change straight to your loans — fully automatic, zero effort.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.27, duration: 0.56 }}
              className="flex items-stretch gap-5"
            >
              {[
                { value: "$847", label: "avg. saved / year" },
                { value: "2.3 yrs", label: "faster payoff" },
                { value: "0 effort", label: "fully automatic" },
              ].map((s, i) => (
                <div key={i} className="flex items-stretch gap-5">
                  {i > 0 && <div className="w-px self-stretch" style={{ background: "hsl(var(--border))" }} />}
                  <div>
                    <p className="text-[1.35rem] font-bold font-mono"
                      style={{ background: "linear-gradient(130deg, hsl(var(--primary)), hsl(250 88% 68%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.value}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.54 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button variant="hero" size="xl" className="group">
                Start saving now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="xl" className="text-white"
                onClick={() => document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                See how it works
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.52 }}
              className="flex items-center gap-4 pt-0.5"
            >
              <div className="flex -space-x-2.5">
                {(["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"] as const).map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c, zIndex: 4 - i }}>
                    {["A", "M", "J", "S"][i]}
                  </div>
                ))}
              </div>
              <p className="text-[13px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span className="text-foreground font-semibold">12,400+</span> paying off debt faster
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: Shield, label: "Bank-level security" },
                { icon: Zap, label: "Instant round-ups" },
                { icon: TrendingDown, label: "Any loan or card" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                  style={{ background: "hsl(var(--muted) / 0.44)", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Animation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.76, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:py-16"
          >
            <div
              className="relative w-full max-w-[490px] rounded-[28px] overflow-visible"
              style={{
                background: "linear-gradient(158deg, hsl(220 22% 9%), hsl(220 18% 7%))",
                border: "1.5px solid hsl(220 18% 15%)",
                boxShadow: "0 48px 120px rgba(0,0,0,0.55), inset 0 1px 0 hsl(220 18% 20%)",
                padding: "26px 24px 20px",
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10.5px] font-semibold tracking-[0.12em] uppercase" style={{ color: "hsl(220 14% 34%)" }}>
                  Live Demo
                </p>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0.22, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }}
                  />
                  <p className="text-[10.5px]" style={{ color: "hsl(220 14% 34%)" }}>Auto-applying</p>
                </div>
              </div>

              {/* Scene */}
              <div className="relative">
                <SceneCanvas phase={phase} />
                <NotificationPanel phase={phase} />
              </div>

              {/* Card footer */}
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid hsl(220 18% 12%)" }}>
                <p className="text-[10.5px]" style={{ color: "hsl(220 14% 28%)" }}>Every transaction. Every cent.</p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      animate={{ opacity: [0.14, 1, 0.14] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.42 }}
                      className="w-1 h-1 rounded-full" style={{ background: "hsl(215 58% 54%)" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Corner glow */}
            <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(250 78% 58% / 0.065), transparent 70%)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};