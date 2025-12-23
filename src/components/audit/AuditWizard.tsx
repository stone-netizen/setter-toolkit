import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WizardProgress } from "./WizardProgress";
import { BusinessBasicsStep } from "./steps/BusinessBasicsStep";
import { RevenueLeadsStep } from "./steps/RevenueLeadsStep";
import { LeadResponseStep } from "./steps/LeadResponseStep";
import { OnlinePresenceStep } from "./steps/OnlinePresenceStep";
import { ReviewSubmitStep } from "./steps/ReviewSubmitStep";
import { useAuditWizard } from "@/hooks/useAuditWizard";
import { useCreateLead } from "@/hooks/useLeads";
import { cn } from "@/lib/utils";

interface AuditWizardProps {
  trigger?: React.ReactNode;
}

export function AuditWizard({ trigger }: AuditWizardProps) {
  const [open, setOpen] = useState(false);
  const {
    currentStep,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isStepValid,
    canProceed,
    isFirstStep,
    isLastStep,
    isSubmitting,
    setIsSubmitting,
  } = useAuditWizard();

  const { mutateAsync: createLead } = useCreateLead();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createLead({
        business_name: data.business_name,
        website: data.website || undefined,
        industry: data.category || undefined,
        category: data.category || undefined,
      });
      setOpen(false);
      reset();
      // TODO: Trigger Live Scan Mode here
    } catch (error) {
      console.error("Failed to create lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessBasicsStep data={data} updateData={updateData} />;
      case 2:
        return <RevenueLeadsStep data={data} updateData={updateData} />;
      case 3:
        return <LeadResponseStep data={data} updateData={updateData} />;
      case 4:
        return <OnlinePresenceStep data={data} updateData={updateData} />;
      case 5:
        return <ReviewSubmitStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 glow-primary">
            <Zap className="w-4 h-4" />
            New Audit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-strong border-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">
              Start New Audit
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Progress Indicator */}
        <WizardProgress
          currentStep={currentStep}
          onStepClick={goToStep}
          isStepValid={isStepValid}
        />

        {/* Step Content */}
        <div className="min-h-[400px] py-4">
          <AnimatePresence mode="wait">
            <div key={currentStep}>{renderStep()}</div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(
              "gap-2",
              isFirstStep && "opacity-50 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 glow-primary bg-primary hover:bg-primary/90"
            >
              <Zap className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Run Audit"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceed}
              className={cn(
                "gap-2",
                !canProceed && "opacity-50 cursor-not-allowed"
              )}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
