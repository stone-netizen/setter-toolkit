import { motion } from "framer-motion";
import { Trophy, Zap, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, ReactivationLeak } from "@/utils/calculations";

interface ReactivationHeroCardProps {
  reactivation: ReactivationLeak;
}

export const ReactivationHeroCard = ({ reactivation }: ReactivationHeroCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <Card className="relative overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 blur-xl opacity-30 animate-pulse" />

        {/* Quick Win Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-emerald-500 text-white px-3 py-1.5 text-sm font-bold shadow-lg animate-pulse">
            <Zap className="w-3.5 h-3.5 mr-1" />
            QUICK WIN
          </Badge>
        </div>

        <CardContent className="relative p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Trophy className="w-8 h-8 text-amber-100" />
            </motion.div>
            <div>
              <p className="text-amber-100 text-sm font-semibold tracking-wider uppercase">
                Quick Win Opportunity
              </p>
              <div className="h-0.5 w-full bg-white/30 mt-1" />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-amber-100" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              💤 Dormant Leads & Customer Reactivation
            </h2>
          </div>

          {/* Main metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-amber-100 text-sm font-medium mb-2">
                Untapped Monthly Opportunity
              </p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                {formatCurrency(reactivation.monthlyLoss)}
              </motion.p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-amber-100 text-sm font-medium mb-2">
                Annual Value
              </p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                {formatCurrency(reactivation.annualLoss)}
              </motion.p>
            </div>
          </div>

          {/* Quick Win Info */}
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">
                ⚡ QUICK WIN: Fastest money to recover
              </p>
              <p className="text-amber-100 text-sm">
                {reactivation.implementationTime} • Expected ROI: {reactivation.expectedROI} • Payback: {reactivation.paybackPeriod}
              </p>
            </div>
          </div>

          {/* Quick Win Score */}
          {reactivation.quickWinScore > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-amber-100 text-sm">Opportunity Score:</span>
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${reactivation.quickWinScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
                />
              </div>
              <span className="text-white font-bold text-sm">{reactivation.quickWinScore}/100</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
