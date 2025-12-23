import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface StepProps {
  formData: CalculatorFormData;
  errors: Partial<Record<keyof CalculatorFormData, string>>;
  updateField: <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => void;
}

export const Step7ContactInfo = ({ formData, errors, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
        <div>
          <div className="font-medium text-emerald-800 text-sm">Your data is secure</div>
          <div className="text-xs text-emerald-600">
            We'll send your personalized revenue leak report to this email.
          </div>
        </div>
      </div>

      <FormField
        label="Your Name"
        error={errors.contactName}
        helpText="How should we address you in the report?"
      >
        <Input
          type="text"
          placeholder="John Smith"
          value={formData.contactName}
          onChange={(e) => updateField("contactName", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.contactName && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Email Address"
        required
        error={errors.contactEmail}
        helpText="We'll send your detailed revenue leak report here"
      >
        <Input
          type="email"
          placeholder="john@company.com"
          value={formData.contactEmail}
          onChange={(e) => updateField("contactEmail", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.contactEmail && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Phone Number"
        error={errors.contactPhone}
        helpText="Optional - for a personalized follow-up call"
      >
        <Input
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.contactPhone}
          onChange={(e) => updateField("contactPhone", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.contactPhone && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>
    </div>
  );
};
