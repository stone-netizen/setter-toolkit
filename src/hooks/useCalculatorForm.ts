import { useState, useEffect, useCallback } from "react";

export interface CalculatorFormData {
  // Step 1: Business Info
  businessName: string;
  mapsUrl: string;
  websiteUrl: string;
  
  // Step 2: Revenue & Leads
  avgTicketValue: string;
  leadsPerMonth: string;
  historicalLeadsCount: string;
  
  // Step 3: Response Time
  responseTime: string;
  
  // Step 4: CRM & Follow-up
  usesCrm: boolean | null;
  crmName: string;
  followUpAttempts: string;
  
  // Step 5: Missed Calls
  missedCallsPercentage: string;
  
  // Step 6: Online Presence
  respondsToReviews: boolean | null;
  usesEmailMarketing: boolean | null;
  hasChatWidget: boolean | null;
  
  // Step 7: Contact Info
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

const STORAGE_KEY = "leakdetector_calculator_form";

const initialFormData: CalculatorFormData = {
  businessName: "",
  mapsUrl: "",
  websiteUrl: "",
  avgTicketValue: "",
  leadsPerMonth: "",
  historicalLeadsCount: "",
  responseTime: "",
  usesCrm: null,
  crmName: "",
  followUpAttempts: "",
  missedCallsPercentage: "",
  respondsToReviews: null,
  usesEmailMarketing: null,
  hasChatWidget: null,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

export const TOTAL_STEPS = 7;

export const useCalculatorForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CalculatorFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CalculatorFormData, string>>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed.formData }));
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
      } catch (e) {
        console.error("Failed to parse saved form data");
      }
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, currentStep })
    );
  }, [formData, currentStep]);

  const updateField = useCallback(
    <K extends keyof CalculatorFormData>(field: K, value: CalculatorFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when field is updated
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Partial<Record<keyof CalculatorFormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          newErrors.businessName = "Business name is required";
        }
        break;
      case 2:
        if (!formData.avgTicketValue || isNaN(Number(formData.avgTicketValue))) {
          newErrors.avgTicketValue = "Please enter a valid number";
        }
        if (!formData.leadsPerMonth || isNaN(Number(formData.leadsPerMonth))) {
          newErrors.leadsPerMonth = "Please enter a valid number";
        }
        break;
      case 3:
        if (!formData.responseTime) {
          newErrors.responseTime = "Please select a response time";
        }
        break;
      case 4:
        if (formData.usesCrm === null) {
          newErrors.usesCrm = "Please select an option";
        }
        break;
      case 5:
        if (!formData.missedCallsPercentage) {
          newErrors.missedCallsPercentage = "Please enter a percentage";
        }
        break;
      case 6:
        if (formData.respondsToReviews === null) {
          newErrors.respondsToReviews = "Please select an option";
        }
        break;
      case 7:
        if (!formData.contactEmail.trim()) {
          newErrors.contactEmail = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          newErrors.contactEmail = "Please enter a valid email";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const canContinue = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return formData.businessName.trim().length > 0;
      case 2:
        return (
          formData.avgTicketValue.length > 0 &&
          formData.leadsPerMonth.length > 0 &&
          !isNaN(Number(formData.avgTicketValue)) &&
          !isNaN(Number(formData.leadsPerMonth))
        );
      case 3:
        return formData.responseTime.length > 0;
      case 4:
        return formData.usesCrm !== null;
      case 5:
        return formData.missedCallsPercentage.length > 0;
      case 6:
        return formData.respondsToReviews !== null;
      case 7:
        return (
          formData.contactEmail.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
        );
      default:
        return false;
    }
  }, [currentStep, formData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep) && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  return {
    currentStep,
    formData,
    errors,
    updateField,
    nextStep,
    prevStep,
    canContinue,
    validateStep,
    resetForm,
    progressPercentage,
    totalSteps: TOTAL_STEPS,
  };
};
