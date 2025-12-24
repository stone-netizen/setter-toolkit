import { motion } from "framer-motion";
import { Leak } from "@/utils/calculations";
import { LeakCard } from "./LeakCard";

interface LeakBreakdownGridProps {
  leaks: Leak[];
  totalLoss: number;
  onViewSolution: (leakType: string) => void;
}

export function LeakBreakdownGrid({ leaks, totalLoss, onViewSolution }: LeakBreakdownGridProps) {
  const activeLeaks = leaks.filter(leak => leak.monthlyLoss > 0);
  
  if (activeLeaks.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-display-lg font-bold text-foreground mb-4">
            Your Revenue Leaks
          </h2>
          <p className="text-lg text-muted-foreground">
            Ranked by impact and speed to fix
          </p>
        </motion.div>

        {/* Grid of leak cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {activeLeaks.map((leak, index) => (
            <LeakCard
              key={leak.type}
              leak={leak}
              rank={index + 1}
              totalLoss={totalLoss}
              onViewSolution={() => onViewSolution(leak.type)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
