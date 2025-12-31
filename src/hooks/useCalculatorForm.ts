import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

export const INDUSTRIES = [
  "Med Spa",
  "Dentist",
  "Plastic Surgeon",
  "Chiropractor",
  "Construction",
  "HVAC",
  "Other"
] as const;

export const ROLES = [
  "Owner",
  "Partner",
  "Manager",
  "Other"
] as const;

export const LEAD_SOURCES = [
  "Paid Ads",
  "Referrals",
  "SEO",
  "Organic",
  "Social Media",
  "Other"
] as const;

export const AFTER_HOURS_OPTIONS = [
  "Voicemail",
  "Answering Service",
  "None",
  "Other"
] as const;

export const CLOSERS = [
  "Landon",
  "Closer A",
  "Closer B"
] as const;

export const calculatorFormSchema = z.object({
  // Phase 1: Calculator (Conviction)
  businessName: z.string().default(""), // Required for export
  inquiresPerWeek: z.number().default(0),
  percentageRatio: z.number().min(0).max(10).default(0),
  avgTicket: z.number().default(0),
  closeRate: z.number().min(0).max(100).default(25), // New field for accuracy
  afterHoursHandling: z.string().default(""),

  // Phase 2: Booking Gate (Mandatory)
  email: z.string().default(""), // Required for export
  phone: z.string().default(""),
  dmConfirmed: z.boolean().default(false),
  ownerAttending: z.boolean().default(false),
  demoDate: z.string().default(""),
  demoTime: z.string().default(""),
  assignedCloser: z.string().default(""),

  // Phase 3: Sales Intelligence (Context)
  industry: z.string().default(""), // Required for export
  contactRole: z.string().default(""), // Role (Required: Owner/Partner/GM)
  urgency: z.number().min(1).max(10).default(5),
  primaryLeadSource: z.string().default(""),
  mainPain: z.string().default(""),
  consequence: z.string().default(""),

  // Internal Logic / Additional
  website: z.string().default(""),
  location: z.string().default(""),
  contactName: z.string().default(""),
  closerFeedback: z.string().default(""),
  currentBriefId: z.string().optional(),
  currentPhase: z.number().min(1).max(3).default(1),
  isBooked: z.boolean().default(false),
});

export type CalculatorFormData = z.infer<typeof calculatorFormSchema>;

interface CalculatorStore {
  formData: CalculatorFormData;
  setFormData: (data: Partial<CalculatorFormData>) => void;
  resetForm: () => void;
}

const initialState: CalculatorFormData = {
  businessName: "",
  inquiresPerWeek: 0,
  percentageRatio: 0,
  avgTicket: 0,
  closeRate: 25,
  afterHoursHandling: "",
  email: "",
  phone: "",
  dmConfirmed: false,
  ownerAttending: false,
  demoDate: "",
  demoTime: "",
  assignedCloser: "",
  industry: "",
  contactRole: "",
  urgency: 5,
  primaryLeadSource: "",
  mainPain: "",
  consequence: "",
  website: "",
  location: "",
  contactName: "",
  closerFeedback: "",
  currentBriefId: undefined,
  currentPhase: 1,
  isBooked: false,
};

export const useCalculatorForm = create<CalculatorStore>()(
  persist(
    (set) => ({
      formData: initialState,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ formData: initialState }),
    }),
    {
      name: "calculator-system-v8-storage",
    }
  )
);
