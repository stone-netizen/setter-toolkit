import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Users, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step6TeamEfficiency = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const qualifiesLeads = watch("qualifiesLeads");
  const usesCRM = watch("usesCRM");

  return (
    <div className="space-y-6">
      {/* Number of Sales Staff */}
      <FormField
        label="Number of Sales/Customer-Facing Staff"
        required
        error={errors.numSalesStaff?.message}
        helpText="People who handle leads and customers"
      >
        <div className="relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="number"
            placeholder="3"
            min={1}
            max={100}
            {...register("numSalesStaff", { valueAsNumber: true })}
            className={cn(
              "h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.numSalesStaff && "border-red-500"
            )}
          />
        </div>
      </FormField>

      {/* Hourly Labor Cost */}
      <FormField
        label="Average Hourly Labor Cost"
        required
        error={errors.avgHourlyLaborCost?.message}
        helpText="Used to calculate time-waste cost"
      >
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="number"
            placeholder="25"
            min={10}
            max={500}
            {...register("avgHourlyLaborCost", { valueAsNumber: true })}
            className={cn(
              "h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-12",
              errors.avgHourlyLaborCost && "border-red-500"
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">/hr</span>
        </div>
      </FormField>

      {/* Qualifies Leads */}
      <FormField
        label="Do you qualify leads before booking consultations?"
        required
        error={errors.qualifiesLeads?.message}
        helpText="Before booking consultations"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("qualifiesLeads", true)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              qualifiesLeads === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2 className={cn("w-5 h-5", qualifiesLeads === true ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", qualifiesLeads === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("qualifiesLeads", false)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              qualifiesLeads === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle className={cn("w-5 h-5", qualifiesLeads === false ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", qualifiesLeads === false ? "text-emerald-700" : "text-slate-600")}>No</span>
          </button>
        </div>
      </FormField>

      {/* Unqualified Percentage */}
      <AnimatePresence>
        {qualifiesLeads === false && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <FormField
              label="Percentage of unqualified leads?"
              error={errors.percentageUnqualified?.message}
              helpText="Can't afford it, wrong service, just browsing, etc."
            >
              <div className="relative">
                <Input
                  type="number"
                  placeholder="20"
                  min={0}
                  max={100}
                  {...register("percentageUnqualified", { valueAsNumber: true })}
                  className={cn(
                    "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8",
                    errors.percentageUnqualified && "border-red-500"
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </FormField>
            <div className="mt-2 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700">
                ⚠️ Unqualified leads waste sales time and increase cost per acquisition.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uses CRM */}
      <FormField
        label="Do you use a CRM system?"
        error={errors.usesCRM?.message}
        helpText="Customer Relationship Management software"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("usesCRM", true)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              usesCRM === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2 className={cn("w-5 h-5", usesCRM === true ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", usesCRM === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("usesCRM", false)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              usesCRM === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle className={cn("w-5 h-5", usesCRM === false ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", usesCRM === false ? "text-emerald-700" : "text-slate-600")}>No</span>
          </button>
        </div>
      </FormField>

      {/* CRM Name */}
      <AnimatePresence>
        {usesCRM === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <FormField
              label="Which CRM do you use?"
              error={errors.crmName?.message}
            >
              <Input
                type="text"
                placeholder="e.g., HubSpot, Salesforce, Zoho"
                {...register("crmName")}
                className="h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {usesCRM === false && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-700">
            ⚠️ <strong>Revenue leak detected:</strong> Businesses without a CRM lose an average of 20-30% of leads due to poor follow-up tracking.
          </p>
        </div>
      )}
    </div>
  );
};
