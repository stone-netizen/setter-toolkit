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
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

const SEVERITY_CONFIG = {
  critical: { 
    color: "hsl(0 72% 51%)", 
    bg: "bg-destructive/10", 
    text: "text-destructive", 
    border: "border-destructive/20",
    label: "Critical"
  },
  high: { 
    color: "hsl(25 95% 53%)", 
    bg: "bg-orange-500/10", 
    text: "text-orange-400", 
    border: "border-orange-500/20",
    label: "High"
  },
  medium: { 
    color: "hsl(38 92% 50%)", 
    bg: "bg-warning/10", 
    text: "text-warning", 
    border: "border-warning/20",
    label: "Medium"
  },
  low: { 
    color: "hsl(160 84% 39%)", 
    bg: "bg-success/10", 
    text: "text-success", 
    border: "border-success/20",
    label: "Low"
  },
};

const LEAK_ICONS: Record<string, React.ReactNode> = {
  missedCalls: <Phone className="h-5 w-5" />,
  slowResponse: <Clock className="h-5 w-5" />,
  noFollowUp: <TrendingUp className="h-5 w-5" />,
  noShow: <Calendar className="h-5 w-5" />,
  unqualifiedLeads: <Target className="h-5 w-5" />,
  afterHours: <Clock className="h-5 w-5" />,
  holdTime: <Phone className="h-5 w-5" />,
  reactivation: <Zap className="h-5 w-5" />,
};

const LEAK_PROBLEMS: Record<string, string[]> = {
  missedCalls: [
    "Callers who can't reach you rarely try again",
    "Each missed call walks to a competitor",
    "No voicemail = no second chance",
  ],
  slowResponse: [
    "5-minute response = 100x higher contact rate",
    "Speed signals reliability to prospects",
    "Competitors respond in minutes, not hours",
  ],
  noFollowUp: [
    "80% of sales need 5+ follow-up attempts",
    "Most give up after 2 attempts",
    "Unfollowed leads = wasted ad spend",
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

const LEAK_FIXES: Record<string, { fix: string; roi: string; time: string }> = {
  missedCalls: {
    fix: "AI answering or overflow call handling for 24/7 coverage.",
    roi: "70-90% of missed leads recovered",
    time: "1-2 weeks",
  },
  slowResponse: {
    fix: "Automated instant text/email + smart lead routing.",
    roi: "2-3x improvement in contact rates",
    time: "1 week",
  },
  noFollowUp: {
    fix: "Automated 6-8 touchpoint sequence across channels.",
    roi: "40-60% more conversions",
    time: "2-3 weeks",
  },
  noShow: {
    fix: "Automated reminders at 48hr, 24hr, and 2hr. Consider deposits.",
    roi: "50-70% fewer no-shows",
    time: "1 week",
  },
  unqualifiedLeads: {
    fix: "Qualification form or 5-min screening before booking.",
    roi: "10+ hours saved weekly",
    time: "1-2 weeks",
  },
  afterHours: {
    fix: "AI receptionist for evenings, weekends, holidays.",
    roi: "30-50% more leads captured",
    time: "1 week",
  },
  holdTime: {
    fix: "Callback system, additional staff, or AI for initial inquiries.",
    roi: "60-80% fewer abandoned calls",
    time: "2-4 weeks",
  },
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
        navigate("/calculator");
      }
    } else {
      navigate("/calculator");
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
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

  const handleEditInputs = () => {
    navigate("/calculator");
  };

  const handleDownloadPDF = () => {
    toast.info("Coming soon", {
      description: "PDF export will be available in a future update.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Link copied");
  };

  if (!storedData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { results, formData } = storedData;
  const totalLoss = results.totalMonthlyLoss;

  const criticalLeaks = results.leaks.filter((l) => l.severity === "critical" && l.monthlyLoss > 0);
  const highLeaks = results.leaks.filter((l) => l.severity === "high" && l.monthlyLoss > 0);
  const otherLeaks = results.leaks.filter(
    (l) => (l.severity === "medium" || l.severity === "low") && l.monthlyLoss > 0
  );

  const phase1Recovery = criticalLeaks.reduce((sum, l) => sum + l.monthlyLoss, 0);
  const phase2Recovery = highLeaks.reduce((sum, l) => sum + l.monthlyLoss, 0);
  const phase3Recovery = otherLeaks.reduce((sum, l) => sum + l.monthlyLoss, 0);

  return (
    <div className="min-h-screen bg-background custom-scrollbar">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold text-foreground tracking-tight">
            LeakDetector
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditInputs}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </header>

      <main className="pt-20">
        {/* Reactivation Opportunity */}
        {results.reactivationOpportunity && (
          <section className="px-4 sm:px-6 py-6">
            <div className="max-w-5xl mx-auto">
              <ReactivationHeroCard reactivation={results.reactivationOpportunity} />
            </div>
          </section>
        )}

        {/* Hero Loss Section */}
        <section className="px-4 sm:px-6 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border border-destructive/20 bg-card p-8 lg:p-12">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent" />
              
              <div className="relative text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {formData.businessName}
                </p>
                <h1 className="text-heading-lg font-bold text-foreground mb-6">
                  Monthly Revenue Loss
                </h1>
                
                {/* Big number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mb-6"
                >
                  <span className="text-display-xl font-black text-gradient-destructive font-numeric">
                    {formatCurrency(results.totalMonthlyLoss)}
                  </span>
                  <span className="text-heading-lg text-destructive/70 font-normal">/mo</span>
                </motion.div>
                
                <p className="text-lg text-muted-foreground mb-8">
                  {formatCurrency(results.totalAnnualLoss)} annually
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                  <Button 
                    size="lg"
                    onClick={() => setIsCalendlyOpen(true)}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg btn-shine"
                  >
                    Book Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={handleDownloadPDF}
                    className="flex-1 h-12 border-border text-foreground hover:bg-secondary font-medium rounded-lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
                
                <p className="mt-4 text-xs text-muted-foreground">
                  15 min • No pressure • Free action plan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reactivation Details */}
        {results.reactivationOpportunity && (
          <section className="px-4 sm:px-6 py-6">
            <div className="max-w-5xl mx-auto space-y-6">
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
          </section>
        )}

        {/* Loss Distribution Chart - Custom bars */}
        <section className="px-4 sm:px-6 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <h2 className="text-heading font-bold text-foreground mb-8">
                Loss by Category
              </h2>
              
              <div className="space-y-4">
                {results.leaks.filter(leak => leak.monthlyLoss > 0).map((leak, index) => {
                  const severity = SEVERITY_CONFIG[leak.severity as keyof typeof SEVERITY_CONFIG];
                  const percentage = totalLoss > 0 ? (leak.monthlyLoss / totalLoss) * 100 : 0;
                  
                  return (
                    <motion.div
                      key={leak.type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group"
                    >
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold bg-secondary text-muted-foreground">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {leak.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-foreground font-numeric">
                            ${(leak.monthlyLoss / 1000).toFixed(1)}K
                          </span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>
                      </div>
                      
                      {/* Bar */}
                      <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.2 + index * 0.05, duration: 0.5, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 rounded-lg"
                          style={{ backgroundColor: severity.color }}
                        >
                          {/* Subtle stripe pattern */}
                          <div 
                            className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)"
                            }}
                          />
                        </motion.div>
                        
                        {/* Percentage label */}
                        {percentage > 10 && (
                          <div className="absolute inset-y-0 left-3 flex items-center">
                            <span className="text-xs font-semibold text-white/90">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-border">
                {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leak Details */}
        <section className="px-4 sm:px-6 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-heading-lg font-bold text-foreground mb-8">
              Detailed Analysis
            </h2>
            
            <div className="space-y-4">
              {results.leaks.filter(leak => leak.monthlyLoss > 0).map((leak, index) => {
                const severity = SEVERITY_CONFIG[leak.severity as keyof typeof SEVERITY_CONFIG];
                const isExpanded = expandedLeaks.has(leak.type);
                
                return (
                  <motion.div
                    key={leak.type}
                    ref={(el) => (leakRefs.current[leak.type] = el)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div 
                      className={`rounded-xl border bg-card overflow-hidden transition-all duration-200 ${
                        isExpanded ? "border-primary/30" : "border-border hover:border-border/80"
                      }`}
                    >
                      {/* Collapse header */}
                      <button
                        onClick={() => toggleLeak(leak.type)}
                        className="w-full text-left p-5 lg:p-6 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-lg ${severity.bg} ${severity.text} border ${severity.border}`}>
                            {LEAK_ICONS[leak.type] || <DollarSign className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-semibold text-foreground">
                                {leak.label}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${severity.bg} ${severity.text} ${severity.border}`}
                              >
                                {severity.label}
                              </Badge>
                              {leak.quickWin && (
                                <Badge className="text-xs bg-success/10 text-success border border-success/20">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Quick Win
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-destructive font-numeric">
                              {formatCurrency(leak.monthlyLoss)}
                              <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      
                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 lg:px-6 pb-6 pt-2 border-t border-border">
                              <div className="grid md:grid-cols-2 gap-6">
                                {/* Problems */}
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    Impact
                                  </h4>
                                  <ul className="space-y-2">
                                    {LEAK_PROBLEMS[leak.type]?.map((problem, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                                        {problem}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Solution */}
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    Solution
                                  </h4>
                                  <p className="text-sm text-foreground/80 mb-4">
                                    {LEAK_FIXES[leak.type]?.fix}
                                  </p>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                                      <p className="text-xs font-medium text-success mb-1">Expected ROI</p>
                                      <p className="text-sm text-foreground">{LEAK_FIXES[leak.type]?.roi}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                                      <p className="text-xs font-medium text-primary mb-1">Timeline</p>
                                      <p className="text-sm text-foreground">{LEAK_FIXES[leak.type]?.time}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What Happens on Call */}
        <section className="px-4 sm:px-6 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-8 lg:p-10">
              <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-heading font-bold text-foreground mb-1">
                    What Happens on Your Call
                  </h3>
                  <p className="text-muted-foreground">
                    15 minutes to walk through your results and next steps.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: "Deep-dive into top 3 leaks", desc: "Which to fix first for maximum ROI" },
                  { title: "Custom implementation roadmap", desc: "Timeline, systems, exact steps" },
                  { title: "ROI projections", desc: "30/60/90 day expectations" },
                  { title: "Fit assessment", desc: "Zero pressure, just a conversation" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg"
                onClick={() => setIsCalendlyOpen(true)}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg btn-shine"
              >
                Book My 15-Minute Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Action Plan */}
        <section className="px-4 sm:px-6 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-8">
                <Target className="h-6 w-6 text-success" />
                <h2 className="text-heading font-bold text-foreground">
                  Recommended Action Plan
                </h2>
              </div>
              
              <div className="space-y-4">
                {criticalLeaks.length > 0 && (
                  <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-destructive text-destructive-foreground">Phase 1</Badge>
                        <span className="font-medium text-foreground">Critical Fixes — Week 1-2</span>
                      </div>
                      <span className="text-success font-bold font-numeric">
                        +{formatCurrency(phase1Recovery * 0.7)}/mo
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {criticalLeaks.map((leak) => (
                        <li key={leak.type} className="flex items-center gap-2 text-sm text-foreground/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          {leak.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {highLeaks.length > 0 && (
                  <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-500 text-white">Phase 2</Badge>
                        <span className="font-medium text-foreground">High Priority — Week 3-4</span>
                      </div>
                      <span className="text-success font-bold font-numeric">
                        +{formatCurrency(phase2Recovery * 0.6)}/mo
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {highLeaks.map((leak) => (
                        <li key={leak.type} className="flex items-center gap-2 text-sm text-foreground/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          {leak.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {otherLeaks.length > 0 && (
                  <div className="p-5 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">Phase 3</Badge>
                        <span className="font-medium text-foreground">Optimization — Month 2+</span>
                      </div>
                      <span className="text-success font-bold font-numeric">
                        +{formatCurrency(phase3Recovery * 0.5)}/mo
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {otherLeaks.map((leak) => (
                        <li key={leak.type} className="flex items-center gap-2 text-sm text-foreground/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          {leak.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-center pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total Potential Recovery</p>
                  <p className="text-display font-black text-success font-numeric">
                    {formatCurrency(results.totalMonthlyLoss * 0.65)}
                    <span className="text-heading text-success/70 font-normal">/month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 py-12 lg:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-primary/5 to-card p-8 lg:p-12 text-center">
              <h2 className="text-heading-xl font-bold text-foreground mb-4">
                Ready to fix these leaks?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Get a personalized implementation plan to recover{" "}
                <span className="text-success font-semibold">
                  {formatCurrency(results.totalMonthlyLoss * 0.65)}/month
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <Button
                  size="lg"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg btn-shine"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Book Strategy Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 border-border text-foreground hover:bg-secondary font-medium rounded-lg"
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="py-8 text-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Button>
        </div>
      </main>

      {/* Sticky CTA */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border"
          >
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  Recover {formatCurrency(results.totalMonthlyLoss * 0.65)}/month
                </p>
                <p className="text-xs text-muted-foreground">
                  Book your free strategy call
                </p>
              </div>
              <Button 
                onClick={() => setIsCalendlyOpen(true)}
                className="flex-shrink-0 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
              >
                Book Free Call
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Share Results</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Share your analysis with your team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn", bg: "bg-blue-600" },
                { icon: Twitter, label: "Twitter", bg: "bg-sky-500" },
                { icon: Mail, label: "Email", bg: "bg-success" },
              ].map(({ icon: Icon, label, bg }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  onClick={() => toast.info(`${label} sharing coming soon`)}
                >
                  <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2">Or copy link</p>
              <button
                className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                onClick={handleCopyLink}
              >
                <span className="text-sm text-muted-foreground truncate">{window.location.href}</span>
                {linkCopied ? (
                  <Check className="h-4 w-4 text-success flex-shrink-0 ml-2" />
                ) : (
                  <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendly Modal */}
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  );
}
