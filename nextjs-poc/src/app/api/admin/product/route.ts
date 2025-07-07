import { NextResponse } from 'next/server';
import type { ABTest, FeatureFlag } from '@/types/admin';

const mockABTests: ABTest[] = [
    { 
        id: 'onboarding_flow_v2', 
        name: 'New Onboarding Flow', 
        status: 'running', 
        startDate: new Date('2024-01-15'),
        variants: [ 
            { name: 'Control (5-step)', percentage: 50, users: 1247, conversionRate: 68.2 }, 
            { name: 'Variant (3-step)', percentage: 50, users: 1253, conversionRate: 74.1 } 
        ] 
    },
    { 
        id: 'content_approval_ui', 
        name: 'Content Approval Interface', 
        status: 'completed', 
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        variants: [ 
            { name: 'List View', percentage: 50, users: 892, conversionRate: 82.3 }, 
            { name: 'Card View', percentage: 50, users: 908, conversionRate: 89.1 } 
        ] 
    },
];

const initialFeatureFlags: FeatureFlag[] = [
    { key: 'new_home_feed', label: 'New Home Feed Experience', description: 'Enable experimental card-based feed for all users', rollout: 100, enabled: true },
    { key: 'ai_content_scanning_v2', label: 'Enhanced AI Content Scanning', description: 'Deploy new AI models for content safety analysis', rollout: 50, enabled: true },
];

export async function GET(request: Request) {
    return NextResponse.json({ 
        abTests: mockABTests,
        featureFlags: initialFeatureFlags
    });
} 