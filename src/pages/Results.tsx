import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Edit3, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, CalculationResult } from "@/utils/calculations";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { toast } from "sonner";
import { CalendlyModal } from "@/components/CalendlyModal";
import { HeroSection } from "@/components/results/HeroSection";
import { QuickWinCard } from "@/components/results/QuickWinCard";
import { LeakBreakdownGrid } from "@/components/results/LeakBreakdownGrid";
import { StrategyCallTimeline } from "@/components/results/StrategyCallTimeline";
import { MethodologyDrawer } from "@/components/results/MethodologyDrawer";

const RESULTS_STORAGE_KEY = "leakDetectorResults";

interface StoredResults {
  results: CalculationResult;
  formData: CalculatorFormData;
  calculatedAt: string;
}

export default function Results() {
  const navigate = useNavigate();
  const [storedData, setStoredData] = useState<StoredResults | null>(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

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
      setShowStickyBar(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEditInputs = () => navigate("/calculator");

  const handleDownloadPDF = () => {
    toast.info("Coming soon", { description: "PDF export will be available soon." });
  };

  const handleViewSolution = (leakType: string) => {
    toast.info("Solution details coming soon");
  };

  if (!storedData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { results, formData } = storedData;

  return (
    <div className="min-h-screen bg-background custom-scrollbar">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold text-foreground tracking-tight">
            LeakDetector
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownloadPDF} className="text-muted-foreground hover:text-foreground">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditInputs} className="border-border text-muted-foreground hover:text-foreground">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <HeroSection
          businessName={formData.businessName || "Your Business"}
          industry={formData.industry}
          monthlyLoss={results.totalMonthlyLoss}
          annualLoss={results.totalAnnualLoss}
          onBookCall={() => setIsCalendlyOpen(true)}
        />

        {/* Quick Win - Reactivation */}
        {results.reactivationOpportunity && results.reactivationOpportunity.monthlyLoss > 0 && (
          <section className="py-8 lg:py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <QuickWinCard
                reactivation={results.reactivationOpportunity}
                onViewPlan={() => setIsCalendlyOpen(true)}
              />
            </div>
          </section>
        )}

        {/* Leak Breakdown Grid */}
        <LeakBreakdownGrid
          leaks={results.leaks}
          totalLoss={results.totalMonthlyLoss}
          onViewSolution={handleViewSolution}
        />

        {/* Strategy Call Timeline */}
        <StrategyCallTimeline onBookCall={() => setIsCalendlyOpen(true)} />

        {/* Final CTA */}
        <section className="py-16 lg:py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 lg:p-12 text-center"
            >
              <div className="absolute inset-0 pattern-grid opacity-20" />
              <div className="relative">
                <h2 className="text-display font-bold text-foreground mb-4">
                  Ready to fix these leaks?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                  Get a personalized plan to recover{" "}
                  <span className="text-success font-semibold">
                    {formatCurrency(results.totalMonthlyLoss * 0.65)}/month
                  </span>
                </p>
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-glow-md btn-shine"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Book Strategy Call
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Methodology Drawer */}
        <MethodologyDrawer />

        {/* Footer */}
        <div className="py-8 text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/")}>
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
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  Recover {formatCurrency(results.totalMonthlyLoss * 0.65)}/month
                </p>
              </div>
              <Button
                onClick={() => setIsCalendlyOpen(true)}
                className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
              >
                Book Free Call
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  );
}
