import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step4CrmFollowup = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  const usesCrm = watch("usesCrm");

  return (
    <div className="space-y-6">
      <FormField
        label="Do you use a CRM to manage leads?"
        required
        error={errors.usesCrm?.message}
        helpText="A CRM helps track and follow up with leads systematically"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("usesCrm", true)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              usesCrm === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2
              className={cn(
                "w-8 h-8",
                usesCrm === true ? "text-emerald-500" : "text-slate-300"
              )}
            />
            <span
              className={cn(
                "font-medium",
                usesCrm === true ? "text-emerald-700" : "text-slate-600"
              )}
            >
              Yes
            </span>
          </button>
          <button
            type="button"
            onClick={() => setValue("usesCrm", false)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              usesCrm === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle
              className={cn(
                "w-8 h-8",
                usesCrm === false ? "text-emerald-500" : "text-slate-300"
              )}
            />
            <span
              className={cn(
                "font-medium",
                usesCrm === false ? "text-emerald-700" : "text-slate-600"
              )}
            >
              No
            </span>
          </button>
        </div>
      </FormField>

      {usesCrm === true && (
        <FormField
          label="Which CRM do you use?"
          error={errors.crmName?.message}
          helpText="e.g., Salesforce, HubSpot, Zoho, etc."
        >
          <Input
            type="text"
            placeholder="Enter CRM name"
            {...register("crmName")}
            className={cn(
              "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.crmName && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </FormField>
      )}

      {usesCrm === false && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-700">
            ⚠️ <strong>Revenue leak detected:</strong> Businesses without a CRM lose an average of 20-30% of leads due to poor follow-up tracking.
          </p>
        </div>
      )}
    </div>
  );
};
