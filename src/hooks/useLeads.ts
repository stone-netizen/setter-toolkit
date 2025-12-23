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
      maps_url?: string;
      avg_ticket_value?: number;
      leads_per_month?: number;
      historical_leads_count?: number;
      response_time?: string;
      crm_name?: string;
      crm_active?: boolean;
      follow_up_attempts?: number;
      missed_calls_percentage?: number;
      review_response_active?: boolean;
      email_marketing_active?: boolean;
      has_chat_widget?: boolean;
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
          maps_url: lead.maps_url || null,
          avg_ticket_value: lead.avg_ticket_value ?? 5000,
          leads_per_month: lead.leads_per_month ?? 20,
          historical_leads_count: lead.historical_leads_count ?? 0,
          response_time: lead.response_time ?? "1-4 hrs",
          crm_name: lead.crm_name || null,
          crm_active: lead.crm_active ?? false,
          follow_up_attempts: lead.follow_up_attempts ?? 2,
          missed_calls_percentage: lead.missed_calls_percentage ?? 20,
          review_response_active: lead.review_response_active ?? false,
          email_marketing_active: lead.email_marketing_active ?? false,
          has_chat_widget: lead.has_chat_widget ?? false,
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
