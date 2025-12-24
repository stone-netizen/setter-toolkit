import { motion } from "framer-motion";
import { AlertTriangle, Clock, Wrench, Zap } from "lucide-react";
import { formatCurrencyRangeCompact, Leak } from "@/utils/calculations";

interface ConstraintSummaryCardProps {
  primaryConstraint: Leak;
}

// Why it matters copy for each leak type
const WHY_IT_MATTERS: Record<string, string> = {
  "missed-calls": "78% of customers buy from the first responder",
  "after-hours": "30%+ of high-intent buyers call outside business hours",
  "slow-response": "5-minute response = 100x higher contact rate than 30 min",
  "no-follow-up": "80% of sales require 5+ follow-up attempts to close",
  "no-show": "Every empty slot costs staff time and blocks paying customers",
  "unqualified-leads": "Unqualified leads drain 15+ hours/week of team capacity",
  "hold-time": "Every minute on hold increases hang-up rate by 10%",
  "reactivation": "Past leads convert 3–5x faster than cold outreach",
};

// Fix complexity based on leak type
const FIX_COMPLEXITY: Record<string, string> = {
  "missed-calls": "Low",
  "after-hours": "Low",
  "slow-response": "Low",
  "no-follow-up": "Medium",
  "no-show": "Low",
  "unqualified-leads": "Medium",
  "hold-time": "Medium",
  "reactivation": "Low",
};

// Time to impact based on leak type
const TIME_TO_IMPACT: Record<string, string> = {
  "missed-calls": "14–21 days",
  "after-hours": "7–14 days",
  "slow-response": "7–14 days",
  "no-follow-up": "21–30 days",
  "no-show": "7–14 days",
  "unqualified-leads": "14–21 days",
  "hold-time": "21–30 days",
  "reactivation": "7–14 days",
};

export function ConstraintSummaryCard({ primaryConstraint }: ConstraintSummaryCardProps) {
  const whyItMatters = WHY_IT_MATTERS[primaryConstraint.type] || "This is your highest-leverage fix opportunity";
  const fixComplexity = FIX_COMPLEXITY[primaryConstraint.type] || "Medium";
  const timeToImpact = TIME_TO_IMPACT[primaryConstraint.type] || "14–21 days";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border-2 border-destructive/40 bg-gradient-to-br from-destructive/10 via-card to-card shadow-[0_0_60px_-20px_hsl(var(--destructive))]"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-grid opacity-10" />
      
      {/* Content */}
      <div className="relative p-6 lg:p-8">
        {/* Header badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wide">
              Primary Constraint
            </span>
          </div>
        </div>

        {/* Main constraint title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
          {primaryConstraint.label}
        </h2>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Estimated Impact */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Impact</p>
              <p className="text-xl font-bold text-foreground font-numeric">
                {formatCurrencyRangeCompact(primaryConstraint.monthlyLossRange)}/month
              </p>
            </div>
          </div>

          {/* Why it matters */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 border border-warning/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Why it matters</p>
              <p className="text-sm text-foreground leading-relaxed">
                {whyItMatters}
              </p>
            </div>
          </div>

          {/* Fix complexity */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Fix complexity</p>
              <p className={`text-lg font-semibold ${
                fixComplexity === "Low" ? "text-success" : 
                fixComplexity === "Medium" ? "text-warning" : "text-destructive"
              }`}>
                {fixComplexity}
              </p>
            </div>
          </div>

          {/* Time to impact */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Time to impact</p>
              <p className="text-lg font-semibold text-foreground">
                {timeToImpact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}