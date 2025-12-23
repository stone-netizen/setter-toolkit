import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeakSimulator } from "@/components/dashboard/LeakSimulator";
import { LeadTable } from "@/components/leads/LeadTable";
import { AddLeadDialog } from "@/components/leads/AddLeadDialog";
import { useLeads, useDeleteLead, useLeadStats } from "@/hooks/useLeads";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import {
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Users,
} from "lucide-react";

export default function Index() {
  const { data: leads = [], isLoading } = useLeads();
  const { mutate: deleteLead } = useDeleteLead();
  const { totalLeakAmount, avgLeakScore, criticalLeaks, totalLeads } = useLeadStats();
  const { data: settings } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();

  const handleSettingsChange = (projectValue: number, missedCalls: number) => {
    if (settings && (settings.avg_project_value !== projectValue || settings.missed_calls_per_month !== missedCalls)) {
      updateSettings({
        avg_project_value: projectValue,
        missed_calls_per_month: missedCalls,
      });
    }
  };

  // Get top 5 leads for "Top Opportunities" preview
  const topOpportunities = [...leads]
    .filter((l) => l.audits?.[0]?.leak_amount)
    .sort((a, b) => (Number(b.audits?.[0]?.leak_amount) || 0) - (Number(a.audits?.[0]?.leak_amount) || 0))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
            <p className="text-muted-foreground">Monitor revenue leaks across your leads</p>
          </div>
          <AddLeadDialog />
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Revenue at Risk"
            value={totalLeakAmount}
            prefix="$"
            icon={DollarSign}
            variant="critical"
            delay={0}
          />
          <KPICard
            title="Average Leak Score"
            value={avgLeakScore}
            suffix="/100"
            icon={TrendingDown}
            variant={avgLeakScore > 70 ? "healthy" : avgLeakScore > 40 ? "warning" : "critical"}
            delay={1}
          />
          <KPICard
            title="Critical Leaks"
            value={criticalLeaks}
            icon={AlertTriangle}
            variant={criticalLeaks > 0 ? "critical" : "healthy"}
            delay={2}
          />
          <KPICard
            title="Leads in Pipeline"
            value={totalLeads}
            icon={Users}
            variant="default"
            delay={3}
          />
        </div>

        {/* Simulator + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeakSimulator
            initialProjectValue={settings?.avg_project_value || 5000}
            initialMissedCalls={settings?.missed_calls_per_month || 10}
            onValuesChange={handleSettingsChange}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="glass rounded-xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">Top Opportunities</h3>
            {topOpportunities.length > 0 ? (
              <div className="space-y-3">
                {topOpportunities.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                        {lead.business_name}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-leak-critical">
                      ${Number(lead.audits?.[0]?.leak_amount || 0).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Run audits on your leads to see top opportunities here.
              </p>
            )}
          </motion.div>
        </div>

        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Leads</h3>
          <LeadTable
            leads={leads.slice(0, 10)}
            onDelete={(id) => deleteLead(id)}
            loading={isLoading}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
