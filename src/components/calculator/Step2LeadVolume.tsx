import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { Phone, Globe, MessageCircle, Users } from "lucide-react";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step2LeadVolume = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch } = form;
  
  const totalMonthlyLeads = watch("totalMonthlyLeads") || 0;
  const inboundCalls = watch("inboundCalls") || 0;
  const webFormSubmissions = watch("webFormSubmissions") || 0;
  const socialInquiries = watch("socialInquiries") || 0;
  
  const breakdown = inboundCalls + webFormSubmissions + socialInquiries;

  return (
    <div className="space-y-6">
      <FormField
        label="Total Monthly Leads"
        required
        error={errors.totalMonthlyLeads?.message}
        helpText="All inquiries - calls, forms, DMs, walk-ins"
      >
        <div className="relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="number"
            placeholder="80"
            min={1}
            {...register("totalMonthlyLeads", { valueAsNumber: true })}
            className={cn(
              "h-12 pl-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.totalMonthlyLeads && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
          />
        </div>
      </FormField>

      <div className="p-4 bg-slate-100 rounded-xl">
        <p className="text-sm font-medium text-slate-600 mb-4">Break down your leads by source:</p>
        
        <div className="space-y-4">
          <FormField
            label="Inbound Phone Calls"
            required
            error={errors.inboundCalls?.message}
            helpText="How many calls ring your phone?"
          >
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="number"
                placeholder="40"
                min={0}
                {...register("inboundCalls", { valueAsNumber: true })}
                className={cn(
                  "h-12 pl-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  errors.inboundCalls && "border-red-500 focus:ring-red-500 focus:border-red-500"
                )}
              />
            </div>
          </FormField>

          <FormField
            label="Web Form Submissions"
            required
            error={errors.webFormSubmissions?.message}
            helpText="Contact forms, quote requests, etc."
          >
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="number"
                placeholder="25"
                min={0}
                {...register("webFormSubmissions", { valueAsNumber: true })}
                className={cn(
                  "h-12 pl-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  errors.webFormSubmissions && "border-red-500 focus:ring-red-500 focus:border-red-500"
                )}
              />
            </div>
          </FormField>

          <FormField
            label="Social Media Inquiries"
            required
            error={errors.socialInquiries?.message}
            helpText="Instagram DMs, Facebook messages"
          >
            <div className="relative">
              <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="number"
                placeholder="15"
                min={0}
                {...register("socialInquiries", { valueAsNumber: true })}
                className={cn(
                  "h-12 pl-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  errors.socialInquiries && "border-red-500 focus:ring-red-500 focus:border-red-500"
                )}
              />
            </div>
          </FormField>
        </div>

        {breakdown > 0 && totalMonthlyLeads > 0 && (
          <div className={cn(
            "mt-4 p-3 rounded-lg text-sm",
            breakdown === totalMonthlyLeads
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          )}>
            {breakdown === totalMonthlyLeads
              ? "✅ Your lead sources add up correctly!"
              : `📊 Breakdown total: ${breakdown} (${totalMonthlyLeads - breakdown > 0 ? "+" : ""}${breakdown - totalMonthlyLeads} difference from total)`
            }
          </div>
        )}
      </div>
    </div>
  );
};
