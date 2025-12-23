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

export const Step2RevenueLeads = ({ formData, errors, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Average Ticket Value ($)"
        required
        error={errors.avgTicketValue}
        helpText="What's the average value of a sale or job?"
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <Input
            type="number"
            placeholder="4500"
            value={formData.avgTicketValue}
            onChange={(e) => updateField("avgTicketValue", e.target.value)}
            className={cn(
              "h-12 pl-8 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.avgTicketValue && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </div>
      </FormField>

      <FormField
        label="Leads Per Month (approx)"
        required
        error={errors.leadsPerMonth}
        helpText="Rough average number of inquiries you receive per month"
      >
        <Input
          type="number"
          placeholder="80"
          value={formData.leadsPerMonth}
          onChange={(e) => updateField("leadsPerMonth", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.leadsPerMonth && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Historical Leads Count"
        error={errors.historicalLeadsCount}
        helpText="Size of your past contact list or leads database"
      >
        <Input
          type="number"
          placeholder="2200"
          value={formData.historicalLeadsCount}
          onChange={(e) => updateField("historicalLeadsCount", e.target.value)}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.historicalLeadsCount && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>
    </div>
  );
};
