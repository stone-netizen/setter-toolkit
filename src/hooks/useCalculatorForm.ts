import { useState, useEffect, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const INDUSTRIES = [
  "Med Spa",
  "Dental",
  "Mortgage Lending",
  "Real Estate",
  "Roofing",
  "Plumbing/HVAC",
  "Legal Services",
  "Financial Planning",
  "Fitness/Gyms",
  "Senior Care",
  "Auto Repair",
  "Chiropractor",
  "Marketing Agency",
  "SaaS",
  "Other",
] as const;

export const RESPONSE_TIMES = [
  { value: "<5min", label: "< 5 minutes" },
  { value: "5-30min", label: "5-30 minutes" },
  { value: "30min-2hr", label: "30 min - 2 hours" },
  { value: "2-24hr", label: "2-24 hours" },
  { value: "24hr+", label: "24+ hours" },
  { value: "dont-track", label: "Don't track" },
] as const;

export const MISSED_CALL_RATES = [
  { value: "0-10", label: "0-10% (rarely miss)" },
  { value: "10-25", label: "10-25% (miss some when busy)" },
  { value: "25-50", label: "25-50% (miss quite a few)" },
  { value: "50+", label: "50%+ (miss a lot)" },
  { value: "unknown", label: "No idea" },
] as const;

// Full form schema
export const calculatorFormSchema = z.object({
  // Step 1: Business Profile
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  yearsInBusiness: z.coerce.number().min(0, "Must be 0 or more").max(100, "Must be 100 or less"),
  monthlyRevenue: z.coerce.number().min(1000, "Monthly revenue must be at least $1,000"),
  avgTransactionValue: z.coerce.number().min(50, "Average transaction must be at least $50"),
  email: z.string().email("Please enter a valid email address"),

  // Step 2: Lead Volume
  totalMonthlyLeads: z.coerce.number().min(1, "Must have at least 1 lead"),
  inboundCalls: z.coerce.number().min(0, "Cannot be negative"),
  webFormSubmissions: z.coerce.number().min(0, "Cannot be negative"),
  socialInquiries: z.coerce.number().min(0, "Cannot be negative"),

  // Step 3: Sales Process
  closedDealsPerMonth: z.coerce.number().min(0, "Cannot be negative"),
  avgResponseTime: z.string().min(1, "Please select a response time"),
  followUpAllLeads: z.boolean(),
  percentageFollowedUp: z.coerce.number().min(0).max(100).optional(),
  avgFollowUpAttempts: z.coerce.number().min(0, "Cannot be negative").max(20, "Maximum is 20"),
  consultationLength: z.coerce.number().min(5, "Minimum 5 minutes").max(300, "Maximum 300 minutes"),

  // Step 4: Operations
  businessHoursStart: z.string().min(1, "Please set start time"),
  businessHoursEnd: z.string().min(1, "Please set end time"),
  openSaturday: z.boolean(),
  openSunday: z.boolean(),
  answersAfterHours: z.boolean().nullable(),
  answersWeekends: z.boolean().nullable(),
  missedCallRate: z.string().min(1, "Please select an option"),
  avgHoldTime: z.coerce.number().min(0, "Cannot be negative").max(30, "Maximum 30 minutes"),

  // Step 5: Appointments
  requiresAppointments: z.boolean().nullable(),
  appointmentsBooked: z.coerce.number().min(0).optional(),
  appointmentsShowUp: z.coerce.number().min(0).optional(),
  sendsReminders: z.boolean().nullable().optional(),
  reminderCount: z.coerce.number().min(1).max(5).optional(),
  reminderMethods: z.array(z.string()).optional(),
  chargesNoShowFee: z.boolean().nullable().optional(),
  daysUntilAppointment: z.coerce.number().min(0).max(90).optional(),

  // Step 6: Team Efficiency
  numSalesStaff: z.coerce.number().min(1, "At least 1 staff member").max(100, "Maximum 100"),
  avgHourlyLaborCost: z.coerce.number().min(10, "Minimum $10/hr").max(500, "Maximum $500/hr"),
  qualifiesLeads: z.boolean().nullable(),
  percentageUnqualified: z.coerce.number().min(0).max(100).optional(),
  usesCRM: z.boolean().nullable().optional(),
  crmName: z.string().optional(),

  // Step 7: Customer Value
  repeatCustomers: z.boolean().nullable(),
  avgPurchasesPerCustomer: z.coerce.number().min(1).max(50).optional(),
});

export type CalculatorFormData = z.infer<typeof calculatorFormSchema>;

const STORAGE_KEY = "leakdetector_calculator_form";

const defaultValues: CalculatorFormData = {
  // Step 1
  businessName: "",
  industry: "",
  yearsInBusiness: 0,
  monthlyRevenue: 0,
  avgTransactionValue: 0,
  email: "",
  // Step 2
  totalMonthlyLeads: 0,
  inboundCalls: 0,
  webFormSubmissions: 0,
  socialInquiries: 0,
  // Step 3
  closedDealsPerMonth: 0,
  avgResponseTime: "",
  followUpAllLeads: true,
  percentageFollowedUp: 100,
  avgFollowUpAttempts: 0,
  consultationLength: 30,
  // Step 4
  businessHoursStart: "09:00",
  businessHoursEnd: "18:00",
  openSaturday: false,
  openSunday: false,
  answersAfterHours: null,
  answersWeekends: null,
  missedCallRate: "",
  avgHoldTime: 0,
  // Step 5
  requiresAppointments: null,
  appointmentsBooked: 0,
  appointmentsShowUp: 0,
  sendsReminders: null,
  reminderCount: 2,
  reminderMethods: [],
  chargesNoShowFee: null,
  daysUntilAppointment: 7,
  // Step 6
  numSalesStaff: 1,
  avgHourlyLaborCost: 25,
  qualifiesLeads: null,
  percentageUnqualified: 20,
  usesCRM: null,
  crmName: "",
  // Step 7
  repeatCustomers: null,
  avgPurchasesPerCustomer: 1,
};

export const TOTAL_STEPS = 7;

export const useCalculatorForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          form.reset({ ...defaultValues, ...parsed.formData });
        }
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
      } catch (e) {
        console.error("Failed to parse saved form data");
      }
    }
  }, [form]);

  // Save to localStorage on every change
  const formValues = form.watch();
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData: formValues, currentStep })
    );
  }, [formValues, currentStep]);

  const canContinue = useCallback((): boolean => {
    const values = form.getValues();
    const errors = form.formState.errors;

    switch (currentStep) {
      case 1:
        return (
          values.businessName.length >= 2 &&
          values.industry.length > 0 &&
          values.yearsInBusiness >= 0 &&
          values.monthlyRevenue >= 1000 &&
          values.avgTransactionValue >= 50 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) &&
          !errors.businessName &&
          !errors.industry &&
          !errors.yearsInBusiness &&
          !errors.monthlyRevenue &&
          !errors.avgTransactionValue &&
          !errors.email
        );
      case 2:
        return (
          values.totalMonthlyLeads >= 1 &&
          values.inboundCalls >= 0 &&
          values.webFormSubmissions >= 0 &&
          values.socialInquiries >= 0
        );
      case 3:
        return (
          values.closedDealsPerMonth >= 0 &&
          values.avgResponseTime.length > 0 &&
          values.avgFollowUpAttempts >= 0 &&
          values.avgFollowUpAttempts <= 20 &&
          values.consultationLength >= 5 &&
          values.consultationLength <= 300
        );
      case 4:
        return (
          values.businessHoursStart.length > 0 &&
          values.businessHoursEnd.length > 0 &&
          values.answersAfterHours !== null &&
          values.answersWeekends !== null &&
          values.missedCallRate.length > 0 &&
          values.avgHoldTime >= 0 &&
          values.avgHoldTime <= 30
        );
      case 5:
        if (values.requiresAppointments === null) return false;
        if (values.requiresAppointments === false) return true;
        return (
          (values.appointmentsBooked ?? 0) >= 0 &&
          (values.appointmentsShowUp ?? 0) >= 0 &&
          values.sendsReminders !== null &&
          (values.daysUntilAppointment ?? 0) >= 0
        );
      case 6:
        return (
          values.numSalesStaff >= 1 &&
          values.avgHourlyLaborCost >= 10 &&
          values.qualifiesLeads !== null
        );
      case 7:
        return values.repeatCustomers !== null;
      default:
        return false;
    }
  }, [currentStep, form]);

  const nextStep = useCallback(async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetForm = useCallback(() => {
    form.reset(defaultValues);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
  }, [form]);

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  return {
    currentStep,
    form,
    nextStep,
    prevStep,
    canContinue,
    resetForm,
    progressPercentage,
    totalSteps: TOTAL_STEPS,
  };
};
