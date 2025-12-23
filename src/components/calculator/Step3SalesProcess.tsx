import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData, RESPONSE_TIMES } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step3SalesProcess = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const totalMonthlyLeads = watch("totalMonthlyLeads") || 0;
  const closedDealsPerMonth = watch("closedDealsPerMonth") || 0;
  const avgResponseTime = watch("avgResponseTime");
  const followUpAllLeads = watch("followUpAllLeads");
  const avgFollowUpAttempts = watch("avgFollowUpAttempts") || 0;
  const consultationLength = watch("consultationLength") || 0;
  
  const dealsExceedLeads = closedDealsPerMonth > totalMonthlyLeads && totalMonthlyLeads > 0;
  const closeRateRaw = totalMonthlyLeads > 0 
    ? (closedDealsPerMonth / totalMonthlyLeads) * 100
    : 0;
  const closeRate = Math.min(closeRateRaw, 100).toFixed(1);

  return (
    <div className="space-y-6">
      <FormField
        label="Closed Deals Per Month"
        required
        error={dealsExceedLeads ? `Cannot exceed ${totalMonthlyLeads} leads` : errors.closedDealsPerMonth?.message}
        helpText="How many leads become customers?"
      >
        <div className="relative">
          <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="number"
            placeholder="12"
            min={0}
            max={totalMonthlyLeads}
            {...register("closedDealsPerMonth", { valueAsNumber: true })}
            className={cn(
              "h-12 pl-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              (errors.closedDealsPerMonth || dealsExceedLeads) && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </div>
      </FormField>

      {/* Calculated Close Rate */}
      <div className={cn(
        "p-4 rounded-xl border-2",
        parseFloat(closeRate) >= 20 
          ? "bg-emerald-50 border-emerald-200" 
          : parseFloat(closeRate) >= 10 
          ? "bg-amber-50 border-amber-200"
          : "bg-red-50 border-red-200"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Your Close Rate</p>
            <p className="text-xs text-slate-500">Based on {totalMonthlyLeads} leads/month</p>
          </div>
          <div className={cn(
            "text-3xl font-bold",
            parseFloat(closeRate) >= 20 
              ? "text-emerald-600" 
              : parseFloat(closeRate) >= 10 
              ? "text-amber-600"
              : "text-red-600"
          )}>
            {closeRate}%
          </div>
        </div>
        <p className={cn(
          "text-xs mt-2",
          parseFloat(closeRate) >= 20 
            ? "text-emerald-600" 
            : parseFloat(closeRate) >= 10 
            ? "text-amber-600"
            : "text-red-600"
        )}>
          {parseFloat(closeRate) >= 20 
            ? "✅ Excellent! Above industry average." 
            : parseFloat(closeRate) >= 10 
            ? "📊 Average. Room for improvement."
            : "⚠️ Below average. Significant opportunity for growth."}
        </p>
      </div>

      <FormField
        label="Average Response Time"
        required
        error={errors.avgResponseTime?.message}
        helpText="How quickly do you respond to new leads?"
      >
        <Select value={avgResponseTime} onValueChange={(value) => setValue("avgResponseTime", value)}>
          <SelectTrigger
            className={cn(
              "h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.avgResponseTime && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          >
            <Clock className="w-5 h-5 text-slate-400 mr-2" />
            <SelectValue placeholder="Select response time" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 shadow-lg z-50">
            {RESPONSE_TIMES.map((time) => (
              <SelectItem key={time.value} value={time.value} className="text-slate-900 hover:bg-slate-100">
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Do you follow up with ALL leads?"
        required
        error={errors.followUpAllLeads?.message}
        helpText="Including ones that don't respond initially"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("followUpAllLeads", true)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
              followUpAllLeads === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2
              className={cn(
                "w-6 h-6",
                followUpAllLeads === true ? "text-emerald-500" : "text-slate-300"
              )}
            />
            <span
              className={cn(
                "font-medium text-sm",
                followUpAllLeads === true ? "text-emerald-700" : "text-slate-600"
              )}
            >
              Yes
            </span>
          </button>
          <button
            type="button"
            onClick={() => setValue("followUpAllLeads", false)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
              followUpAllLeads === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle
              className={cn(
                "w-6 h-6",
                followUpAllLeads === false ? "text-emerald-500" : "text-slate-300"
              )}
            />
            <span
              className={cn(
                "font-medium text-sm",
                followUpAllLeads === false ? "text-emerald-700" : "text-slate-600"
              )}
            >
              No
            </span>
          </button>
        </div>
      </FormField>

      {followUpAllLeads === false && (
        <FormField
          label="What percentage of leads do you follow up with?"
          error={errors.percentageFollowedUp?.message}
        >
          <div className="relative">
            <Input
              type="number"
              placeholder="60"
              min={0}
              max={100}
              {...register("percentageFollowedUp", { valueAsNumber: true })}
              className={cn(
                "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8",
                errors.percentageFollowedUp && "border-red-500 focus:ring-red-500 focus:border-red-500"
              )}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
        </FormField>
      )}

      <FormField
        label="Average Follow-up Attempts"
        required
        error={avgFollowUpAttempts > 20 ? "Maximum 20 attempts" : errors.avgFollowUpAttempts?.message}
        helpText="Top performers do 6-8 attempts"
      >
        <Input
          type="number"
          placeholder="3"
          min={0}
          max={20}
          {...register("avgFollowUpAttempts", { valueAsNumber: true })}
          className={cn(
            "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            (errors.avgFollowUpAttempts || avgFollowUpAttempts > 20) && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
      </FormField>

      <FormField
        label="Average Consultation Length"
        required
        error={consultationLength > 300 ? "Maximum 300 minutes" : consultationLength < 5 && consultationLength > 0 ? "Minimum 5 minutes" : errors.consultationLength?.message}
        helpText="In minutes (5-300)"
      >
        <div className="relative">
          <Input
            type="number"
            placeholder="30"
            min={5}
            max={300}
            {...register("consultationLength", { valueAsNumber: true })}
            className={cn(
              "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-16",
              (errors.consultationLength || consultationLength > 300 || (consultationLength < 5 && consultationLength > 0)) && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">minutes</span>
        </div>
      </FormField>
    </div>
  );
};
