import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";

interface StepProps {
  formData: CalculatorFormData;
  errors: Partial<Record<keyof CalculatorFormData, string>>;
  updateField: <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => void;
}

export const Step1BusinessInfo = ({ formData, errors, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Business Name"
        required
        error={errors.businessName}
        helpText="Enter your business name as it appears on Google"
      >
        <Input
          type="text"
          placeholder="e.g., Smith Plumbing Co"
          value={formData.businessName}
          onChange={(e) => updateField("businessName", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.businessName && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Google Maps URL"
        error={errors.mapsUrl}
        helpText="Paste your Google Maps listing link for automatic data extraction"
      >
        <Input
          type="url"
          placeholder="https://www.google.com/maps/place/..."
          value={formData.mapsUrl}
          onChange={(e) => updateField("mapsUrl", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.mapsUrl && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Website URL"
        error={errors.websiteUrl}
        helpText="Your official business website for analysis"
      >
        <Input
          type="url"
          placeholder="https://www.yourbusiness.com"
          value={formData.websiteUrl}
          onChange={(e) => updateField("websiteUrl", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.websiteUrl && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>
    </div>
  );
};
