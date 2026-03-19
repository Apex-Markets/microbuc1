import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, TrendingDown, Shield, Zap,
  Bot, Target, BarChart3, Landmark, Car, GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Phases: idle → raise → tap → success → pickdest → aigoal → notify → reset
type Phase =
  | "idle" | "raise" | "tap" | "success"
  | "pickdest" | "aigoal" | "notify" | "reset";

// ─── NFC Arc Waves ──────────────────────────────────────────────────────────
const NfcWaves = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active &&
      [0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M 292 202 Q ${296 + i * 3} ${196 - i * 5} 292 190`}
          stroke="#0ea5e9" strokeWidth="1.8" fill="none" strokeLinecap="round"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: [0, 0.85, 0], x: [-4, -20 - i * 9] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, delay: i * 0.24, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
  </AnimatePresence>
);

// ─── Phone Screen ───────────────────────────────────────────────────────────
const destinations = [
  { id: "car",    icon: Car,          label: "Car Loan",  color: "#0ea5e9" },
  { id: "401k",   icon: Landmark,     label: "401(k)",    color: "#a78bfa" },
  { id: "broker", icon: BarChart3,    label: "Brokerage", color: "#34d399" },
  { id: "student",icon: GraduationCap,label: "Student",   color: "#f59e0b" },
];

const PhoneScreen = ({ phase }: { phase: Phase }) => {
  const [selected, setSelected] = useState("car");

  useEffect(() => {
    if (phase === "pickdest") setSelected("car");
  }, [phase]);

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

  if (phase === "success") {
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

  // These phases render as React overlays, not SVG
  return null;
};

// ─── Phone Overlay (React DOM — for rich destination picker & AI screens) ──
const PhoneOverlay = ({ phase }: { phase: Phase }) => {
  const [selected, setSelected] = useState("car");
  const showPicker = phase === "pickdest";
  const showAI = phase === "aigoal";
  const showNotif = phase === "notify";
  const show = showPicker || showAI || showNotif;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.94, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -4 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="absolute"
          // Positioned over the phone body in the SVG
          style={{ bottom: 48, right: 62, width: 140, zIndex: 25 }}
        >
          {/* ── Destination picker ── */}
          {showPicker && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(220 25% 9%)", border: "1.5px solid hsl(220 20% 20%)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
              <div className="px-3 py-2.5" style={{ borderBottom: "1px solid hsl(220 18% 14%)" }}>
                <p className="text-[9.5px] font-bold" style={{ color: "#f0f6ff" }}>Send round-up to</p>
              </div>
              <div className="p-2 space-y-1">
                {destinations.map((d) => {
                  const Icon = d.icon;
                  const active = d.id === selected;
                  return (
                    <motion.div key={d.id}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 cursor-pointer"
                      style={{
                        background: active ? d.color + "18" : "transparent",
                        border: `1px solid ${active ? d.color + "40" : "transparent"}`,
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelected(d.id)}
                    >
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: d.color + "22" }}>
                        <Icon className="w-2.5 h-2.5" style={{ color: d.color }} />
                      </div>
                      <span className="text-[9px] font-semibold flex-1"
                        style={{ color: active ? "#f0f6ff" : "hsl(220 15% 45%)" }}>{d.label}</span>
                      {active && (
                        <motion.div layoutId="selDot" className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="px-3 py-2.5" style={{ borderTop: "1px solid hsl(220 18% 14%)" }}>
                <motion.div
                  className="w-full text-center text-[9px] font-bold py-1.5 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "#fff" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Confirm +$0.33
                </motion.div>
              </div>
            </div>
          )}

          {/* ── AI Advisor ── */}
          {showAI && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(220 25% 9%)", border: "1.5px solid hsl(220 20% 20%)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
              <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ borderBottom: "1px solid hsl(220 18% 14%)" }}>
                <div className="w-4 h-4 rounded-md flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#0ea5e9,#a78bfa)" }}>
                  <Bot className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[9px] font-bold" style={{ color: "#f0f6ff" }}>AI Advisor</span>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
              </div>
              <div className="p-2.5 space-y-2">
                <div className="rounded-xl p-2"
                  style={{ background: "linear-gradient(135deg,hsl(215 55%13%),hsl(255 45%13%))", border: "1px solid hsl(215 50%22%)" }}>
                  <p className="text-[9px] leading-relaxed" style={{ color: "#d1e8ff" }}>
                    Based on your $4.67 coffee, I've routed $0.33 to your Car Loan. At this pace, you'll pay off <span style={{ color: "#0ea5e9", fontWeight: 700 }}>2.3 years early</span>.
                  </p>
                </div>
                <div className="rounded-xl p-2" style={{ background: "hsl(220 22% 12%)", border: "1px solid hsl(220 18%18%)" }}>
                  <p className="text-[9px]" style={{ color: "hsl(220 15%55%)" }}>
                    Want to also contribute to your 401(k)?
                  </p>
                </div>
                <div className="flex gap-1">
                  {["Yes!", "Not now"].map((l) => (
                    <motion.div key={l} whileTap={{ scale: 0.95 }}
                      className="flex-1 text-center text-[8.5px] font-semibold py-1 rounded-lg cursor-pointer"
                      style={{
                        background: l === "Yes!" ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "hsl(220 22%13%)",
                        border: l === "Yes!" ? "none" : "1px solid hsl(220 18%20%)",
                        color: l === "Yes!" ? "#fff" : "hsl(220 15%45%)",
                      }}>
                      {l}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notification ── */}
          {showNotif && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(220 25% 9%)", border: "1.5px solid hsl(220 20% 20%)", boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(14,165,233,0.08)" }}>
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: "1px solid hsl(220 18% 14%)" }}>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L6.5 4H9.5L7 6L8 9L5 7.5L2 9L3 6L0.5 4H3.5L5 1Z" fill="white" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-[9px] font-semibold" style={{ color: "hsl(220 15%55%)" }}>RoundUp</span>
                <span className="ml-auto text-[8px]" style={{ color: "hsl(220 15%35%)" }}>now</span>
              </div>
              <div className="p-3 space-y-2">
                <p className="text-[10px] font-bold" style={{ color: "#f0f6ff" }}>Round-up complete 🎉</p>
                <p className="text-[9px]" style={{ color: "hsl(220 15%50%)" }}>
                  <span style={{ color: "#0ea5e9", fontWeight: 700 }}>$0.33</span> → <span style={{ color: "#a78bfa", fontWeight: 600 }}>Car Loan</span>
                </p>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[8.5px]" style={{ color: "hsl(220 15%38%)" }}>Goal progress</span>
                    <span className="text-[8.5px] font-semibold" style={{ color: "#0ea5e9" }}>$67.33 / $80</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(220 20%15%)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg,#0ea5e9,#6366f1)" }}
                      initial={{ width: "84%" }} animate={{ width: "84.2%" }}
                      transition={{ delay: 0.4, duration: 0.8 }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
                  style={{ background: "hsl(220 22%12%)", border: "1px solid hsl(220 18%18%)" }}>
                  <Target className="w-2.5 h-2.5 shrink-0" style={{ color: "#0ea5e9" }} />
                  <p className="text-[8.5px]" style={{ color: "hsl(220 15%48%)" }}>
                    On track · debt-free <span style={{ color: "#0ea5e9" }}>Mar 2027</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
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
    {phase === "success" && (
      <motion.g key="amount" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <text x="253" y="209" textAnchor="middle" fill="hsl(220 15% 48%)" fontSize="5.5" fontFamily="monospace">TOTAL</text>
        <text x="253" y="222" textAnchor="middle" fill="#f0f6ff" fontSize="12" fontFamily="monospace" fontWeight="700">$4.67</text>
      </motion.g>
    )}
    {(phase === "pickdest" || phase === "aigoal") && (
      <motion.g key="paid" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <circle cx="253" cy="208" r="6" fill="#22c55e" opacity="0.12" />
        <text x="253" y="211" textAnchor="middle" fill="#22c55e" fontSize="7.5" fontFamily="monospace" fontWeight="700">✓ PAID</text>
        <text x="253" y="222" textAnchor="middle" fill="#22c55e" fontSize="5.5" fontFamily="monospace" opacity="0.6">$4.67 approved</text>
      </motion.g>
    )}
    {phase === "notify" && (
      <motion.g key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <text x="253" y="214" textAnchor="middle" fill="hsl(220 15%38%)" fontSize="6" fontFamily="monospace" fontWeight="600">THANK YOU</text>
        <text x="253" y="225" textAnchor="middle" fill="hsl(220 15%26%)" fontSize="5.5" fontFamily="monospace">Have a great day</text>
      </motion.g>
    )}
  </AnimatePresence>
);

// ─── Cashier ────────────────────────────────────────────────────────────────
const Cashier = ({ phase }: { phase: Phase }) => {
  const x = 112, skin = "hsl(28 52% 67%)", cloth = "hsl(160 38% 28%)", hair = "hsl(25 45% 22%)";
  const lean = phase === "tap" || phase === "success";
  return (
    <motion.g animate={lean ? { x: 6, y: -2 } : { x: 0, y: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
      <rect x={x-20} y={152} width={40} height={88} rx={12} fill={cloth} />
      <rect x={x-10} y={158} width={20} height={70} rx={6} fill="hsl(160 30% 22%)" opacity="0.5" />
      <path d={`M${x-7} 155 Q${x} 163 ${x+7} 155`} stroke="hsl(0 0% 88%)" strokeWidth="1.8" fill="none" opacity="0.45" />
      <circle cx={x} cy={128} r={24} fill={skin} />
      <path d={`M${x-21} 119 Q${x-16} 105 ${x} 104 Q${x+16} 105 ${x+21} 119`} fill={hair} />
      <ellipse cx={x-7} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <ellipse cx={x+7} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <circle cx={x-6} cy={126} r={1} fill="white" opacity="0.7" />
      <circle cx={x+8} cy={126} r={1} fill="white" opacity="0.7" />
      <path d={`M${x-10} 121 Q${x-7} 119 ${x-4} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M${x+4} 121 Q${x+7} 119 ${x+10} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <motion.path d={`M${x-6} 137 Q${x} 143 ${x+6} 137`} stroke="hsl(220 20% 24%)" strokeWidth="2.2" fill="none" strokeLinecap="round"
        animate={(phase === "notify") ? { d: `M${x-8} 136 Q${x} 145 ${x+8} 136` } : {}} transition={{ duration: 0.35 }} />
      <path d={`M${x+18} 168 Q${x+30} 190 ${x+28} 230`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none" />
      <circle cx={x+27} cy={232} r={9} fill={skin} />
      <path d={`M${x-18} 168 Q${x-30} 195 ${x-26} 232`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none" />
      <circle cx={x-25} cy={234} r={9} fill={skin} />
    </motion.g>
  );
};

// ─── Customer ───────────────────────────────────────────────────────────────
const Customer = ({ phase }: { phase: Phase }) => {
  const x = 388, skin = "hsl(32 55% 74%)", cloth = "hsl(215 50% 32%)", hair = "hsl(220 18% 18%)";
  const armUp = phase !== "idle" && phase !== "reset";
  return (
    <g>
      <rect x={x-20} y={152} width={40} height={88} rx={12} fill={cloth} />
      <path d={`M${x-7} 155 Q${x} 164 ${x+7} 155`} stroke="hsl(0 0% 88%)" strokeWidth="1.8" fill="none" opacity="0.4" />
      <circle cx={x} cy={128} r={24} fill={skin} />
      <path d={`M${x-22} 117 Q${x-16} 102 ${x} 102 Q${x+16} 102 ${x+22} 117`} fill={hair} />
      <ellipse cx={x-7.5} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <ellipse cx={x+6.5} cy={127} rx={2.8} ry={3} fill="hsl(220 20% 18%)" />
      <circle cx={x-8.5} cy={127} r={1.2} fill="hsl(25 60% 15%)" />
      <circle cx={x+5.5} cy={127} r={1.2} fill="hsl(25 60% 15%)" />
      <circle cx={x-7.5} cy={126} r={0.9} fill="white" opacity="0.6" />
      <circle cx={x+6.5} cy={126} r={0.9} fill="white" opacity="0.6" />
      <path d={`M${x-11} 121 Q${x-7.5} 119 ${x-4} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M${x+3} 121 Q${x+6.5} 119 ${x+10} 121`} stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <motion.path d={`M${x-5} 137 Q${x} 141 ${x+5} 137`} stroke="hsl(25 35% 30%)" strokeWidth="2" fill="none" strokeLinecap="round"
        animate={(phase === "notify") ? { d: `M${x-7} 136 Q${x} 144 ${x+7} 136` } : {}} transition={{ duration: 0.35 }} />
      {/* Arm at side (fades on raise) */}
      <motion.path d={`M${x+18} 168 Q${x+28} 195 ${x+24} 234`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none"
        animate={armUp ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.22 }} />
      <motion.circle cx={x+23} cy={235} r={9} fill={skin}
        animate={armUp ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.22 }} />
      {/* Raised arm */}
      <motion.path d={`M${x-18} 168 Q${x-54} 162 ${x-80} 178`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none"
        initial={{ opacity: 0 }} animate={armUp ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.48 }} />
      <motion.path d={`M${x-80} 178 Q${x-95} 190 ${x-97} 206`} stroke={cloth} strokeWidth="15" strokeLinecap="round" fill="none"
        initial={{ opacity: 0 }} animate={armUp ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.48, delay: 0.06 }} />
      <motion.circle cx={x-99} cy={210} r={9} fill={skin}
        initial={{ opacity: 0 }} animate={armUp ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }} />
      <motion.path d={`M${x-107} 206 Q${x-111} 210 ${x-107} 215`} stroke={skin} strokeWidth="4.5" strokeLinecap="round" fill="none"
        initial={{ opacity: 0 }} animate={armUp ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.12 }} />
      {/* Phone */}
      <motion.g initial={{ opacity: 0 }} animate={armUp ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.14 }}>
        <rect x="272" y="196" width="26" height="42" rx="5" fill="hsl(220 30% 4%)" opacity="0.35" transform="translate(2,3)" />
        <rect x="272" y="196" width="26" height="42" rx="5" fill="hsl(220 15% 13%)" stroke="hsl(220 20% 25%)" strokeWidth="1.2" />
        <rect x="298" y="206" width="1.5" height="8" rx="0.75" fill="hsl(220 15% 27%)" />
        <rect x="270.5" y="204" width="1.5" height="5" rx="0.75" fill="hsl(220 15% 27%)" />
        <rect x="270.5" y="211" width="1.5" height="5" rx="0.75" fill="hsl(220 15% 27%)" />
        <rect x="281" y="197.5" width="6" height="3" rx="1.5" fill="hsl(220 15% 9%)" />
        <rect x="274.5" y="200" width="21" height="35" rx="3" fill="hsl(220 35% 7%)" />
        <PhoneScreen phase={phase} />
        <rect x="281" y="233.5" width="8" height="1.5" rx="0.75" fill="hsl(220 15% 24%)" />
      </motion.g>
      {/* Other arm */}
      <motion.path d={`M${x+18} 168 Q${x+28} 198 ${x+22} 234`} stroke={cloth} strokeWidth="17" strokeLinecap="round" fill="none"
        animate={armUp ? { opacity: 0.35 } : { opacity: 1 }} transition={{ duration: 0.4 }} />
      <motion.circle cx={x+21} cy={235} r={9} fill={skin}
        animate={armUp ? { opacity: 0.35 } : { opacity: 1 }} transition={{ duration: 0.4 }} />
    </g>
  );
};

// ─── Scene Canvas ────────────────────────────────────────────────────────────
const SceneCanvas = ({ phase }: { phase: Phase }) => {
  const glow = phase === "tap" || phase === "success" || phase === "pickdest" || phase === "aigoal";
  return (
    <div className="relative w-full select-none" style={{ height: 290 }}>
      <AnimatePresence>
        {glow && (
          <motion.div key="glow" className="absolute pointer-events-none"
            style={{ width: 110, height: 70, top: "40%", left: "40%",
              background: "radial-gradient(ellipse, rgba(14,165,233,0.16) 0%, transparent 70%)", filter: "blur(14px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
        )}
      </AnimatePresence>

      <svg viewBox="0 0 520 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="phoneGradH" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Counter */}
        <rect x="70" y="235" width="380" height="65" rx="16" fill="hsl(220 22% 10%)" stroke="hsl(220 18% 17%)" strokeWidth="1.5" />
        <rect x="70" y="233" width="380" height="11" rx="5" fill="hsl(220 18% 15%)" />
        <rect x="90" y="237" width="180" height="2" rx="1" fill="hsl(220 18% 22%)" opacity="0.55" />
        <ellipse cx="260" cy="306" rx="170" ry="7" fill="hsl(220 28% 4%)" opacity="0.5" />
        {/* Terminal */}
        <rect x="210" y="183" width="86" height="56" rx="11" fill="hsl(220 18% 13%)" stroke="hsl(220 18% 21%)" strokeWidth="1.5" />
        <rect x="218" y="191" width="70" height="36" rx="6" fill="hsl(220 28% 7%)" />
        <path d="M296 200 Q302 209.5 296 219" stroke={glow ? "#0ea5e9" : "hsl(220 15% 28%)"} strokeWidth="2" fill="none" strokeLinecap="round" opacity={glow ? 0.75 : 1} />
        <path d="M299 203.5 Q307 209.5 299 215.5" stroke={glow ? "#0ea5e9" : "hsl(220 15% 22%)"} strokeWidth="2" fill="none" strokeLinecap="round" opacity={glow ? 0.45 : 1} />
        <rect x="244" y="239" width="22" height="5" rx="2.5" fill="hsl(220 18% 17%)" />
        <rect x="222" y="236" width="62" height="3.5" rx="1.5" fill="hsl(220 28% 6%)" stroke="hsl(220 18% 18%)" strokeWidth="0.8" />
        <TerminalScreen phase={phase} />
        <NfcWaves active={phase === "tap"} />
        <Cashier phase={phase} />
        <Customer phase={phase} />
        {/* Counter items */}
        <path d="M148 225 Q149 218 157 218 Q165 218 166 225 L164 238 Q163 242 157 242 Q151 242 150 238 Z" fill="hsl(25 55% 38%)" />
        <rect x="150" y="218" width="14" height="4" rx="2" fill="hsl(25 55% 44%)" />
        <path d="M166 224 Q172 224 172 229 Q172 234 166 234" stroke="hsl(25 45% 40%)" strokeWidth="2.5" fill="none" />
        <rect x="172" y="222" width="20" height="18" rx="3" fill="hsl(200 60% 38%)" />
        <rect x="172" y="222" width="20" height="6" rx="3" fill="hsl(200 65% 44%)" />
        <path d="M133 218 Q135 210 143 210 Q151 210 153 218 L155 238 Q154 243 143 243 Q132 243 131 238 Z" fill="hsl(340 50% 38%)" opacity="0.85" />
        <path d="M137 210 Q143 205 149 210" stroke="hsl(340 40% 48%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>

      {/* Phone UI overlay */}
      <PhoneOverlay phase={phase} />
    </div>
  );
};

// ─── Hero Section ────────────────────────────────────────────────────────────
export const HeroSection = () => {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const run = async () => {
      setPhase("idle");     await delay(900);
      setPhase("raise");    await delay(820);
      setPhase("tap");      await delay(1200);
      setPhase("success");  await delay(600);
      setPhase("pickdest"); await delay(2200);
      setPhase("aigoal");   await delay(2800);
      setPhase("notify");   await delay(3000);
      setPhase("reset");    await delay(500);
    };
    run();
    const id = setInterval(run, 12000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[460px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(210 100% 50% / 0.055) 0%, transparent 68%)" }} />
      <div className="absolute top-1/3 left-[10%] w-72 h-72 bg-primary/[0.035] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-[8%] w-60 h-60 bg-violet-500/[0.035] rounded-full blur-[80px]" />

      <div className="container relative z-10 py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[86vh]">

          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 lg:py-16"
          >
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.52 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "hsl(var(--primary) / 0.07)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-primary tracking-[0.1em] uppercase">AI-powered wealth building</span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4">
              <h1 className="font-bold leading-[1.07] tracking-[-0.03em]"
                style={{ fontSize: "clamp(2.4rem, 4.6vw, 3.9rem)" }}>
                <span className="text-foreground">Every spare cent,</span>
                <br />
                <span className="gradient-text">working for</span>
                <br />
                <span className="text-foreground">your future.</span>
              </h1>
              <p className="text-[1.04rem] leading-relaxed max-w-[430px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                Round up every purchase and route the change to any goal — debt payoff, 401(k), Roth IRA, or brokerage. AI builds your plan. You just live your life.
              </p>
            </motion.div>

            {/* Destination chips */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
              className="flex flex-wrap gap-2">
              {[
                { icon: Car,          label: "Car Loan",  color: "#0ea5e9" },
                { icon: Landmark,     label: "401(k)",    color: "#a78bfa" },
                { icon: TrendingDown, label: "Student Loan", color: "#f87171" },
                { icon: BarChart3,    label: "Brokerage", color: "#34d399" },
                { icon: Bot,          label: "AI-guided",   color: "#f59e0b" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
                  style={{
                    background: color + "10",
                    border: `1px solid ${color}28`,
                    color: color,
                  }}>
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
              className="flex items-stretch gap-5">
              {[
                { value: "$847", label: "avg. saved / year" },
                { value: "2.3 yrs", label: "faster payoff" },
                { value: "0 effort", label: "fully automatic" },
              ].map((s, i) => (
                <div key={i} className="flex items-stretch gap-5">
                  {i > 0 && <div className="w-px self-stretch" style={{ background: "hsl(var(--border))" }} />}
                  <div>
                    <p className="text-[1.35rem] font-bold font-mono"
                      style={{ background: "linear-gradient(130deg,hsl(var(--primary)),hsl(250 88% 68%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.value}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.52 }}
              className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" className="group">
                Start for free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="xl" className="text-white"
                onClick={() => document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                See how it works
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52, duration: 0.5 }}
              className="flex items-center gap-4 pt-0.5">
              <div className="flex -space-x-2.5">
                {(["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"] as const).map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c, zIndex: 4 - i }}>
                    {["A", "M", "J", "S"][i]}
                  </div>
                ))}
              </div>
              <p className="text-[13px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span className="text-foreground font-semibold">12,400+</span> people building wealth automatically
              </p>
            </motion.div>

            {/* Trust pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.48 }}
              className="flex flex-wrap gap-2">
              {[
                { icon: Shield, label: "Bank-level security" },
                { icon: Zap, label: "Instant round-ups" },
                { icon: Target, label: "Any loan or account" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                  style={{ background: "hsl(var(--muted)/0.44)", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Animation card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.76, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:py-16"
          >
            <div className="relative w-full max-w-[500px] rounded-[28px] overflow-visible"
              style={{
                background: "linear-gradient(158deg, hsl(220 22% 9%), hsl(220 18% 7%))",
                border: "1.5px solid hsl(220 18% 15%)",
                boxShadow: "0 48px 120px rgba(0,0,0,0.55), inset 0 1px 0 hsl(220 18% 20%)",
                padding: "26px 24px 20px",
              }}>
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-[11px] font-semibold tracking-[0.08em]" style={{ color: "hsl(220 14% 44%)" }}>Live Preview</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ opacity: [1, 0.22, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                  <p className="text-[10.5px]" style={{ color: "hsl(220 14% 34%)" }}>Auto-routing</p>
                </div>
              </div>

              {/* Phase label */}
              <AnimatePresence mode="wait">
                <motion.div key={phase}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1" style={{ background: "hsl(220 18% 14%)" }} />
                  <span className="text-[9.5px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full"
                    style={{ background: "hsl(220 18% 12%)", color: "hsl(220 15% 36%)", border: "1px solid hsl(220 18% 18%)" }}>
                    {{
                      idle: "Waiting at counter",
                      raise: "Lifting phone to pay",
                      tap: "Tap to pay via NFC",
                      success: "Payment confirmed",
                      pickdest: "Choose destination",
                      aigoal: "AI advisor active",
                      notify: "Round-up complete",
                      reset: "…",
                    }[phase]}
                  </span>
                  <div className="h-px flex-1" style={{ background: "hsl(220 18% 14%)" }} />
                </motion.div>
              </AnimatePresence>

              <SceneCanvas phase={phase} />

              {/* Footer */}
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid hsl(220 18% 12%)" }}>
                <p className="text-[10.5px]" style={{ color: "hsl(220 14% 28%)" }}>
                  Every transaction builds your future.
                </p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      animate={{ opacity: [0.14, 1, 0.14] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.42 }}
                      className="w-1 h-1 rounded-full" style={{ background: "hsl(215 58% 54%)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Corner glow */}
            <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(250 78% 58% / 0.065), transparent 70%)" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};