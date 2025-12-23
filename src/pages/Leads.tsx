import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LeadTable } from "@/components/leads/LeadTable";
import { AddLeadDialog } from "@/components/leads/AddLeadDialog";
import { useLeads, useDeleteLead } from "@/hooks/useLeads";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Leads() {
  const { data: leads = [], isLoading } = useLeads();
  const { mutate: deleteLead } = useDeleteLead();
  const [search, setSearch] = useState("");

  const filteredLeads = leads.filter((lead) =>
    lead.business_name.toLowerCase().includes(search.toLowerCase()) ||
    lead.industry?.toLowerCase().includes(search.toLowerCase()) ||
    lead.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground">Manage and audit your business leads</p>
          </div>
          <AddLeadDialog />
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Lead Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LeadTable
            leads={filteredLeads}
            onDelete={(id) => deleteLead(id)}
            loading={isLoading}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          Showing {filteredLeads.length} of {leads.length} leads
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
