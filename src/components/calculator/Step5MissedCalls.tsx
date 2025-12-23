import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { PhoneMissed } from "lucide-react";

interface StepProps {
  formData: CalculatorFormData;
  errors: Partial<Record<keyof CalculatorFormData, string>>;
  updateField: <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => void;
}

export const Step5MissedCalls = ({ formData, errors, updateField }: StepProps) => {
  const percentage = Number(formData.missedCallsPercentage) || 0;

  return (
    <div className="space-y-6">
      <FormField
        label="Estimated Missed Calls Percentage"
        required
        error={errors.missedCallsPercentage}
        helpText="What percentage of calls do you estimate you can't answer?"
      >
        <div className="space-y-6">
          {/* Visual Display */}
          <div className="flex items-center justify-center gap-4 p-6 bg-slate-50 rounded-xl">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                percentage > 30
                  ? "bg-red-100"
                  : percentage > 15
                  ? "bg-amber-100"
                  : "bg-emerald-100"
              )}
            >
              <PhoneMissed
                className={cn(
                  "w-8 h-8",
                  percentage > 30
                    ? "text-red-500"
                    : percentage > 15
                    ? "text-amber-500"
                    : "text-emerald-500"
                )}
              />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{percentage}%</div>
              <div className="text-sm text-slate-500">of calls missed</div>
            </div>
          </div>

          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[percentage]}
              onValueChange={(values) =>
                updateField("missedCallsPercentage", String(values[0]))
              }
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Context Message */}
          <div
            className={cn(
              "p-4 rounded-lg text-sm",
              percentage > 30
                ? "bg-red-50 text-red-700"
                : percentage > 15
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            )}
          >
            {percentage > 30
              ? "⚠️ High missed call rate. This could be costing you significant revenue."
              : percentage > 15
              ? "📊 Moderate missed calls. There's room for improvement."
              : "✅ Good job! Low missed call rate indicates efficient call handling."}
          </div>
        </div>
      </FormField>
    </div>
  );
};
