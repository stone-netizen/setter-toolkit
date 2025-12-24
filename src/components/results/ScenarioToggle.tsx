import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, Leak } from "@/utils/calculations";

interface ScenarioToggleProps {
  missedCallsLeak: Leak | undefined;
  totalMonthlyLoss: number;
}

export function ScenarioToggle({ missedCallsLeak, totalMonthlyLoss }: ScenarioToggleProps) {
  const [isCaptured, setIsCaptured] = useState(false);

  if (!missedCallsLeak || missedCallsLeak.monthlyLoss <= 0) {
    return null;
  }

  // Calculate recovered amount (65% of the missed calls leak)
  const recoveredAmount = Math.round(missedCallsLeak.monthlyLoss * 0.65);
  const newLoss = totalMonthlyLoss - recoveredAmount;
  const percentReduction = Math.round((recoveredAmount / totalMonthlyLoss) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <label 
              htmlFor="scenario-toggle" 
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              What if missed calls were captured?
            </label>
            <p className="text-xs text-muted-foreground">See your adjusted revenue</p>
          </div>
        </div>
        
        <Switch
          id="scenario-toggle"
          checked={isCaptured}
          onCheckedChange={setIsCaptured}
        />
      </div>

      <AnimatePresence mode="wait">
        {isCaptured && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Scenario applied</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Recovered</p>
                  <p className="text-lg font-bold text-success font-numeric">
                    +{formatCurrency(recoveredAmount)}/mo
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">New monthly loss</p>
                  <p className="text-lg font-bold text-foreground font-numeric">
                    {formatCurrency(newLoss)}/mo
                  </p>
                </div>
              </div>
              
              <p className="mt-3 text-xs text-muted-foreground">
                That's a <span className="font-semibold text-success">{percentReduction}% reduction</span> in recoverable revenue loss
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
