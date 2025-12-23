import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Lead {
  id: string;
  user_id: string;
  business_name: string;
  website: string | null;
  industry: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  status: "pending" | "scanning" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface Audit {
  id: string;
  lead_id: string;
  user_id: string;
  leak_score: number | null;
  leak_amount: number | null;
  grade: "A" | "B" | "C" | "D" | "F" | null;
  trust_leak: number | null;
  capture_leak: number | null;
  response_leak: number | null;
  gbp_data: Record<string, unknown> | null;
  website_data: Record<string, unknown> | null;
  evidence: Record<string, unknown> | null;
  pdf_url: string | null;
  created_at: string;
}

export interface LeadWithAudit extends Lead {
  audits?: Audit[];
}

export function useLeads() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("leads")
        .select(`
          *,
          audits (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeadWithAudit[];
    },
    enabled: !!user,
  });
}

export function useCreateLead() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: {
      business_name: string;
      website?: string;
      industry?: string;
      category?: string;
      address?: string;
      phone?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("leads")
        .insert({
          user_id: user.id,
          business_name: lead.business_name,
          website: lead.website || null,
          industry: lead.industry || null,
          category: lead.category || null,
          address: lead.address || null,
          phone: lead.phone || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead Created",
        description: "New lead has been added to your pipeline.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteLead() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead Deleted",
        description: "Lead has been removed from your pipeline.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLeadStats() {
  const { data: leads = [] } = useLeads();

  const totalLeads = leads.length;
  const completedAudits = leads.filter((l) => l.status === "completed").length;
  
  const totalLeakAmount = leads.reduce((sum, lead) => {
    const latestAudit = lead.audits?.[0];
    return sum + (Number(latestAudit?.leak_amount) || 0);
  }, 0);

  const avgLeakScore = leads.reduce((sum, lead) => {
    const latestAudit = lead.audits?.[0];
    return sum + (latestAudit?.leak_score || 0);
  }, 0) / (completedAudits || 1);

  const criticalLeaks = leads.filter((lead) => {
    const latestAudit = lead.audits?.[0];
    return latestAudit?.grade === "D" || latestAudit?.grade === "F";
  }).length;

  return {
    totalLeads,
    completedAudits,
    totalLeakAmount,
    avgLeakScore: Math.round(avgLeakScore),
    criticalLeaks,
  };
}
