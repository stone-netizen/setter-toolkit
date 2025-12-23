import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, Calendar, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step5Appointments = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const requiresAppointments = watch("requiresAppointments");
  const appointmentsBooked = watch("appointmentsBooked") || 0;
  const appointmentsShowUp = watch("appointmentsShowUp") || 0;
  const sendsReminders = watch("sendsReminders");
  const reminderMethods = watch("reminderMethods") || [];
  const chargesNoShowFee = watch("chargesNoShowFee");
  
  const noShowRate = appointmentsBooked > 0 
    ? (((appointmentsBooked - appointmentsShowUp) / appointmentsBooked) * 100).toFixed(1)
    : "0.0";

  const toggleReminderMethod = (method: string) => {
    const current = reminderMethods || [];
    if (current.includes(method)) {
      setValue("reminderMethods", current.filter(m => m !== method));
    } else {
      setValue("reminderMethods", [...current, method]);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Does your business require appointments?"
        required
        error={errors.requiresAppointments?.message}
        helpText="Consultations, bookings, scheduled visits, etc."
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("requiresAppointments", true)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              requiresAppointments === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <Calendar className={cn("w-8 h-8", requiresAppointments === true ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", requiresAppointments === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("requiresAppointments", false)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              requiresAppointments === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle className={cn("w-8 h-8", requiresAppointments === false ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", requiresAppointments === false ? "text-emerald-700" : "text-slate-600")}>No</span>
          </button>
        </div>
      </FormField>

      <AnimatePresence mode="wait">
        {requiresAppointments === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Appointment Stats */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Appointments Booked (monthly)"
                required
                error={errors.appointmentsBooked?.message}
              >
                <Input
                  type="number"
                  placeholder="50"
                  min={0}
                  {...register("appointmentsBooked", { valueAsNumber: true })}
                  className={cn(
                    "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                    errors.appointmentsBooked && "border-red-500"
                  )}
                />
              </FormField>
              <FormField
                label="Appointments That Show Up"
                required
                error={errors.appointmentsShowUp?.message}
              >
                <Input
                  type="number"
                  placeholder="40"
                  min={0}
                  {...register("appointmentsShowUp", { valueAsNumber: true })}
                  className={cn(
                    "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                    errors.appointmentsShowUp && "border-red-500"
                  )}
                />
              </FormField>
            </div>

            {/* No-Show Rate Display */}
            <div className={cn(
              "p-4 rounded-xl border-2",
              parseFloat(noShowRate) > 20 
                ? "bg-red-50 border-red-200" 
                : parseFloat(noShowRate) > 10 
                ? "bg-amber-50 border-amber-200"
                : "bg-emerald-50 border-emerald-200"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    "w-5 h-5",
                    parseFloat(noShowRate) > 20 
                      ? "text-red-500" 
                      : parseFloat(noShowRate) > 10 
                      ? "text-amber-500"
                      : "text-emerald-500"
                  )} />
                  <span className="text-sm font-medium text-slate-700">No-Show Rate</span>
                </div>
                <span className={cn(
                  "text-2xl font-bold",
                  parseFloat(noShowRate) > 20 
                    ? "text-red-600" 
                    : parseFloat(noShowRate) > 10 
                    ? "text-amber-600"
                    : "text-emerald-600"
                )}>
                  {noShowRate}%
                </span>
              </div>
              <p className={cn(
                "text-xs mt-1",
                parseFloat(noShowRate) > 20 
                  ? "text-red-600" 
                  : parseFloat(noShowRate) > 10 
                  ? "text-amber-600"
                  : "text-emerald-600"
              )}>
                {parseFloat(noShowRate) > 20 
                  ? "High no-show rate. This is a major revenue leak!" 
                  : parseFloat(noShowRate) > 10 
                  ? "Above average. Consider implementing reminders."
                  : "Great! Your no-show rate is below industry average."}
              </p>
            </div>

            {/* Sends Reminders */}
            <FormField
              label="Do you send appointment reminders?"
              required
              error={errors.sendsReminders?.message}
            >
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue("sendsReminders", true)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    sendsReminders === true
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <CheckCircle2 className={cn("w-5 h-5", sendsReminders === true ? "text-emerald-500" : "text-slate-300")} />
                  <span className={cn("font-medium", sendsReminders === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("sendsReminders", false)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    sendsReminders === false
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <XCircle className={cn("w-5 h-5", sendsReminders === false ? "text-emerald-500" : "text-slate-300")} />
                  <span className={cn("font-medium", sendsReminders === false ? "text-emerald-700" : "text-slate-600")}>No</span>
                </button>
              </div>
            </FormField>

            {/* Reminder Details */}
            <AnimatePresence>
              {sendsReminders === true && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <FormField
                    label="How many reminders do you send?"
                    error={errors.reminderCount?.message}
                  >
                    <Input
                      type="number"
                      placeholder="2"
                      min={1}
                      max={5}
                      {...register("reminderCount", { valueAsNumber: true })}
                      className="h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </FormField>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Reminder Methods</label>
                    <div className="flex flex-wrap gap-3">
                      {["Email", "SMS", "Phone Call"].map((method) => (
                        <label
                          key={method}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all",
                            reminderMethods.includes(method)
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <Checkbox
                            checked={reminderMethods.includes(method)}
                            onCheckedChange={() => toggleReminderMethod(method)}
                          />
                          <span className={cn(
                            "text-sm font-medium",
                            reminderMethods.includes(method) ? "text-emerald-700" : "text-slate-600"
                          )}>
                            {method}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* No-Show Fee */}
            <FormField
              label="Do you charge a no-show fee?"
              error={errors.chargesNoShowFee?.message}
            >
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue("chargesNoShowFee", true)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    chargesNoShowFee === true
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <CheckCircle2 className={cn("w-5 h-5", chargesNoShowFee === true ? "text-emerald-500" : "text-slate-300")} />
                  <span className={cn("font-medium", chargesNoShowFee === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("chargesNoShowFee", false)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    chargesNoShowFee === false
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <XCircle className={cn("w-5 h-5", chargesNoShowFee === false ? "text-emerald-500" : "text-slate-300")} />
                  <span className={cn("font-medium", chargesNoShowFee === false ? "text-emerald-700" : "text-slate-600")}>No</span>
                </button>
              </div>
            </FormField>

            {/* Days Until Appointment */}
            <FormField
              label="Average Days Until Appointment"
              required
              error={errors.daysUntilAppointment?.message}
              helpText="Average wait time from booking to appointment"
            >
              <div className="relative">
                <Input
                  type="number"
                  placeholder="7"
                  min={0}
                  max={90}
                  {...register("daysUntilAppointment", { valueAsNumber: true })}
                  className={cn(
                    "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-16",
                    errors.daysUntilAppointment && "border-red-500"
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">days</span>
              </div>
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {requiresAppointments === false && (
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600">
            ✓ No appointment tracking needed. We'll calculate your revenue leaks based on your lead conversion data.
          </p>
        </div>
      )}
    </div>
  );
};
