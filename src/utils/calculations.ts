import { CalculatorFormData } from "@/hooks/useCalculatorForm";

// Value range for confidence-adjusted estimates
export interface ValueRange {
  conservative: number;  // -30% of expected
  expected: number;      // Base calculation
  aggressive: number;    // +20% of expected
}

// Helper to create a range from a base value
export function createRange(baseValue: number): ValueRange {
  return {
    conservative: Math.round(baseValue * 0.70),  // -30%
    expected: Math.round(baseValue),
    aggressive: Math.round(baseValue * 1.20),    // +20%
  };
}

export interface LeakDetails {
  [key: string]: string | number | boolean | undefined;
}

export interface Leak {
  rank: number;
  type: string;
  label: string;
  monthlyLoss: number;
  annualLoss: number;
  monthlyLossRange: ValueRange;
  annualLossRange: ValueRange;
  severity: "critical" | "high" | "medium" | "low";
  details: LeakDetails;
  recommendation: string;
  quickWin?: boolean;
  constraintScore?: number;      // Weighted priority score
  constraintLabel?: string;      // "Primary Constraint", etc.
}

// Dormant Leads Result
export interface DormantLeadsResult {
  monthlyLoss: number;
  annualLoss: number;
  monthlyLossRange: ValueRange;
  annualLossRange: ValueRange;
  viableLeads: number;
  expectedCustomers: number;
  bestCaseCustomers: number;
  customersLost: number;
  currentlyRecovered: number;
  databaseAge: string;
  viabilityRate: number;
  expectedResponseRate: number;
  bestCaseResponseRate: number;
  recontactStatus: string;
  upside: number;
}

// Past Customers Result
export interface PastCustomersResult {
  monthlyLoss: number;
  annualLoss: number;
  monthlyLossRange: ValueRange;
  annualLossRange: ValueRange;
  winnableCustomers: number;
  customersLost: number;
  currentlyRecovered: number;
  timeSinceLastPurchase: string;
  winBackRate: number;
  returnPurchaseBonus: number;
  currentStatus: string;
  frequencyScore: number;
  recommendedFrequency: string;
  upside: number;
}

// Reactivation Leak Result
export interface ReactivationLeak {
  type: "reactivation";
  label: string;
  monthlyLoss: number;
  annualLoss: number;
  monthlyLossRange: ValueRange;
  annualLossRange: ValueRange;
  dormantLeads: DormantLeadsResult | null;
  pastCustomers: PastCustomersResult | null;
  severity: "critical" | "high" | "medium" | "low";
  quickWinScore: number;
  totalUpside: number;
  implementationTime: string;
  expectedROI: string;
  paybackPeriod: string;
  isQuickWin: boolean;
}

export interface CalculationResult {
  totalMonthlyLoss: number;
  totalAnnualLoss: number;
  totalMonthlyLossRange: ValueRange;
  totalAnnualLossRange: ValueRange;
  leaks: Leak[];
  reactivationOpportunity: ReactivationLeak | null;
  operationalLeaks: Leak[];
  allLeaks: Leak[];
  hasReactivationData: boolean;
}

// =====================================================
// CONSTRAINT WEIGHTS - Diagnostic Priority System
// =====================================================
// These weights represent operational leverage - areas where
// intervention has the highest ROI based on industry research.

export const CONSTRAINT_WEIGHTS: Record<string, number> = {
  "missed-calls": 0.35,       // Missed Calls / After Hours - 35%
  "after-hours": 0.35,        // Combined with missed calls
  "slow-response": 0.20,      // Response Time - 20%
  "no-follow-up": 0.15,       // Follow-Up Depth - 15%
  "no-show": 0.15,            // No-Shows - 15%
  "reactivation": 0.10,       // Reactivation - 10%
  "unqualified-leads": 0.05,  // CRM / Team - 5%
  "hold-time": 0.05,          // Included in CRM/Team
};

// Calculate weighted constraint score
export function calculateConstraintScore(leak: Leak): number {
  const weight = CONSTRAINT_WEIGHTS[leak.type] || 0.05;
  return leak.monthlyLoss * weight;
}

// Get constraint label based on score ranking
export function getConstraintLabel(rank: number): string {
  if (rank === 1) return "Primary Constraint";
  if (rank === 2) return "Secondary Constraint";
  if (rank === 3) return "Tertiary Constraint";
  return "Contributing Factor";
}

// Response time conversion - percentage of leads lost due to slow response
const RESPONSE_TIME_LOSS_RATES: Record<string, number> = {
  "<5min": 0.00,      // Optimal - no loss
  "5-30min": 0.10,    // 10% of leads go cold
  "30min-2hr": 0.25,  // 25% loss
  "2-24hr": 0.45,     // 45% loss
  "24hr+": 0.70,      // 70% loss
  "dont-track": 0.35, // Assume moderate loss
};

// Missed call rate conversion
const MISSED_CALL_RATES: Record<string, number> = {
  "0-10": 0.05,
  "10-25": 0.175,
  "25-50": 0.375,
  "50+": 0.65,
  "unknown": 0.30,
};

// Helper: Get average transaction value
function getAvgTransactionValue(data: CalculatorFormData): number {
  return data.avgTransactionValue || 0;
}

// Helper: Get customer lifetime value
function getLTV(data: CalculatorFormData): number {
  const avgTransaction = data.avgTransactionValue || 0;
  const repeatPurchases = data.avgPurchasesPerCustomer || 1;
  return avgTransaction * repeatPurchases;
}

// Helper: Get monthly revenue
function getMonthlyRevenue(data: CalculatorFormData): number {
  return data.monthlyRevenue || 1;
}

// Helper: Get close rate
function getCloseRate(data: CalculatorFormData): number {
  const totalLeads = data.totalMonthlyLeads || 1;
  const closedDeals = data.closedDealsPerMonth || 0;
  return Math.min(closedDeals / totalLeads, 0.5); // Cap at 50%
}

// Helper: Determine severity based on % of monthly revenue
function getSeverityByPercent(percent: number): "critical" | "high" | "medium" | "low" {
  if (percent >= 0.08) return "critical";  // 8%+ of revenue
  if (percent >= 0.04) return "high";      // 4-8%
  if (percent >= 0.02) return "medium";    // 2-4%
  return "low";                            // <2%
}

// =====================================================
// LEAK CALCULATIONS - CORRECTED FORMULAS
// =====================================================

// 1. MISSED CALLS - Lost new leads (use LTV, but value = leads × closeRate × LTV)
export function calculateMissedCallsLeak(data: CalculatorFormData): Leak {
  const missedCallRateKey = data.missedCallRate || "unknown";
  const missedCallRate = MISSED_CALL_RATES[missedCallRateKey] || 0.30;
  const inboundCalls = data.inboundCalls || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);
  const monthlyRevenue = getMonthlyRevenue(data);

  // Missed calls = lost lead opportunities
  const missedCalls = Math.round(inboundCalls * missedCallRate);
  
  // Value of each missed call = probability it would have closed × LTV
  const valuePerMissedCall = closeRate * ltv;
  const rawLoss = missedCalls * valuePerMissedCall;
  
  // Cap at 8% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.08);

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "missedCalls",
    label: "Missed Calls",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      missedCallRate: `${(missedCallRate * 100).toFixed(0)}%`,
      missedCallsPerMonth: missedCalls,
      valuePerCall: Math.round(valuePerMissedCall),
    },
    recommendation: missedCallRate > 0.25
      ? "Implement an answering service or AI call handling for 24/7 coverage."
      : "Your missed call rate is reasonable. Focus on other areas first.",
  };
}

// 2. SLOW RESPONSE - Lost leads due to delayed follow-up (use LTV)
export function calculateSlowResponseLeak(data: CalculatorFormData): Leak {
  const responseTime = data.avgResponseTime || "dont-track";
  const lossRate = RESPONSE_TIME_LOSS_RATES[responseTime] || 0.35;
  const totalLeads = data.totalMonthlyLeads || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);
  const monthlyRevenue = getMonthlyRevenue(data);

  // Leads lost due to slow response
  const leadsLost = totalLeads * lossRate;
  
  // Value = lost leads × probability of close × LTV
  const rawLoss = leadsLost * closeRate * ltv;
  
  // Cap at 8% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.08);

  const responseTimeLabels: Record<string, string> = {
    "<5min": "Under 5 minutes",
    "5-30min": "5-30 minutes",
    "30min-2hr": "30 min - 2 hours",
    "2-24hr": "2-24 hours",
    "24hr+": "Over 24 hours",
    "dont-track": "Not tracked",
  };

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "slowResponse",
    label: "Slow Response Time",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      currentResponseTime: responseTimeLabels[responseTime] || responseTime,
      leadsLostToSlowResponse: Math.round(leadsLost),
      lossRate: `${(lossRate * 100).toFixed(0)}%`,
    },
    recommendation: lossRate > 0.25
      ? "Speed is critical. Implement automated instant responses to dramatically improve contact rates."
      : "Your response time is good. Consider automation for consistency.",
  };
}

// 3. NO FOLLOW-UP - Lost leads from insufficient persistence (use LTV)
export function calculateNoFollowUpLeak(data: CalculatorFormData): Leak {
  const totalLeads = data.totalMonthlyLeads || 0;
  const followsAll = data.followUpAllLeads;
  const percentageFollowedUp = data.percentageFollowedUp || 100;
  const avgAttempts = data.avgFollowUpAttempts || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);
  const monthlyRevenue = getMonthlyRevenue(data);

  // Leads not followed up at all
  const followUpRate = followsAll ? 1.0 : percentageFollowedUp / 100;
  const leadsNotFollowedUp = totalLeads * (1 - followUpRate);

  // Optimal is 5-6 attempts. Penalty for fewer attempts on followed-up leads
  const optimalAttempts = 5;
  const attemptPenalty = avgAttempts < optimalAttempts 
    ? (optimalAttempts - avgAttempts) * 0.06 // 6% penalty per missing attempt
    : 0;
  
  // Leads with insufficient follow-up
  const leadsWithWeakFollowUp = totalLeads * followUpRate * attemptPenalty;
  
  // Total lost opportunity
  const totalLostLeads = leadsNotFollowedUp + leadsWithWeakFollowUp;
  const rawLoss = totalLostLeads * closeRate * ltv;
  
  // Cap at 8% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.08);

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "noFollowUp",
    label: "Insufficient Follow-Up",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      leadsNotFollowedUp: Math.round(leadsNotFollowedUp),
      currentAttempts: avgAttempts,
      optimalAttempts,
      followUpRate: `${(followUpRate * 100).toFixed(0)}%`,
    },
    recommendation: avgAttempts < 5
      ? "Top performers make 5-6 follow-up attempts. Implement an automated follow-up sequence."
      : "Your follow-up process is solid. Consider A/B testing your messaging.",
  };
}

// 4. NO-SHOWS - Lost bookings/appointments (use TRANSACTION VALUE, not LTV)
export function calculateNoShowLeak(data: CalculatorFormData): Leak {
  const requiresAppointments = data.requiresAppointments;
  
  if (!requiresAppointments) {
    return {
      rank: 0,
      type: "noShow",
      label: "Appointment No-Shows",
      monthlyLoss: 0,
      annualLoss: 0,
      monthlyLossRange: createRange(0),
      annualLossRange: createRange(0),
      severity: "low",
      details: { applicable: false },
      recommendation: "Not applicable to your business model.",
    };
  }

  const appointmentsBooked = data.appointmentsBooked || 0;
  const appointmentsShowUp = data.appointmentsShowUp || 0;
  const sendsReminders = data.sendsReminders;
  // Use single transaction value - these are lost BOOKINGS, not lost leads
  const transactionValue = getAvgTransactionValue(data);
  const monthlyRevenue = getMonthlyRevenue(data);

  const noShows = Math.max(0, appointmentsBooked - appointmentsShowUp);
  
  // 60% of no-shows are preventable with proper reminder systems
  const preventabilityRate = sendsReminders ? 0.30 : 0.60;
  const preventableNoShows = noShows * preventabilityRate;

  // Use transaction value (not LTV) for lost appointments
  const rawLoss = preventableNoShows * transactionValue;
  
  // Cap at 6% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.06);

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "noShow",
    label: "Appointment No-Shows",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      appointmentsBooked,
      noShows,
      preventableNoShows: Math.round(preventableNoShows),
      sendsReminders: sendsReminders ? "Yes" : "No",
    },
    recommendation: !sendsReminders
      ? "Implement automated SMS and email reminders 48hr and 24hr before appointments."
      : "Consider requiring deposits to reduce no-shows further.",
  };
}

// 5. UNQUALIFIED LEADS - Wasted time (opportunity cost, use transaction value)
export function calculateUnqualifiedLeadLeak(data: CalculatorFormData): Leak {
  const qualifiesLeads = data.qualifiesLeads;
  
  if (qualifiesLeads) {
    return {
      rank: 0,
      type: "unqualifiedLeads",
      label: "Unqualified Lead Time",
      monthlyLoss: 0,
      annualLoss: 0,
      monthlyLossRange: createRange(0),
      annualLossRange: createRange(0),
      severity: "low",
      details: { qualifiesLeads: true },
      recommendation: "Your lead qualification process is in place.",
    };
  }

  const totalLeads = data.totalMonthlyLeads || 0;
  const percentageUnqualified = data.percentageUnqualified || 20;
  const consultationLength = data.consultationLength || 30;
  const avgHourlyCost = data.avgHourlyLaborCost || 25;
  const monthlyRevenue = getMonthlyRevenue(data);

  const unqualifiedLeads = totalLeads * (percentageUnqualified / 100);
  const hoursWasted = (unqualifiedLeads * consultationLength) / 60;
  
  // Direct labor cost only (no opportunity cost to avoid inflation)
  const rawLoss = hoursWasted * avgHourlyCost;
  
  // Cap at 3% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.03);

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "unqualifiedLeads",
    label: "Unqualified Lead Time",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      unqualifiedLeadsPerMonth: Math.round(unqualifiedLeads),
      hoursWastedPerMonth: hoursWasted.toFixed(1),
      laborCost: Math.round(rawLoss),
    },
    recommendation: "Add a brief qualification step before booking consultations.",
  };
}

// 6. AFTER-HOURS - Lost leads from no coverage (use LTV)
export function calculateAfterHoursLeak(data: CalculatorFormData): Leak {
  const inboundCalls = data.inboundCalls || 0;
  const answersAfterHours = data.answersAfterHours;
  const answersWeekends = data.answersWeekends;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);
  const monthlyRevenue = getMonthlyRevenue(data);

  // Industry averages: 25% after hours, 15% weekends (some overlap)
  let missedRate = 0;
  if (!answersAfterHours) missedRate += 0.20;
  if (!answersWeekends) missedRate += 0.10;

  const missedCalls = inboundCalls * missedRate;
  const rawLoss = missedCalls * closeRate * ltv;
  
  // Cap at 6% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.06);

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "afterHours",
    label: "After-Hours & Weekend Calls",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      missedCallsAfterHours: Math.round(missedCalls),
      answersAfterHours: answersAfterHours ? "Yes" : "No",
      answersWeekends: answersWeekends ? "Yes" : "No",
    },
    recommendation: missedRate > 0.20
      ? "An answering service or AI receptionist can capture these leads."
      : "Consider adding coverage for remaining gaps.",
  };
}

// 7. HOLD TIME - Lost leads from hang-ups (use LTV)
export function calculateHoldTimeLeak(data: CalculatorFormData): Leak {
  const inboundCalls = data.inboundCalls || 0;
  const avgHoldTime = data.avgHoldTime || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);
  const monthlyRevenue = getMonthlyRevenue(data);

  // 8% hang-up rate per minute of hold (capped at 60%)
  const hangUpRate = Math.min(avgHoldTime * 0.08, 0.60);
  const callsAbandoned = inboundCalls * hangUpRate;
  const rawLoss = callsAbandoned * closeRate * ltv;
  
  // Cap at 4% of monthly revenue
  const monthlyLoss = Math.min(rawLoss, monthlyRevenue * 0.04);

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    rank: 0,
    type: "holdTime",
    label: "Long Hold Times",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    severity: getSeverityByPercent(monthlyLoss / monthlyRevenue),
    details: {
      avgHoldTimeMinutes: avgHoldTime,
      estimatedHangUpRate: `${(hangUpRate * 100).toFixed(0)}%`,
      callsAbandonedPerMonth: Math.round(callsAbandoned),
    },
    recommendation: avgHoldTime > 2
      ? "Consider a callback system or AI assistant for initial inquiries."
      : "Your hold times are acceptable.",
  };
}

// =====================================================
// REACTIVATION CALCULATIONS
// =====================================================

const DATABASE_VIABILITY_RATES: Record<string, number> = {
  "0-3months": 0.40,
  "3-6months": 0.30,
  "6-12months": 0.20,
  "1-2years": 0.12,
  "2+years": 0.06,
};

const WIN_BACK_RATES: Record<string, number> = {
  "3-6months": 0.22,
  "6-12months": 0.15,
  "1-2years": 0.10,
  "2+years": 0.05,
};

export function calculateDormantLeadsValue(data: CalculatorFormData): DormantLeadsResult {
  const totalDormantLeads = data.totalDormantLeads || 0;
  const databaseAge = data.databaseAge || "6-12months";
  const everRecontactedDormant = data.everRecontactedDormant || false;
  const percentageRecontactedDormant = data.percentageRecontactedDormant || 0;
  const dormantResponseCount = data.dormantResponseCount || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);

  const viabilityRate = DATABASE_VIABILITY_RATES[databaseAge] || 0.20;
  const viableLeads = totalDormantLeads * viabilityRate;

  // Reactivation response rate: 18% average
  const reactivationResponseRate = 0.18;
  const bestInClassResponseRate = 0.30;

  const expectedCustomers = viableLeads * reactivationResponseRate * closeRate;
  const bestCaseCustomers = viableLeads * bestInClassResponseRate * closeRate;

  let customersLost: number;
  let currentlyRecovered = 0;

  if (!everRecontactedDormant) {
    customersLost = expectedCustomers;
  } else {
    currentlyRecovered = dormantResponseCount;
    customersLost = Math.max(0, expectedCustomers - currentlyRecovered);
  }

  // Use single transaction value for dormant leads (they're not proven repeat customers yet)
  const avgTransaction = data.avgTransactionValue || 0;
  const monthlyLoss = customersLost * avgTransaction;
  const bestCaseRevenue = bestCaseCustomers * avgTransaction;

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    viableLeads: Math.round(viableLeads),
    expectedCustomers: Math.round(expectedCustomers),
    bestCaseCustomers: Math.round(bestCaseCustomers),
    customersLost: Math.round(customersLost),
    currentlyRecovered,
    databaseAge,
    viabilityRate: Math.round(viabilityRate * 100),
    expectedResponseRate: 18,
    bestCaseResponseRate: 30,
    recontactStatus: everRecontactedDormant
      ? `Reached ${percentageRecontactedDormant}% of database`
      : "Never contacted",
    upside: Math.round(bestCaseRevenue - (currentlyRecovered * avgTransaction)),
  };
}

export function calculatePastCustomerValue(data: CalculatorFormData): PastCustomersResult {
  const numPastCustomers = data.numPastCustomers || 0;
  const avgTimeSinceLastPurchase = data.avgTimeSinceLastPurchase || "6-12months";
  const sendsReengagementCampaigns = data.sendsReengagementCampaigns || false;
  const reengagementFrequency = data.reengagementFrequency || "rarely";
  const reengagementResponseRate = data.reengagementResponseRate || 0;
  const avgTransactionValue = data.avgTransactionValue || 0;

  const winBackRate = WIN_BACK_RATES[avgTimeSinceLastPurchase] || 0.15;
  const winnableCustomers = numPastCustomers * winBackRate;

  // Past customers spend 20% more on return (established trust)
  const returnPurchaseValue = avgTransactionValue * 1.2;

  let customersLost: number;
  let currentlyRecovered = 0;

  if (!sendsReengagementCampaigns) {
    customersLost = winnableCustomers;
  } else {
    currentlyRecovered = numPastCustomers * (reengagementResponseRate / 100);
    customersLost = Math.max(0, winnableCustomers - currentlyRecovered);
  }

  const monthlyLoss = customersLost * returnPurchaseValue;
  const bestCaseRevenue = winnableCustomers * returnPurchaseValue;

  const frequencyMultipliers: Record<string, number> = {
    "monthly": 1.0, "quarterly": 0.85, "twice-a-year": 0.70, "once-a-year": 0.50, "rarely": 0.30,
  };
  const frequencyImpact = sendsReengagementCampaigns ? frequencyMultipliers[reengagementFrequency] || 0.30 : 0;

  const roundedMonthlyLoss = Math.round(monthlyLoss);
  return {
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    winnableCustomers: Math.round(winnableCustomers),
    customersLost: Math.round(customersLost),
    currentlyRecovered: Math.round(currentlyRecovered),
    timeSinceLastPurchase: avgTimeSinceLastPurchase,
    winBackRate: Math.round(winBackRate * 100),
    returnPurchaseBonus: 20,
    currentStatus: sendsReengagementCampaigns
      ? `${reengagementFrequency} campaigns reaching ${reengagementResponseRate}%`
      : "No reactivation campaigns",
    frequencyScore: Math.round(frequencyImpact * 100),
    recommendedFrequency: "Monthly",
    upside: Math.round(bestCaseRevenue - (currentlyRecovered * returnPurchaseValue)),
  };
}

export function calculateReactivationLeak(data: CalculatorFormData): ReactivationLeak | null {
  const hasDormantLeads = data.hasDormantLeads === true;
  const hasPastCustomers = data.hasPastCustomers === true;

  if (!hasDormantLeads && !hasPastCustomers) return null;

  const dormantLeads = hasDormantLeads ? calculateDormantLeadsValue(data) : null;
  const pastCustomers = hasPastCustomers ? calculatePastCustomerValue(data) : null;
  const monthlyRevenue = getMonthlyRevenue(data);

  let totalMonthlyLoss = (dormantLeads?.monthlyLoss || 0) + (pastCustomers?.monthlyLoss || 0);
  
  // Cap reactivation at 10% of monthly revenue
  totalMonthlyLoss = Math.min(totalMonthlyLoss, monthlyRevenue * 0.10);

  const totalUpside = (dormantLeads?.upside || 0) + (pastCustomers?.upside || 0);

  let quickWinScore = 0;
  if (dormantLeads && dormantLeads.viabilityRate > 20) quickWinScore += 30;
  if (pastCustomers && pastCustomers.winBackRate > 12) quickWinScore += 30;
  if (dormantLeads && !data.everRecontactedDormant) quickWinScore += 20;
  if (pastCustomers && !data.sendsReengagementCampaigns) quickWinScore += 20;

  const severity: "critical" | "high" | "medium" | "low" =
    totalMonthlyLoss > 8000 ? "critical" : totalMonthlyLoss > 4000 ? "high" : "medium";

  const roundedMonthlyLoss = Math.round(totalMonthlyLoss);
  return {
    type: "reactivation",
    label: "Dormant Leads & Customer Reactivation",
    monthlyLoss: roundedMonthlyLoss,
    annualLoss: roundedMonthlyLoss * 12,
    monthlyLossRange: createRange(roundedMonthlyLoss),
    annualLossRange: createRange(roundedMonthlyLoss * 12),
    dormantLeads,
    pastCustomers,
    severity,
    quickWinScore,
    totalUpside: Math.round(totalUpside),
    implementationTime: "7-14 days",
    expectedROI: "3-5x in first 30 days",
    paybackPeriod: "7-10 days",
    isQuickWin: true,
  };
}

// =====================================================
// MAIN CALCULATION FUNCTION
// =====================================================

export function calculateAllLeaks(formData: CalculatorFormData): CalculationResult {
  const hasReactivationData = formData.hasDormantLeads === true || formData.hasPastCustomers === true;
  const reactivationOpportunity = calculateReactivationLeak(formData);
  const monthlyRevenue = getMonthlyRevenue(formData);

  const operationalLeaks: Leak[] = [
    calculateMissedCallsLeak(formData),
    calculateSlowResponseLeak(formData),
    calculateNoFollowUpLeak(formData),
    calculateNoShowLeak(formData),
    calculateUnqualifiedLeadLeak(formData),
    calculateAfterHoursLeak(formData),
    calculateHoldTimeLeak(formData),
  ];

  // Calculate constraint scores for each leak (revenue × weight)
  operationalLeaks.forEach(leak => {
    leak.constraintScore = calculateConstraintScore(leak);
  });

  let reactivationAsLeak: Leak | null = null;
  if (reactivationOpportunity) {
    reactivationAsLeak = {
      rank: 1,
      type: "reactivation",
      label: reactivationOpportunity.label,
      monthlyLoss: reactivationOpportunity.monthlyLoss,
      annualLoss: reactivationOpportunity.annualLoss,
      monthlyLossRange: reactivationOpportunity.monthlyLossRange,
      annualLossRange: reactivationOpportunity.annualLossRange,
      severity: reactivationOpportunity.severity,
      quickWin: true,
      details: {
        dormantLeadsValue: reactivationOpportunity.dormantLeads?.monthlyLoss || 0,
        pastCustomersValue: reactivationOpportunity.pastCustomers?.monthlyLoss || 0,
        quickWinScore: reactivationOpportunity.quickWinScore,
      },
      recommendation: "A simple email/SMS campaign to dormant leads can generate revenue within days.",
      constraintScore: reactivationOpportunity.monthlyLoss * (CONSTRAINT_WEIGHTS["reactivation"] || 0.10),
    };
  }

  let allLeaks: Leak[] = reactivationAsLeak
    ? [reactivationAsLeak, ...operationalLeaks]
    : operationalLeaks;

  // Sort by WEIGHTED constraint score (not raw dollar amount)
  allLeaks.sort((a, b) => (b.constraintScore || 0) - (a.constraintScore || 0));

  // Assign ranks and constraint labels based on weighted priority
  allLeaks.forEach((leak, index) => {
    leak.rank = index + 1;
    leak.constraintLabel = getConstraintLabel(index + 1);
  });

  // Update operationalLeaks reference to match new ranking
  const updatedOperationalLeaks = allLeaks.filter(l => l.type !== "reactivation");

  // Calculate total
  let totalMonthlyLoss = allLeaks.reduce((sum, leak) => sum + leak.monthlyLoss, 0);
  
  // GLOBAL CAP: Total loss cannot exceed 45% of monthly revenue
  const maxTotalLoss = monthlyRevenue * 0.45;
  
  if (totalMonthlyLoss > maxTotalLoss) {
    const reductionFactor = maxTotalLoss / totalMonthlyLoss;
    allLeaks = allLeaks.map(leak => {
      const newMonthlyLoss = Math.round(leak.monthlyLoss * reductionFactor);
      const newConstraintScore = newMonthlyLoss * (CONSTRAINT_WEIGHTS[leak.type] || 0.05);
      return {
        ...leak,
        monthlyLoss: newMonthlyLoss,
        annualLoss: newMonthlyLoss * 12,
        monthlyLossRange: createRange(newMonthlyLoss),
        annualLossRange: createRange(newMonthlyLoss * 12),
        constraintScore: newConstraintScore,
      };
    });
    totalMonthlyLoss = Math.round(maxTotalLoss);
  }

  const roundedTotal = Math.round(totalMonthlyLoss);
  return {
    totalMonthlyLoss: roundedTotal,
    totalAnnualLoss: roundedTotal * 12,
    totalMonthlyLossRange: createRange(roundedTotal),
    totalAnnualLossRange: createRange(roundedTotal * 12),
    leaks: allLeaks,
    reactivationOpportunity,
    operationalLeaks: allLeaks.filter(l => l.type !== "reactivation"),
    allLeaks,
    hasReactivationData,
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format a currency range (e.g., "$17,430 – $29,880")
export function formatCurrencyRange(range: ValueRange): string {
  return `${formatCurrency(range.conservative)} – ${formatCurrency(range.aggressive)}`;
}

// Compact format for ranges (e.g., "$17k–$30k")
export function formatCurrencyRangeCompact(range: ValueRange): string {
  const formatShort = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${Math.round(n / 1000)}k`;
    return formatCurrency(n);
  };
  return `${formatShort(range.conservative)}–${formatShort(range.aggressive)}`;
}

export function getSeverityColor(severity: Leak["severity"]): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case "critical":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    case "high":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
    case "medium":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    case "low":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
  }
}

export function getSeverityLabel(severity: Leak["severity"]): string {
  switch (severity) {
    case "critical": return "Critical";
    case "high": return "High Priority";
    case "medium": return "Medium Priority";
    case "low": return "Low Priority";
  }
}
