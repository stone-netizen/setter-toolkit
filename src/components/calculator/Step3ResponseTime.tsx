import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface StepProps {
  formData: CalculatorFormData;
  errors: Partial<Record<keyof CalculatorFormData, string>>;
  updateField: <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => void;
}

const responseOptions = [
  { value: "<15min", label: "< 15 minutes", description: "Excellent response time" },
  { value: "15-60min", label: "15–60 minutes", description: "Good response time" },
  { value: "1-4hrs", label: "1–4 hours", description: "Average response time" },
  { value: "4-24hrs", label: "4–24 hours", description: "Below average" },
  { value: ">24hrs", label: "> 24 hours", description: "Needs improvement" },
];

export const Step3ResponseTime = ({ formData, errors, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Typical First Response Time"
        required
        error={errors.responseTime}
        helpText="How fast do you typically respond to new leads?"
      >
        <div className="space-y-3">
          {responseOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("responseTime", option.value)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                formData.responseTime === option.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  formData.responseTime === option.value
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "font-medium",
                    formData.responseTime === option.value
                      ? "text-emerald-700"
                      : "text-slate-700"
                  )}
                >
                  {option.label}
                </div>
                <div className="text-sm text-slate-500">{option.description}</div>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  formData.responseTime === option.value
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300"
                )}
              >
                {formData.responseTime === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
};
