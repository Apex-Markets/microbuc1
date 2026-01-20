import { motion } from "framer-motion";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Clock, Percent } from "lucide-react";

export const ImpactCalculator = () => {
  const [transactions, setTransactions] = useState([30]);
  const [avgRoundup, setAvgRoundup] = useState([0.50]);
  const [debtAmount, setDebtAmount] = useState([15000]);

  const dailySavings = transactions[0] * avgRoundup[0];
  const monthlySavings = dailySavings * 30;
  const yearlySavings = monthlySavings * 12;
  const monthsToPayExtra = debtAmount[0] / monthlySavings;

  return (
    <section id="calculator" className="py-24 lg:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="glass-card p-8 lg:p-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Calculate your impact</h3>
                <p className="text-muted-foreground">See how much you could save based on your spending habits.</p>
              </div>

              {/* Transactions slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white">Daily transactions</label>
                  <span className="font-mono font-bold text-primary">{transactions[0]}</span>
                </div>
                <Slider
                  value={transactions}
                  onValueChange={setTransactions}
                  min={5}
                  max={50}
                  step={1}
                  className="py-2"
                />
              </div>

              {/* Average roundup slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white">Avg. round-up amount</label>
                  <span className="font-mono font-bold text-primary">${avgRoundup[0].toFixed(2)}</span>
                </div>
                <Slider
                  value={avgRoundup}
                  onValueChange={setAvgRoundup}
                  min={0.10}
                  max={0.99}
                  step={0.01}
                  className="py-2"
                />
              </div>

              {/* Debt amount slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white">Total debt</label>
                  <span className="font-mono font-bold text-primary">${debtAmount[0].toLocaleString()}</span>
                </div>
                <Slider
                  value={debtAmount}
                  onValueChange={setDebtAmount}
                  min={1000}
                  max={100000}
                  step={1000}
                  className="py-2"
                />
              </div>

              {/* Results */}
              <div className="pt-6 border-t border-border space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold font-mono gradient-text">${dailySavings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Daily</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold font-mono gradient-text">${monthlySavings.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Monthly</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold font-mono gradient-text">${yearlySavings.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Yearly</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div>
              <p className="text-primary font-semibold mb-4">See the math</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-white">Small change.</span>
                <br />
                <span className="gradient-text">Big difference.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most people don't realize how much those spare cents add up. 
                With Micropay, you're putting every fraction to work — automatically.
              </p>
            </div>

            {/* Impact stats */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-xl">${yearlySavings.toFixed(0)}/year in round-ups</p>
                  <p className="text-muted-foreground">Based on your spending habits</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-xl">{monthsToPayExtra.toFixed(0)} months faster</p>
                  <p className="text-muted-foreground">Debt payoff acceleration</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Percent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-xl">Interest saved</p>
                  <p className="text-muted-foreground">Less time = less interest paid</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};