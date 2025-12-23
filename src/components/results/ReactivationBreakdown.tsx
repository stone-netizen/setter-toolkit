import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Database, Users, AlertTriangle, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, DormantLeadsResult, PastCustomersResult } from "@/utils/calculations";

interface ReactivationBreakdownProps {
  dormantLeads: DormantLeadsResult | null;
  pastCustomers: PastCustomersResult | null;
  hasDormantLeads: boolean;
  hasPastCustomers: boolean;
  everRecontactedDormant: boolean | null;
  sendsReengagementCampaigns: boolean | null;
  percentageRecontactedDormant?: number;
}

export const ReactivationBreakdown = ({
  dormantLeads,
  pastCustomers,
  hasDormantLeads,
  hasPastCustomers,
  everRecontactedDormant,
  sendsReengagementCampaigns,
  percentageRecontactedDormant = 0,
}: ReactivationBreakdownProps) => {
  const [dormantExpanded, setDormantExpanded] = useState(true);
  const [pastCustomersExpanded, setPastCustomersExpanded] = useState(true);

  const DATABASE_AGE_LABELS: Record<string, string> = {
    "0-3months": "0-3 months old",
    "3-6months": "3-6 months old",
    "6-12months": "6-12 months old",
    "1-2years": "1-2 years old",
    "2+years": "2+ years old",
  };

  const TIME_SINCE_LABELS: Record<string, string> = {
    "3-6months": "3-6 months",
    "6-12months": "6-12 months",
    "1-2years": "1-2 years",
    "2+years": "2+ years",
  };

  return (
    <div className="space-y-4">
      {/* Dormant Leads Section */}
      {hasDormantLeads && dormantLeads && (
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setDormantExpanded(!dormantExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-200">
                    📊 Dormant Leads Database Analysis
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    {dormantLeads.viableLeads} viable leads ready for reactivation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-400">
                    {formatCurrency(dormantLeads.monthlyLoss)}/mo
                  </p>
                  <p className="text-xs text-slate-500">opportunity</p>
                </div>
                {dormantExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {dormantExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="border-t border-slate-700 pt-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Database</p>
                      <p className="text-2xl font-bold text-slate-200">
                        {dormantLeads.viableLeads + Math.round(dormantLeads.viableLeads * (100 - dormantLeads.viabilityRate) / dormantLeads.viabilityRate)} leads
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Database Age</p>
                      <p className="text-2xl font-bold text-slate-200">
                        {DATABASE_AGE_LABELS[dormantLeads.databaseAge] || dormantLeads.databaseAge}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Viable Leads</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {dormantLeads.viableLeads} ({dormantLeads.viabilityRate}%)
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                      <p className="text-lg font-bold text-slate-200">
                        {dormantLeads.recontactStatus}
                      </p>
                    </div>
                  </div>

                  {/* The Opportunity */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20 mb-6">
                    <h4 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      The Opportunity
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expected response rate:</span>
                          <span className="text-slate-200 font-medium">{dormantLeads.expectedResponseRate}% with basic campaign</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Best-in-class rate:</span>
                          <span className="text-emerald-400 font-medium">{dormantLeads.bestCaseResponseRate}% with optimized system</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expected customers:</span>
                          <span className="text-slate-200 font-medium">{dormantLeads.expectedCustomers} customers</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Best-case customers:</span>
                          <span className="text-emerald-400 font-medium">{dormantLeads.bestCaseCustomers} customers</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase mb-1">Monthly Opportunity</p>
                          <p className="text-3xl font-bold text-amber-400">{formatCurrency(dormantLeads.monthlyLoss)}</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase mb-1">Annual Opportunity</p>
                          <p className="text-3xl font-bold text-amber-400">{formatCurrency(dormantLeads.annualLoss)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning/Info Box */}
                  {everRecontactedDormant === false ? (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-400 font-semibold">
                          ⚠️ You've never reached back out to these leads
                        </p>
                        <p className="text-red-300/80 text-sm mt-1">
                          This is leaving {formatCurrency(dormantLeads.monthlyLoss)}/month on the table. A simple email or SMS campaign could recover a significant portion of this.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      <Clock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-400 font-semibold">
                          You've contacted {percentageRecontactedDormant}% of your database
                        </p>
                        <p className="text-amber-300/80 text-sm mt-1">
                          Reaching the remaining {100 - percentageRecontactedDormant}% could recover {formatCurrency(dormantLeads.upside)}/month in additional revenue.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Past Customers Section */}
      {hasPastCustomers && pastCustomers && (
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setPastCustomersExpanded(!pastCustomersExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-200">
                    💰 Past Customer Win-Back Analysis
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    {pastCustomers.winnableCustomers} winnable customers identified
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">
                    {formatCurrency(pastCustomers.monthlyLoss)}/mo
                  </p>
                  <p className="text-xs text-slate-500">opportunity</p>
                </div>
                {pastCustomersExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {pastCustomersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="border-t border-slate-700 pt-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Past Customers</p>
                      <p className="text-2xl font-bold text-slate-200">
                        {pastCustomers.winnableCustomers + pastCustomers.currentlyRecovered} customers
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time Since Purchase</p>
                      <p className="text-2xl font-bold text-slate-200">
                        {TIME_SINCE_LABELS[pastCustomers.timeSinceLastPurchase] || pastCustomers.timeSinceLastPurchase}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Win-Back Rate</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {pastCustomers.winBackRate}%
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Winnable Customers</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {pastCustomers.winnableCustomers}
                      </p>
                    </div>
                  </div>

                  {/* The Opportunity */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20 mb-6">
                    <h4 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      The Opportunity
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Return purchase bonus:</span>
                          <span className="text-emerald-400 font-medium">+{pastCustomers.returnPurchaseBonus}% higher AOV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current status:</span>
                          <span className="text-slate-200 font-medium">{pastCustomers.currentStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Recommended frequency:</span>
                          <span className="text-emerald-400 font-medium">{pastCustomers.recommendedFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current frequency score:</span>
                          <span className={`font-medium ${pastCustomers.frequencyScore >= 70 ? 'text-emerald-400' : pastCustomers.frequencyScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                            {pastCustomers.frequencyScore}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase mb-1">Monthly Opportunity</p>
                          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(pastCustomers.monthlyLoss)}</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase mb-1">Annual Opportunity</p>
                          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(pastCustomers.annualLoss)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning/Info Box */}
                  {sendsReengagementCampaigns === false ? (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-400 font-semibold">
                          ⚠️ No reactivation campaigns = {formatCurrency(pastCustomers.monthlyLoss)}/month in missed revenue
                        </p>
                        <p className="text-red-300/80 text-sm mt-1">
                          Past customers already trust you. A simple "We miss you" campaign can bring them back at a {pastCustomers.returnPurchaseBonus}% higher order value.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Metric</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Your Current</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Best-in-Class</th>
                            <th className="text-right py-3 px-4 text-slate-400 font-medium">Gap</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-700/50">
                            <td className="py-3 px-4 text-slate-300">Campaign Frequency</td>
                            <td className="py-3 px-4 text-amber-400">{pastCustomers.currentStatus.split(" ")[0]}</td>
                            <td className="py-3 px-4 text-emerald-400">Monthly</td>
                            <td className="py-3 px-4 text-right text-emerald-400">+{formatCurrency(pastCustomers.upside * 0.3)}/mo</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-slate-300">Response Rate</td>
                            <td className="py-3 px-4 text-amber-400">{pastCustomers.frequencyScore}%</td>
                            <td className="py-3 px-4 text-emerald-400">28%</td>
                            <td className="py-3 px-4 text-right text-emerald-400">+{formatCurrency(pastCustomers.upside * 0.7)}/mo</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}
    </div>
  );
};
