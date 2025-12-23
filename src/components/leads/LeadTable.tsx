import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadWithAudit } from "@/hooks/useLeads";
import { cn } from "@/lib/utils";
import { ExternalLink, Trash2, Play, FileText } from "lucide-react";

interface LeadTableProps {
  leads: LeadWithAudit[];
  onDelete?: (id: string) => void;
  onRunAudit?: (lead: LeadWithAudit) => void;
  onViewReport?: (lead: LeadWithAudit) => void;
  loading?: boolean;
}

export function LeadTable({
  leads,
  onDelete,
  onRunAudit,
  onViewReport,
  loading,
}: LeadTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-muted text-muted-foreground",
      scanning: "bg-primary/20 text-primary animate-pulse",
      completed: "bg-success/20 text-success",
      failed: "bg-destructive/20 text-destructive",
    };

    return (
      <Badge className={cn("font-medium", styles[status as keyof typeof styles] || styles.pending)}>
        {status === "scanning" ? "Scanning..." : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return null;

    const styles = {
      A: "bg-leak-healthy/20 text-leak-healthy border-leak-healthy/30",
      B: "bg-leak-healthy/10 text-leak-healthy/80 border-leak-healthy/20",
      C: "bg-leak-warning/20 text-leak-warning border-leak-warning/30",
      D: "bg-leak-critical/20 text-leak-critical border-leak-critical/30",
      F: "bg-leak-critical/30 text-leak-critical border-leak-critical/40 pulse-critical",
    };

    return (
      <Badge
        variant="outline"
        className={cn("font-mono font-bold text-lg w-8 h-8 flex items-center justify-center", styles[grade as keyof typeof styles])}
      >
        {grade}
      </Badge>
    );
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return "—";
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`;
    }
    return `$${val.toLocaleString()}`;
  };

  if (leads.length === 0 && !loading) {
    return (
      <div className="glass rounded-xl border border-border p-12 text-center">
        <p className="text-muted-foreground">No leads yet. Add your first lead to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Business</TableHead>
            <TableHead className="text-muted-foreground">Industry</TableHead>
            <TableHead className="text-muted-foreground text-center">Grade</TableHead>
            <TableHead className="text-muted-foreground text-right">Leak Amount</TableHead>
            <TableHead className="text-muted-foreground text-center">Status</TableHead>
            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => {
            const latestAudit = lead.audits?.[0];
            const isScanning = lead.status === "scanning";

            return (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={cn(
                  "border-border relative overflow-hidden",
                  isScanning && "bg-primary/5"
                )}
              >
                {/* Scan line animation */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="scan-line absolute inset-y-0 w-32" />
                  </div>
                )}

                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-foreground">{lead.business_name}</span>
                    {lead.website && (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                      >
                        {new URL(lead.website).hostname}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {lead.industry || lead.category || "—"}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  {getGradeBadge(latestAudit?.grade || null)}
                </TableCell>

                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      latestAudit?.leak_amount && latestAudit.leak_amount > 50000
                        ? "text-leak-critical"
                        : latestAudit?.leak_amount && latestAudit.leak_amount > 20000
                        ? "text-leak-warning"
                        : "text-foreground"
                    )}
                  >
                    {formatCurrency(latestAudit?.leak_amount ? Number(latestAudit.leak_amount) : null)}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  {getStatusBadge(lead.status)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {lead.status === "completed" && latestAudit?.pdf_url && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewReport?.(lead)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                    {lead.status !== "scanning" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRunAudit?.(lead)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete?.(lead.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
