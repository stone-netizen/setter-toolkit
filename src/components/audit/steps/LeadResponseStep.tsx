import { motion } from "framer-motion";
import { Clock, Phone, RefreshCw, PhoneMissed } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { AuditWizardData } from "@/hooks/useAuditWizard";

interface LeadResponseStepProps {
  data: AuditWizardData;
  updateData: (updates: Partial<AuditWizardData>) => void;
}

const RESPONSE_TIME_OPTIONS = [
  { value: "<15 min", label: "<15 min", color: "text-green-400" },
  { value: "15-60 min", label: "15–60 min", color: "text-green-300" },
  { value: "1-4 hrs", label: "1–4 hrs", color: "text-yellow-400" },
  { value: "4-24 hrs", label: "4–24 hrs", color: "text-orange-400" },
  { value: ">24 hrs", label: ">24 hrs", color: "text-red-400" },
];

const FOLLOW_UP_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3+" },
];

export function LeadResponseStep({ data, updateData }: LeadResponseStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Lead Response & Ops</h2>
        <p className="text-muted-foreground">How does the business handle leads?</p>
      </div>

      <div className="space-y-8">
        {/* Response Time */}
        <div className="space-y-4">
          <Label className="text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Typical First Response Time
          </Label>
          <RadioGroup
            value={data.response_time}
            onValueChange={(value) => updateData({ response_time: value })}
            className="grid grid-cols-5 gap-2"
          >
            {RESPONSE_TIME_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                  data.response_time === option.value
                    ? "border-primary bg-primary/20 glow-primary"
                    : "border-border bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                <span className={cn("text-sm font-medium", option.color)}>
                  {option.label}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* CRM Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <Label className="text-foreground">Do you use a CRM?</Label>
              <p className="text-xs text-muted-foreground">Customer relationship management</p>
            </div>
          </div>
          <Switch
            checked={data.crm_active}
            onCheckedChange={(checked) => updateData({ crm_active: checked })}
          />
        </div>

        {/* CRM Name (conditional) */}
        {data.crm_active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="crm_name" className="text-foreground">CRM Name</Label>
            <Input
              id="crm_name"
              placeholder="HubSpot, Salesforce, GoHighLevel..."
              value={data.crm_name}
              onChange={(e) => updateData({ crm_name: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </motion.div>
        )}

        {/* Follow-up Attempts */}
        <div className="space-y-4">
          <Label className="text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" />
            Average Follow-up Attempts
          </Label>
          <div className="flex gap-3">
            {FOLLOW_UP_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateData({ follow_up_attempts: option.value })}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg border font-medium transition-all",
                  data.follow_up_attempts === option.value
                    ? "border-primary bg-primary/20 text-primary glow-primary"
                    : "border-border bg-secondary/30 text-foreground hover:bg-secondary/50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Missed Calls Percentage */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground flex items-center gap-2">
              <PhoneMissed className="w-4 h-4 text-primary" />
              Missed Calls Percentage
            </Label>
            <span className="text-xl font-bold text-destructive">
              {data.missed_calls_percentage}%
            </span>
          </div>
          <Slider
            value={[data.missed_calls_percentage]}
            onValueChange={([value]) => updateData({ missed_calls_percentage: value })}
            min={0}
            max={100}
            step={5}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
