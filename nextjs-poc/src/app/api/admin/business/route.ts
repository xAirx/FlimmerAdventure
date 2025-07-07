import { NextResponse } from 'next/server';
import type { Contract, SaasIntegration } from '@/types/admin';

const mockContracts: Contract[] = [
    { id: 'ctr_01', name: 'Snyk Enterprise', vendor: 'Snyk', status: 'Active', renewalDate: '2025-01-15', value: '$25,000/year' },
    { id: 'ctr_02', name: 'Twilio Segment', vendor: 'Twilio', status: 'Pending Renewal', renewalDate: '2024-08-01', value: '$50,000/year' },
];

const mockIntegrations: SaasIntegration[] = [
    { name: 'Stripe', description: 'Payment Processing', link: 'https://dashboard.stripe.com' },
    { name: 'Sentry', description: 'Error & Performance Monitoring', link: 'https://sentry.io' },
];

export async function GET(request: Request) {
    return NextResponse.json({ 
        contracts: mockContracts,
        integrations: mockIntegrations
    });
} 