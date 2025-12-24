import { motion } from "framer-motion";
import { Zap, Users, DollarSign, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyRangeCompact, ReactivationLeak } from "@/utils/calculations";

interface QuickWinCardProps {
  reactivation: ReactivationLeak;
  onViewPlan: () => void;
}

export function QuickWinCard({ reactivation, onViewPlan }: QuickWinCardProps) {
  const dormantCount = reactivation.dormantLeads?.viableLeads || 0;
  const pastCount = reactivation.pastCustomers?.winnableCustomers || 0;
  const totalContacts = dormantCount + pastCount;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-emerald-950/20 border border-success/20"
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-success/20 to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-success-foreground" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                  Quick Win
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Dormant Lead Reactivation
              </h3>
              <p className="text-sm text-muted-foreground">
                Fastest path to recovered revenue
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Contacts</span>
            </div>
            <p className="text-2xl font-bold text-foreground font-numeric">{totalContacts}</p>
            <p className="text-xs text-muted-foreground">Dormant leads</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Monthly</span>
            </div>
            <p className="text-xl font-bold text-success font-numeric">
              {formatCurrencyRangeCompact(reactivation.monthlyLossRange)}
            </p>
            <p className="text-xs text-muted-foreground">Projected recovery</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Timeline</span>
            </div>
            <p className="text-2xl font-bold text-foreground font-numeric">7d</p>
            <p className="text-xs text-muted-foreground">To first result</p>
          </div>
        </div>

        {/* Info box */}
        <div className="p-4 rounded-xl bg-success/5 border border-success/10 mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                These are warm leads who already know you
              </p>
              <p className="text-sm text-muted-foreground">
                Industry data: 22% reactivation rate with personalized outreach. No ad spend required.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onViewPlan}
          className="w-full h-12 bg-success hover:bg-success/90 text-success-foreground font-semibold rounded-xl"
        >
          Let's Build Your Reactivation Campaign
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
