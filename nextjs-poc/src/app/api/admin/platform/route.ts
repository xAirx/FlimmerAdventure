import { NextResponse } from 'next/server';
import type { VersionAdoption, SystemSetting } from '@/types/admin';

const mockVersionAdoption: VersionAdoption[] = [
    { version: '1.3.0', percentage: 15.2, userCount: 327, releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), isForced: false, crashRate: 0.8 },
    { version: '1.2.0', percentage: 68.4, userCount: 1473, releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), isForced: false, crashRate: 0.3 },
];

const initialSystemSettings: SystemSetting[] = [
    { key: 'api_rate_limit', label: 'API Rate Limit', description: 'Requests per user per minute', value: '100', unit: 'req/min' },
    { key: 'new_user_cap', label: 'New User Registration Cap', description: 'Max new users per hour', value: '1000', unit: 'users/hr' },
];

export async function GET(request: Request) {
    return NextResponse.json({ 
        versionAdoption: mockVersionAdoption,
        systemSettings: initialSystemSettings
    });
} 