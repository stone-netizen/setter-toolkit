import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Leak } from "@/utils/calculations";

interface RecommendedInterventionProps {
  primaryConstraint: Leak;
}

// Intervention recommendations based on leak type
const INTERVENTIONS: Record<string, { action: string; outcome: string }> = {
  "missed-calls": {
    action: "Implement automated capture + immediate response for missed and after-hours calls, integrated into existing CRM.",
    outcome: "This typically recovers 30–60% of lost opportunities within the first 30 days."
  },
  "after-hours": {
    action: "Deploy 24/7 automated response system with intelligent call routing and lead capture for after-hours inquiries.",
    outcome: "This typically recovers 40–65% of after-hours opportunities within the first 30 days."
  },
  "slow-response": {
    action: "Implement instant lead notification with automated initial response within 60 seconds of inquiry.",
    outcome: "This typically increases contact rates by 50–80% within the first 14 days."
  },
  "no-follow-up": {
    action: "Deploy structured multi-touch follow-up sequences across SMS, email, and phone with automated scheduling.",
    outcome: "This typically increases close rates by 25–40% within the first 45 days."
  },
  "no-show": {
    action: "Implement automated appointment confirmation and reminder sequences with easy rescheduling options.",
    outcome: "This typically reduces no-show rates by 40–60% within the first 21 days."
  },
  "unqualified-leads": {
    action: "Deploy automated lead qualification with scoring criteria and intelligent routing to appropriate team members.",
    outcome: "This typically improves team efficiency by 30–50% within the first 30 days."
  },
  "hold-time": {
    action: "Implement callback systems and intelligent queue management to eliminate hold time bottlenecks.",
    outcome: "This typically reduces hang-up rates by 35–55% within the first 14 days."
  },
  "reactivation": {
    action: "Deploy automated reactivation campaigns targeting dormant leads and past customers with personalized outreach.",
    outcome: "This typically generates 15–30% response rates within the first 21 days."
  },
};

export function RecommendedIntervention({ primaryConstraint }: RecommendedInterventionProps) {
  const intervention = INTERVENTIONS[primaryConstraint.type] || {
    action: "Implement targeted automation for your primary constraint, integrated with existing workflows.",
    outcome: "This typically shows measurable improvement within the first 30 days."
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-6 lg:p-8"
    >
      <div className="absolute inset-0 pattern-grid opacity-5" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recommended Intervention
          </h3>
        </div>
        
        <p className="text-foreground leading-relaxed mb-4">
          {intervention.action}
        </p>
        
        <p className="text-sm text-muted-foreground italic">
          {intervention.outcome}
        </p>
      </div>
    </motion.div>
  );
}
