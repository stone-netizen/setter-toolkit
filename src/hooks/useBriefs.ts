import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CalculatorFormData } from "./useCalculatorForm";
import { calculateCockpitResult } from "@/utils/calculations";

export function useSaveBrief() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: CalculatorFormData) => {
            if (!user) throw new Error("Not authenticated");

            const result = calculateCockpitResult(formData as any);

            const briefData: any = {
                business_name: formData.businessName,
                website: formData.website || null,
                email: formData.email || null,
                industry: formData.industry || null,
                location: formData.location || null,
                contact_name: formData.contactName || null,
                phone: formData.phone || null,

                urgency: formData.urgency,
                lead_source: formData.primaryLeadSource || null,
                contact_role: formData.contactRole || null,
                main_pain: formData.mainPain || null,
                consequence: formData.consequence || null,

                inquiries_per_week: Math.round(formData.inquiresPerWeek),
                missed_calls: Math.round(result.missedCalls),
                avg_ticket: formData.avgTicket,
                after_hours_handling: formData.afterHoursHandling || null,

                // monthly_exposure is handled by DB trigger

                qualification_status: (result.status as string === "DISQUALIFIED" || result.status as string === "DISQUALIFIED - NO AUTHORITY") ? "DISQUALIFIED" : "QUALIFIED",
                dm_confirmed: formData.dmConfirmed,
                owner_attending: formData.ownerAttending,

                demo_date: formData.demoDate || null,
                demo_time: formData.demoTime || null,
                assigned_closer: formData.assignedCloser || null,

                closer_feedback: formData.closerFeedback || null,
                export_status: result.status === "DISQUALIFIED - NO AUTHORITY" ? "DISQUALIFIED" : result.status,

                created_by: user.id,
                updated_at: new Date().toISOString() // Let DB handle it actually
            };

            if (formData.currentBriefId) {
                briefData.id = formData.currentBriefId;
            }

            const { data, error } = await supabase
                .from("briefs" as any)
                .upsert(briefData)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["briefs"] });
            toast({
                title: "Brief Saved",
                description: "Your brief has been synced to the database.",
            });
        },
        onError: (error) => {
            toast({
                title: "Sync Error",
                description: error.message,
                variant: "destructive",
            });
        }
    });
}
