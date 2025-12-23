import { motion } from "framer-motion";
import { Star, Mail, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AuditWizardData } from "@/hooks/useAuditWizard";

interface OnlinePresenceStepProps {
  data: AuditWizardData;
  updateData: (updates: Partial<AuditWizardData>) => void;
}

const PRESENCE_OPTIONS = [
  {
    key: "review_response_active" as const,
    icon: Star,
    title: "Respond to Google Reviews?",
    description: "Actively responds to customer reviews",
  },
  {
    key: "email_marketing_active" as const,
    icon: Mail,
    title: "Use Email Marketing?",
    description: "Send marketing emails to past leads",
  },
  {
    key: "has_chat_widget" as const,
    icon: MessageSquare,
    title: "Live Chat on Website?",
    description: "Chat widget or chatbot on website",
  },
];

export function OnlinePresenceStep({ data, updateData }: OnlinePresenceStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Online & Social Presence</h2>
        <p className="text-muted-foreground">How does the business engage online?</p>
      </div>

      <div className="space-y-4">
        {PRESENCE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = data[option.key];

          return (
            <motion.div
              key={option.key}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                isActive
                  ? "border-primary/50 bg-primary/10"
                  : "border-border bg-secondary/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <Label className="text-foreground text-base font-medium">{option.title}</Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => updateData({ [option.key]: checked })}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-secondary/20 border border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          These signals help us understand the business's digital maturity and identify improvement opportunities.
        </p>
      </div>
    </motion.div>
  );
}
