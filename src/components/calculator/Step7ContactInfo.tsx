import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step7ContactInfo = ({ form }: StepProps) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
        <div>
          <div className="font-medium text-emerald-800 text-sm">Your data is secure</div>
          <div className="text-xs text-emerald-600">
            We'll send your personalized revenue leak report to your email.
          </div>
        </div>
      </div>

      <FormField
        label="Your Name"
        error={errors.contactName?.message}
        helpText="How should we address you in the report?"
      >
        <Input
          type="text"
          placeholder="John Smith"
          {...register("contactName")}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.contactName && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Phone Number"
        error={errors.contactPhone?.message}
        helpText="Optional - for a personalized follow-up call"
      >
        <Input
          type="tel"
          placeholder="(555) 123-4567"
          {...register("contactPhone")}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.contactPhone && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center">
          By clicking "Calculate My Revenue Leaks", you agree to receive your personalized report via email.
        </p>
      </div>
    </div>
  );
};
