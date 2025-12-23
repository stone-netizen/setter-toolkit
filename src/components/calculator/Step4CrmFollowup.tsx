import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface StepProps {
  formData: CalculatorFormData;
  errors: Partial<Record<keyof CalculatorFormData, string>>;
  updateField: <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => void;
}

export const Step4CrmFollowup = ({ formData, errors, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Do you use a CRM to manage leads?"
        required
        error={errors.usesCrm}
        helpText="A CRM helps track and follow up with leads systematically"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateField("usesCrm", true)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              formData.usesCrm === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2
              className={cn(
                "w-8 h-8",
                formData.usesCrm === true ? "text-emerald-500" : "text-slate-300"
              )}
            />
            <span
              className={cn(
                "font-medium",
                formData.usesCrm === true ? "text-emerald-700" : "text-slate-600"
              )}
            >
              Yes
            </span>
          </button>
          <button
            type="button"
            onClick={() => updateField("usesCrm", false)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              formData.usesCrm === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle
              className={cn(
                "w-8 h-8",
                formData.usesCrm === false ? "text-emerald-500" : "text-slate-300"
              )}
            />
            <span
              className={cn(
                "font-medium",
                formData.usesCrm === false ? "text-emerald-700" : "text-slate-600"
              )}
            >
              No
            </span>
          </button>
        </div>
      </FormField>

      {formData.usesCrm === true && (
        <FormField
          label="Which CRM do you use?"
          error={errors.crmName}
          helpText="e.g., Salesforce, HubSpot, Zoho, etc."
        >
          <Input
            type="text"
            placeholder="Enter CRM name"
            value={formData.crmName}
            onChange={(e) => updateField("crmName", e.target.value)}
            className={cn(
              "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.crmName && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </FormField>
      )}

      <FormField
        label="How many follow-up attempts do you make on average?"
        error={errors.followUpAttempts}
        helpText="The number of times you reach out to a lead before giving up"
      >
        <Input
          type="number"
          placeholder="e.g., 3"
          value={formData.followUpAttempts}
          onChange={(e) => updateField("followUpAttempts", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.followUpAttempts && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>
    </div>
  );
};
