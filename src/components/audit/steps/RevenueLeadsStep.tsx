import { motion } from "framer-motion";
import { DollarSign, Users, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AuditWizardData } from "@/hooks/useAuditWizard";

interface RevenueLeadsStepProps {
  data: AuditWizardData;
  updateData: (updates: Partial<AuditWizardData>) => void;
}

export function RevenueLeadsStep({ data, updateData }: RevenueLeadsStepProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Revenue & Leads</h2>
        <p className="text-muted-foreground">Help us understand the business metrics</p>
      </div>

      <div className="space-y-8">
        {/* Average Ticket Value */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Average Ticket Value
            </Label>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(data.avg_ticket_value)}
            </span>
          </div>
          <Slider
            value={[data.avg_ticket_value]}
            onValueChange={([value]) => updateData({ avg_ticket_value: value })}
            min={500}
            max={100000}
            step={500}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$500</span>
            <span>$100,000</span>
          </div>
        </div>

        {/* Leads Per Month */}
        <div className="space-y-2">
          <Label htmlFor="leads_per_month" className="text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Leads Per Month (approx)
          </Label>
          <Input
            id="leads_per_month"
            type="number"
            placeholder="80"
            value={data.leads_per_month || ""}
            onChange={(e) => updateData({ leads_per_month: parseInt(e.target.value) || 0 })}
            className="bg-secondary/50 border-border focus:border-primary"
            min={0}
          />
          <p className="text-xs text-muted-foreground">
            Rough average number of inquiries received per month
          </p>
        </div>

        {/* Historical Leads Count */}
        <div className="space-y-2">
          <Label htmlFor="historical_leads_count" className="text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            Historical Lead Database Size
          </Label>
          <Input
            id="historical_leads_count"
            type="number"
            placeholder="2200"
            value={data.historical_leads_count || ""}
            onChange={(e) => updateData({ historical_leads_count: parseInt(e.target.value) || 0 })}
            className="bg-secondary/50 border-border focus:border-primary"
            min={0}
          />
          <p className="text-xs text-muted-foreground">
            Size of past contact list / leads file
          </p>
        </div>
      </div>
    </motion.div>
  );
}
