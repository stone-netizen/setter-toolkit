import { UseFormReturn } from "react-hook-form";
import { FormField } from "./FormField";
import { CalculatorFormData } from "@/hooks/useCalculatorForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Star, Mail, MessageSquare } from "lucide-react";

interface StepProps {
  form: UseFormReturn<CalculatorFormData>;
}

interface ToggleCardProps {
  label: string;
  icon: React.ReactNode;
  value: boolean | null | undefined;
  onChange: (value: boolean) => void;
  helpText?: string;
}

const ToggleCard = ({ label, icon, value, onChange, helpText }: ToggleCardProps) => (
  <div className="p-4 border border-slate-200 rounded-xl bg-white">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium text-slate-700 mb-1">{label}</div>
        {helpText && <div className="text-xs text-slate-500 mb-3">{helpText}</div>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium",
              value === true
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium",
              value === false
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
            )}
          >
            <XCircle className="w-4 h-4" />
            No
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const Step6OnlinePresence = ({ form }: StepProps) => {
  const { watch, setValue, formState: { errors } } = form;
  
  const respondsToReviews = watch("respondsToReviews");
  const usesEmailMarketing = watch("usesEmailMarketing");
  const hasChatWidget = watch("hasChatWidget");

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-6">
        These factors affect your online reputation and lead nurturing capabilities.
      </p>

      <FormField
        label=""
        error={errors.respondsToReviews?.message}
      >
        <div className="space-y-4">
          <ToggleCard
            label="Do you respond to Google reviews?"
            icon={<Star className="w-5 h-5" />}
            value={respondsToReviews}
            onChange={(value) => setValue("respondsToReviews", value)}
            helpText="Responding to reviews builds trust and improves SEO"
          />

          <ToggleCard
            label="Do you use email marketing for past leads?"
            icon={<Mail className="w-5 h-5" />}
            value={usesEmailMarketing}
            onChange={(value) => setValue("usesEmailMarketing", value)}
            helpText="Email marketing helps nurture leads and drive repeat business"
          />

          <ToggleCard
            label="Do you have a chat widget on your website?"
            icon={<MessageSquare className="w-5 h-5" />}
            value={hasChatWidget}
            onChange={(value) => setValue("hasChatWidget", value)}
            helpText="Chat widgets capture leads who prefer not to call"
          />
        </div>
      </FormField>
    </div>
  );
};
