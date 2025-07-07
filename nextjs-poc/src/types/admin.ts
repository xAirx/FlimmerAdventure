export interface Contract {
  id: string;
  name: string;
  vendor: string;
  status: string;
  renewalDate: string;
  value: string;
}

export interface SaasIntegration {
  name: string;
  description: string;
  link: string;
}

export interface SentryIssue {
  id: string;
  title: string;
  events: number;
  usersAffected: number;
  lastSeen: string;
}

export interface ModerationItem {
  id: number;
  title: string;
  creator: string;
  family: string;
  reason: string;
  aiStatus: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  lastSeen: string;
  identityStatus: 'Verified (MitID)' | 'Unverified';
}

export interface ABTest {
  id: string;
  name: string;
  status: string;
  variants: any[];
  startDate: Date;
  endDate?: Date;
}

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  rollout: number;
  enabled: boolean;
}

export interface VersionAdoption {
  version: string;
  percentage: number;
  userCount: number;
  releaseDate: Date;
  isForced: boolean;
  crashRate: number;
}

export interface SystemSetting {
  key: string;
  label: string;
  description: string;
  value: string;
  unit: string;
}

export interface Vulnerability {
  id: string;
  severity: string;
  description: string;
  dependency: string;
  path: string;
  remediation: string;
}

export interface MonitoredDependency {
  name: string;
  version: string;
  status: string;
  license: string;
}

export interface SecurityMetrics {
  totalVulnerabilities: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  securityScore: number;
}

export interface PlatformMetrics {
  totalFamilies: number;
  activeFamilies: number;
  totalChildren: number;
  verifiedParents: number;
  pendingVerifications: number;
  safetyAlerts: number;
}

export interface ProductMetrics {
  featureAdoptionRate: number;
  userSatisfaction: number;
  timeToValue: number;
  featureRequests: number;
} 