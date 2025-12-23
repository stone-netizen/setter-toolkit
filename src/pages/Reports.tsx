import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLeads } from "@/hooks/useLeads";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Reports() {
  const { data: leads = [] } = useLeads();

  // Filter leads with completed audits that have PDF reports
  const reportsAvailable = leads.filter(
    (lead) => lead.status === "completed" && lead.audits?.[0]?.pdf_url
  );

  // All completed audits (even without PDF)
  const completedAudits = leads.filter((lead) => lead.status === "completed");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">View and download audit reports for your leads</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="glass rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-1">Completed Audits</p>
            <p className="text-3xl font-bold font-mono text-foreground">
              {completedAudits.length}
            </p>
          </div>
          <div className="glass rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-1">Reports Available</p>
            <p className="text-3xl font-bold font-mono text-primary">
              {reportsAvailable.length}
            </p>
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">All Completed Audits</h3>
          
          {completedAudits.length === 0 ? (
            <div className="glass rounded-xl border border-border p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No completed audits yet. Run audits on your leads to generate reports.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedAudits.map((lead, index) => {
                const audit = lead.audits?.[0];
                const hasPdf = !!audit?.pdf_url;

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    className="glass rounded-xl border border-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          hasPdf
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.business_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Audited on {new Date(audit?.created_at || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {audit?.grade && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-mono font-bold",
                            audit.grade === "A" || audit.grade === "B"
                              ? "border-leak-healthy/30 text-leak-healthy"
                              : audit.grade === "C"
                              ? "border-leak-warning/30 text-leak-warning"
                              : "border-leak-critical/30 text-leak-critical"
                          )}
                        >
                          Grade: {audit.grade}
                        </Badge>
                      )}
                      
                      {audit?.leak_amount && (
                        <span className="text-sm font-mono font-semibold text-leak-critical">
                          ${Number(audit.leak_amount).toLocaleString()}
                        </span>
                      )}

                      {hasPdf ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => window.open(audit.pdf_url!, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = audit.pdf_url!;
                              link.download = `${lead.business_name}-report.pdf`;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No PDF yet</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
