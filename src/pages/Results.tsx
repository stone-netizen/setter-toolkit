import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Download,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Zap,
  Calendar,
  Edit3,
  Linkedin,
  Twitter,
  Mail,
  Link2,
  Check,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  formatCurrency,
  Leak,
  CalculationResult,
} from "@/utils/calculations";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { toast } from "sonner";
import { ReactivationHeroCard } from "@/components/results/ReactivationHeroCard";
import { ReactivationBreakdown } from "@/components/results/ReactivationBreakdown";
import { ReactivationROICalculator } from "@/components/results/ReactivationROICalculator";
import { CalendlyModal } from "@/components/CalendlyModal";

const RESULTS_STORAGE_KEY = "leakDetectorResults";

const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#10b981",
};

const SEVERITY_BG = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const LEAK_ICONS: Record<string, React.ReactNode> = {
  missedCalls: <Phone className="h-5 w-5" />,
  slowResponse: <Clock className="h-5 w-5" />,
  noFollowUp: <TrendingUp className="h-5 w-5" />,
  noShow: <Calendar className="h-5 w-5" />,
  unqualifiedLeads: <Target className="h-5 w-5" />,
  afterHours: <Clock className="h-5 w-5" />,
  holdTime: <Phone className="h-5 w-5" />,
  reactivation: <Sparkles className="h-5 w-5" />,
};

const LEAK_PROBLEMS: Record<string, string[]> = {
  missedCalls: [
    "Potential customers are calling but no one is answering",
    "Each missed call is a potential deal walking to a competitor",
    "Callers who can't reach you rarely try again",
  ],
  slowResponse: [
    "Leads contacted within 5 minutes are 100x more likely to convert",
    "Response time directly correlates with close rates",
    "Delayed responses signal poor customer service to prospects",
  ],
  noFollowUp: [
    "80% of sales require 5+ follow-up attempts",
    "Most salespeople give up after just 2 attempts",
    "Leads that aren't followed up are essentially thrown away",
  ],
  noShow: [
    "Empty appointment slots cost time and money",
    "Staff scheduled for no-shows can't serve other customers",
    "No-shows often indicate weak booking confirmation processes",
  ],
  unqualifiedLeads: [
    "Time spent with poor-fit prospects is time not spent closing",
    "Unqualified consultations drain team energy and morale",
    "Every hour wasted has an opportunity cost",
  ],
  afterHours: [
    "30%+ of calls come outside business hours",
    "After-hours callers often have urgent needs",
    "Competitors with 24/7 availability capture these leads",
  ],
  holdTime: [
    "Long hold times frustrate callers before you even speak",
    "Every minute on hold increases hang-up likelihood by 10%",
    "First impressions are made during the wait",
  ],
};

const LEAK_FIXES: Record<string, { fix: string; roi: string; time: string }> = {
  missedCalls: {
    fix: "Implement an AI answering service or overflow call handling to ensure every call is answered professionally, 24/7.",
    roi: "Recover 70-90% of currently missed leads",
    time: "1-2 weeks to implement",
  },
  slowResponse: {
    fix: "Set up automated instant text/email responses and implement a lead routing system that notifies the right person immediately.",
    roi: "2-3x improvement in contact rates",
    time: "1 week to implement",
  },
  noFollowUp: {
    fix: "Create an automated follow-up sequence with 6-8 touchpoints across email, SMS, and phone over 30 days.",
    roi: "40-60% increase in conversions from existing leads",
    time: "2-3 weeks to set up",
  },
  noShow: {
    fix: "Implement automated SMS and email reminders 48hr, 24hr, and 2hr before appointments. Consider requiring deposits.",
    roi: "Reduce no-shows by 50-70%",
    time: "1 week to implement",
  },
  unqualifiedLeads: {
    fix: "Add a qualification form or 5-minute screening call before booking consultations to filter out poor-fit leads.",
    roi: "Save 10+ hours per week of wasted time",
    time: "1-2 weeks to implement",
  },
  afterHours: {
    fix: "Deploy an AI receptionist or answering service to capture leads during evenings, weekends, and holidays.",
    roi: "Capture 30-50% more leads",
    time: "1 week to implement",
  },
  holdTime: {
    fix: "Implement a callback system, hire additional staff, or use AI to handle initial inquiries and reduce wait times.",
    roi: "Reduce abandoned calls by 60-80%",
    time: "2-4 weeks to implement",
  },
};

const INDUSTRY_BENCHMARKS: Record<string, number> = {
  "Med Spa": 45,
  Dental: 55,
  "Mortgage Lending": 35,
  "Real Estate": 40,
  Roofing: 60,
  "Plumbing/HVAC": 50,
  "Legal Services": 45,
  "Financial Planning": 40,
  "Fitness/Gyms": 55,
  "Senior Care": 45,
  "Auto Repair": 50,
  Chiropractor: 50,
  "Marketing Agency": 35,
  SaaS: 30,
  Other: 50,
};

interface StoredResults {
  results: CalculationResult;
  formData: CalculatorFormData;
  calculatedAt: string;
}

export default function Results() {
  const navigate = useNavigate();
  const [storedData, setStoredData] = useState<StoredResults | null>(null);
  const [expandedLeaks, setExpandedLeaks] = useState<Set<string>>(new Set());
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const leakRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: StoredResults = JSON.parse(saved);
        if (parsed.results && parsed.formData) {
          setStoredData(parsed);
        } else {
          navigate("/calculator");
        }
      } catch (e) {
        console.error("Failed to parse saved results");
        navigate("/calculator");
      }
    } else {
      navigate("/calculator");
    }
  }, [navigate]);

  // Show sticky bar after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLeak = (leakType: string) => {
    setExpandedLeaks((prev) => {
      const next = new Set(prev);
      if (next.has(leakType)) {
        next.delete(leakType);
      } else {
        next.add(leakType);
      }
      return next;
    });
  };

  const scrollToLeak = (leakType: string) => {
    setExpandedLeaks((prev) => new Set([...prev, leakType]));
    setTimeout(() => {
      leakRefs.current[leakType]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleEditInputs = () => {
    navigate("/calculator");
  };

  const handleDownloadPDF = () => {
    toast.info("Coming soon!", {
      description: "PDF generation will be available in a future update.",
    });
  };

  const handleEmailResults = () => {
    toast.info("Coming soon!", {
      description: "Email delivery will be available in a future update.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  if (!storedData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const { results, formData } = storedData;

  const chartData = results.leaks.map((leak) => ({
    name: leak.label,
    value: leak.monthlyLoss,
    severity: leak.severity,
    type: leak.type,
  }));

  const industryBenchmark = INDUSTRY_BENCHMARKS[formData.industry] || 50;
  const worsePercentile = Math.min(95, Math.max(5, industryBenchmark + Math.random() * 20));

  // Create action plan phases
  const criticalLeaks = results.leaks.filter((l) => l.severity === "critical");
  const highLeaks = results.leaks.filter((l) => l.severity === "high");
  const otherLeaks = results.leaks.filter(
    (l) => l.severity === "medium" || l.severity === "low"
  );

  const phase1Recovery = criticalLeaks.reduce((sum, l) => sum + l.monthlyLoss, 0);
  const phase2Recovery = highLeaks.reduce((sum, l) => sum + l.monthlyLoss, 0);
  const phase3Recovery = otherLeaks.reduce((sum, l) => sum + l.monthlyLoss, 0);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
              LeakDetector
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditInputs}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Inputs
            </Button>
          </div>
        </div>
      </header>

      {/* Reactivation Hero Card */}
      {results.reactivationOpportunity && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-24 pb-4 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <ReactivationHeroCard reactivation={results.reactivationOpportunity} />
          </div>
        </motion.section>
      )}

      {/* Hero Section with Big Loss Number */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
            <CardContent className="p-8 md:p-12 relative">
              <div className="text-center">
                <p className="text-slate-400 text-lg mb-2">{formData.businessName}</p>
                <h1 className="text-2xl md:text-3xl font-medium text-slate-300 mb-4">
                  You're Losing
                </h1>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-5xl md:text-7xl font-bold text-red-500">
                    {formatCurrency(results.totalMonthlyLoss)}
                  </span>
                  <span className="text-2xl md:text-3xl text-red-400">/month</span>
                </motion.div>
                <p className="text-xl md:text-2xl text-slate-400 mb-6">
                  ({formatCurrency(results.totalAnnualLoss)}/year)
                </p>
                <Badge
                  variant="outline"
                  className="text-orange-400 border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Worse than {worsePercentile.toFixed(0)}% of {formData.industry} businesses
                </Badge>
              </div>

              {/* Main CTA - Book Strategy Call */}
              <div className="mt-8 space-y-4">
                <Button 
                  size="lg"
                  onClick={() => setIsCalendlyOpen(true)}
                  className="w-full px-8 py-5 h-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all hover:scale-[1.02]"
                >
                  Book Your Free Strategy Call
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  15 minutes • No pressure • Free action plan
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="px-4 py-3 h-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-4 py-3 h-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all"
                    onClick={handleEmailResults}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Me Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Share Results</DialogTitle>
            <DialogDescription className="text-slate-400">
              Share your revenue leak analysis with your team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                onClick={() => toast.info("LinkedIn sharing coming soon!")}
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <Linkedin className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-slate-300">LinkedIn</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                onClick={() => toast.info("Twitter sharing coming soon!")}
              >
                <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-slate-300">Twitter</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                onClick={() => toast.info("Email sharing coming soon!")}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-slate-300">Email</span>
              </button>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-slate-400 mb-2">Or copy link</p>
              <button
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                onClick={handleCopyLink}
              >
                <span className="text-sm text-slate-300 truncate">{window.location.href}</span>
                {linkCopied ? (
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 ml-2" />
                ) : (
                  <Link2 className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reactivation Breakdown & ROI Calculator */}
      {results.reactivationOpportunity && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="py-4 px-4"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <ReactivationBreakdown 
              dormantLeads={results.reactivationOpportunity.dormantLeads}
              pastCustomers={results.reactivationOpportunity.pastCustomers}
              hasDormantLeads={formData.hasDormantLeads || false}
              hasPastCustomers={formData.hasPastCustomers || false}
              everRecontactedDormant={formData.everRecontactedDormant ?? null}
              sendsReengagementCampaigns={formData.sendsReengagementCampaigns ?? null}
              percentageRecontactedDormant={formData.percentageRecontactedDormant}
            />
            <ReactivationROICalculator 
              reactivation={results.reactivationOpportunity}
              customerLifetimeValue={formData.avgTransactionValue || 1000}
            />
          </div>
        </motion.section>
      )}

      {/* Chart Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200">
                Loss Distribution by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={{ stroke: "#475569" }}
                      tickLine={{ stroke: "#475569" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={{ stroke: "#475569" }}
                      tickLine={{ stroke: "#475569" }}
                      width={150}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Monthly Loss"]}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      cursor="pointer"
                      onClick={(data) => scrollToLeak(data.type)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {Object.entries(SEVERITY_COLORS).map(([severity, color]) => (
                  <div key={severity} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-slate-400 capitalize">{severity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Leak Details */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="py-8 px-4"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-slate-200 mb-6">
            Leak Analysis Details
          </h2>
          {results.leaks.filter(leak => leak.monthlyLoss > 0).map((leak, index) => (
            <motion.div
              key={leak.type}
              ref={(el) => (leakRefs.current[leak.type] = el)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <Card
                className={`bg-slate-800/50 border-slate-700 overflow-hidden transition-all duration-300 ${
                  expandedLeaks.has(leak.type) ? "ring-1 ring-slate-600" : ""
                }`}
              >
                <button
                  onClick={() => toggleLeak(leak.type)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        SEVERITY_BG[leak.severity as keyof typeof SEVERITY_BG]
                      } border`}
                    >
                      {LEAK_ICONS[leak.type] || <DollarSign className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-200">
                          {leak.label}
                        </h3>
                        <Badge
                          variant="outline"
                          className={SEVERITY_BG[leak.severity as keyof typeof SEVERITY_BG]}
                        >
                          {leak.severity}
                        </Badge>
                        {leak.quickWin && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <Zap className="h-3 w-3 mr-1" />
                            Quick Win
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-400">
                        {formatCurrency(leak.monthlyLoss)}/mo
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(leak.annualLoss)}/yr
                      </p>
                    </div>
                    {expandedLeaks.has(leak.type) ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedLeaks.has(leak.type) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-700">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Problem Analysis */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                              Why This Hurts
                            </h4>
                            <ul className="space-y-2">
                              {LEAK_PROBLEMS[leak.type]?.map((problem, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  {problem}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Fix & ROI */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                              The Fix
                            </h4>
                            <p className="text-slate-300 text-sm mb-4">
                              {LEAK_FIXES[leak.type]?.fix}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 font-medium">Expected ROI</p>
                                <p className="text-sm text-slate-200 mt-1">
                                  {LEAK_FIXES[leak.type]?.roi}
                                </p>
                              </div>
                              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-blue-400 font-medium">Time to Fix</p>
                                <p className="text-sm text-slate-200 mt-1">
                                  {LEAK_FIXES[leak.type]?.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Value Proposition Card - What Happens On Your Call */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  What Happens On Your Strategy Call
                </h3>
                <p className="text-slate-400">
                  I'll personally walk you through your results and show you exactly how to fix your biggest leaks.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Deep-dive into your top 3 leaks</div>
                  <div className="text-sm text-slate-400">Which ones to fix first for maximum ROI</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Custom implementation roadmap</div>
                  <div className="text-sm text-slate-400">Timeline, systems, and exact steps to recover this revenue</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">ROI projections for each fix</div>
                  <div className="text-sm text-slate-400">See exactly what to expect in 30/60/90 days</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Decide if we're a fit to work together</div>
                  <div className="text-sm text-slate-400">Zero pressure - just a conversation about your business</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-violet-500/20">
              <Button 
                size="lg"
                onClick={() => setIsCalendlyOpen(true)}
                className="w-full px-6 py-4 h-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Book My 15-Minute Call
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Action Plan Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                Recommended Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Phase 1 */}
                {criticalLeaks.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-500 text-white">Phase 1</Badge>
                        <span className="text-slate-200 font-medium">
                          Critical Fixes (Week 1-2)
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        +{formatCurrency(phase1Recovery * 0.7)}/mo recovery
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {criticalLeaks.map((leak) => (
                        <li key={leak.type} className="flex items-center gap-2 text-slate-300 text-sm">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          {leak.label} — {LEAK_FIXES[leak.type]?.fix.split(".")[0]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Phase 2 */}
                {highLeaks.length > 0 && (
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-500 text-white">Phase 2</Badge>
                        <span className="text-slate-200 font-medium">
                          High Priority (Week 3-4)
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        +{formatCurrency(phase2Recovery * 0.6)}/mo recovery
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {highLeaks.map((leak) => (
                        <li key={leak.type} className="flex items-center gap-2 text-slate-300 text-sm">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          {leak.label} — {LEAK_FIXES[leak.type]?.fix.split(".")[0]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Phase 3 */}
                {otherLeaks.length > 0 && (
                  <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-slate-600 text-white">Phase 3</Badge>
                        <span className="text-slate-200 font-medium">
                          Optimization (Month 2+)
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        +{formatCurrency(phase3Recovery * 0.5)}/mo recovery
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {otherLeaks.map((leak) => (
                        <li key={leak.type} className="flex items-center gap-2 text-slate-300 text-sm">
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                          {leak.label} — {LEAK_FIXES[leak.type]?.fix.split(".")[0]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm mb-2">Total Potential Recovery</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(results.totalMonthlyLoss * 0.65)}/month
                  </p>
                  <p className="text-slate-500 text-sm">
                    ({formatCurrency(results.totalAnnualLoss * 0.65)}/year)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-violet-900/50 to-slate-900 border-violet-500/30">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-4">
                Ready to fix these leaks?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Get a personalized implementation plan and learn how to recover{" "}
                <span className="text-emerald-400 font-semibold">
                  {formatCurrency(results.totalMonthlyLoss * 0.65)}/month
                </span>{" "}
                in lost revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/50 text-white text-lg px-8 py-6 h-auto"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Book 15-Minute Strategy Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6 h-auto"
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Full PDF Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Footer */}
      <div className="py-8 text-center">
        <Button
          variant="ghost"
          className="text-slate-500 hover:text-slate-400"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
      </div>

      {/* Sticky CTA Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  Ready to recover {formatCurrency(results.totalMonthlyLoss)}/month?
                </div>
                <div className="text-xs text-slate-400">
                  Book your free strategy call to get started
                </div>
              </div>
              <Button 
                onClick={() => setIsCalendlyOpen(true)}
                className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Book Free Call
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendly Modal */}
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  );
}
