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
import { Step4Operations } from "@/components/calculator/Step4Operations";
import { Step5Appointments } from "@/components/calculator/Step5Appointments";
import { Step6TeamEfficiency } from "@/components/calculator/Step6TeamEfficiency";
import { Step7CustomerValue } from "@/components/calculator/Step7CustomerValue";

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
    "Operations",
    "Appointments",
    "Team Efficiency",
    "Customer Value",
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
        return <Step4Operations form={form} />;
      case 5:
        return <Step5Appointments form={form} />;
      case 6:
        return <Step6TeamEfficiency form={form} />;
      case 7:
        return <Step7CustomerValue form={form} />;
      default:
        return null;
    }
  };

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
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
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
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
            {currentStep === TOTAL_STEPS ? "Calculate My Revenue Leaks →" : "Continue"}
            {currentStep !== TOTAL_STEPS && <span className="ml-2">→</span>}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
