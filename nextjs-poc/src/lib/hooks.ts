'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTopStories, fetchItem, fetchUser } from '@/lib/hackernews-api';
import { queryKeys } from '@/lib/react-query';
import { Story, HackerNewsItem, HackerNewsUser } from '@/types/hackernews';
import type { 
    ModerationItem, 
    User, 
    ABTest, 
    FeatureFlag, 
    VersionAdoption, 
    SystemSetting, 
    Vulnerability, 
    MonitoredDependency, 
    Contract, 
    SaasIntegration,
    PlatformAlert,
    SecurityEvent,
    SentryIssue
} from '@flimmer/shared-types';

/**
 * Hook to fetch top stories from Hacker News
 */
export const useTopStories = (limit: number = 20) => {
  return useQuery<Story[], Error>({
    queryKey: queryKeys.stories.top(limit),
    queryFn: () => fetchTopStories(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single story by ID
 */
export const useStory = (id: number) => {
  return useQuery<HackerNewsItem, Error>({
    queryKey: queryKeys.story.byId(id),
    queryFn: () => fetchItem(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch user information by username
 */
export const useUser = (username: string) => {
  return useQuery<HackerNewsUser, Error>({
    queryKey: queryKeys.user.byId(username),
    queryFn: () => fetchUser(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

const fetchAdminData = async (endpoint: string) => {
    const res = await fetch(`/api/admin/${endpoint}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
    }
    return res.json();
}

// Mock data generation functions
const generateMockData = <T>(generator: () => Omit<T, 'id'>, count = 5): T[] => 
    Array.from({ length: count }, (_, i) => ({ id: i + 1, ...generator() } as T));

// Mock Data
const mockModerationQueue: ModerationItem[] = generateMockData(() => ({ title: 'Sample Video', creator: 'User123', reason: 'Inappropriate Content', family: 'Smith', aiStatus: 'pending' }));
const mockPlatformAlerts: PlatformAlert[] = generateMockData(() => ({ type: 'system_issue', severity: 'critical', message: 'Service X is overloaded.', details: {}, timestamp: new Date() }));
const mockVersionAdoption: VersionAdoption[] = [{ version: '1.2.3', percentage: 80, userCount: 1000, releaseDate: new Date(), isForced: false, crashRate: 0.1 }];
const mockABTests: ABTest[] = generateMockData(() => ({ name: 'New Checkout Flow', status: 'running', variants: [{name: 'A', percentage: 50, users: 100, conversionRate: 0.1}, {name: 'B', percentage: 50, users: 100, conversionRate: 0.2}], startDate: new Date() }));
const mockFeatureFlags: FeatureFlag[] = [{ key: 'new-dashboard', label: 'New Dashboard', description: 'A new dashboard', enabled: true, rollout: 50 }];
const mockSystemSettings: SystemSetting[] = [{ key: 'api_rate_limit', label: 'API Rate Limit', description: 'req/min', value: '1000', unit: 'req/min' }];
const mockVulnerabilities: Vulnerability[] = generateMockData(() => ({ description: 'XSS in comments', severity: 'High', dependency: 'react-v16', path: '/', remediation: 'upgrade' }));
const mockDependencies: MonitoredDependency[] = [{ name: 'react', version: '18.2.0', status: 'healthy', license: 'MIT' }];
const mockSecurityEvents: SecurityEvent[] = generateMockData(() => ({ type: 'Failed Login', ip: '127.0.0.1', timestamp: new Date().toISOString(), description: 'Failed login attempt' }));
const mockSentryIssues: SentryIssue[] = generateMockData(() => ({ title: 'API Error', events: 100, usersAffected: 10, lastSeen: '2 min ago' }));
const mockContracts: Contract[] = generateMockData(() => ({ name: 'AWS', value: '$1000/mo', renewalDate: '2025-01-01', status: 'Active', vendor: 'Amazon' }));
const mockIntegrations: SaasIntegration[] = [{ name: 'Stripe', description: 'Payments', link: '#' }];

export const useOperationsData = () => useQuery({ queryKey: ['operationsData'], queryFn: () => Promise.resolve({ moderationQueue: mockModerationQueue, platformAlerts: mockPlatformAlerts }) });
export const useProductData = () => useQuery({ queryKey: ['productData'], queryFn: () => Promise.resolve({ abTests: mockABTests, featureFlags: mockFeatureFlags, systemSettings: mockSystemSettings }) });
export const usePlatformData = () => useQuery({ queryKey: ['platformData'], queryFn: () => Promise.resolve({ versions: mockVersionAdoption }) });
export const useSecurityData = () => useQuery({ queryKey: ['securityData'], queryFn: () => Promise.resolve({ vulnerabilities: mockVulnerabilities, dependencies: mockDependencies, securityEvents: mockSecurityEvents }) });
export const useBusinessData = () => useQuery({ queryKey: ['businessData'], queryFn: () => Promise.resolve({ sentryIssues: mockSentryIssues, contracts: mockContracts, integrations: mockIntegrations }) }); 