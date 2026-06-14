
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface FinancialMetric {
  label: string;
  value: number;
}

export interface Competitor {
  name: string;
  type: string;
  lat: number;
  lng: number;
  rating: number;
  status: 'Successful' | 'Failed' | 'Active';
}

export interface AnalysisResult {
  locationOverview: string;
  suitabilityScore: number;
  suitabilityBreakdown: {
    populationDensity: number;
    footTraffic: number;
    competitionScore: number;
    accessibility: number;
    parking: number;
  };
  competitionAnalysis: {
    count: number;
    avgRating: number;
    successfulCount: number;
    failedCount: number;
    pressureIndex: number;
  };
  costEstimation: {
    initialSetup: number;
    monthlyRent: number;
    monthlySalaries: number;
    monthlyUtilities: number;
    monthlySupplies: number;
    monthlyMarketing: number;
    monthlyMaintenance: number;
    totalMonthly: number;
    breakEvenMonths: number;
    feasibilityScore: number;
  };
  riskAnalysis: {
    score: number;
    level: RiskLevel;
    identifiedRisks: string[];
    mitigationFactors: string[];
  };
  prediction: {
    successProb: number;
    failureProb: number;
    confidence: number;
    timeToProfitability: string;
    keyRiskContributors: { factor: string; impact: number }[];
  };
  reasoning: string;
  finalRecommendation: string;
  competitors: Competitor[];
  center: [number, number];
}

export interface UserInputs {
  businessType: string;
  locationName: string;
  latitude: number;
  longitude: number;
  budget: number;
  area: number;
  radius: number;
}
