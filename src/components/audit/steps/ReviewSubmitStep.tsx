import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  DollarSign,
  Users,
  Clock,
  Phone,
  Star,
  Mail,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { AuditWizardData } from "@/hooks/useAuditWizard";

interface ReviewSubmitStepProps {
  data: AuditWizardData;
}

function ReviewItem({
  icon: Icon,
  label,
  value,
  isBoolean = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | boolean;
  isBoolean?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      {isBoolean ? (
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            value ? "text-green-400" : "text-red-400"
          }`}
        >
          {value ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {value ? "Yes" : "No"}
        </span>
      ) : (
        <span className="text-sm font-medium text-foreground">{value || "—"}</span>
      )}
    </div>
  );
}

export function ReviewSubmitStep({ data }: ReviewSubmitStepProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">Confirm the details before running your audit</p>
      </div>

      {/* Business Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Business Details
        </h3>
        <div className="space-y-2">
          <ReviewItem icon={Building2} label="Business Name" value={data.business_name} />
          <ReviewItem icon={Globe} label="Website" value={data.website} />
          <ReviewItem icon={Building2} label="Category" value={data.category} />
        </div>
      </div>

      {/* Revenue & Leads */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Revenue & Leads
        </h3>
        <div className="space-y-2">
          <ReviewItem
            icon={DollarSign}
            label="Avg Ticket Value"
            value={formatCurrency(data.avg_ticket_value)}
          />
          <ReviewItem icon={Users} label="Leads/Month" value={data.leads_per_month} />
          <ReviewItem icon={Users} label="Historical Leads" value={data.historical_leads_count} />
        </div>
      </div>

      {/* Operations */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Operations
        </h3>
        <div className="space-y-2">
          <ReviewItem icon={Clock} label="Response Time" value={data.response_time} />
          <ReviewItem icon={Phone} label="Uses CRM" value={data.crm_active} isBoolean />
          {data.crm_active && (
            <ReviewItem icon={Phone} label="CRM Name" value={data.crm_name} />
          )}
          <ReviewItem icon={Clock} label="Follow-up Attempts" value={`${data.follow_up_attempts}+`} />
          <ReviewItem icon={Phone} label="Missed Calls" value={`${data.missed_calls_percentage}%`} />
        </div>
      </div>

      {/* Online Presence */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Online Presence
        </h3>
        <div className="space-y-2">
          <ReviewItem
            icon={Star}
            label="Responds to Reviews"
            value={data.review_response_active}
            isBoolean
          />
          <ReviewItem
            icon={Mail}
            label="Email Marketing"
            value={data.email_marketing_active}
            isBoolean
          />
          <ReviewItem
            icon={MessageSquare}
            label="Live Chat"
            value={data.has_chat_widget}
            isBoolean
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/30 text-center"
      >
        <p className="text-sm text-primary font-medium">
          Ready to run the audit? Click "Run Audit" below to start the scan.
        </p>
      </motion.div>
    </motion.div>
  );
}
