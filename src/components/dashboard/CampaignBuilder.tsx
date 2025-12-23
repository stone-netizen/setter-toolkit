import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Rocket,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Copy,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency, ReactivationLeak } from "@/utils/calculations";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { toast } from "sonner";

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
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState<"dormant" | "winback" | "both">("both");
  const [channels, setChannels] = useState<string[]>(["sms", "email"]);
  const [budget, setBudget] = useState("2000");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const totalLeads =
    (reactivation?.dormantLeads?.viableLeads || 0) +
    (reactivation?.pastCustomers?.winnableCustomers || 0);

  const budgetNum = parseFloat(budget) || 0;
  
  // Realistic per-channel costs
  const channelCosts = {
    sms: 0.02,      // $0.02 per SMS
    email: 0.001,   // $0.001 per email
    phone: 2.50     // $2.50 per call (avg 5 min at $30/hr)
  };
  
  const messagesPerContact = 3; // Sequence of 3 touchpoints per channel
  const phoneResponseRate = 0.22; // Only call responders
  
  // Calculate cost per contact based on selected channels
  const calculateCostPerContact = () => {
    if (channels.length === 0 || totalLeads === 0) return 0;
    
    let costPerContact = 0;
    
    if (channels.includes("sms")) {
      costPerContact += messagesPerContact * channelCosts.sms;
    }
    if (channels.includes("email")) {
      costPerContact += messagesPerContact * channelCosts.email;
    }
    if (channels.includes("phone")) {
      // Only call responders (~22% of total)
      costPerContact += phoneResponseRate * channelCosts.phone;
    }
    
    return costPerContact;
  };
  
  const costPerContact = calculateCostPerContact();
  const totalCampaignCost = costPerContact * totalLeads;
  const setupFee = 500; // Campaign setup fee for scripts, automation, templates
  const remainingBudget = budgetNum - totalCampaignCost - setupFee;
  
  // With realistic costs, we can reach the entire database
  const estimatedReach = totalLeads;
  const expectedResponses = Math.round(totalLeads * 0.22);
  // Calculate close rate from closedDeals / totalLeads if available
  const closeRate = formData.totalMonthlyLeads && formData.closedDealsPerMonth 
    ? formData.closedDealsPerMonth / formData.totalMonthlyLeads 
    : 0.3;
  const expectedConversions = Math.max(1, Math.round(expectedResponses * closeRate));
  const avgTransactionValue = formData.avgTransactionValue || 500;
  const repeatPurchases = formData.avgPurchasesPerCustomer || 3;
  const customerLifetimeValue = avgTransactionValue * repeatPurchases;
  const projectedRevenue = expectedConversions * customerLifetimeValue;
  const expectedROI = budgetNum > 0 ? projectedRevenue / budgetNum : 0;
  const paybackDays = projectedRevenue > 0 ? Math.round((budgetNum / projectedRevenue) * 30) : 0;

  const toggleChannel = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (in real app, would call Claude API)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    const plan = `
# 🚀 ${formData.businessName} Reactivation Campaign Plan

## Campaign Overview
- **Target:** ${totalLeads} ${campaignType === "dormant" ? "dormant leads" : campaignType === "winback" ? "past customers" : "dormant leads & past customers"}
- **Channels:** ${channels.map(c => c.toUpperCase()).join(", ")}
- **Budget:** ${formatCurrency(budgetNum)}
- **Duration:** 14 days

---

## 📱 SMS Sequence (if enabled)

### Message 1 - Day 1 (Ice Breaker)
"Hi [First Name]! It's been a while since we connected. ${formData.businessName} has some exciting updates we'd love to share with you. Reply YES to learn more!"

### Message 2 - Day 3 (Value Offer)
"[First Name], as a valued past contact, we're offering you an exclusive [20% discount/free consultation]. This offer expires in 48 hours. Book now: [Link]"

### Message 3 - Day 5 (Urgency)
"Last chance, [First Name]! Your exclusive offer expires tonight. Don't miss out on [specific benefit]. Tap to claim: [Link]"

---

## ✉️ Email Sequence (if enabled)

### Email 1 - Day 1
**Subject:** We miss you, [First Name]!
**Preview:** It's been a while, and we have something special for you...

### Email 2 - Day 4
**Subject:** [First Name], your exclusive offer inside
**Preview:** Because you're a valued member of our community...

### Email 3 - Day 7
**Subject:** Final reminder: Your offer expires soon
**Preview:** Don't let this opportunity slip away...

---

## 📞 Follow-Up Calls (if enabled)

### Call Script
"Hi [First Name], this is [Agent] from ${formData.businessName}. I noticed you expressed interest in [service] a while back. I wanted to personally check in and see if we can help you with [specific benefit]. Do you have 2 minutes?"

---

## 📊 Expected Results

| Metric | Projection |
|--------|-----------|
| Total Reach | ${totalLeads} contacts |
| Expected Responses | ${expectedResponses} (22%) |
| Expected Conversions | ${expectedConversions} |
| Projected Revenue | ${formatCurrency(projectedRevenue)} |
| ROI | ${expectedROI.toFixed(1)}x |

---

## ⏱️ Timeline

- **Day 1:** Launch SMS & Email Campaign
- **Day 3:** Second touchpoint
- **Day 5-7:** Phone follow-ups for engaged leads
- **Day 10:** Final reminder sequence
- **Day 14:** Campaign wrap-up & analysis

---

*Generated for ${formData.businessName} on ${new Date().toLocaleDateString()}*
    `;
    
    setGeneratedPlan(plan);
    setIsGenerating(false);
    setStep(5);
  };

  const handleCopyPlan = () => {
    if (generatedPlan) {
      navigator.clipboard.writeText(generatedPlan);
      toast.success("Plan copied to clipboard!");
    }
  };

  const handleBookCall = () => {
    toast.success("Redirecting to booking...", {
      description: "You'll be able to schedule your implementation call.",
    });
  };

  return (
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
              <Rocket className="w-5 h-5 text-amber-400" />
              🚀 Reactivation Campaign Builder
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
            <AnimatePresence mode="wait">
              {/* Step 1: Campaign Type */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      STEP 1: Select Campaign Type
                    </h3>
                    <RadioGroup value={campaignType} onValueChange={(v: "dormant" | "winback" | "both") => setCampaignType(v)}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-colors">
                          <RadioGroupItem value="dormant" id="dormant" />
                          <Label htmlFor="dormant" className="text-slate-200 cursor-pointer flex-1">
                            Dormant Leads Reactivation
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-colors">
                          <RadioGroupItem value="winback" id="winback" />
                          <Label htmlFor="winback" className="text-slate-200 cursor-pointer flex-1">
                            Past Customer Win-Back
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 rounded-lg bg-amber-500/10 border-2 border-amber-500/30 hover:border-amber-500/50 transition-colors">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both" className="text-slate-200 cursor-pointer flex-1">
                            <span className="font-medium">Both (Recommended)</span>
                            <p className="text-sm text-slate-400 mt-1">Maximize your reach and results</p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => setStep(2)}
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Channels */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      STEP 2: Choose Channels
                    </h3>
                    <div className="space-y-3">
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                          channels.includes("sms")
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-slate-700/50 border-slate-600"
                        }`}
                        onClick={() => toggleChannel("sms")}
                      >
                        <Checkbox checked={channels.includes("sms")} />
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                        <div className="flex-1">
                          <span className="text-slate-200">SMS</span>
                          <p className="text-xs text-emerald-400">Highest response rate</p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                          channels.includes("email")
                            ? "bg-blue-500/10 border-blue-500/30"
                            : "bg-slate-700/50 border-slate-600"
                        }`}
                        onClick={() => toggleChannel("email")}
                      >
                        <Checkbox checked={channels.includes("email")} />
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <span className="text-slate-200">Email</span>
                          <p className="text-xs text-blue-400">Lower cost per send</p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                          channels.includes("phone")
                            ? "bg-purple-500/10 border-purple-500/30"
                            : "bg-slate-700/50 border-slate-600"
                        }`}
                        onClick={() => toggleChannel("phone")}
                      >
                        <Checkbox checked={channels.includes("phone")} />
                        <Phone className="w-5 h-5 text-purple-400" />
                        <div className="flex-1">
                          <span className="text-slate-200">Phone Calls</span>
                          <p className="text-xs text-purple-400">Most personal, highest cost</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" className="text-slate-400" onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => setStep(3)}
                      disabled={channels.length === 0}
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Budget */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      STEP 3: Set Campaign Budget
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-400 text-sm">Total budget</Label>
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <Input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="pl-8 bg-slate-700 border-slate-600 text-white text-lg h-12"
                            placeholder="2000"
                          />
                        </div>
                      </div>
                      <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase">Estimated Reach</p>
                            <p className="text-xl font-bold text-emerald-400">{estimatedReach} contacts</p>
                            <p className="text-xs text-slate-500">(Your full database)</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase">Cost per Contact</p>
                            <p className="text-xl font-bold text-slate-200">
                              ${costPerContact.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-600 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Campaign costs ({estimatedReach} × ${costPerContact.toFixed(2)})</span>
                            <span className="text-slate-200">{formatCurrency(totalCampaignCost)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Setup fee (scripts, templates, automation)</span>
                            <span className="text-slate-200">{formatCurrency(setupFee)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium pt-2 border-t border-slate-600">
                            <span className="text-slate-300">Total estimated cost</span>
                            <span className="text-amber-400">{formatCurrency(totalCampaignCost + setupFee)}</span>
                          </div>
                          {remainingBudget > 0 && (
                            <div className="flex justify-between text-sm text-emerald-400">
                              <span>Remaining for scaling/future</span>
                              <span>{formatCurrency(remainingBudget)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" className="text-slate-400" onClick={() => setStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => setStep(4)}
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      STEP 4: Review Projection
                    </h3>
                    <div className="space-y-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Campaign reach</span>
                        <span className="text-slate-200 font-medium">{estimatedReach} contacts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expected responses (22%)</span>
                        <span className="text-slate-200 font-medium">{expectedResponses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expected conversions</span>
                        <span className="text-slate-200 font-medium">{expectedConversions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Projected revenue</span>
                        <span className="text-emerald-400 font-bold text-lg">
                          {formatCurrency(projectedRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-emerald-500/20">
                        <span className="text-slate-400">Expected ROI</span>
                        <span className="text-emerald-400 font-bold text-2xl">
                          {expectedROI.toFixed(1)}x
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payback period</span>
                        <span className="text-emerald-400 font-medium">{paybackDays} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" className="text-slate-400" onClick={() => setStep(3)}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={handleGeneratePlan}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Campaign Plan <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Generated Plan */}
              {step === 5 && generatedPlan && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Your Campaign Plan is Ready!
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300"
                      onClick={handleCopyPlan}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                      {generatedPlan}
                    </pre>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => toast.info("Email feature coming soon!")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send to Email
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={handleBookCall}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Implementation Call
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
