import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Rocket,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Filter,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCurrency,
  CalculationResult,
  Leak,
} from "@/utils/calculations";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendlyModal } from "@/components/CalendlyModal";

const RESULTS_STORAGE_KEY = "leakDetectorResults";

interface StoredResults {
  results: CalculationResult;
  formData: CalculatorFormData;
  calculatedAt: string;
}

const SEVERITY_COLORS = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function LeakDashboard() {
  const navigate = useNavigate();
  const [storedData, setStoredData] = useState<StoredResults | null>(null);
  const [sortColumn, setSortColumn] = useState<"rank" | "monthlyLoss" | "severity">("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<"all" | "critical" | "quickwin">("all");
  

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

  const sortedAndFilteredLeaks = useMemo(() => {
    if (!storedData?.results?.allLeaks) return [];

    let leaks = [...storedData.results.allLeaks];

    // Filter
    if (filter === "critical") {
      leaks = leaks.filter((l) => l.severity === "critical" || l.severity === "high");
    } else if (filter === "quickwin") {
      leaks = leaks.filter((l) => l.quickWin);
    }

    // Sort
    leaks.sort((a, b) => {
      if (sortColumn === "rank") {
        return sortDirection === "asc" ? a.rank - b.rank : b.rank - a.rank;
      } else if (sortColumn === "monthlyLoss") {
        return sortDirection === "asc"
          ? a.monthlyLoss - b.monthlyLoss
          : b.monthlyLoss - a.monthlyLoss;
      } else if (sortColumn === "severity") {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return sortDirection === "asc"
          ? order[a.severity] - order[b.severity]
          : order[b.severity] - order[a.severity];
      }
      return 0;
    });

    return leaks;
  }, [storedData, sortColumn, sortDirection, filter]);

  const handleSort = (column: "rank" | "monthlyLoss" | "severity") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDownloadPDF = () => {
    toast.info("Coming soon!", {
      description: "PDF generation will be available in a future update.",
    });
  };

  const handleUpdateAnalysis = () => {
    navigate("/calculator");
  };

  if (!storedData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const { results, formData, calculatedAt } = storedData;
  const analysisDate = new Date(calculatedAt);
  const daysSinceAnalysis = Math.floor((Date.now() - analysisDate.getTime()) / (1000 * 60 * 60 * 24));
  const dataFreshness = daysSinceAnalysis <= 7 ? "Fresh" : daysSinceAnalysis <= 30 ? "Recent" : "Stale";

  const reactivationValue = results.reactivationOpportunity?.monthlyLoss || 0;
  const operationalLeaks = results.operationalLeaks || results.leaks || [];
  const operationalValue = operationalLeaks.reduce((sum: number, l: any) => sum + (l.monthlyLoss || 0), 0);
  const quickWinROI = results.reactivationOpportunity?.expectedROI ? 
    parseFloat(results.reactivationOpportunity.expectedROI.split("-")[0]) : 0;

  // Implementation progress (mock data - would come from database in real app)
  const implementationProgress = 40;

  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
                  LeakDetector
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Business: <span className="text-slate-200">{formData.businessName}</span> | 
                Industry: <span className="text-slate-200">{formData.industry}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => navigate("/results")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Full Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg text-white"
                onClick={handleUpdateAnalysis}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Run New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Opportunity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  TOTAL OPPORTUNITY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-emerald-400 mb-1">
                  {formatCurrency(results.totalMonthlyLoss)}/mo
                </p>
                <p className="text-lg text-slate-400 mb-4">
                  {formatCurrency(results.totalAnnualLoss)}/year
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reactivation:</span>
                    <span className="text-amber-400 font-medium">{formatCurrency(reactivationValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operational Leaks:</span>
                    <span className="text-slate-300 font-medium">{formatCurrency(operationalValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Win Priority Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-500/30 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-violet-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  QUICK WIN PRIORITY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-white mb-2">Reactivation Campaign</p>
                <p className="text-slate-400 text-sm mb-4">Expected Recovery:</p>
                <p className="text-3xl font-bold text-violet-400 mb-4">
                  {formatCurrency(reactivationValue)} in 30 days
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">ROI</p>
                    <p className="text-lg font-bold text-emerald-400">{quickWinROI}x</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Payback</p>
                    <p className="text-lg font-bold text-blue-400">7-10 days</p>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/50 text-white"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Book Strategy Call
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analysis Date Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  LAST ANALYSIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white mb-1">
                  {format(analysisDate, "MMM d, yyyy")}
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  {format(analysisDate, "h:mm a")}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-slate-400 text-sm">Data Freshness:</span>
                  <Badge
                    className={
                      dataFreshness === "Fresh"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : dataFreshness === "Recent"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {dataFreshness}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={handleUpdateAnalysis}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Analysis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Leak Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Leak Breakdown
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <Select value={filter} onValueChange={(v: "all" | "critical" | "quickwin") => setFilter(v)}>
                    <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-300">
                      <SelectValue placeholder="Filter leaks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Show All</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                      <SelectItem value="quickwin">Quick Wins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-transparent">
                      <TableHead
                        className="text-slate-400 cursor-pointer hover:text-slate-200"
                        onClick={() => handleSort("rank")}
                      >
                        Rank {sortColumn === "rank" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-slate-400">Leak Type</TableHead>
                      <TableHead
                        className="text-slate-400 cursor-pointer hover:text-slate-200"
                        onClick={() => handleSort("monthlyLoss")}
                      >
                        Monthly Loss {sortColumn === "monthlyLoss" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-slate-400">Annual Loss</TableHead>
                      <TableHead
                        className="text-slate-400 cursor-pointer hover:text-slate-200"
                        onClick={() => handleSort("severity")}
                      >
                        Severity {sortColumn === "severity" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredLeaks.map((leak) => (
                      <TableRow key={leak.type} className="border-slate-700/50 hover:bg-slate-700/30">
                        <TableCell className="font-medium">
                          {leak.quickWin ? (
                            <Trophy className="w-5 h-5 text-amber-400" />
                          ) : (
                            <span className="text-slate-400">{leak.rank}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-200">{leak.label}</span>
                            {leak.quickWin && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                Quick Win
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-red-400 font-medium">
                          {formatCurrency(leak.monthlyLoss)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {formatCurrency(leak.annualLoss)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${SEVERITY_COLORS[leak.severity]} border`}>
                            {leak.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                            Not Started
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-200"
                            onClick={() => navigate("/results")}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Implementation Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                📈 Implementation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">{implementationProgress}% Complete</span>
                </div>
                <Progress value={implementationProgress} className="h-3 bg-slate-700" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">Reactivation Campaign</p>
                    <p className="text-slate-400 text-sm">Launched (Day 3)</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">AI Voice Agent</p>
                    <p className="text-slate-400 text-sm">In Progress (Day 8)</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    In Progress
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">SMS Reminder System</p>
                    <p className="text-slate-400 text-sm">Scheduled (Day 15)</p>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    Scheduled
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <Circle className="w-6 h-6 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-slate-400 font-medium">Follow-Up Automation</p>
                    <p className="text-slate-500 text-sm">Not Started</p>
                  </div>
                  <Badge className="bg-slate-700 text-slate-400 border-slate-600">
                    Pending
                  </Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <div className="flex flex-col items-center text-center gap-3">
                  <div>
                    <p className="text-slate-300 font-medium mb-1">Ready to start recovering?</p>
                    <p className="text-slate-400 text-sm">
                      Book a free strategy call to get a personalized implementation plan.
                    </p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/50 text-white"
                    onClick={() => setIsCalendlyOpen(true)}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Book Strategy Call
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <Button
          variant="ghost"
          className="text-slate-500 hover:text-slate-400"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
      </footer>

      {/* Calendly Modal */}
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  );
}
