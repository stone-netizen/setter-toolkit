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

// Step schemas
const step1Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  yearsInBusiness: z.number().min(0, "Must be 0 or more").max(100, "Must be 100 or less"),
  monthlyRevenue: z.number().min(1000, "Monthly revenue must be at least $1,000"),
  avgTransactionValue: z.number().min(50, "Average transaction must be at least $50"),
  email: z.string().email("Please enter a valid email address"),
});

const step2Schema = z.object({
  totalMonthlyLeads: z.number().min(1, "Must have at least 1 lead"),
  inboundCalls: z.number().min(0, "Cannot be negative"),
  webFormSubmissions: z.number().min(0, "Cannot be negative"),
  socialInquiries: z.number().min(0, "Cannot be negative"),
});

const step3Schema = z.object({
  closedDealsPerMonth: z.number().min(0, "Cannot be negative"),
  avgResponseTime: z.string().min(1, "Please select a response time"),
  followUpAllLeads: z.boolean(),
  percentageFollowedUp: z.number().min(0).max(100).optional(),
  avgFollowUpAttempts: z.number().min(0, "Cannot be negative").max(20, "Maximum is 20"),
  consultationLength: z.number().min(5, "Minimum 5 minutes").max(300, "Maximum 300 minutes"),
});

const step4Schema = z.object({
  usesCrm: z.boolean().nullable(),
  crmName: z.string().optional(),
  followUpAttempts: z.string().optional(),
});

const step5Schema = z.object({
  missedCallsPercentage: z.string().min(1, "Please select a percentage"),
});

const step6Schema = z.object({
  respondsToReviews: z.boolean().nullable(),
  usesEmailMarketing: z.boolean().nullable(),
  hasChatWidget: z.boolean().nullable(),
});

const step7Schema = z.object({
  contactName: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

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

  // Step 4: CRM & Follow-up (legacy)
  usesCrm: z.boolean().nullable().optional(),
  crmName: z.string().optional(),

  // Step 5: Missed Calls
  missedCallsPercentage: z.string().optional(),

  // Step 6: Online Presence
  respondsToReviews: z.boolean().nullable().optional(),
  usesEmailMarketing: z.boolean().nullable().optional(),
  hasChatWidget: z.boolean().nullable().optional(),

  // Step 7: Contact Info
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
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
  usesCrm: null,
  crmName: "",
  // Step 5
  missedCallsPercentage: "0",
  // Step 6
  respondsToReviews: null,
  usesEmailMarketing: null,
  hasChatWidget: null,
  // Step 7
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

export const TOTAL_STEPS = 7;

const stepValidationFields: Record<number, (keyof CalculatorFormData)[]> = {
  1: ["businessName", "industry", "yearsInBusiness", "monthlyRevenue", "avgTransactionValue", "email"],
  2: ["totalMonthlyLeads", "inboundCalls", "webFormSubmissions", "socialInquiries"],
  3: ["closedDealsPerMonth", "avgResponseTime", "followUpAllLeads", "avgFollowUpAttempts", "consultationLength"],
  4: ["usesCrm"],
  5: ["missedCallsPercentage"],
  6: ["respondsToReviews"],
  7: [],
};

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

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const fields = stepValidationFields[step] || [];
    if (fields.length === 0) return true;
    
    const result = await form.trigger(fields);
    return result;
  }, [form]);

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
        return values.usesCrm !== null;
      case 5:
        return values.missedCallsPercentage !== undefined && values.missedCallsPercentage.length > 0;
      case 6:
        return values.respondsToReviews !== null;
      case 7:
        return true;
      default:
        return false;
    }
  }, [currentStep, form]);

  const nextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, validateStep]);

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
    validateStep,
    resetForm,
    progressPercentage,
    totalSteps: TOTAL_STEPS,
  };
};
