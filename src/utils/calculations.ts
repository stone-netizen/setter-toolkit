/**
 * SETTER QUALIFICATION COCKPIT - MATH ENGINE
 * 
 * Logic: Mirroring "Qualified Bookings Core" Sheet
 * - Monthly Exposure = Missed Calls / Week * Avg Ticket * 4
 * - Economic Qualification = Exposure >= $7,500
 * - Booking Readiness = Decision Maker Confirmed AND Owner Attending
 */

export type QualificationStatus = "BOOKED" | "VERIFICATION WARRANTED" | "DISQUALIFIED - NO AUTHORITY" | "NOT WARRANTED" | "INCOMPLETE";

export interface CockpitResult {
  missedCalls: number;
  monthlyExposure: number;
  lowEndImpact: number;
  status: QualificationStatus;
  statusReason?: string;
  nextStep?: string;
  certaintyLabel: string;
  primaryConstraint: string;
}

export function calculateCockpitResult(data: {
  inquiresPerWeek: number;
  avgTicket: number;
  percentageRatio: number; // 0-10 out of 10
  dmConfirmed: boolean;
  ownerAttending: boolean;
  isBooked?: boolean;
  slowResponse?: boolean;
  afterHoursIssue?: boolean;
  followUpBroken?: boolean;
  manualConstraintOverride?: boolean;
  customConstraint?: string;
}): CockpitResult {
  // 1. Initial State Check
  if (data.inquiresPerWeek === 0 || data.percentageRatio === 0 || data.avgTicket === 0) {
    return {
      missedCalls: 0,
      monthlyExposure: 0,
      lowEndImpact: 0,
      status: "INCOMPLETE",
      statusReason: "Awaiting core volume data",
      nextStep: "Enter the 3 fields to generate a directional estimate.",
      certaintyLabel: "N/A",
      primaryConstraint: "Incomplete Data"
    };
  }

  // 1. "Out of 10" Missed Calls Math
  const missedCalls = Math.floor(data.inquiresPerWeek * (data.percentageRatio / 10));
  const certaintyLabel = `Out of 10 (${data.percentageRatio})`;

  const monthlyExposure = missedCalls * data.avgTicket * 4;
  const lowEndImpact = monthlyExposure * 0.20; // 20% conservative baseline

  // 2. Automated Constraint Identification
  let primaryConstraint = "Lead Capture Failure";

  if (data.manualConstraintOverride && data.customConstraint) {
    primaryConstraint = data.customConstraint;
  } else {
    // Priority sequence for single-constraint focus
    if (data.followUpBroken) primaryConstraint = "Follow-Up Breakdown";
    else if (data.afterHoursIssue) primaryConstraint = "After-Hours Coverage Gap";
    else if (data.slowResponse) primaryConstraint = "Slow Response Time";
    else if (missedCalls > 0) primaryConstraint = "Lead Capture Failure";
  }

  // 3. Setter Decision Logic (Phase-Based)
  let status: QualificationStatus = "NOT WARRANTED";
  let statusReason = "";
  let nextStep = "";

  if (lowEndImpact < 1500) {
    status = "NOT WARRANTED";
    statusReason = "INSUFFICIENT IMPACT";
    nextStep = "Surface consequence of inaction before proceeding.";
  } else if (!data.dmConfirmed || !data.ownerAttending) {
    status = "DISQUALIFIED - NO AUTHORITY";
    statusReason = "NO AUTHORITY (Owner not attending)";
    nextStep = "Do not book — owner must be present for verification.";
  } else if (data.isBooked) {
    status = "BOOKED";
    statusReason = "BOOKING CONFIRMED";
    nextStep = "Ready for Closer Briefing.";
  } else {
    status = "VERIFICATION WARRANTED";
    statusReason = "HIGH IMPACT DETECTED";
    nextStep = "This is worth a 15-minute verification against actual call logs.";
  }

  return {
    missedCalls,
    monthlyExposure,
    lowEndImpact,
    status,
    statusReason,
    nextStep,
    certaintyLabel,
    primaryConstraint
  };
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, // Default: no decimals
  }).format(value);
};

export const formatCurrencyCompact = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return formatCurrency(value);
};
