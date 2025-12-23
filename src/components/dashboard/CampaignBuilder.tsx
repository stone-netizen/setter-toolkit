import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Trophy,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, ReactivationLeak } from "@/utils/calculations";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { CalendlyModal } from "@/components/CalendlyModal";

interface CampaignBuilderProps {
  reactivation: ReactivationLeak | null;
  formData: CalculatorFormData;
  onClose: () => void;
}

export const CampaignBuilder = ({
  reactivation,
  formData,
  onClose,
}: CampaignBuilderProps) => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const totalLeads =
    (reactivation?.dormantLeads?.viableLeads || 0) +
    (reactivation?.pastCustomers?.winnableCustomers || 0);

  const responseRate = 0.22;
  const expectedResponses = Math.round(totalLeads * responseRate);
  
  const closeRate = formData.totalMonthlyLeads && formData.closedDealsPerMonth 
    ? formData.closedDealsPerMonth / formData.totalMonthlyLeads 
    : 0.3;
  const expectedConversions = Math.max(1, Math.round(expectedResponses * closeRate));
  
  const avgTransactionValue = formData.avgTransactionValue || 500;
  const repeatPurchases = formData.avgPurchasesPerCustomer || 3;
  const customerLifetimeValue = avgTransactionValue * repeatPurchases;
  const projectedRevenue = expectedConversions * customerLifetimeValue;

  const opportunityValue = reactivation?.monthlyLoss || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Reactivation Opportunity
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Reactivation Campaign: {formatCurrency(opportunityValue)} Opportunity
                    </h3>
                    <p className="text-slate-400">
                      You have {totalLeads} dormant leads + past customers who could be reactivated
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-slate-900/30">
                    <div className="text-sm text-slate-400 mb-1">Expected Results (30 Days)</div>
                    <div className="text-2xl font-bold text-white">{expectedConversions} customer{expectedConversions !== 1 ? 's' : ''}</div>
                    <div className="text-sm text-emerald-400">From {totalLeads} contacts ({Math.round(responseRate * 100)}% response rate)</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-slate-900/30">
                    <div className="text-sm text-slate-400 mb-1">Projected Revenue</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(projectedRevenue)}</div>
                    <div className="text-sm text-emerald-400">{expectedConversions} conversion{expectedConversions !== 1 ? 's' : ''} × {formatCurrency(customerLifetimeValue)} LTV</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-6">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold text-amber-400">Quick Win:</span> This is often the fastest money to recover. These people already know you.
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      Personalized SMS + Email sequences for your industry
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      AI-powered follow-up automation
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      Complete setup & implementation included
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  onClick={() => setIsCalendlyOpen(true)}
                  className="w-full px-6 py-4 h-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all"
                >
                  Let's Implement This Together
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="mt-4 text-center text-sm text-slate-400">
                  We'll discuss implementation on your strategy call
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </>
  );
};
