import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCalculatorForm, TOTAL_STEPS } from "@/hooks/useCalculatorForm";
import { calculateAllLeaks } from "@/utils/calculations";

// Step Components
import { Step1BusinessInfo } from "@/components/calculator/Step1BusinessInfo";
import { Step2LeadVolume } from "@/components/calculator/Step2LeadVolume";
import { Step3SalesProcess } from "@/components/calculator/Step3SalesProcess";
import { Step4Operations } from "@/components/calculator/Step4Operations";
import { Step5Appointments } from "@/components/calculator/Step5Appointments";
import { Step6TeamEfficiency } from "@/components/calculator/Step6TeamEfficiency";
import { Step7CustomerValue } from "@/components/calculator/Step7CustomerValue";

const RESULTS_STORAGE_KEY = "leakDetectorResults";

const Calculator = () => {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
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

  const handleContinue = async () => {
    if (currentStep === TOTAL_STEPS) {
      // Show loading state
      setIsCalculating(true);
      
      // Get form data
      const formData = form.getValues();
      
      // Simulate calculation time for effect (can remove in production)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Calculate LTV and all leaks
      const results = calculateAllLeaks(formData);
      
      // Save results to localStorage
      localStorage.setItem(
        RESULTS_STORAGE_KEY,
        JSON.stringify({
          results,
          formData,
          calculatedAt: new Date().toISOString(),
        })
      );
      
      // Navigate to results
      navigate("/results");
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
      {/* Loading Overlay */}
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <Loader2 className="w-16 h-16 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Analyzing your business...
              </h2>
              <p className="text-slate-400">
                This takes ~30 seconds
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-1 bg-emerald-500 rounded-full mt-6 max-w-xs mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            disabled={!canContinue() || isCalculating}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 h-auto rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {currentStep === TOTAL_STEPS ? (
              <>
                <Search className="w-4 h-4 mr-2" />
                Generate My Report
              </>
            ) : (
              <>
                Continue
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
