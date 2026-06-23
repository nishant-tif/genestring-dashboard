// Type definitions for the application

export interface LoginCredentials {
  user_email: string;
  user_password: string;
  cookies?: object;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Policy {
  id: string;
  policy_id?: string;
  policyName: string;
  metricName: string;
  operator: string;
  expectedValue: string;
  severity: "Low" | "Medium" | "High";
  description: string;
}

export interface Model {
  model_id?: string;
  id: string;
  name: string;
  version: string;
  owner: string;
  organizations: string;
  framework: string;
  riskCategory: "Low" | "Medium" | "High" | "Good";
  artifactLocation: string;
  policy: string;
}
export interface state {
  state_id: string;
  stateName: string;
  country_id: string;
}
export interface city {
  city_id: string;
  cityName: string;
  state_id: string;
}

export interface Organization {
  city?: city;
  state?: state;
  city_id: string;
  state_id: string;
  organization_id: string;
  id: string;
  name: string;
  organizationsName: string;
  email: string;
  address: string;
}
// export interface Article {
//   id: string;
//   article_title: string;
//   author_id: string;
// }

export interface DashboardData {
  healthScore: number;
  totalModels: number;
  highRiskModels: number;
  completeModels: number;
  criticalIssues: number;
  riskAssessment: {
    critical: { count: number; items: string[] };
    high: { count: number; items: string[] };
    medium: { count: number; items: string[] };
    low: { count: number; items: string[] };
  };
  compliance: {
    overall: number;
    euAiAct: number;
    iso42001: number;
    indiaDpdpAct: number;
    oecdPrinciples: number;
  };
  activeAlerts: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  aiSystems: Array<{
    id: string;
    systemName: string;
    riskLevel: string;
    compliance: number;
    status: string;
  }>;
}

export interface Category {
  id?: string; // optional fallback
  category_id: string; // main backend id
  category_name: string;
  created_at?: string;
  updated_at?: string;
}
export interface Country {
  id?: string;
  country_id: string;
  countryName: string;
  countryCode?: string;
  created_at?: string;
}
export interface State {
  id?: string;
  state_id: string;
  stateName: string;
  country_id: string;
}
export interface City {
  id?: string;
  city_id: string;
  cityName: string;
  state_id: string;
}
