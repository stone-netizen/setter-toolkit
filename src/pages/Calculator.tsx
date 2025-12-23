import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCalculatorForm, TOTAL_STEPS } from "@/hooks/useCalculatorForm";

// Step Components
import { Step1BusinessInfo } from "@/components/calculator/Step1BusinessInfo";
import { Step2LeadVolume } from "@/components/calculator/Step2LeadVolume";
import { Step3SalesProcess } from "@/components/calculator/Step3SalesProcess";
import { Step4CrmFollowup } from "@/components/calculator/Step4CrmFollowup";
import { Step5MissedCalls } from "@/components/calculator/Step5MissedCalls";
import { Step6OnlinePresence } from "@/components/calculator/Step6OnlinePresence";
import { Step7ContactInfo } from "@/components/calculator/Step7ContactInfo";

const Calculator = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    form,
    nextStep,
    prevStep,
    canContinue,
    progressPercentage,
  } = useCalculatorForm();

  const stepTitles = [
    "Business Profile",
    "Lead Volume",
    "Sales Process",
    "CRM & Follow-up",
    "Missed Calls",
    "Online Presence",
    "Contact Information",
  ];

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      prevStep();
    }
  };

  const handleContinue = () => {
    if (currentStep === TOTAL_STEPS) {
      // Submit form - navigate to results
      navigate("/calculator/results");
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BusinessInfo form={form} />;
      case 2:
        return <Step2LeadVolume form={form} />;
      case 3:
        return <Step3SalesProcess form={form} />;
      case 4:
        return <Step4CrmFollowup form={form} />;
      case 5:
        return <Step5MissedCalls form={form} />;
      case 6:
        return <Step6OnlinePresence form={form} />;
      case 7:
        return <Step7ContactInfo form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-[600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-sm font-medium text-white">LeakDetector</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-emerald-400 font-medium">
                {progressPercentage}% complete
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-slate-700"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-32 px-6">
        <div className="max-w-[600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card Container */}
              <div className="bg-white rounded-2xl shadow-xl shadow-black/20 p-8">
                {/* Step Title */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {stepTitles[currentStep - 1]}
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Fill in the details below to calculate your revenue leaks
                  </p>
                </div>

                {/* Step Content */}
                {renderStep()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-[600px] mx-auto px-6 py-4">
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 h-auto rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {currentStep === TOTAL_STEPS ? "Calculate My Revenue Leaks" : "Continue"}
            {currentStep !== TOTAL_STEPS && <span className="ml-2">→</span>}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
