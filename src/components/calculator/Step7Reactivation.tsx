import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Database, Users, AlertTriangle, Sparkles, Repeat, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const DATABASE_AGE_OPTIONS = [
  { value: "0-3months", label: "0-3 months old" },
  { value: "3-6months", label: "3-6 months old" },
  { value: "6-12months", label: "6-12 months old" },
  { value: "1-2years", label: "1-2 years old" },
  { value: "2+years", label: "2+ years old" },
];

const TIME_SINCE_PURCHASE_OPTIONS = [
  { value: "3-6months", label: "3-6 months" },
  { value: "6-12months", label: "6-12 months" },
  { value: "1-2years", label: "1-2 years" },
  { value: "2+years", label: "2+ years" },
];

const REENGAGEMENT_FREQUENCY_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "twice-a-year", label: "Twice a year" },
  { value: "once-a-year", label: "Once a year" },
  { value: "rarely", label: "Rarely" },
];

export const Step7Reactivation = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const hasDormantLeads = watch("hasDormantLeads");
  const everRecontactedDormant = watch("everRecontactedDormant");
  const hasPastCustomers = watch("hasPastCustomers");
  const sendsReengagementCampaigns = watch("sendsReengagementCampaigns");
  const avgPurchasesPerCustomer = watch("avgPurchasesPerCustomer") || 1;
  const avgTransactionValue = watch("avgTransactionValue") || 0;
  
  const ltv = avgPurchasesPerCustomer * avgTransactionValue;
  const bothNo = hasDormantLeads === false && hasPastCustomers === false;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Encouraging Message */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">This section often reveals the primary constraint</p>
          <p className="text-sm text-amber-700 mt-1">
            Dormant leads and past customers are already familiar with you — they're much easier to convert.
          </p>
        </div>
      </div>

      {/* SECTION A: Dormant Leads */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
          <Database className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">Dormant Leads Database</h3>
        </div>

        <FormField
          label="Do you have a database of past leads/inquiries?"
          required
          error={errors.hasDormantLeads?.message}
          helpText="Leads that inquired but never bought"
        >
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("hasDormantLeads", true)}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                hasDormantLeads === true
                  ? "border-amber-500 bg-amber-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <CheckCircle2 className={cn("w-7 h-7", hasDormantLeads === true ? "text-amber-500" : "text-slate-300")} />
              <span className={cn("font-medium", hasDormantLeads === true ? "text-amber-700" : "text-slate-600")}>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("hasDormantLeads", false)}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                hasDormantLeads === false
                  ? "border-amber-500 bg-amber-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <XCircle className={cn("w-7 h-7", hasDormantLeads === false ? "text-amber-500" : "text-slate-300")} />
              <span className={cn("font-medium", hasDormantLeads === false ? "text-amber-700" : "text-slate-600")}>No</span>
            </button>
          </div>
        </FormField>

        <AnimatePresence mode="wait">
          {hasDormantLeads === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 overflow-hidden"
            >
              <FormField
                label="Total leads in database"
                required
                error={errors.totalDormantLeads?.message}
                helpText="Rough estimate is fine"
              >
                <Input
                  type="number"
                  placeholder="500"
                  min={1}
                  {...register("totalDormantLeads", { valueAsNumber: true })}
                  className={cn(
                    "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                    errors.totalDormantLeads && "border-red-500"
                  )}
                />
              </FormField>

              <FormField
                label="How old is this database?"
                required
                error={errors.databaseAge?.message}
              >
                <Select
                  value={watch("databaseAge") || ""}
                  onValueChange={(value) => setValue("databaseAge", value)}
                >
                  <SelectTrigger className={cn(
                    "h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500",
                    errors.databaseAge && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select age of database" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATABASE_AGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Have you ever re-contacted these leads?"
                required
                error={errors.everRecontactedDormant?.message}
              >
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue("everRecontactedDormant", true)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                      everRecontactedDormant === true
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <CheckCircle2 className={cn("w-7 h-7", everRecontactedDormant === true ? "text-amber-500" : "text-slate-300")} />
                    <span className={cn("font-medium", everRecontactedDormant === true ? "text-amber-700" : "text-slate-600")}>Yes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("everRecontactedDormant", false)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                      everRecontactedDormant === false
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <XCircle className={cn("w-7 h-7", everRecontactedDormant === false ? "text-amber-500" : "text-slate-300")} />
                    <span className={cn("font-medium", everRecontactedDormant === false ? "text-amber-700" : "text-slate-600")}>No</span>
                  </button>
                </div>
              </FormField>

              <AnimatePresence mode="wait">
                {everRecontactedDormant === false && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-emerald-100 rounded-xl border border-emerald-300">
                      <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                        <span className="text-lg">💰</span> This is your biggest hidden goldmine
                      </p>
                      <p className="text-sm text-emerald-700 mt-1">
                        These leads already know you — a simple re-engagement can bring them back.
                      </p>
                    </div>
                  </motion.div>
                )}

                {everRecontactedDormant === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <FormField
                      label="What % did you reach back out to?"
                      required
                      error={errors.percentageRecontactedDormant?.message}
                    >
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="50"
                          min={0}
                          max={100}
                          {...register("percentageRecontactedDormant", { valueAsNumber: true })}
                          className={cn(
                            "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-10",
                            errors.percentageRecontactedDormant && "border-red-500"
                          )}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                      </div>
                    </FormField>

                    <FormField
                      label="How many responded positively?"
                      required
                      error={errors.dormantResponseCount?.message}
                    >
                      <Input
                        type="number"
                        placeholder="25"
                        min={0}
                        {...register("dormantResponseCount", { valueAsNumber: true })}
                        className={cn(
                          "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                          errors.dormantResponseCount && "border-red-500"
                        )}
                      />
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION B: Past Customers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
          <Users className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">Past Customers</h3>
        </div>

        <FormField
          label="Do you have past customers who haven't returned?"
          required
          error={errors.hasPastCustomers?.message}
          helpText="One-time buyers who could buy again"
        >
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("hasPastCustomers", true)}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                hasPastCustomers === true
                  ? "border-amber-500 bg-amber-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <CheckCircle2 className={cn("w-7 h-7", hasPastCustomers === true ? "text-amber-500" : "text-slate-300")} />
              <span className={cn("font-medium", hasPastCustomers === true ? "text-amber-700" : "text-slate-600")}>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("hasPastCustomers", false)}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                hasPastCustomers === false
                  ? "border-amber-500 bg-amber-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <XCircle className={cn("w-7 h-7", hasPastCustomers === false ? "text-amber-500" : "text-slate-300")} />
              <span className={cn("font-medium", hasPastCustomers === false ? "text-amber-700" : "text-slate-600")}>No</span>
            </button>
          </div>
        </FormField>

        <AnimatePresence mode="wait">
          {hasPastCustomers === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 overflow-hidden"
            >
              <FormField
                label="Number of past customers"
                required
                error={errors.numPastCustomers?.message}
              >
                <Input
                  type="number"
                  placeholder="200"
                  min={1}
                  {...register("numPastCustomers", { valueAsNumber: true })}
                  className={cn(
                    "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                    errors.numPastCustomers && "border-red-500"
                  )}
                />
              </FormField>

              <FormField
                label="Average time since last purchase"
                required
                error={errors.avgTimeSinceLastPurchase?.message}
              >
                <Select
                  value={watch("avgTimeSinceLastPurchase") || ""}
                  onValueChange={(value) => setValue("avgTimeSinceLastPurchase", value)}
                >
                  <SelectTrigger className={cn(
                    "h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500",
                    errors.avgTimeSinceLastPurchase && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select time since purchase" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SINCE_PURCHASE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Do you send re-engagement campaigns?"
                required
                error={errors.sendsReengagementCampaigns?.message}
              >
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue("sendsReengagementCampaigns", true)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                      sendsReengagementCampaigns === true
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <CheckCircle2 className={cn("w-7 h-7", sendsReengagementCampaigns === true ? "text-amber-500" : "text-slate-300")} />
                    <span className={cn("font-medium", sendsReengagementCampaigns === true ? "text-amber-700" : "text-slate-600")}>Yes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("sendsReengagementCampaigns", false)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                      sendsReengagementCampaigns === false
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <XCircle className={cn("w-7 h-7", sendsReengagementCampaigns === false ? "text-amber-500" : "text-slate-300")} />
                    <span className={cn("font-medium", sendsReengagementCampaigns === false ? "text-amber-700" : "text-slate-600")}>No</span>
                  </button>
                </div>
              </FormField>

              <AnimatePresence mode="wait">
                {sendsReengagementCampaigns === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <FormField
                      label="How often?"
                      required
                      error={errors.reengagementFrequency?.message}
                    >
                      <Select
                        value={watch("reengagementFrequency") || ""}
                        onValueChange={(value) => setValue("reengagementFrequency", value)}
                      >
                        <SelectTrigger className={cn(
                          "h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500",
                          errors.reengagementFrequency && "border-red-500"
                        )}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {REENGAGEMENT_FREQUENCY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField
                      label="What % typically respond?"
                      required
                      error={errors.reengagementResponseRate?.message}
                    >
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="15"
                          min={0}
                          max={100}
                          {...register("reengagementResponseRate", { valueAsNumber: true })}
                          className={cn(
                            "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-10",
                            errors.reengagementResponseRate && "border-red-500"
                          )}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                      </div>
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning if both are No */}
      <AnimatePresence mode="wait">
        {bothNo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-300">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Building a lead database is crucial for long-term growth</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Consider starting this now — even simple spreadsheets of past inquiries can become valuable assets.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION C: Customer Value (merged from Step 8) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-900">Customer Value</h3>
        </div>

        <FormField
          label="Average Purchases Per Customer (Lifetime)"
          required
          error={errors.avgPurchasesPerCustomer?.message}
          helpText="How many times does a typical customer buy from you? (Enter 1 for one-time purchases)"
        >
          <Input
            type="number"
            placeholder="1"
            min={1}
            max={50}
            {...register("avgPurchasesPerCustomer", { valueAsNumber: true })}
            className={cn(
              "h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.avgPurchasesPerCustomer && "border-red-500"
            )}
          />
        </FormField>

        {/* Contextual messaging based on value */}
        <AnimatePresence mode="wait">
          {avgPurchasesPerCustomer === 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Single transaction business</span> — Each new customer represents one sale.
                </p>
              </div>
            </motion.div>
          )}

          {avgPurchasesPerCustomer > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Repeat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Repeat customers multiply every lead's value</p>
                    {avgTransactionValue > 0 && (
                      <p className="text-lg font-bold text-emerald-900">LTV: {formatCurrency(ltv)}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ready to Calculate */}
      <div className="pt-4 border-t border-slate-200">
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
