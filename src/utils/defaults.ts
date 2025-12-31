export const INDUSTRY_RATES: Record<string, number> = {
    "Dentist": 0.30,
    "Med Spa": 0.25,
    "HVAC": 0.35,
    "Plumber": 0.35,
    "Roofer": 0.30,
    "default": 0.25
};

export const INDUSTRY_LABELS: Record<string, string> = {
    "Dentist": "Dentist",
    "Med Spa": "Med Spa",
    "HVAC": "HVAC",
    "Plumber": "Plumber",
    "Roofer": "Roofer",
    "default": "General Business"
};

export function getIndustryDefaultCloseRate(industry: string): number {
    return INDUSTRY_RATES[industry] || INDUSTRY_RATES["default"];
}

export function formatPercent(rate: number): string {
    // 0.25 -> 25%
    return `${Math.round(rate * 100)}%`;
}
