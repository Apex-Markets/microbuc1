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
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const totalSaved = transactions
    .slice(0, currentIndex + 1)
    .reduce((sum, tx) => sum + (tx.rounded - tx.amount), 0);

  const currentTx = transactions[currentIndex];
  const roundUp = (currentTx.rounded - currentTx.amount).toFixed(2);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl" />
      {/* Phone mockup */}
      <div className="relative bg-card rounded-[2.5rem] p-2 shadow-2xl border border-border/50">
        <div className="bg-background rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-3 bg-muted/50">
            <span className="text-xs text-muted-foreground font-mono">9:41</span>
            <div className="w-20 h-6 bg-foreground/10 rounded-full" />
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
              <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
            </div>
          </div>
          {/* App content */}
          <div className="p-6 space-y-6 min-h-[400px]">
            {/* Header */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Round-ups today</p>
              <motion.div
                key={totalSaved}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold font-mono gradient-text"
              >
                ${totalSaved.toFixed(2)}
              </motion.div>
            </div>
            {/* Transaction card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-card p-5 space-y-4"
              >
                {/* Visible item and numbers */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{currentTx.item}</span>
                  <span className="font-mono font-semibold text-white">${currentTx.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">Rounded to</span>
                  <span className="font-mono font-semibold text-white">${currentTx.rounded.toFixed(2)}</span>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex justify-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                    <span className="text-sm text-primary font-medium">+${roundUp} to debt</span>
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      ↑
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            {/* Progress indicator */}
            <div className="flex justify-center gap-2">
              {transactions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "bg-primary w-6" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};