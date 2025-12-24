import { motion } from "framer-motion";
import { ArrowRight, Zap, Phone, Clock, TrendingUp, Calendar, Target, AlertCircle } from "lucide-react";
import { formatCurrencyRangeCompact, Leak } from "@/utils/calculations";

interface LeakCardProps {
  leak: Leak;
  rank: number;
  totalLoss: number;
  onViewSolution: () => void;
}

// Rank-based styling: #1 = red, #2 = yellow, rest = muted gray
const getRankConfig = (rank: number) => {
  if (rank === 1) {
    return {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      text: "text-destructive",
      badge: "bg-destructive text-destructive-foreground",
      glow: "shadow-[0_0_40px_-15px_hsl(var(--destructive))]",
    };
  }
  if (rank === 2) {
    return {
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
      badge: "bg-warning text-warning-foreground",
      glow: "shadow-[0_0_30px_-15px_hsl(var(--warning))]",
    };
  }
  // Everything else is muted gray
  return {
    bg: "bg-muted/30",
    border: "border-border",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
    glow: "",
  };
};

const LEAK_ICONS: Record<string, typeof Phone> = {
  missedCalls: Phone,
  slowResponse: Clock,
  noFollowUp: TrendingUp,
  noShow: Calendar,
  unqualifiedLeads: Target,
  afterHours: Clock,
  holdTime: Phone,
  reactivation: Zap,
};

const LEAK_PROBLEMS: Record<string, string[]> = {
  missedCalls: [
    "Missing 35% of inbound calls during business hours",
    "78% of callers won't leave voicemail",
    "Lost to competitors who answer first",
  ],
  slowResponse: [
    "5-minute response = 100x higher contact rate",
    "Speed signals reliability to prospects",
    "Competitors respond in minutes, not hours",
  ],
  noFollowUp: [
    "80% of sales need 5+ follow-up attempts",
    "Most give up after just 2 attempts",
    "Every unfollowed lead = wasted ad spend",
  ],
  noShow: [
    "Empty slots cost time and revenue",
    "Staff idle, can't serve others",
    "Weak confirmation = weak commitment",
  ],
  unqualifiedLeads: [
    "Hours wasted on poor-fit prospects",
    "Drains team energy and morale",
    "Every hour has opportunity cost",
  ],
  afterHours: [
    "30%+ of calls come after hours",
    "After-hours = high-intent buyers",
    "Competitors with 24/7 capture these",
  ],
  holdTime: [
    "Every hold minute = 10% hang-up rate",
    "First impression made during wait",
    "Frustration before you even speak",
  ],
};

const LEAK_FIXES: Record<string, { time: string; roi: string }> = {
  missedCalls: { time: "14d", roi: "12x" },
  slowResponse: { time: "7d", roi: "8x" },
  noFollowUp: { time: "21d", roi: "6x" },
  noShow: { time: "7d", roi: "5x" },
  unqualifiedLeads: { time: "14d", roi: "4x" },
  afterHours: { time: "7d", roi: "10x" },
  holdTime: { time: "21d", roi: "7x" },
};

export function LeakCard({ leak, rank, totalLoss, onViewSolution }: LeakCardProps) {
  // Use rank-based coloring instead of severity
  const rankConfig = getRankConfig(rank);
  const Icon = LEAK_ICONS[leak.type] || AlertCircle;
  const problems = LEAK_PROBLEMS[leak.type] || [];
  const fix = LEAK_FIXES[leak.type] || { time: "14d", roi: "5x" };
  const percentage = totalLoss > 0 ? Math.round((leak.monthlyLoss / totalLoss) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl bg-card border ${rankConfig.border} ${rankConfig.glow} transition-all duration-300`}
    >
      {/* Constraint label badge - top right */}
      <div className="absolute top-4 right-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${rankConfig.badge}`}>
          {leak.constraintLabel || (leak.severity.charAt(0).toUpperCase() + leak.severity.slice(1))}
        </span>
      </div>

      {/* Rank badge - top left */}
      <div className="absolute top-4 left-4">
        <div className="w-8 h-8 rounded-lg bg-secondary/80 border border-border flex items-center justify-center">
          <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
        </div>
      </div>

      <div className="pt-16 p-6">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${rankConfig.bg} border ${rankConfig.border} flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${rankConfig.text}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {leak.label}
        </h3>

        {/* Loss amount - Now a range */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-numeric ${rankConfig.text}`}>
              {formatCurrencyRangeCompact(leak.monthlyLossRange)}
            </span>
            <span className="text-sm text-muted-foreground">/mo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatCurrencyRangeCompact(leak.annualLossRange)}/year
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-foreground font-numeric">{percentage}%</p>
            <p className="text-xs text-muted-foreground">Of loss</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-foreground font-numeric">{fix.time}</p>
            <p className="text-xs text-muted-foreground">Fix time</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-success font-numeric">{fix.roi}</p>
            <p className="text-xs text-muted-foreground">ROI</p>
          </div>
        </div>

        {/* Problems - concise bullets */}
        <div className="space-y-2 mb-6">
          {problems.slice(0, 3).map((problem, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className={`w-1 h-1 rounded-full ${rankConfig.text.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
              <span>{problem}</span>
            </div>
          ))}
        </div>

        {/* Quick win badge */}
        {leak.quickWin && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20 mb-4">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Quick Win</span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onViewSolution}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${rankConfig.bg} ${rankConfig.text} font-medium text-sm hover:opacity-80 transition-opacity`}
        >
          View Solution
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
