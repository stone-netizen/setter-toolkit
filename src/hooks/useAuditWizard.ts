import { useState, useCallback } from "react";

export interface AuditWizardData {
  // Step 1: Business Basics
  maps_url: string;
  website: string;
  category: string;
  business_name: string;

  // Step 2: Revenue & Leads
  avg_ticket_value: number;
  leads_per_month: number;
  historical_leads_count: number;

  // Step 3: Lead Response & Ops
  response_time: string;
  crm_active: boolean;
  crm_name: string;
  follow_up_attempts: number;
  missed_calls_percentage: number;

  // Step 4: Online & Social Presence
  review_response_active: boolean;
  email_marketing_active: boolean;
  has_chat_widget: boolean;
}

const initialData: AuditWizardData = {
  maps_url: "",
  website: "",
  category: "",
  business_name: "",
  avg_ticket_value: 5000,
  leads_per_month: 20,
  historical_leads_count: 0,
  response_time: "1-4 hrs",
  crm_active: false,
  crm_name: "",
  follow_up_attempts: 2,
  missed_calls_percentage: 20,
  review_response_active: false,
  email_marketing_active: false,
  has_chat_widget: false,
};

export const WIZARD_STEPS = [
  { id: 1, label: "Basics", description: "Business information" },
  { id: 2, label: "Revenue", description: "Revenue & leads" },
  { id: 3, label: "Ops", description: "Lead response" },
  { id: 4, label: "Online", description: "Online presence" },
  { id: 5, label: "Review", description: "Review & submit" },
];

export function useAuditWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AuditWizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateData = useCallback((updates: Partial<AuditWizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setData(initialData);
    setIsSubmitting(false);
  }, []);

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return data.business_name.trim().length > 0;
        case 2:
          return data.avg_ticket_value > 0;
        case 3:
          return data.response_time.length > 0;
        case 4:
          return true; // All optional toggles
        case 5:
          return true; // Review step
        default:
          return false;
      }
    },
    [data]
  );

  const canProceed = isStepValid(currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === WIZARD_STEPS.length;

  return {
    currentStep,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isStepValid,
    canProceed,
    isFirstStep,
    isLastStep,
    isSubmitting,
    setIsSubmitting,
  };
}
