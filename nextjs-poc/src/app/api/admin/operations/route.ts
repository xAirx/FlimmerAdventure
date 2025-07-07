import { NextResponse } from 'next/server';
import type { ModerationItem, User } from '@/types/admin';

const mockedQueue: ModerationItem[] = [
    { id: 1, title: 'Exploding Volcano Experiment', creator: 'ScienceSam', family: 'Johnson', reason: 'Messy materials', aiStatus: 'pending' },
    { id: 2, title: 'Dancing Challenge Video', creator: 'DancingKid', family: 'Martinez', reason: 'Inappropriate moves', aiStatus: 'flagged' },
];

const allUsers: User[] = [
    { id: 'usr_1', name: 'Alisa Webber', email: 'alisa.webber@email.com', plan: 'Premium Yearly', status: 'Active', lastSeen: '2 hours ago', identityStatus: 'Verified (MitID)' },
    { id: 'usr_2', name: 'John Doe', email: 'john.doe@email.com', plan: 'Premium Monthly', status: 'Active', lastSeen: '1 day ago', identityStatus: 'Unverified' },
];

export async function GET() {
    // In a real app, you'd fetch this from a database
    return NextResponse.json({
        moderationQueue: mockedQueue,
        users: allUsers,
        totalFamilies: 2153,
        activeFamilies: 1847,
        verifiedParents: 1847,
        pendingVerifications: 306,
        safetyAlerts: 12
    });
} 