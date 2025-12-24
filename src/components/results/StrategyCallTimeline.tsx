import { motion } from "framer-motion";
import { Target, FileText, Users, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrategyCallTimelineProps {
  onBookCall: () => void;
}

export function StrategyCallTimeline({ onBookCall }: StrategyCallTimelineProps) {
  const steps = [
    {
      number: 1,
      title: "Deep-dive your top 3 leaks",
      description: "We'll walk through exactly where you're losing money and why it's happening. No generic advice.",
      icon: Target,
    },
    {
      number: 2,
      title: "Custom 90-day recovery roadmap",
      description: "Which fixes to prioritize, exact implementation steps, and realistic timeline for each.",
      icon: FileText,
    },
    {
      number: 3,
      title: "See if we're a fit to work together",
      description: "Zero pressure. If it makes sense to collaborate, great. If not, you still leave with a clear action plan.",
      icon: Users,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-16 lg:py-24"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0 pattern-dots opacity-20" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display-lg font-bold text-foreground mb-4"
          >
            What Happens On Your Strategy Call
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            15 minutes. Zero pressure. Custom action plan.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex gap-6"
              >
                {/* Step number */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex w-10 h-10 rounded-lg bg-secondary items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={onBookCall}
            className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-glow-md btn-shine"
          >
            Book Your 15-Minute Call
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Next available: Today</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
