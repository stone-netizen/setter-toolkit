import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DollarSign, Phone } from "lucide-react";

interface LeakSimulatorProps {
  initialProjectValue?: number;
  initialMissedCalls?: number;
  onValuesChange?: (projectValue: number, missedCalls: number) => void;
}

export function LeakSimulator({
  initialProjectValue = 5000,
  initialMissedCalls = 10,
  onValuesChange,
}: LeakSimulatorProps) {
  const [projectValue, setProjectValue] = useState(initialProjectValue);
  const [missedCalls, setMissedCalls] = useState(initialMissedCalls);
  const [displayedLoss, setDisplayedLoss] = useState(0);

  // Calculate annual loss: missed calls * 12 months * 30% close rate * project value
  const annualLoss = missedCalls * 12 * 0.3 * projectValue;

  // Animate the displayed value
  useEffect(() => {
    const duration = 600;
    const steps = 20;
    const startValue = displayedLoss;
    const diff = annualLoss - startValue;
    const stepValue = diff / steps;
    let current = startValue;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += stepValue;
      if (step >= steps) {
        setDisplayedLoss(annualLoss);
        clearInterval(timer);
      } else {
        setDisplayedLoss(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [annualLoss]);

  useEffect(() => {
    onValuesChange?.(projectValue, missedCalls);
  }, [projectValue, missedCalls, onValuesChange]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32, duration: 0.4 }}
      className="glass rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold mb-6 text-foreground">Revenue Leak Simulator</h3>

      <div className="space-y-6">
        {/* Project Value Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              Average Project Value
            </Label>
            <span className="text-sm font-mono text-primary font-semibold">
              ${projectValue.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[projectValue]}
            onValueChange={(val) => setProjectValue(val[0])}
            min={1000}
            max={100000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$1K</span>
            <span>$100K</span>
          </div>
        </div>

        {/* Missed Calls Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              Missed Calls Per Month
            </Label>
            <span className="text-sm font-mono text-primary font-semibold">
              {missedCalls} calls
            </span>
          </div>
          <Slider
            value={[missedCalls]}
            onValueChange={(val) => setMissedCalls(val[0])}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>50</span>
          </div>
        </div>

        {/* Result */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Annual Money Lost</p>
          <motion.p
            key={displayedLoss}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold font-mono text-leak-critical tracking-tight"
          >
            {formatCurrency(displayedLoss)}
          </motion.p>
          <p className="text-xs text-muted-foreground mt-2">
            Based on 30% close rate × {missedCalls} missed calls/month × 12 months
          </p>
        </div>
      </div>
    </motion.div>
  );
}
