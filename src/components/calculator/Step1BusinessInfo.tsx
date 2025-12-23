import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData, INDUSTRIES } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step1BusinessInfo = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  const industry = watch("industry");

  return (
    <div className="space-y-6">
      <FormField
        label="Business Name"
        required
        error={errors.businessName?.message}
        helpText="Enter your business name as customers see it"
      >
        <Input
          type="text"
          placeholder="e.g., Smith Plumbing Co"
          {...register("businessName")}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.businessName && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Industry"
        required
        error={errors.industry?.message}
        helpText="Select your primary business category"
      >
        <Select value={industry} onValueChange={(value) => setValue("industry", value)}>
          <SelectTrigger
            className={cn(
              "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.industry && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          >
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 shadow-lg z-50">
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind} className="hover:bg-slate-100">
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Years in Business"
        required
        error={errors.yearsInBusiness?.message}
        helpText="How long has your business been operating?"
      >
        <Input
          type="number"
          placeholder="e.g., 5"
          min={0}
          max={100}
          {...register("yearsInBusiness", { valueAsNumber: true })}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.yearsInBusiness && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Monthly Revenue"
        required
        error={errors.monthlyRevenue?.message}
        helpText="Your average monthly revenue"
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
          <Input
            type="number"
            placeholder="50000"
            min={1000}
            {...register("monthlyRevenue", { valueAsNumber: true })}
            className={cn(
              "h-12 pl-8 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.monthlyRevenue && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </div>
      </FormField>

      <FormField
        label="Average Transaction Value"
        required
        error={errors.avgTransactionValue?.message}
        helpText="What's the average value of a single sale or job?"
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
          <Input
            type="number"
            placeholder="4500"
            min={50}
            {...register("avgTransactionValue", { valueAsNumber: true })}
            className={cn(
              "h-12 pl-8 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.avgTransactionValue && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </div>
      </FormField>

      <FormField
        label="Email Address"
        required
        error={errors.email?.message}
        helpText="We'll send your revenue leak report here"
      >
        <Input
          type="email"
          placeholder="you@company.com"
          {...register("email")}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            errors.email && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>
    </div>
  );
};
