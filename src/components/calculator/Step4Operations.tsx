import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { CalculatorFormData, MISSED_CALL_RATES } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle2, XCircle, Info } from "lucide-react";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

export const Step4Operations = ({ form }: StepProps) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const businessHoursStart = watch("businessHoursStart");
  const businessHoursEnd = watch("businessHoursEnd");
  const openSaturday = watch("openSaturday");
  const openSunday = watch("openSunday");
  const answersAfterHours = watch("answersAfterHours");
  const answersWeekends = watch("answersWeekends");
  const missedCallRate = watch("missedCallRate");

  return (
    <div className="space-y-6">
      {/* Business Hours */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Business Hours <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Opens at"
            error={errors.businessHoursStart?.message}
          >
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="time"
                value={businessHoursStart}
                onChange={(e) => setValue("businessHoursStart", e.target.value)}
                className={cn(
                  "h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  errors.businessHoursStart && "border-red-500"
                )}
              />
            </div>
          </FormField>
          <FormField
            label="Closes at"
            error={errors.businessHoursEnd?.message}
          >
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="time"
                value={businessHoursEnd}
                onChange={(e) => setValue("businessHoursEnd", e.target.value)}
                className={cn(
                  "h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  errors.businessHoursEnd && "border-red-500"
                )}
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* Weekend Hours */}
      <div className="p-4 bg-slate-50 rounded-xl space-y-3">
        <p className="text-sm font-medium text-slate-700">Weekend Availability</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={openSaturday}
              onCheckedChange={(checked) => setValue("openSaturday", checked === true)}
            />
            <span className="text-sm text-slate-600">Open Saturday</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={openSunday}
              onCheckedChange={(checked) => setValue("openSunday", checked === true)}
            />
            <span className="text-sm text-slate-600">Open Sunday</span>
          </label>
        </div>
      </div>

      {/* After Hours Response */}
      <FormField
        label="Do you answer calls after hours?"
        required
        error={errors.answersAfterHours?.message}
        helpText="Via answering service, voicemail callback, etc."
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("answersAfterHours", true)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              answersAfterHours === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2 className={cn("w-5 h-5", answersAfterHours === true ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", answersAfterHours === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("answersAfterHours", false)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              answersAfterHours === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle className={cn("w-5 h-5", answersAfterHours === false ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", answersAfterHours === false ? "text-emerald-700" : "text-slate-600")}>No</span>
          </button>
        </div>
      </FormField>

      {/* Weekend Response */}
      <FormField
        label="Do you answer calls on weekends?"
        required
        error={errors.answersWeekends?.message}
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("answersWeekends", true)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              answersWeekends === true
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <CheckCircle2 className={cn("w-5 h-5", answersWeekends === true ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", answersWeekends === true ? "text-emerald-700" : "text-slate-600")}>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("answersWeekends", false)}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              answersWeekends === false
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <XCircle className={cn("w-5 h-5", answersWeekends === false ? "text-emerald-500" : "text-slate-300")} />
            <span className={cn("font-medium", answersWeekends === false ? "text-emerald-700" : "text-slate-600")}>No</span>
          </button>
        </div>
      </FormField>

      {/* Missed Call Rate */}
      <FormField
        label="How often do you miss incoming calls?"
        required
        error={errors.missedCallRate?.message}
      >
        <Select value={missedCallRate} onValueChange={(value) => setValue("missedCallRate", value)}>
          <SelectTrigger
            className={cn(
              "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              errors.missedCallRate && "border-red-500"
            )}
          >
            <SelectValue placeholder="Select missed call rate" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 shadow-lg z-50">
            {MISSED_CALL_RATES.map((rate) => (
              <SelectItem key={rate.value} value={rate.value} className="hover:bg-slate-100">
                {rate.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {missedCallRate === "unknown" && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mt-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-700">We'll use industry average: 45%</p>
          </div>
        )}
      </FormField>

      {/* Average Hold Time */}
      <FormField
        label="Average Hold Time"
        required
        error={errors.avgHoldTime?.message}
        helpText="In minutes before someone answers"
      >
        <div className="relative">
          <Input
            type="number"
            placeholder="2"
            min={0}
            max={30}
            {...register("avgHoldTime", { valueAsNumber: true })}
            className={cn(
              "h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-20",
              errors.avgHoldTime && "border-red-500"
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">minutes</span>
        </div>
      </FormField>
    </div>
  );
};
