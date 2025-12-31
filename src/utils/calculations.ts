import { formatCurrency } from "@/utils/calculations"; // Using existing format helper if available, or will redefine if strictly needed. Actually, let's redefine internal helpers to allow this file to be self-contained for the engine.

// --- Helper for Currency ---
export const formatCurrencyStrict = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatCurrencyCompact = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: "compact",
    maximumFractionDigits: 1
  }).format(val);
};

// --- Canonical Types ---

export interface ExposureInput {
  inquiriesWeekly: number;
  missedPer10: number; // 0-10
  avgTicket: number;
  closeRate: number; // 0.0 - 1.0 (decimal)
}

export interface ExposureResult {
  missedRate: number;      // e.g. 0.3
  missedWeekly: number;    // e.g. 30.0
  missedMonthly: number;   // e.g. 120.0
  daily: number;           // $
  monthly: number;         // $
  yearly: number;          // $
}

export interface CockpitResult {
  status: "INCOMPLETE" | "DISQUALIFIED" | "QUALIFIED" | "BOOKED";
  dailyExposure: number;
  monthlyExposure: number;
  yearlyExposure: number;
  missedCalls: number; // Monthly missed calls for display compatibility
  fullExposure: number; // For Ledger compatibility
  conservativeExposure: number; // For Ledger compatibility
  nextStep: string;
}

// --- Unified Math Engine ---

export function computeExposure(input: ExposureInput): ExposureResult {
  // Guardrails: Default to 0 if NaN/undefined and Clamp
  const inquiries = Math.max(0, input.inquiriesWeekly || 0);
  const missed10 = Math.min(10, Math.max(0, input.missedPer10 || 0));
  const ticket = Math.max(0, input.avgTicket || 0);
  const rate = Math.min(1.0, Math.max(0, input.closeRate || 0));

  // 1. Missed Rate
  const missedRate = missed10 / 10;

  // 2. Missed Weekly (Round to 1 decimal)
  // Logic: inquiries * rate
  const rawMissedWeekly = inquiries * missedRate;
  const missedWeekly = Math.round(rawMissedWeekly * 10) / 10;

  // 3. Missed Monthly (Fixed x4 multiplier)
  // Logic: missedWeekly * 4
  const missedMonthly = Math.round((missedWeekly * 4) * 10) / 10;

  // 4. Monthly Exposure
  // Logic: missedMonthly * ticket * closeRate
  const monthly = Math.round(missedMonthly * ticket * rate);

  // 5. Daily / Yearly
  // Daily = Monthly / 30
  // Yearly = Monthly * 12
  const daily = Math.round(monthly / 30);
  const yearly = Math.round(monthly * 12);

  return {
    missedRate,
    missedWeekly,
    missedMonthly,
    daily,
    monthly,
    yearly
  };
}

// --- Main Calculator Function (The "Brain") ---

export function calculateCockpitResult(data: {
  inquiresPerWeek: number;
  avgTicket: number;
  percentageRatio: number; // 0-10
  dmConfirmed: boolean;
  ownerAttending: boolean;
  isBooked?: boolean;
  exposureMode: "floor" | "full";
  closeRate: number; // 0-100 (integer from slider)
  industryRate?: number; // 0.0-1.0 (decimal from defaults)
  businessName: string;
}): CockpitResult {

  // Normalization
  const inputs = {
    inquiries: Math.max(0, data.inquiresPerWeek || 0),
    ratio: Math.min(10, Math.max(0, data.percentageRatio || 0)),
    ticket: Math.max(0, data.avgTicket || 0),
    closeRate: Math.max(0, data.closeRate || 0) / 100, // Convert integer % to decimal
    industryRate: Math.max(0, data.industryRate || 0.25) // Default to 25% if missing
  };

  // 1. Calculate Conservative (Floor) using User's Slider
  const conservativeResult = computeExposure({
    inquiriesWeekly: inputs.inquiries,
    missedPer10: inputs.ratio,
    avgTicket: inputs.ticket,
    closeRate: inputs.closeRate
  });

  // 2. Calculate Full (Uncapped) using 100% (1.0) Rate as per v10.5 Spec
  const fullResult = computeExposure({
    inquiriesWeekly: inputs.inquiries,
    missedPer10: inputs.ratio,
    avgTicket: inputs.ticket,
    closeRate: 1.0 // FULL EXPOSURE = 100% of missed calls
  });

  // 3. Determine Active Display based on Toggle
  const activeResult = data.exposureMode === 'full' ? fullResult : conservativeResult;

  // 4. Determine Status
  let status: CockpitResult["status"] = "INCOMPLETE";
  let nextStep = "Input Data...";

  // Check completeness
  const hasData = inputs.inquiries > 0 && inputs.ratio > 0 && inputs.ticket > 0;

  if (hasData) {
    // Disqualification Logic
    const isVolumeTooLow = inputs.inquiries < 10;
    const isMissedTooLow = inputs.ratio < 2; // < 2/10
    const isTicketTooLow = inputs.ticket < 300;
    const isExposureTooLow = conservativeResult.monthly < 3000;

    if (isVolumeTooLow || isMissedTooLow || isTicketTooLow || isExposureTooLow) {
      status = "DISQUALIFIED";
      nextStep = "Lead Disqualified: Below Thresholds";
    } else {
      status = "QUALIFIED";
      nextStep = "Unlock Value -> Book Verification";
    }
  }

  if (data.isBooked) {
    status = "BOOKED";
    nextStep = "Verification Call Booked";
  }

  return {
    status,
    dailyExposure: activeResult.daily,
    monthlyExposure: activeResult.monthly,
    yearlyExposure: activeResult.yearly,
    missedCalls: activeResult.missedMonthly, // Using Monthly for display as per context, or we can use weekly. The UI uses this for "Missed Calls" label. Let's align with v10.2: "Missed calls per month" is a key step.
    fullExposure: fullResult.monthly,
    conservativeExposure: conservativeResult.monthly,
    nextStep
  };
}

// Re-export old formatter for compatibility if needed, but prefer strict
export const formatCurrency = formatCurrencyStrict; 
