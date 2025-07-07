// --- Admin & Platform Interfaces ---

export interface ModerationItem { 
  id: number; 
  title: string; 
  creator: string; 
  family: string; 
  reason: string; 
  aiStatus: 'pending' | 'ok' | 'flagged'; 
}

export interface PlatformAlert { 
  id: number; 
  type: 'safety_violation' | 'gdpr_request' | 'system_issue' | 'performance'; 
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string; 
  family?: string; 
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Premium Monthly' | 'Premium Yearly';
  status: 'Active' | 'Suspended' | 'Pending Confirmation';
  lastSeen: string;
}

// --- Product & Engineering Interfaces ---

export interface VersionAdoption {
  version: string;
  percentage: number;
  userCount: number;
  releaseDate: Date;
  isForced: boolean;
  crashRate: number;
}

export interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: Array<{
    name: string;
    percentage: number;
    users: number;
    conversionRate: number;
  }>;
}

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  rollout: number; // Percentage 0-100
  enabled: boolean;
}

export interface SystemSetting {
  key: 'api_rate_limit' | 'new_user_cap' | 'content_upload_limit';
  label: string;
  description: string;
  value: string;
  unit: string;
}

// --- Security & Business Interfaces ---

export interface Vulnerability {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  dependency: string;
  remediation: string;
}

export interface Contract {
  id:string;
  name: string;
  vendor: string;
  status: 'Active' | 'Pending Renewal' | 'Expired';
  renewalDate: string;
  value: string;
}

export interface SaasIntegration {
    name: 'Stripe' | 'Sentry' | 'Google Analytics' | 'AWS';
    description: string;
    link: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  responseBody: string;
}

export type Story = {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
};

export interface MonitoredDependency {}
export interface SecurityEvent {}
export interface SentryIssue {} 