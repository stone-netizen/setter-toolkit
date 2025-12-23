import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Repeat, DollarSign, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step7CustomerValue = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const repeatCustomers = watch("repeatCustomers");
  const avgPurchasesPerCustomer = watch("avgPurchasesPerCustomer") || 1;
  const avgTransactionValue = watch("avgTransactionValue") || 0;
  
  const ltv = avgPurchasesPerCustomer * avgTransactionValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Do customers typically make repeat purchases?"
        required
        error={errors.repeatCustomers?.message}
        helpText="Multiple visits, ongoing services, subscriptions, etc."
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("repeatCustomers", true)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              repeatCustomers === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <Repeat className={cn("w-8 h-8", repeatCustomers === true ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", repeatCustomers === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("repeatCustomers", false)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              repeatCustomers === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle className={cn("w-8 h-8", repeatCustomers === false ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", repeatCustomers === false ? "text-emerald-700" : "text-slate-600")}>No</span>
          </button>
        </div>
      </FormField>

      <AnimatePresence mode="wait">
        {repeatCustomers === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            <FormField
              label="Average Purchases Per Customer (Lifetime)"
              required
              error={errors.avgPurchasesPerCustomer?.message}
              helpText="How many times does a typical customer buy from you?"
            >
              <Input
                type="number"
                placeholder="3"
                min={1}
                max={50}
                {...register("avgPurchasesPerCustomer", { valueAsNumber: true })}
                className={cn(
                  "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  errors.avgPurchasesPerCustomer && "border-red-500"
                )}
              />
            </FormField>

            {/* LTV Display */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">Customer Lifetime Value</p>
                  <p className="text-3xl font-bold text-emerald-900">{formatCurrency(ltv)}</p>
                </div>
              </div>
              <div className="text-sm text-emerald-700 space-y-1">
                <p>{avgPurchasesPerCustomer} purchases × {formatCurrency(avgTransactionValue)} avg transaction</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Why LTV matters</p>
                <p className="text-sm text-blue-700 mt-1">
                  This multiplies the cost of every lost lead. A single missed call isn't just {formatCurrency(avgTransactionValue)} lost — 
                  it's potentially {formatCurrency(ltv)} in lifetime value walking out the door.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {repeatCustomers === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-slate-50 rounded-xl"
          >
            <p className="text-sm text-slate-600">
              ✓ One-time transactions noted. We'll calculate based on single purchase value of {formatCurrency(avgTransactionValue)}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready to Calculate */}
      <div className="pt-6 border-t border-slate-200">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-emerald-800">Almost done!</p>
              <p className="text-sm text-emerald-600">Click below to calculate your revenue leaks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
