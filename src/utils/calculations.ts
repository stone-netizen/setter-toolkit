import { CalculatorFormData } from "@/hooks/useCalculatorForm";

export interface LeakDetails {
  [key: string]: string | number | boolean | undefined;
}

export interface Leak {
  rank: number;
  type: string;
  label: string;
  monthlyLoss: number;
  annualLoss: number;
  severity: "critical" | "high" | "medium" | "low";
  details: LeakDetails;
  recommendation: string;
  quickWin?: boolean;
}

// Dormant Leads Result
export interface DormantLeadsResult {
  monthlyLoss: number;
  annualLoss: number;
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
  leaks: Leak[];
  reactivationOpportunity: ReactivationLeak | null;
  operationalLeaks: Leak[];
  allLeaks: Leak[];
  hasReactivationData: boolean;
}

// Response time conversion penalties
const RESPONSE_TIME_MULTIPLIERS: Record<string, number> = {
  "<5min": 1.0,
  "5-30min": 0.85,
  "30min-2hr": 0.60,
  "2-24hr": 0.35,
  "24hr+": 0.15,
  "dont-track": 0.50,
};

// Missed call rate conversion
const MISSED_CALL_RATES: Record<string, number> = {
  "0-10": 0.05,
  "10-25": 0.175,
  "25-50": 0.375,
  "50+": 0.65,
  "unknown": 0.45, // Industry average
};

// Helper function to get LTV
function getLTV(data: CalculatorFormData): number {
  const avgTransaction = data.avgTransactionValue || 0;
  const repeatPurchases = data.repeatCustomers ? (data.avgPurchasesPerCustomer || 1) : 1;
  return avgTransaction * repeatPurchases;
}

// Helper function to get close rate
function getCloseRate(data: CalculatorFormData): number {
  const totalLeads = data.totalMonthlyLeads || 1;
  const closedDeals = data.closedDealsPerMonth || 0;
  return closedDeals / totalLeads;
}

// Helper to determine severity based on monthly loss
function getSeverity(monthlyLoss: number): "critical" | "high" | "medium" | "low" {
  if (monthlyLoss >= 15000) return "critical";
  if (monthlyLoss >= 7500) return "high";
  if (monthlyLoss >= 2500) return "medium";
  return "low";
}

// 1. Missed Calls Leak
export function calculateMissedCallsLeak(data: CalculatorFormData): Leak {
  const missedCallRateKey = data.missedCallRate || "unknown";
  const missedCallRate = MISSED_CALL_RATES[missedCallRateKey] || 0.45;
  const inboundCalls = data.inboundCalls || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);

  const missedCalls = Math.round(inboundCalls * missedCallRate);
  const lostDeals = missedCalls * closeRate;
  const monthlyLoss = Math.round(lostDeals * ltv);
  const annualLoss = monthlyLoss * 12;

  return {
    rank: 0, // Will be set after sorting
    type: "missedCalls",
    label: "Missed Calls",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      missedCallRate: `${(missedCallRate * 100).toFixed(0)}%`,
      missedCallsPerMonth: missedCalls,
      lostDealsPerMonth: lostDeals.toFixed(1),
      ltv,
    },
    recommendation: missedCallRate > 0.25
      ? "Consider implementing an answering service or AI call handling to capture missed leads 24/7."
      : "Your missed call rate is reasonable. Focus on optimizing other areas first.",
  };
}

// 2. Slow Response Leak
export function calculateSlowResponseLeak(data: CalculatorFormData): Leak {
  const responseTime = data.avgResponseTime || "dont-track";
  const responseMultiplier = RESPONSE_TIME_MULTIPLIERS[responseTime] || 0.50;
  const totalLeads = data.totalMonthlyLeads || 0;
  const actualCloseRate = getCloseRate(data);
  const ltv = getLTV(data);

  // Ideal close rate assumes <5min response (industry shows 391% higher contact rate)
  const idealCloseRate = Math.min(actualCloseRate / responseMultiplier, 0.40);
  const closeRateGap = Math.max(0, idealCloseRate - actualCloseRate);
  
  const lostDeals = totalLeads * closeRateGap;
  const monthlyLoss = Math.round(lostDeals * ltv);
  const annualLoss = monthlyLoss * 12;

  const responseTimeLabels: Record<string, string> = {
    "<5min": "Under 5 minutes",
    "5-30min": "5-30 minutes",
    "30min-2hr": "30 min - 2 hours",
    "2-24hr": "2-24 hours",
    "24hr+": "Over 24 hours",
    "dont-track": "Not tracked",
  };

  return {
    rank: 0,
    type: "slowResponse",
    label: "Slow Response Time",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      currentResponseTime: responseTimeLabels[responseTime] || responseTime,
      responseEfficiency: `${(responseMultiplier * 100).toFixed(0)}%`,
      potentialCloseRate: `${(idealCloseRate * 100).toFixed(1)}%`,
      actualCloseRate: `${(actualCloseRate * 100).toFixed(1)}%`,
      lostDealsPerMonth: lostDeals.toFixed(1),
    },
    recommendation: responseMultiplier < 0.6
      ? "Speed is critical. Leads contacted within 5 minutes are 100x more likely to convert. Implement automated instant responses."
      : "Your response time is good. Consider automation to maintain consistency during busy periods.",
  };
}

// 3. No Follow-Up Leak
export function calculateNoFollowUpLeak(data: CalculatorFormData): Leak {
  const totalLeads = data.totalMonthlyLeads || 0;
  const followsAll = data.followUpAllLeads;
  const percentageFollowedUp = data.percentageFollowedUp || 100;
  const avgAttempts = data.avgFollowUpAttempts || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);

  // Calculate leads not followed up
  const followUpRate = followsAll ? 1.0 : percentageFollowedUp / 100;
  const leadsNotFollowedUp = totalLeads * (1 - followUpRate);

  // Optimal is 6-8 attempts, each missed attempt = ~5% lower close rate
  const optimalAttempts = 6;
  const attemptGap = Math.max(0, optimalAttempts - avgAttempts);
  const closeRatePenalty = attemptGap * 0.05;
  
  // Leads that are followed up but with insufficient attempts
  const leadsWithInsufficientFollowUp = totalLeads * followUpRate;
  const lostFromInsufficientAttempts = leadsWithInsufficientFollowUp * closeRatePenalty * closeRate;
  
  // Leads completely not followed up (assume 50% would have converted with proper follow-up)
  const lostFromNoFollowUp = leadsNotFollowedUp * closeRate * 0.5;

  const totalLostDeals = lostFromNoFollowUp + lostFromInsufficientAttempts;
  const monthlyLoss = Math.round(totalLostDeals * ltv);
  const annualLoss = monthlyLoss * 12;

  return {
    rank: 0,
    type: "noFollowUp",
    label: "Insufficient Follow-Up",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      leadsNotFollowedUp: Math.round(leadsNotFollowedUp),
      currentAttempts: avgAttempts,
      optimalAttempts,
      followUpRate: `${(followUpRate * 100).toFixed(0)}%`,
      lostDealsFromNoFollowUp: lostFromNoFollowUp.toFixed(1),
      lostDealsFromFewAttempts: lostFromInsufficientAttempts.toFixed(1),
    },
    recommendation: avgAttempts < 5
      ? "Top performers make 6-8 follow-up attempts. Implement an automated follow-up sequence to stay persistent without manual effort."
      : followUpRate < 1
        ? "You're missing leads. Ensure every inquiry gets at least one follow-up, even if just an automated email."
        : "Your follow-up process is solid. Consider A/B testing your messaging to improve conversion.",
  };
}

// 4. No-Show Leak
export function calculateNoShowLeak(data: CalculatorFormData): Leak {
  const requiresAppointments = data.requiresAppointments;
  
  if (!requiresAppointments) {
    return {
      rank: 0,
      type: "noShow",
      label: "Appointment No-Shows",
      monthlyLoss: 0,
      annualLoss: 0,
      severity: "low",
      details: {
        applicable: false,
        reason: "Business does not require appointments",
      },
      recommendation: "Not applicable to your business model.",
    };
  }

  const appointmentsBooked = data.appointmentsBooked || 0;
  const appointmentsShowUp = data.appointmentsShowUp || 0;
  const sendsReminders = data.sendsReminders;
  const ltv = getLTV(data);

  const noShows = Math.max(0, appointmentsBooked - appointmentsShowUp);
  const noShowRate = appointmentsBooked > 0 ? noShows / appointmentsBooked : 0;

  // 70% of no-shows are preventable with proper reminder systems
  const preventabilityRate = sendsReminders ? 0.30 : 0.70;
  const preventableNoShows = noShows * preventabilityRate;

  const monthlyLoss = Math.round(preventableNoShows * ltv);
  const annualLoss = monthlyLoss * 12;

  return {
    rank: 0,
    type: "noShow",
    label: "Appointment No-Shows",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      appointmentsBooked,
      noShows,
      noShowRate: `${(noShowRate * 100).toFixed(1)}%`,
      preventableNoShows: Math.round(preventableNoShows),
      sendsReminders: sendsReminders ? "Yes" : "No",
    },
    recommendation: !sendsReminders
      ? "Implement automated SMS and email reminders 48hr and 24hr before appointments. This alone can reduce no-shows by 50%."
      : noShowRate > 0.15
        ? "Consider requiring deposits or implementing a cancellation policy to reduce no-shows further."
        : "Your no-show rate is reasonable. Focus on other areas for bigger wins.",
  };
}

// 5. Unqualified Lead Leak
export function calculateUnqualifiedLeadLeak(data: CalculatorFormData): Leak {
  const qualifiesLeads = data.qualifiesLeads;
  
  if (qualifiesLeads) {
    return {
      rank: 0,
      type: "unqualifiedLeads",
      label: "Unqualified Lead Time",
      monthlyLoss: 0,
      annualLoss: 0,
      severity: "low",
      details: {
        qualifiesLeads: true,
        reason: "Lead qualification is already in place",
      },
      recommendation: "Good job! Your lead qualification process helps focus sales efforts.",
    };
  }

  const totalLeads = data.totalMonthlyLeads || 0;
  const percentageUnqualified = data.percentageUnqualified || 20;
  const consultationLength = data.consultationLength || 30;
  const avgHourlyCost = data.avgHourlyLaborCost || 25;
  const closeRate = getCloseRate(data);
  const avgTransaction = data.avgTransactionValue || 0;

  const unqualifiedLeads = totalLeads * (percentageUnqualified / 100);
  const hoursWasted = (unqualifiedLeads * consultationLength) / 60;
  
  // Direct labor cost
  const laborCost = hoursWasted * avgHourlyCost;
  
  // Opportunity cost: those hours could have been spent on qualified leads
  const potentialDeals = (hoursWasted / (consultationLength / 60)) * closeRate;
  const opportunityCost = potentialDeals * avgTransaction;

  const monthlyLoss = Math.round(laborCost + opportunityCost);
  const annualLoss = monthlyLoss * 12;

  return {
    rank: 0,
    type: "unqualifiedLeads",
    label: "Unqualified Lead Time",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      unqualifiedLeadsPerMonth: Math.round(unqualifiedLeads),
      hoursWastedPerMonth: hoursWasted.toFixed(1),
      laborCost: Math.round(laborCost),
      opportunityCost: Math.round(opportunityCost),
      percentageUnqualified: `${percentageUnqualified}%`,
    },
    recommendation: "Add a brief qualification step before booking consultations. A simple online form or 5-minute screening call can filter out poor-fit leads.",
  };
}

// 6. After-Hours Leak
export function calculateAfterHoursLeak(data: CalculatorFormData): Leak {
  const inboundCalls = data.inboundCalls || 0;
  const answersAfterHours = data.answersAfterHours;
  const answersWeekends = data.answersWeekends;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);

  // Industry averages: 30% of calls come after hours, 25% on weekends
  const afterHoursRate = 0.30;
  const weekendRate = 0.25;

  let missedAfterHours = 0;
  let missedWeekends = 0;

  if (!answersAfterHours) {
    missedAfterHours = inboundCalls * afterHoursRate;
  }
  
  if (!answersWeekends) {
    // Don't double-count if both are missed (assume some overlap)
    const weekendOnlyRate = answersAfterHours ? weekendRate : weekendRate * 0.7;
    missedWeekends = inboundCalls * weekendOnlyRate;
  }

  const totalMissed = missedAfterHours + missedWeekends;
  const lostDeals = totalMissed * closeRate;
  const monthlyLoss = Math.round(lostDeals * ltv);
  const annualLoss = monthlyLoss * 12;

  return {
    rank: 0,
    type: "afterHours",
    label: "After-Hours & Weekend Calls",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      missedAfterHoursCalls: Math.round(missedAfterHours),
      missedWeekendCalls: Math.round(missedWeekends),
      totalMissedCalls: Math.round(totalMissed),
      answersAfterHours: answersAfterHours ? "Yes" : "No",
      answersWeekends: answersWeekends ? "Yes" : "No",
      lostDeals: lostDeals.toFixed(1),
    },
    recommendation: !answersAfterHours && !answersWeekends
      ? "You're missing 55% of potential calls. An answering service or AI receptionist can capture these leads for a fraction of their value."
      : !answersAfterHours
        ? "After-hours calls represent 30% of inquiries. Consider an answering service for evenings."
        : !answersWeekends
          ? "Weekend calls are high-intent buyers. Add weekend coverage or an automated booking system."
          : "Great job covering all hours! You're not leaving money on the table here.",
  };
}

// 7. Hold Time Leak
export function calculateHoldTimeLeak(data: CalculatorFormData): Leak {
  const inboundCalls = data.inboundCalls || 0;
  const avgHoldTime = data.avgHoldTime || 0;
  const closeRate = getCloseRate(data);
  const ltv = getLTV(data);

  // Every minute of hold time = ~10% hang-up rate (capped at 90%)
  const hangUpRate = Math.min(avgHoldTime * 0.10, 0.90);
  const callsAbandoned = inboundCalls * hangUpRate;
  const lostDeals = callsAbandoned * closeRate;
  const monthlyLoss = Math.round(lostDeals * ltv);
  const annualLoss = monthlyLoss * 12;

  return {
    rank: 0,
    type: "holdTime",
    label: "Long Hold Times",
    monthlyLoss,
    annualLoss,
    severity: getSeverity(monthlyLoss),
    details: {
      avgHoldTimeMinutes: avgHoldTime,
      estimatedHangUpRate: `${(hangUpRate * 100).toFixed(0)}%`,
      callsAbandonedPerMonth: Math.round(callsAbandoned),
      lostDeals: lostDeals.toFixed(1),
    },
    recommendation: avgHoldTime > 2
      ? "Long hold times frustrate callers. Consider hiring additional staff, implementing a callback system, or using an AI assistant to handle initial inquiries."
      : "Your hold times are acceptable. Focus on other areas with bigger impact.",
  };
}

// ============================================
// REACTIVATION LEAK CALCULATIONS
// ============================================

// Viability rates by database age (industry research)
const DATABASE_VIABILITY_RATES: Record<string, number> = {
  "0-3months": 0.45,
  "3-6months": 0.35,
  "6-12months": 0.25,
  "1-2years": 0.15,
  "2+years": 0.08,
};

// Win-back rates by recency (industry benchmarks)
const WIN_BACK_RATES: Record<string, number> = {
  "3-6months": 0.28,
  "6-12months": 0.20,
  "1-2years": 0.12,
  "2+years": 0.06,
};

// Frequency impact on success
const FREQUENCY_MULTIPLIERS: Record<string, number> = {
  "monthly": 1.0,
  "quarterly": 0.85,
  "twice-a-year": 0.70,
  "once-a-year": 0.50,
  "rarely": 0.30,
};

// FUNCTION 1: Calculate Dormant Leads Value
export function calculateDormantLeadsValue(data: CalculatorFormData): DormantLeadsResult {
  const totalDormantLeads = data.totalDormantLeads || 0;
  const databaseAge = data.databaseAge || "6-12months";
  const everRecontactedDormant = data.everRecontactedDormant || false;
  const percentageRecontactedDormant = data.percentageRecontactedDormant || 0;
  const dormantResponseCount = data.dormantResponseCount || 0;
  const closeRate = getCloseRate(data) * 100; // Convert to percentage
  const customerLifetimeValue = getLTV(data);

  const viabilityRate = DATABASE_VIABILITY_RATES[databaseAge] || 0.25;
  const viableLeads = totalDormantLeads * viabilityRate;

  // Reactivation campaigns typically have 15-30% response rate
  const reactivationResponseRate = 0.22; // 22% industry average
  const bestInClassResponseRate = 0.35; // 35% with proper system

  // Expected customers from reactivation
  const expectedCustomers = viableLeads * reactivationResponseRate * (closeRate / 100);
  const bestCaseCustomers = viableLeads * bestInClassResponseRate * (closeRate / 100);

  // Calculate current gap
  let customersLost: number;
  let currentlyRecovered = 0;

  if (!everRecontactedDormant) {
    // Never contacted = losing 100% of opportunity
    customersLost = expectedCustomers;
  } else {
    // They did some outreach, calculate what they're missing
    const leadsRecontacted = totalDormantLeads * (percentageRecontactedDormant / 100);
    currentlyRecovered = dormantResponseCount;
    customersLost = Math.max(0, expectedCustomers - currentlyRecovered);
  }

  const monthlyLoss = customersLost * customerLifetimeValue;
  const bestCaseRevenue = bestCaseCustomers * customerLifetimeValue;

  return {
    monthlyLoss: Math.round(monthlyLoss),
    annualLoss: Math.round(monthlyLoss * 12),
    viableLeads: Math.round(viableLeads),
    expectedCustomers: Math.round(expectedCustomers),
    bestCaseCustomers: Math.round(bestCaseCustomers),
    customersLost: Math.round(customersLost),
    currentlyRecovered: currentlyRecovered,
    databaseAge: databaseAge,
    viabilityRate: Math.round(viabilityRate * 100),
    expectedResponseRate: 22,
    bestCaseResponseRate: 35,
    recontactStatus: everRecontactedDormant
      ? `Reached ${percentageRecontactedDormant}% of database`
      : "Never contacted",
    upside: Math.round(bestCaseRevenue - (currentlyRecovered * customerLifetimeValue)),
  };
}

// FUNCTION 2: Calculate Past Customer Value
export function calculatePastCustomerValue(data: CalculatorFormData): PastCustomersResult {
  const numPastCustomers = data.numPastCustomers || 0;
  const avgTimeSinceLastPurchase = data.avgTimeSinceLastPurchase || "6-12months";
  const sendsReengagementCampaigns = data.sendsReengagementCampaigns || false;
  const reengagementFrequency = data.reengagementFrequency || "rarely";
  const reengagementResponseRate = data.reengagementResponseRate || 0;
  const avgTransactionValue = data.avgTransactionValue || 0;

  const winBackRate = WIN_BACK_RATES[avgTimeSinceLastPurchase] || 0.20;
  const winnableCustomers = numPastCustomers * winBackRate;

  // Past customers typically spend 30% more on return (established trust)
  const returnPurchaseValue = avgTransactionValue * 1.3;

  // Calculate gap
  let customersLost: number;
  let currentlyRecovered = 0;

  if (!sendsReengagementCampaigns) {
    // No campaigns = losing 100% of opportunity
    customersLost = winnableCustomers;
  } else {
    // They're doing something, calculate gap
    currentlyRecovered = numPastCustomers * (reengagementResponseRate / 100);
    customersLost = Math.max(0, winnableCustomers - currentlyRecovered);
  }

  const monthlyLoss = customersLost * returnPurchaseValue;
  const bestCaseRevenue = winnableCustomers * returnPurchaseValue;

  const frequencyImpact = sendsReengagementCampaigns
    ? FREQUENCY_MULTIPLIERS[reengagementFrequency] || 0.30
    : 0;

  return {
    monthlyLoss: Math.round(monthlyLoss),
    annualLoss: Math.round(monthlyLoss * 12),
    winnableCustomers: Math.round(winnableCustomers),
    customersLost: Math.round(customersLost),
    currentlyRecovered: Math.round(currentlyRecovered),
    timeSinceLastPurchase: avgTimeSinceLastPurchase,
    winBackRate: Math.round(winBackRate * 100),
    returnPurchaseBonus: 30,
    currentStatus: sendsReengagementCampaigns
      ? `${reengagementFrequency} campaigns reaching ${reengagementResponseRate}%`
      : "No reactivation campaigns",
    frequencyScore: Math.round(frequencyImpact * 100),
    recommendedFrequency: "Monthly",
    upside: Math.round(bestCaseRevenue - (currentlyRecovered * returnPurchaseValue)),
  };
}

// FUNCTION 3: Calculate Reactivation Leak (master function)
export function calculateReactivationLeak(data: CalculatorFormData): ReactivationLeak | null {
  const hasDormantLeads = data.hasDormantLeads === true;
  const hasPastCustomers = data.hasPastCustomers === true;

  // If no reactivation data, return null
  if (!hasDormantLeads && !hasPastCustomers) {
    return null;
  }

  const dormantLeads = hasDormantLeads ? calculateDormantLeadsValue(data) : null;
  const pastCustomers = hasPastCustomers ? calculatePastCustomerValue(data) : null;

  const totalMonthlyLoss =
    (dormantLeads?.monthlyLoss || 0) + (pastCustomers?.monthlyLoss || 0);

  const totalUpside =
    (dormantLeads?.upside || 0) + (pastCustomers?.upside || 0);

  // Calculate quick-win score (higher = easier money)
  let quickWinScore = 0;
  if (dormantLeads && dormantLeads.viabilityRate > 25) quickWinScore += 30;
  if (pastCustomers && pastCustomers.winBackRate > 15) quickWinScore += 30;
  if (dormantLeads && !data.everRecontactedDormant) quickWinScore += 20;
  if (pastCustomers && !data.sendsReengagementCampaigns) quickWinScore += 20;

  const severity: "critical" | "high" | "medium" | "low" =
    totalMonthlyLoss > 20000 ? "critical" : totalMonthlyLoss > 10000 ? "high" : "medium";

  return {
    type: "reactivation",
    label: "Dormant Leads & Customer Reactivation",
    monthlyLoss: totalMonthlyLoss,
    annualLoss: totalMonthlyLoss * 12,
    dormantLeads: dormantLeads,
    pastCustomers: pastCustomers,
    severity: severity,
    quickWinScore: quickWinScore, // 0-100 scale
    totalUpside: totalUpside,
    implementationTime: "7-14 days",
    expectedROI: "3-5x in first 30 days",
    paybackPeriod: "7-10 days",
    isQuickWin: true,
  };
}

// Main calculation function
export function calculateAllLeaks(formData: CalculatorFormData): CalculationResult {
  // Check for reactivation data
  const hasReactivationData = formData.hasDormantLeads === true || formData.hasPastCustomers === true;
  
  // Calculate reactivation leak first (if applicable)
  const reactivationOpportunity = calculateReactivationLeak(formData);

  // Calculate all operational leaks
  const operationalLeaks: Leak[] = [
    calculateMissedCallsLeak(formData),
    calculateSlowResponseLeak(formData),
    calculateNoFollowUpLeak(formData),
    calculateNoShowLeak(formData),
    calculateUnqualifiedLeadLeak(formData),
    calculateAfterHoursLeak(formData),
    calculateHoldTimeLeak(formData),
  ];

  // Sort operational leaks by monthly loss (descending)
  operationalLeaks.sort((a, b) => b.monthlyLoss - a.monthlyLoss);

  // Assign ranks to operational leaks (starting from 2 if reactivation exists)
  const rankOffset = reactivationOpportunity ? 1 : 0;
  operationalLeaks.forEach((leak, index) => {
    leak.rank = index + 1 + rankOffset;
  });

  // Create reactivation as a Leak for the allLeaks array
  let reactivationAsLeak: Leak | null = null;
  if (reactivationOpportunity) {
    reactivationAsLeak = {
      rank: 1, // Always first
      type: "reactivation",
      label: reactivationOpportunity.label,
      monthlyLoss: reactivationOpportunity.monthlyLoss,
      annualLoss: reactivationOpportunity.annualLoss,
      severity: reactivationOpportunity.severity,
      quickWin: true,
      details: {
        dormantLeadsValue: reactivationOpportunity.dormantLeads?.monthlyLoss || 0,
        pastCustomersValue: reactivationOpportunity.pastCustomers?.monthlyLoss || 0,
        quickWinScore: reactivationOpportunity.quickWinScore,
        totalUpside: reactivationOpportunity.totalUpside,
        implementationTime: reactivationOpportunity.implementationTime,
        expectedROI: reactivationOpportunity.expectedROI,
      },
      recommendation: reactivationOpportunity.quickWinScore > 50
        ? "This is your BIGGEST quick-win opportunity. A simple email/SMS campaign to dormant leads can generate revenue within days."
        : "Reactivating past leads and customers is low-hanging fruit. Start with a simple 'We miss you' campaign.",
    };
  }

  // Combine all leaks with reactivation first
  const allLeaks: Leak[] = reactivationAsLeak
    ? [reactivationAsLeak, ...operationalLeaks]
    : operationalLeaks;

  // Calculate totals (including reactivation)
  const totalMonthlyLoss = allLeaks.reduce((sum, leak) => sum + leak.monthlyLoss, 0);
  const totalAnnualLoss = totalMonthlyLoss * 12;

  // Legacy leaks array (for backwards compatibility) - same as allLeaks
  const leaks = allLeaks;

  return {
    totalMonthlyLoss,
    totalAnnualLoss,
    leaks,
    reactivationOpportunity,
    operationalLeaks,
    allLeaks,
    hasReactivationData,
  };
}

// Helper function to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper function to get severity color
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

// Helper function to get severity label
export function getSeverityLabel(severity: Leak["severity"]): string {
  switch (severity) {
    case "critical":
      return "Critical";
    case "high":
      return "High Priority";
    case "medium":
      return "Medium Priority";
    case "low":
      return "Low Priority";
  }
}
