import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, TrendingDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/calculations";

interface HeroSectionProps {
  businessName: string;
  industry?: string;
  monthlyLoss: number;
  annualLoss: number;
  onBookCall: () => void;
}

export function HeroSection({
  businessName,
  industry,
  monthlyLoss,
  annualLoss,
  onBookCall,
}: HeroSectionProps) {
  // Calculate percentage (assuming ~$100k monthly revenue for context)
  const estimatedPercentage = Math.min(Math.round((monthlyLoss / 85000) * 100), 45);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 pattern-grid opacity-40" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-destructive/20 via-destructive/5 to-transparent blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-2xl" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 noise" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Business badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/80 border border-border mb-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-medium text-foreground">{businessName}</span>
            </div>
            {industry && (
              <>
                <div className="w-px h-4 bg-border" />
                <span className="text-sm text-muted-foreground">{industry}</span>
              </>
            )}
          </motion.div>

          {/* Alert banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-8"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Critical Revenue Leaks Detected</span>
          </motion.div>

          {/* The big reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-lg sm:text-xl text-muted-foreground mb-4">
              You're losing
            </p>
            
            {/* HERO NUMBER */}
            <div className="relative inline-block">
              <span className="hero-number text-gradient-destructive font-numeric">
                {formatCurrency(monthlyLoss)}
              </span>
              
              {/* Glow effect behind number */}
              <div className="absolute inset-0 blur-3xl bg-destructive/30 -z-10 scale-150" />
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xl sm:text-2xl text-muted-foreground">
                every month in fixable leaks
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-numeric">
                {formatCurrency(annualLoss)} annually
              </p>
            </div>
          </motion.div>

          {/* Comparison badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/5 border border-destructive/10 mb-10"
          >
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span className="text-sm text-muted-foreground">
              Losing approximately <span className="text-destructive font-medium">{estimatedPercentage}%</span> of potential revenue
            </span>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              size="lg"
              onClick={onBookCall}
              className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-glow-md btn-shine"
            >
              Book Your Free Strategy Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>15 minutes • Zero pressure • Free action plan</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">Scroll to see breakdown</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
