import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Save, Mail, ChevronDown, ChevronUp, TrendingUp, DollarSign, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatCurrency, ReactivationLeak } from "@/utils/calculations";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell
} from "recharts";
import { toast } from "sonner";

interface ReactivationROICalculatorProps {
  reactivation: ReactivationLeak;
  customerLifetimeValue: number;
}

export const ReactivationROICalculator = ({ 
  reactivation, 
  customerLifetimeValue 
}: ReactivationROICalculatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [campaignInvestment, setCampaignInvestment] = useState(2000);
  const [expectedResponseRate, setExpectedResponseRate] = useState(22);

  // Calculate projections
  const projections = useMemo(() => {
    const totalLeads = (reactivation.dormantLeads?.viableLeads || 0) + 
                       (reactivation.pastCustomers?.winnableCustomers || 0);
    
    const reactivatedCustomers = Math.round(totalLeads * (expectedResponseRate / 100));
    const revenueGenerated = reactivatedCustomers * customerLifetimeValue;
    const netProfit = revenueGenerated - campaignInvestment;
    const roi = campaignInvestment > 0 ? revenueGenerated / campaignInvestment : 0;
    const paybackDays = revenueGenerated > 0 ? Math.ceil((campaignInvestment / revenueGenerated) * 30) : 30;

    return {
      totalLeads,
      reactivatedCustomers,
      revenueGenerated,
      netProfit,
      roi,
      paybackDays,
    };
  }, [campaignInvestment, expectedResponseRate, reactivation, customerLifetimeValue]);

  const chartData = [
    { name: "Investment", value: campaignInvestment, color: "#94a3b8" },
    { name: "Revenue", value: projections.revenueGenerated, color: "#10b981" },
    { name: "Net Profit", value: projections.netProfit, color: "#22c55e" },
  ];

  const handleSaveProjection = () => {
    toast.success("Projection saved!", {
      description: "Your projection has been saved and will appear on your dashboard.",
    });
  };

  const handleEmailProjection = () => {
    toast.info("Coming soon!", {
      description: "Email functionality will be available in a future update.",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-200">
                📊 Reactivation ROI Calculator
              </CardTitle>
              <p className="text-sm text-slate-400">
                Model your campaign returns interactively
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="border-t border-slate-700 pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sliders Section */}
              <div className="space-y-8">
                {/* Campaign Investment Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-medium">Campaign Investment</label>
                    <span className="text-xl font-bold text-blue-400">
                      {formatCurrency(campaignInvestment)}
                    </span>
                  </div>
                  <Slider
                    value={[campaignInvestment]}
                    onValueChange={(value) => setCampaignInvestment(value[0])}
                    min={500}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$500</span>
                    <span>$10,000</span>
                  </div>
                </div>

                {/* Response Rate Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-medium">Expected Response Rate</label>
                    <span className="text-xl font-bold text-emerald-400">{expectedResponseRate}%</span>
                  </div>
                  <Slider
                    value={[expectedResponseRate]}
                    onValueChange={(value) => setExpectedResponseRate(value[0])}
                    min={15}
                    max={35}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-slate-500">15% Conservative</span>
                    <span className="text-amber-400">22% Average</span>
                    <span className="text-emerald-400">35% Best-in-class</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Investment vs Return</p>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical">
                        <XAxis 
                          type="number" 
                          tickFormatter={(v) => formatCurrency(v)}
                          stroke="#64748b"
                          fontSize={11}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          stroke="#64748b"
                          fontSize={11}
                          width={80}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-xl">
                                  <p className="text-slate-200 text-sm">
                                    {payload[0].payload.name}: {formatCurrency(payload[0].value as number)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Projected 30-Day Results
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span className="text-slate-300">Reactivated customers</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-400">
                        {projections.reactivatedCustomers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span className="text-slate-300">Revenue generated</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-400">
                        {formatCurrency(projections.revenueGenerated)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-300">Campaign cost</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-400">
                        {formatCurrency(campaignInvestment)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-300 font-medium">Net profit</span>
                      </div>
                      <span className="text-3xl font-bold text-emerald-400">
                        {formatCurrency(projections.netProfit)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                        <p className="text-xs text-slate-500 uppercase mb-1">ROI</p>
                        <p className="text-2xl font-bold text-amber-400">
                          {projections.roi.toFixed(1)}x
                        </p>
                      </div>
                      <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                        <p className="text-xs text-slate-500 uppercase mb-1">Payback Period</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {projections.paybackDays} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={handleSaveProjection}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save This Projection
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={handleEmailProjection}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Results
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
};
