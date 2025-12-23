export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audits: {
        Row: {
          capture_leak: number | null
          created_at: string
          evidence: Json | null
          gbp_data: Json | null
          grade: string | null
          id: string
          lead_id: string
          leak_amount: number | null
          leak_score: number | null
          pdf_url: string | null
          response_leak: number | null
          trust_leak: number | null
          user_id: string
          website_data: Json | null
        }
        Insert: {
          capture_leak?: number | null
          created_at?: string
          evidence?: Json | null
          gbp_data?: Json | null
          grade?: string | null
          id?: string
          lead_id: string
          leak_amount?: number | null
          leak_score?: number | null
          pdf_url?: string | null
          response_leak?: number | null
          trust_leak?: number | null
          user_id: string
          website_data?: Json | null
        }
        Update: {
          capture_leak?: number | null
          created_at?: string
          evidence?: Json | null
          gbp_data?: Json | null
          grade?: string | null
          id?: string
          lead_id?: string
          leak_amount?: number | null
          leak_score?: number | null
          pdf_url?: string | null
          response_leak?: number | null
          trust_leak?: number | null
          user_id?: string
          website_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          avg_ticket_value: number | null
          business_name: string
          category: string | null
          created_at: string
          crm_active: boolean | null
          crm_name: string | null
          email_marketing_active: boolean | null
          follow_up_attempts: number | null
          has_chat_widget: boolean | null
          historical_leads_count: number | null
          id: string
          industry: string | null
          leads_per_month: number | null
          maps_url: string | null
          missed_calls_percentage: number | null
          phone: string | null
          response_time: string | null
          review_response_active: boolean | null
          status: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          avg_ticket_value?: number | null
          business_name: string
          category?: string | null
          created_at?: string
          crm_active?: boolean | null
          crm_name?: string | null
          email_marketing_active?: boolean | null
          follow_up_attempts?: number | null
          has_chat_widget?: boolean | null
          historical_leads_count?: number | null
          id?: string
          industry?: string | null
          leads_per_month?: number | null
          maps_url?: string | null
          missed_calls_percentage?: number | null
          phone?: string | null
          response_time?: string | null
          review_response_active?: boolean | null
          status?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          avg_ticket_value?: number | null
          business_name?: string
          category?: string | null
          created_at?: string
          crm_active?: boolean | null
          crm_name?: string | null
          email_marketing_active?: boolean | null
          follow_up_attempts?: number | null
          has_chat_widget?: boolean | null
          historical_leads_count?: number | null
          id?: string
          industry?: string | null
          leads_per_month?: number | null
          maps_url?: string | null
          missed_calls_percentage?: number | null
          phone?: string | null
          response_time?: string | null
          review_response_active?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency_name: string | null
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agency_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agency_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          avg_project_value: number
          created_at: string
          id: string
          missed_calls_per_month: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_project_value?: number
          created_at?: string
          id?: string
          missed_calls_per_month?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_project_value?: number
          created_at?: string
          id?: string
          missed_calls_per_month?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
