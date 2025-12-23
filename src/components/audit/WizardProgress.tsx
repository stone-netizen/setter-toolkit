import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/hooks/useAuditWizard";

interface WizardProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  isStepValid: (step: number) => boolean;
}

export function WizardProgress({
  currentStep,
  onStepClick,
  isStepValid,
}: WizardProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isClickable = step.id < currentStep || (step.id === currentStep + 1 && isStepValid(currentStep));

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <motion.button
              type="button"
              onClick={() => isClickable && onStepClick?.(step.id)}
              disabled={!isClickable}
              className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                isCompleted && "bg-primary text-primary-foreground glow-primary cursor-pointer",
                isCurrent && "bg-primary/20 text-primary border-2 border-primary glow-primary",
                !isCompleted && !isCurrent && "bg-secondary/50 text-muted-foreground border border-border",
                isClickable && !isCurrent && "hover:bg-primary/30 cursor-pointer"
              )}
              whileHover={isClickable ? { scale: 1.05 } : undefined}
              whileTap={isClickable ? { scale: 0.95 } : undefined}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
              
              {/* Active pulse ring */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.5, 0], scale: [1, 1.3, 1.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Connector Line */}
            {index < WIZARD_STEPS.length - 1 && (
              <div className="w-8 h-0.5 mx-1">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1 * index }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
