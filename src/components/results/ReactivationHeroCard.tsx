import { motion } from "framer-motion";
import { ArrowRight, Users, RefreshCw } from "lucide-react";
import { formatCurrency, ReactivationLeak } from "@/utils/calculations";

interface ReactivationHeroCardProps {
  reactivation: ReactivationLeak;
}

export const ReactivationHeroCard = ({ reactivation }: ReactivationHeroCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      {/* Main card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-depth-lg">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-30" />
        
        {/* Gradient accent on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary/50" />

        <div className="relative p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
                  Quick Win Opportunity
                </p>
                <h2 className="text-heading font-bold text-foreground">
                  Dormant Leads & Customer Reactivation
                </h2>
              </div>
            </div>
            
            {/* Quick win badge */}
            <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <span className="text-xs font-semibold text-success">Fastest ROI</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Monthly Recovery Potential
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-display font-black text-gradient-primary font-numeric">
                  {formatCurrency(reactivation.monthlyLoss)}
                </span>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Annual Value
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-display font-black text-foreground font-numeric">
                  {formatCurrency(reactivation.annualLoss)}
                </span>
              </div>
            </div>
          </div>

          {/* Implementation details */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">
                {reactivation.implementationTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">
                Expected: {reactivation.expectedROI}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">
                Payback: {reactivation.paybackPeriod}
              </span>
            </div>
          </div>

          {/* Progress indicator */}
          {reactivation.quickWinScore > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Opportunity Score
                </span>
                <span className="text-sm font-bold text-foreground font-numeric">
                  {reactivation.quickWinScore}/100
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${reactivation.quickWinScore}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
