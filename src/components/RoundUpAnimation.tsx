import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const transactions = [
  { amount: 4.67, rounded: 5.00, item: "Coffee" },
  { amount: 12.43, rounded: 13.00, item: "Lunch" },
  { amount: 8.99, rounded: 9.00, item: "Spotify" },
  { amount: 24.56, rounded: 25.00, item: "Gas" },
  { amount: 6.78, rounded: 7.00, item: "Snacks" },
];

export const RoundUpAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % transactions.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const totalSaved = transactions
    .slice(0, currentIndex + 1)
    .reduce((sum, tx) => sum + (tx.rounded - tx.amount), 0);

  const currentTx = transactions[currentIndex];
  const roundUp = (currentTx.rounded - currentTx.amount).toFixed(2);

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>
      {/* iPhone Frame */}
      <div className="relative bg-black rounded-[2.5rem] p-2 shadow-xl border-8 border-black/80 overflow-hidden max-w-xs mx-auto" style={{ minWidth: 320 }}>
        {/* Status bar (9:41, etc): customized, no Apple logo */}
        <div className="flex justify-between items-center px-6 py-3 bg-black/40">
          <span className="text-xs text-white font-mono">9:41</span>
          <div className="w-20 h-6 bg-white/30 rounded-full" />
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-white/60 rounded-sm" />
            <div className="w-4 h-2 bg-white/60 rounded-sm" />
          </div>
        </div>
        {/* App content */}
        <div className="bg-gradient-to-br from-[#1d1e20] to-[#27282c] rounded-[2rem] overflow-hidden px-1 pt-2 pb-4 min-h-[450px] flex flex-col items-center">
          {/* EMPTY space where Apple Pay button was for layout consistency */}
          <div className="flex justify-center mb-4 mt-4" style={{ minHeight: 40, width: 160 }}></div>
          {/* Header/Sum */}
          <div className="flex flex-col items-center mt-6 mb-4">
            <span className="text-xs uppercase tracking-wide text-slate-300/80 mb-0.5">
              Round-ups today
            </span>
            <motion.span
              key={totalSaved}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-semibold text-white font-mono tracking-tight"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.09)",
              }}
            >
              ${totalSaved.toFixed(2)}
            </motion.span>
          </div>
          {/* Transaction Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 16, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="mx-auto bg-white/10 backdrop-blur-md shadow rounded-xl px-4 py-3 w-full max-w-[300px] ring-1 ring-inset ring-white/20"
              style={{
                boxShadow: "0 2px 38px -8px rgba(100,200,250,.12)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-normal text-base text-white">
                  {currentTx.item}
                </span>
                <span className="font-mono font-bold text-white/90 text-base">
                  ${currentTx.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 pr-1 mb-1">
                <div className="flex-1 h-1.5 bg-slate-900/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.1 }}
                    className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                <span className="text-xs text-slate-300/80">Rounded to</span>
                <span className="font-mono text-base text-cyan-100 font-semibold">
                  ${currentTx.rounded.toFixed(2)}
                </span>
              </div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.30, type: "spring", stiffness: 400 }}
                className="flex justify-center mt-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/50 border border-cyan-300/20 shadow-sm">
                  <span className="text-base text-cyan-300 font-medium drop-shadow">
                    +${roundUp} to debt
                  </span>
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                    className="inline-block text-cyan-100"
                  >
                    ↑
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {transactions.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-cyan-300 w-5 h-2 shadow-md"
                    : "bg-slate-300/30 w-2 h-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};