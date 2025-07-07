'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { 
    ExclamationTriangleIcon,
    UserGroupIcon,
    DocumentTextIcon,
    RocketLaunchIcon,
    CogIcon,
    ShieldCheckIcon,
    CpuChipIcon,
    DocumentCheckIcon,
    ChartBarIcon,
    BellIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    ArrowTrendingUpIcon,
    FireIcon,
    PlayIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title as ChartTitle, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { DarkModeProvider, useDarkMode } from '@/components/DarkModeProvider';

// Mock data and interfaces continue from above...

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    PointElement,
    LineElement,
    ArcElement,
    Filler
);

// --- (All Interfaces) ---
interface ModerationItem { id: number; title: string; creator: string; flaggedBy: string; reason: string; aiStatus: string; family: string; }
interface PlatformAlert { id: number; type: string; severity: string; family?: string; message: string; timestamp: Date; resolved: boolean; details: Record<string, any>; }
interface VersionAdoption { version: string; percentage: number; userCount: number; releaseDate: Date; isForced: boolean; crashRate: number; }
interface ABTest { id: string; name: string; status: string; variants: any[]; startDate: Date; endDate?: Date; }
interface FeatureFlag { key: string; label: string; description: string; rollout: number; enabled: boolean; }
interface SystemSetting { key: string; label: string; description: string; value: string; unit: string; }
interface Vulnerability { id: string; severity: string; description: string; dependency: string; path: string; remediation: string; }
interface MonitoredDependency { name: string; version: string; status: string; license: string; }
interface SecurityEvent { timestamp: string; type: string; description: string; ip: string; }
interface SaasIntegration { name: string; description: string; link: string; }
interface Contract { id: string; name: string; vendor: string; status: string; renewalDate: string; value: string; }
interface SentryIssue { id: string; title: string; events: number; usersAffected: number; lastSeen: string; }
interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  requestBody?: string | null;
  responseBody: string;
}
interface TestResult {
  status: number;
  response: any;
  timestamp: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  lastSeen: string;
  identityStatus: 'Verified (MitID)' | 'Unverified';
}
interface PackageVersion {
  name: string;
  version: string;
  lastRelease: string;
  changelogUrl: string;
  npmUrl: string;
}
interface CuratedVideo {
  id: string;
  youtubeUrl: string;
  title: string;
  description: string;
  category: string;
  quiz?: Quiz;
}
interface Quiz {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}
interface ComplianceItem {
  article: string;
  requirement: string;
  status: 'Implemented' | 'Planned' | 'In Progress';
  solution: string;
}
interface RoadmapTask {
  name: string;
  owner: 'Engineering' | 'Product' | 'Founders';
  weeks: number;
  status: 'Done' | 'In Progress' | 'Next Up' | 'Planned';
}
interface RoadmapPhase {
  name: string;
  description: string;
  tasks: RoadmapTask[];
}
// --- (All Mock Data) ---
const allUsers: User[] = [
    { id: 'usr_1', name: 'Alisa Webber', email: 'alisa.webber@email.com', plan: 'Premium Yearly', status: 'Active', lastSeen: '2 hours ago', identityStatus: 'Verified (MitID)' },
    { id: 'usr_2', name: 'John Doe', email: 'john.doe@email.com', plan: 'Premium Monthly', status: 'Active', lastSeen: '1 day ago', identityStatus: 'Unverified' },
];
const mockedQueue: ModerationItem[] = [
    { id: 1, title: 'Volcano Science', creator: 'ScienceSam', flaggedBy: 'parent123', reason: 'Potentially dangerous materials', aiStatus: 'Rejected', family: 'Johnson' },
    { id: 2, title: 'Art Class Fun', creator: 'CreativeKid', flaggedBy: 'teacher_a', reason: 'Inappropriate language', aiStatus: 'Approved', family: 'Smith' },
];
const mockPlatformAlerts: PlatformAlert[] = [
    { id: 1, type: 'gdpr_request', severity: 'high', family: 'Johnson', message: 'Data export request for child account', timestamp: new Date(), resolved: false, details: { userId: 'usr_child_123' } },
    { id: 2, type: 'api_error', severity: 'medium', message: 'High latency on /api/activity', timestamp: new Date(), resolved: false, details: { averageLatency: '850ms', service: 'bff-service' } },
];
const mockVersionAdoption: VersionAdoption[] = [
    { version: '1.3.0', percentage: 15.2, userCount: 327, releaseDate: new Date('2024-07-20'), isForced: false, crashRate: 0.8 },
    { version: '1.2.5', percentage: 84.8, userCount: 1826, releaseDate: new Date('2024-06-15'), isForced: true, crashRate: 1.1 },
];
const mockABTests: ABTest[] = [{ id: 'onboarding_v2', name: 'New Onboarding Flow', status: 'running', variants: ['Control', 'Variant A'], startDate: new Date('2024-07-10') }];
const initialFeatureFlags: FeatureFlag[] = [{ key: 'new_feed', label: 'New Home Feed', description: 'Enable experimental home feed with AI-assisted recommendations', rollout: 100, enabled: true }];
const initialSystemSettings: SystemSetting[] = [{ key: 'rate_limit', label: 'API Rate Limit', description: 'Maximum requests per minute for a single user', value: '100', unit: 'req/min' }];
const mockVulnerabilities: Vulnerability[] = [{ id: 'SNYK-JS-LODASH-1040724', severity: 'High', description: 'Prototype Pollution', dependency: 'lodash', path: 'server/package.json', remediation: 'Upgrade to version 4.17.21 or later.' }];
const mockDependencies: MonitoredDependency[] = [
    { name: 'react', version: '18.2.0', status: 'Healthy', license: 'MIT' },
    { name: 'next', version: '14.1.0', status: 'Healthy', license: 'MIT' },
    { name: 'tailwindcss', version: '3.3.0', status: 'Healthy', license: 'MIT' }
];
const mockSecurityEvents: SecurityEvent[] = [
    { timestamp: '2024-12-23 14:23:15', type: 'Malicious Content Upload', description: 'AI detected potential CSAM content in video upload attempt', ip: '192.168.1.45' },
    { timestamp: '2024-12-23 13:45:32', type: 'Brute Force Attack', description: 'Multiple failed login attempts detected from same IP', ip: '203.45.67.89' },
    { timestamp: '2024-12-23 12:10:45', type: 'Suspicious API Usage', description: 'Unusual API call patterns detected from verified user', ip: '78.132.45.21' }
];
const mockIntegrations: SaasIntegration[] = [
    { name: 'Stripe', description: 'Payment Processing for subscriptions', link: '#' },
    { name: 'Google Cloud Vision AI', description: 'Content moderation and image analysis', link: '#' },
    { name: 'Sentry', description: 'Error tracking and performance monitoring', link: '#' },
];
const mockContracts: Contract[] = [{ id: 'ctr_01', name: 'Snyk Enterprise', vendor: 'Snyk', status: 'Active', renewalDate: '2025-01-15', value: '$25,000/year' }];
const mockSentryIssues: SentryIssue[] = [{ id: 'SENTRY-123', title: 'TypeError: Cannot read properties of null (reading \'map\')', events: 124, usersAffected: 34, lastSeen: '15 min ago' }];
const hackernewsApi: ApiEndpoint[] = [{ method: 'GET', path: '/api/stories', description: 'Get top stories from Hacker News', responseBody: '{"stories": [...]}' }];
const flimmerApi: ApiEndpoint[] = [{ method: 'POST', path: '/api/login', description: 'User login with credentials', requestBody: '{"email": "...", "password": "..."}', responseBody: '{"token": "..."}' }];

const mockPackageVersions: PackageVersion[] = [
    { name: 'nextjs-poc', version: '1.2.0', lastRelease: '2024-07-05', changelogUrl: '#', npmUrl: '#' },
    { name: 'flimmer-mobile', version: '1.1.3', lastRelease: '2024-07-02', changelogUrl: '#', npmUrl: '#' },
];
const mockCuratedContent: CuratedVideo[] = [
    {
        id: 'vid_1', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'The Science of Slime', description: 'Learn how to make the best slime!', category: 'science',
        quiz: { question: 'What is the main ingredient in slime?', answers: ['Glue', 'Water', 'Borax', 'Food Coloring'], correctAnswerIndex: 0 }
    },
    { id: 'vid_2', youtubeUrl: 'https://www.youtube.com/watch?v=some_other_id', title: 'Building a Volcano', description: 'A fun and safe volcano experiment.', category: 'crafts' }
];
const gdprChecklist: ComplianceItem[] = [
    { article: 'Art. 6', requirement: 'Lawfulness of Processing', status: 'Implemented', solution: 'Consent & Legitimate Interest' },
    { article: 'Art. 7', requirement: 'Conditions for Consent', status: 'Implemented', solution: 'Granular, opt-in controls' },
    { article: 'Art. 8', requirement: 'Children\'s Consent', status: 'Planned', solution: 'Parental verification via NemID/MitID' },
];
const roadmapData: RoadmapPhase[] = [
  {
    name: 'Phase 1: MVP Foundation (CURRENT)', description: 'Core safety infrastructure and basic parent/child interfaces',
    tasks: [ { name: 'Web Admin Dashboard', owner: 'Engineering', weeks: 2, status: 'Done' } ]
  },
  {
    name: 'Phase 2: Safety AI & Core Features', description: 'Essential AI-assisted safety engine and identity verification for market readiness',
    tasks: [ { name: 'Google Cloud Vision AI Integration', owner: 'Engineering', weeks: 2, status: 'In Progress' } ]
  },
];

// AnalyticsTab
const userActivityData = {
    labels: ['Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025'],
    datasets: [{
        label: 'Monthly Active Users (Danish Families)',
        data: [1850, 2340, 2890, 3560, 4820, 6100, 7750, 9200, 11400, 14200, 18300, 22600],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99,102,241,0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366F1',
        pointBorderWidth: 2,
        pointRadius: 4,
    }],
};
const contentEngagementData = {
    labels: ['Child Video Uploads', 'Parent Approvals', 'Safety Quiz Completions', 'Family Comments', 'Diamond Rewards Earned'],
    datasets: [{
        label: 'Platform Engagement (Last 30 Days)',
        data: [8638, 7240, 12450, 15670, 9890],
        backgroundColor: ['#F87171', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        hoverOffset: 8,
    }],
};
const moderationActionsData = {
    labels: ['AI-Assisted Pre-Screened (Safe)', 'AI-Assisted Flagged (Review)', 'Manual Parent Reviews', 'Content Approved', 'Content Rejected', 'Appeals Processed'],
    datasets: [{
        label: 'Content Moderation Pipeline (Last 30 Days)',
        data: [7240, 1398, 1398, 1190, 208, 34],
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 40,
    }],
};
const topPerformingContent = [
    { id: 1, title: 'Emma\'s Baking Adventure: Making Danish Pastries', views: 380200, likes: 24600, creator: 'Emma (Age 11)', category: 'Cooking & Crafts' },
    { id: 2, title: 'Oliver\'s Science Lab: Building a Wind Turbine', views: 346800, likes: 28400, creator: 'Oliver (Age 13)', category: 'STEM & Science' },
    { id: 3, title: 'Maja & Lucas: Teaching Sign Language Basics', views: 298500, likes: 31200, creator: 'Maja & Lucas (Age 9 & 12)', category: 'Education & Language' },
    { id: 4, title: 'Astrid\'s Art Corner: Digital Drawing Tutorial', views: 267300, likes: 19800, creator: 'Astrid (Age 10)', category: 'Arts & Creativity' },
    { id: 5, title: 'Noah\'s Nature Walk: Identifying Danish Birds', views: 234700, likes: 16900, creator: 'Noah (Age 8)', category: 'Nature & Environment' },
];

// Headline metrics to accompany visuals
const platformMetrics = {
    activeUsers: 22600,  // Current monthly active users from the chart
    uploads24h: 432,     // Daily video uploads from children
    aiBlocks24h: 64,     // AI-assisted safety flags in last 24h
};

// SecurityTab
const profanityList = [
    { id: 1, word: 'badword1', addedBy: 'admin', timestamp: '2023-10-26' },
    { id: 2, word: 'heck', addedBy: 'moderator_a', timestamp: '2023-10-25' },
    { id: 3, word: 'darn', addedBy: 'admin', timestamp: '2023-10-24' },
];
const flaggedContent = [
    { id: 1, content: 'This is some really badword1 content.', reason: 'Profanity Detected', status: 'Pending Review' },
    { id: 2, content: 'I heckin\' love this video!', reason: 'Profanity Detected', status: 'Resolved' },
    { id: 3, content: 'What the darn is going on here?', reason: 'Profanity Detected', status: 'Pending Review' },
];

// AITab
const aiPerformanceMetrics = {
    accuracy: 98.2,
    precision: 97.5,
    recall: 99.1,
    model_version: 'v2.1.3-alpha'
};
const aiDecisionLog = [
    { id: 'a1', timestamp: '2024-12-23 14:45:23', video_id: 'vid_8472_frame_245', decision: 'BLOCKED', confidence: 99.8, reason: 'Potential harmful content detected in video frame', processingTime: '167ms', flaggedFeatures: ['inappropriate_gesture', 'potential_weapon'], reviewRequired: true, escalated: true, parentNotified: true },
    { id: 'b2', timestamp: '2024-12-23 14:42:18', video_id: 'txt_9284_comment_12', decision: 'APPROVED', confidence: 94.2, reason: 'Clean educational content with positive sentiment', processingTime: '89ms', flaggedFeatures: [], reviewRequired: false, escalated: false, parentNotified: false },
    { id: 'c3', timestamp: '2024-12-23 14:38:45', video_id: 'usr_5647_behavior_pattern', decision: 'FLAGGED', confidence: 76.4, reason: 'Unusual upload frequency detected - monitoring enhanced', processingTime: '334ms', flaggedFeatures: ['upload_spike', 'time_pattern_anomaly'], reviewRequired: true, escalated: false, parentNotified: false },
    { id: 'd4', timestamp: '2024-12-23 14:35:12', video_id: 'rec_request_usr_3829', decision: 'PERSONALIZED', confidence: 91.7, reason: 'Curated educational content matching user interests and safety profile', processingTime: '67ms', flaggedFeatures: ['age_appropriate', 'educational_value'], reviewRequired: false, escalated: false, parentNotified: false }
];

// Mock data for ContentManagementTab
const videoContent = [
    { id: 'v1', title: 'Funniest Cat Moments', uploader: 'user123', status: 'Live', views: 250000, flagged: false },
    { id: 'v2', title: 'How to build a PC', uploader: 'techguru', status: 'Live', views: 120000, flagged: false },
    { id: 'v3', title: 'Controversial Opinion Video', uploader: 'punditx', status: 'Under Review', views: 5000, flagged: true },
    { id: 'v4', title: 'My Awesome Vacation', uploader: 'traveler22', status: 'Removed', views: 100, flagged: true },
];

// Mock data for ComplianceTab
const complianceStatus = {
    gdpr: { status: 'Compliant', lastAudit: '2024-07-01' },
    coppa: { status: 'Compliant', lastAudit: '2024-06-15' },
    'accessibility (wcag)': { status: 'Partially Compliant', lastAudit: '2024-07-10' },
};

const dataRequests = [
    { id: 'dr-001', type: 'Data Deletion', user: 'user999', status: 'Completed', date: '2024-07-20' },
    { id: 'dr-002', type: 'Data Export', user: 'user888', status: 'Pending', date: '2024-07-22' },
];

// --- (All Tab Components) ---

const OperationsTab = ({ moderationQueue, users }: { moderationQueue: any[], users: User[] }) => {
    const { isDark } = useDarkMode();
    const [selectedAlert, setSelectedAlert] = useState<any>(null);
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const enhancedSafetyAlerts = [
        {
            id: 1, family: 'Johnson Family', child: 'Emma Johnson (12)', type: 'Content Safety', severity: 'HIGH',
            description: 'AI-assisted system flagged potentially dangerous chemistry experiment video for parent review', timeAgo: '12 minutes ago',
            aiConfidence: 94.2, previousIncidents: 2, parentNotified: true, location: 'Copenhagen',
            riskScore: 8.7, escalationLevel: 'Immediate Review Required',
            details: { contentType: 'Video Upload', flaggedContent: 'Chemical mixing demonstration', aiReason: 'Detected unsafe chemical handling practices', duration: '3:24' }
        },
        {
            id: 2, family: 'Martinez Family', child: 'Sofia Martinez (9)', type: 'Privacy Concern', severity: 'MEDIUM',
            description: 'AI-assisted system flagged personal information in video description for parent review', timeAgo: '1 hour ago',
            aiConfidence: 87.5, previousIncidents: 0, parentNotified: false, location: 'Aarhus',
            riskScore: 5.2, escalationLevel: 'Standard Review',
            details: { contentType: 'Video Description', flaggedContent: 'Mentioned school name and address', aiReason: 'PII detection algorithm triggered', duration: 'N/A' }
        },
        {
            id: 3, family: 'Nielsen Family', child: 'Lars Nielsen (11)', type: 'Content Violation', severity: 'LOW',
            description: 'AI-assisted system flagged inappropriate language in gaming video for parent review', timeAgo: '2 hours ago',
            aiConfidence: 76.3, previousIncidents: 1, parentNotified: true, location: 'Odense',
            riskScore: 3.1, escalationLevel: 'Auto-moderated',
            details: { contentType: 'Audio Transcript', flaggedContent: 'Mild profanity during gameplay', aiReason: 'Language filter triggered', duration: '8:15' }
        }
    ];

    const contentModerationStats = {
        totalReviews: 2847,
        pendingReviews: 34,
        autoApproved: 2156,
        rejected: 157,
        averageReviewTime: '2.3 minutes',
        escalationRate: '12.4%'
    };

    const filteredAlerts = enhancedSafetyAlerts.filter(alert => {
        const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity.toUpperCase();
        const matchesType = filterType === 'all' || alert.type.toLowerCase().includes(filterType.toLowerCase());
        const matchesSearch = searchTerm === '' || 
            alert.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSeverity && matchesType && matchesSearch;
    });

    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRiskScoreColor = (score: number) => {
        if (score >= 8) return 'text-red-600 bg-red-50';
        if (score >= 5) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <div className={`space-y-8 min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Trust & Safety Operations</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Real-time monitoring and incident response for child safety</p>
                </div>
                <div className="flex space-x-3">
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        Generate Safety Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Safety Alerts</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{filteredAlerts.length}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-red-600">3 High Priority</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <BellIcon className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
                
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Content Reviews (24h)</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentModerationStats.totalReviews}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-green-600">+15.3% vs yesterday</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <EyeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Auto-Approval Rate</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>75.7%</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-green-600">+2.1% efficiency gain</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response Time</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentModerationStats.averageReviewTime}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-blue-600">-45s improvement</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <ClockIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Safety Alerts Management */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Safety Alert Dashboard</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Real-time monitoring of child safety incidents</p>
                        </div>
                        <div className="flex space-x-3">
                            <input 
                                type="text" 
                                placeholder="Search alerts..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                            <select 
                                value={filterSeverity} 
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="all">All Severities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={isDark ? 'bg-gray-750' : 'bg-gray-50'}>
                            <tr>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Alert Details</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Family</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Risk Assessment</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>AI Analysis</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{alert.type}</p>
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{alert.description}</p>
                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{alert.timeAgo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{alert.family}</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{alert.child}</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{alert.location}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskScoreColor(alert.riskScore)}`}>
                                                Risk: {alert.riskScore}/10
                                            </div>
                                        </div>
                                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{alert.escalationLevel}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mr-2`}>
                                                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${alert.aiConfidence}%`}}></div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-xs mr-1">🧠</span>
                                                <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{alert.aiConfidence}%</span>
                                            </div>
                                        </div>
                                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>AI Confidence</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => setSelectedAlert(alert)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        >
                                            Review
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors">
                                            Resolve
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 transition-colors">
                                            Escalate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert Detail Modal */}
            {selectedAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-2xl w-full rounded-xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Safety Alert Details - {selectedAlert.type}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(selectedAlert.details).map(([key, value]) => (
                                    <div key={key}>
                                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                            <button 
                                onClick={() => setSelectedAlert(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Close
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                                Take Action
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProductTab = () => {
    const { isDark } = useDarkMode();
    const [featureFlags, setFeatureFlags] = useState([
        {
            key: 'ai_content_recommendations', label: 'AI-Assisted Content Recommendations', 
            description: 'Enable AI-assisted content suggestions to help parents make informed decisions about child interests and safety',
            rollout: 25, enabled: true, environment: 'production', owner: 'Product Team',
            lastModified: '2024-12-20', modifiedBy: 'Sarah Nielsen', 
            targeting: 'Premium users in Denmark', impact: 'High', userCount: 5650,
            metrics: { ctr: '12.4%', engagement: '+23%', satisfaction: '4.2/5' }
        },
        {
            key: 'gamified_safety_quiz', label: 'Gamified Safety Education', 
            description: 'Interactive safety quizzes with diamond rewards and progress tracking',
            rollout: 75, enabled: true, environment: 'production', owner: 'Education Team',
            lastModified: '2024-12-18', modifiedBy: 'Dr. Erik Larsen', 
            targeting: 'All verified families', impact: 'Medium', userCount: 16950,
            metrics: { completion: '87%', retention: '+31%', satisfaction: '4.6/5' }
        },
        {
            key: 'advanced_parental_controls', label: 'Advanced Parental Dashboard', 
            description: 'Enhanced parent interface with detailed analytics and real-time notifications',
            rollout: 50, enabled: true, environment: 'staging', owner: 'Product Team',
            lastModified: '2024-12-22', modifiedBy: 'Lisa Andersen', 
            targeting: 'Beta program participants', impact: 'High', userCount: 1130,
            metrics: { usage: '68%', feedback: '4.1/5', retention: '+18%' }
        },
        {
            key: 'nemid_verification_v2', label: 'Enhanced NemID Integration', 
            description: 'Streamlined NemID verification process with improved UX and faster processing',
            rollout: 10, enabled: false, environment: 'development', owner: 'Security Team',
            lastModified: '2024-12-23', modifiedBy: 'Security Team', 
            targeting: 'Test users only', impact: 'Critical', userCount: 50,
            metrics: { success_rate: '94%', time_saved: '45s', errors: '-67%' }
        },
        {
            key: 'video_collaboration_tools', label: 'Child Video Collaboration', 
            description: 'Allow verified children to collaborate on video projects with safety monitoring',
            rollout: 0, enabled: false, environment: 'development', owner: 'Product Team',
            lastModified: '2024-12-15', modifiedBy: 'Product Team', 
            targeting: 'Not yet targeted', impact: 'Medium', userCount: 0,
            metrics: { interest: '78%', safety_score: '9.2/10', development: '40%' }
        }
    ]);
    
    const [selectedFlag, setSelectedFlag] = useState<any>(null);
    const [filterEnvironment, setFilterEnvironment] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const flagStats = {
        total: featureFlags.length,
        enabled: featureFlags.filter(f => f.enabled).length,
        production: featureFlags.filter(f => f.environment === 'production').length,
        avgRollout: featureFlags.reduce((sum, f) => sum + f.rollout, 0) / featureFlags.length,
        totalUsers: featureFlags.reduce((sum, f) => sum + f.userCount, 0)
    };

    const handleToggle = (key: string) => {
        setFeatureFlags(featureFlags.map(flag => 
            flag.key === key ? { ...flag, enabled: !flag.enabled, lastModified: new Date().toISOString().split('T')[0] } : flag
        ));
    };

    const handleRolloutChange = (key: string, value: number) => {
        setFeatureFlags(featureFlags.map(flag => 
            flag.key === key ? { ...flag, rollout: value, lastModified: new Date().toISOString().split('T')[0] } : flag
        ));
    };

    const getEnvironmentColor = (env: string) => {
        switch(env) {
            case 'production': return 'bg-green-100 text-green-800 border-green-200';
            case 'staging': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'development': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getImpactColor = (impact: string) => {
        switch(impact) {
            case 'Critical': return 'text-red-600 bg-red-50';
            case 'High': return 'text-orange-600 bg-orange-50';
            case 'Medium': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredFlags = featureFlags.filter(flag => {
        const matchesSearch = flag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             flag.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEnvironment = filterEnvironment === 'all' || flag.environment === filterEnvironment;
        return matchesSearch && matchesEnvironment;
    });

    return (
        <div className={`space-y-8 min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Feature Flag Management</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Dynamic feature control with Firebase Remote Config</p>
                </div>
                <div className="flex space-x-3">
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        Export Configuration
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-600/20">
                        Create Feature Flag
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Flags</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{flagStats.total}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Flags</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{flagStats.enabled}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>In Production</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{flagStats.production}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rollout</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{flagStats.avgRollout.toFixed(0)}%</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Affected Users</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{flagStats.totalUsers.toLocaleString()}</p>
                </div>
            </div>

            {/* Feature Flags Table */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Feature Flag Dashboard</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage feature rollouts across environments</p>
                        </div>
                        <div className="flex space-x-3">
                            <input 
                                type="text" 
                                placeholder="Search flags..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                            <select 
                                value={filterEnvironment} 
                                onChange={(e) => setFilterEnvironment(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="all">All Environments</option>
                                <option value="production">Production</option>
                                <option value="staging">Staging</option>
                                <option value="development">Development</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4 p-6">
                    {filteredFlags.map((flag) => (
                        <div key={flag.key} className={`rounded-lg border p-6 transition-all hover:shadow-md ${isDark ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{flag.label}</h4>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEnvironmentColor(flag.environment)}`}>
                                            {flag.environment}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(flag.impact)}`}>
                                            {flag.impact} Impact
                                        </span>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{flag.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Key</p>
                                            <p className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{flag.key}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Owner</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{flag.owner}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Users Affected</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{flag.userCount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last Modified</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{flag.lastModified}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {Object.entries(flag.metrics).map(([key, value]) => (
                                            <div key={key}>
                                                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{key.toUpperCase()}:</span>
                                                <span className={`ml-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6 ml-6">
                                    <div className="text-center">
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Rollout</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={flag.rollout}
                                                onChange={(e) => handleRolloutChange(flag.key, parseInt(e.target.value))}
                                                className="w-24"
                                                disabled={!flag.enabled}
                                            />
                                            <span className={`text-sm font-medium min-w-[3rem] ${isDark ? 'text-white' : 'text-gray-900'}`}>{flag.rollout}%</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                        <button
                                            onClick={() => handleToggle(flag.key)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full mt-1 transition-colors ${
                                                flag.enabled ? 'bg-indigo-600' : isDark ? 'bg-gray-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                    flag.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedFlag(flag)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flag Details Modal */}
            {selectedFlag && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-2xl w-full rounded-xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Feature Flag: {selectedFlag.label}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Targeting</p>
                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedFlag.targeting}</p>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Modified By</p>
                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedFlag.modifiedBy}</p>
                                </div>
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Performance Metrics</p>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    {Object.entries(selectedFlag.metrics).map(([key, value]) => (
                                        <div key={key} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{key.toUpperCase()}</p>
                                            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{String(value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                            <button 
                                onClick={() => setSelectedFlag(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PlatformTab = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Platform & Infrastructure</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <Title>Version Adoption</Title>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Version</TableHeaderCell>
                            <TableHeaderCell>Users</TableHeaderCell>
                            <TableHeaderCell>%</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockVersionAdoption.map((version) => (
                            <TableRow key={version.version}>
                                <TableCell>{version.version}</TableCell>
                                <TableCell>{version.userCount}</TableCell>
                                <TableCell>{version.percentage}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Card>
                <Title>Package Versions</Title>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Package</TableHeaderCell>
                            <TableHeaderCell>Version</TableHeaderCell>
                            <TableHeaderCell>Last Release</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockPackageVersions.map((pkg) => (
                            <TableRow key={pkg.name}>
                                <TableCell>{pkg.name}</TableCell>
                                <TableCell>{pkg.version}</TableCell>
                                <TableCell>{pkg.lastRelease}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    </div>
);

const ComplianceTab = () => {
    const { isDark } = useDarkMode();
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRegulation, setFilterRegulation] = useState('all');
    const [timeRange, setTimeRange] = useState('30d');

    const complianceMetrics = {
        overallScore: 96.8,
        activeRequests: 12,
        avgResponseTime: '18 hours',
        nextAuditDate: '2025-03-15',
        certificationsValid: 8,
        riskLevel: 'Low'
    };

    const enhancedDataRequests = [
        {
            id: 'DSAR-2024-001', type: 'Data Export', requestor: 'Lars Nielsen', email: 'lars.n@email.dk',
            status: 'Completed', priority: 'Medium', submittedDate: '2024-12-20', completedDate: '2024-12-22',
            regulation: 'GDPR Article 20', dataTypes: ['Profile Data', 'Video Content', 'Chat Messages'],
            requestDetails: 'Full data export for account migration to new family device',
            processingTime: '2 days', assignedTo: 'Privacy Team', fileSize: '245 MB'
        },
        {
            id: 'DSAR-2024-002', type: 'Data Deletion', requestor: 'Emma Andersen', email: 'emma.a@email.dk',
            status: 'In Progress', priority: 'High', submittedDate: '2024-12-22', completedDate: null,
            regulation: 'GDPR Article 17', dataTypes: ['All Personal Data', 'Biometric Data', 'Location History'],
            requestDetails: 'Complete account deletion due to child age policy change',
            processingTime: 'Target: 24 hours', assignedTo: 'Data Protection Officer', fileSize: null
        },
        {
            id: 'DSAR-2024-003', type: 'Data Rectification', requestor: 'Sofia Martinez', email: 'sofia.m@email.dk',
            status: 'Under Review', priority: 'Low', submittedDate: '2024-12-23', completedDate: null,
            regulation: 'GDPR Article 16', dataTypes: ['Profile Information', 'Parental Controls'],
            requestDetails: 'Correction of birthdate and family relationship details',
            processingTime: 'Target: 72 hours', assignedTo: 'Support Team', fileSize: null
        },
        {
            id: 'COPPA-2024-004', type: 'Consent Withdrawal', requestor: 'Thomas Johnson', email: 'thomas.j@email.dk',
            status: 'Escalated', priority: 'Critical', submittedDate: '2024-12-21', completedDate: null,
            regulation: 'COPPA Section 312.5', dataTypes: ['Child Data', 'Behavioral Analytics', 'AI Training Data'],
            requestDetails: 'Withdrawal of parental consent for AI data processing',
            processingTime: 'Overdue: 2 days', assignedTo: 'Legal Team', fileSize: null
        }
    ];

    const enhancedGDPRChecklist = [
        {
            article: 'Art. 6', requirement: 'Lawfulness of Processing', status: 'Implemented',
            solution: 'Consent & Legitimate Interest framework with granular controls',
            lastAudit: '2024-12-01', nextReview: '2025-06-01', riskLevel: 'Low',
            evidence: ['Privacy Policy v3.2', 'Consent Management System', 'Legal Basis Documentation']
        },
        {
            article: 'Art. 7', requirement: 'Conditions for Consent', status: 'Implemented',
            solution: 'Clear, specific, informed consent with easy withdrawal mechanisms',
            lastAudit: '2024-11-15', nextReview: '2025-05-15', riskLevel: 'Low',
            evidence: ['Consent UI Screenshots', 'Withdrawal Process Documentation', 'User Journey Maps']
        },
        {
            article: 'Art. 8', requirement: 'Children\'s Consent & Parental Authorization', status: 'In Progress',
            solution: 'MitID verification system for Danish parents with enhanced age verification',
            lastAudit: '2024-12-10', nextReview: '2025-01-15', riskLevel: 'Medium',
            evidence: ['MitID Integration Specs', 'Age Verification Flow', 'Parental Control Interface']
        },
        {
            article: 'Art. 12-14', requirement: 'Transparent Information & Communication', status: 'Implemented',
            solution: 'Child-friendly privacy notices with visual explanations and parent summaries',
            lastAudit: '2024-11-20', nextReview: '2025-05-20', riskLevel: 'Low',
            evidence: ['Privacy Notice for Children', 'Parent Information Pack', 'Readability Analysis']
        },
        {
            article: 'Art. 15-22', requirement: 'Data Subject Rights', status: 'Implemented',
            solution: 'Automated DSAR processing system with 30-day response guarantee',
            lastAudit: '2024-12-05', nextReview: '2025-06-05', riskLevel: 'Low',
            evidence: ['DSAR Processing System', 'Response Time Analytics', 'Rights Exercise Portal']
        },
        {
            article: 'Art. 25', requirement: 'Data Protection by Design', status: 'Planned',
            solution: 'Privacy-first architecture review and data minimization audit',
            lastAudit: null, nextReview: '2025-02-01', riskLevel: 'Medium',
            evidence: ['Architecture Review Plan', 'Data Flow Mapping', 'Minimization Strategy']
        }
    ];

    const regulatoryFrameworks = [
        {
            name: 'GDPR', fullName: 'General Data Protection Regulation', region: 'EU',
            complianceLevel: 94, lastAudit: '2024-11-15', nextAudit: '2025-05-15',
            certificationStatus: 'Compliant', criticalIssues: 0, totalRequirements: 47, implemented: 44
        },
        {
            name: 'COPPA', fullName: 'Children\'s Online Privacy Protection Act', region: 'US',
            complianceLevel: 98, lastAudit: '2024-12-01', nextAudit: '2025-06-01',
            certificationStatus: 'Fully Compliant', criticalIssues: 0, totalRequirements: 12, implemented: 12
        },
        {
            name: 'Danish Data Protection Act', fullName: 'Databeskyttelsesloven', region: 'Denmark',
            complianceLevel: 96, lastAudit: '2024-10-30', nextAudit: '2025-04-30',
            certificationStatus: 'Compliant', criticalIssues: 0, totalRequirements: 23, implemented: 22
        },
        {
            name: 'ISO 27001', fullName: 'Information Security Management', region: 'International',
            complianceLevel: 92, lastAudit: '2024-09-15', nextAudit: '2025-03-15',
            certificationStatus: 'Certified', criticalIssues: 1, totalRequirements: 114, implemented: 105
        }
    ];

    const privacyImpactAssessments = [
        {
            id: 'PIA-001', title: 'AI Content Moderation System', status: 'Approved',
            riskLevel: 'Medium', completedDate: '2024-11-20', reviewDate: '2025-11-20',
            dataTypes: ['Video Content', 'User Behavior', 'AI Training Data'],
            mitigations: ['Data Anonymization', 'Purpose Limitation', 'Retention Limits']
        },
        {
            id: 'PIA-002', title: 'NemID Integration for Parent Verification', status: 'In Review',
            riskLevel: 'High', completedDate: null, reviewDate: '2025-01-15',
            dataTypes: ['Government ID', 'Biometric Data', 'Family Relationships'],
            mitigations: ['Encryption at Rest', 'Purpose Binding', 'Access Controls']
        },
        {
            id: 'PIA-003', title: 'Behavioral Analytics for Safety', status: 'Draft',
            riskLevel: 'High', completedDate: null, reviewDate: '2025-02-01',
            dataTypes: ['Usage Patterns', 'Social Interactions', 'Risk Indicators'],
            mitigations: ['Opt-in Consent', 'Data Minimization', 'Regular Audits']
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Implemented': case 'Completed': case 'Compliant': case 'Fully Compliant': case 'Certified': case 'Approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'In Progress': case 'Under Review': case 'In Review':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Planned': case 'Draft':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Escalated': case 'Overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-600 bg-red-50';
            case 'High': return 'text-orange-600 bg-orange-50';
            case 'Medium': return 'text-yellow-600 bg-yellow-50';
            case 'Low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getRiskLevelColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'text-green-600 bg-green-50';
            case 'Medium': return 'text-yellow-600 bg-yellow-50';
            case 'High': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredRequests = enhancedDataRequests.filter(request => {
        const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
        const matchesRegulation = filterRegulation === 'all' || request.regulation.includes(filterRegulation);
        return matchesStatus && matchesRegulation;
    });

    return (
        <div className={`space-y-8 min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Compliance & Data Protection</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>GDPR, COPPA, and regulatory compliance monitoring</p>
                </div>
                <div className="flex space-x-3">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="1y">Last Year</option>
                    </select>
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        Compliance Report
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Create PIA
                    </button>
                </div>
            </div>

            {/* Compliance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Overall Score</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{complianceMetrics.overallScore}%</p>
                    <p className={`text-xs mt-1 text-green-600`}>Excellent</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active DSARs</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{complianceMetrics.activeRequests}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending review</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{complianceMetrics.avgResponseTime}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Target: 72h</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Next Audit</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{complianceMetrics.nextAuditDate}</p>
                    <p className={`text-xs mt-1 text-blue-600`}>ISO 27001</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Certifications</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{complianceMetrics.certificationsValid}</p>
                    <p className={`text-xs mt-1 text-green-600`}>All valid</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Risk Level</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{complianceMetrics.riskLevel}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Acceptable</p>
                </div>
            </div>

            {/* Data Subject Access Requests (DSAR) Management */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Data Subject Access Requests (DSAR)</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GDPR Article 15-22 request processing and response tracking</p>
                        </div>
                        <div className="flex space-x-3">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="all">All Status</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Escalated">Escalated</option>
                            </select>
                            <select 
                                value={filterRegulation} 
                                onChange={(e) => setFilterRegulation(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="all">All Regulations</option>
                                <option value="GDPR">GDPR</option>
                                <option value="COPPA">COPPA</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={isDark ? 'bg-gray-750' : 'bg-gray-50'}>
                            <tr>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Request Details</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Requestor</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Data Types</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status & Timeline</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{request.id}</p>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                                    {request.priority}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{request.type}</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{request.regulation}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{request.requestor}</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{request.email}</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Assigned: {request.assignedTo}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {request.dataTypes.map((type) => (
                                                <span key={type} className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                        {request.fileSize && (
                                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Size: {request.fileSize}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Submitted: {request.submittedDate}
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {request.processingTime}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => setSelectedRequest(request)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        >
                                            Review
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors">
                                            Process
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Regulatory Compliance & GDPR Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regulatory Frameworks */}
                <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Regulatory Compliance</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Multi-jurisdiction compliance status</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {regulatoryFrameworks.map((framework) => (
                            <div key={framework.name} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{framework.name}</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{framework.fullName}</p>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{framework.region}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(framework.certificationStatus)}`}>
                                        {framework.certificationStatus}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Compliance</span>
                                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{framework.complianceLevel}%</span>
                                </div>
                                <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2 mb-2`}>
                                    <div className={`h-2 rounded-full ${framework.complianceLevel >= 95 ? 'bg-green-500' : framework.complianceLevel >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                         style={{width: `${framework.complianceLevel}%`}}></div>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{framework.implemented}/{framework.totalRequirements} requirements</span>
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Next audit: {framework.nextAudit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GDPR Compliance Checklist */}
                <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>GDPR Implementation</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Article-by-article compliance tracking</p>
                    </div>
                    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                        {enhancedGDPRChecklist.map((item, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`text-sm font-mono font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{item.article}</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(item.riskLevel)}`}>
                                                {item.riskLevel} Risk
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.requirement}</p>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{item.solution}</p>
                                        <div className="flex justify-between text-xs mt-2">
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Last audit: {item.lastAudit || 'N/A'}</span>
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Review: {item.nextReview}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Privacy Impact Assessments */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Privacy Impact Assessments (PIA)</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GDPR Article 35 compliance for high-risk processing</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {privacyImpactAssessments.map((pia) => (
                            <div key={pia.id} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{pia.title}</h4>
                                        <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{pia.id}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(pia.riskLevel)}`}>
                                        {pia.riskLevel}
                                    </span>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-3 ${getStatusColor(pia.status)}`}>
                                    {pia.status}
                                </span>
                                <div className="space-y-2">
                                    <div>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Data Types:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {pia.dataTypes.slice(0, 2).map((type) => (
                                                <span key={type} className={`px-1 py-0.5 text-xs rounded ${isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                                                    {type}
                                                </span>
                                            ))}
                                            {pia.dataTypes.length > 2 && (
                                                <span className={`px-1 py-0.5 text-xs rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                                    +{pia.dataTypes.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Review: {pia.reviewDate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DSAR Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-2xl w-full rounded-xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                DSAR Details: {selectedRequest.id}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Request Details</p>
                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedRequest.requestDetails}</p>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Regulation</p>
                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedRequest.regulation}</p>
                                </div>
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Data Types Involved</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedRequest.dataTypes.map((type) => (
                                        <span key={type} className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Close
                            </button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                Process Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ContentManagementTab = () => {
    const { isDark } = useDarkMode();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [curatedContent, setCuratedContent] = useState(mockCuratedContent);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [newVideo, setNewVideo] = useState({ youtubeUrl: '', title: '', description: '', category: 'science', hasQuiz: false });
    const [newQuiz, setNewQuiz] = useState({ question: '', answers: ['', '', '', ''], correctAnswerIndex: 0 });
    const [selectedContent, setSelectedContent] = useState<string[]>([]);

    // Enhanced mock data with more realistic content library
    const enhancedCuratedContent = [
        {
            id: 'vid_1', youtubeUrl: 'https://youtube.com/watch?v=abc123', 
            title: 'Safe Chemistry: Making Slime at Home', description: 'Learn safe chemistry principles through fun slime experiments', 
            category: 'STEM & Science', status: 'Live', views: 45200, likes: 3400, 
            dateAdded: '2024-12-15', lastUpdated: '2024-12-20', approvedBy: 'Dr. Sarah Nielsen',
            quiz: { question: 'What should you always wear when doing chemistry experiments?', answers: ['Safety goggles', 'Regular glasses', 'Nothing', 'Sunglasses'], correctAnswerIndex: 0 },
            safetyRating: 9.2, ageGroup: '8-12', duration: '8:34', language: 'Danish'
        },
        {
            id: 'vid_2', youtubeUrl: 'https://youtube.com/watch?v=def456', 
            title: 'Digital Art Masterclass for Kids', description: 'Professional digital art techniques for young creators', 
            category: 'Arts & Creativity', status: 'Live', views: 32800, likes: 2890, 
            dateAdded: '2024-12-18', lastUpdated: '2024-12-19', approvedBy: 'Lisa Andersen',
            safetyRating: 10.0, ageGroup: '10-16', duration: '12:15', language: 'Danish'
        },
        {
            id: 'vid_3', youtubeUrl: 'https://youtube.com/watch?v=ghi789', 
            title: 'Traditional Danish Baking: Kringle Workshop', description: 'Learn to bake authentic Danish pastries with proper techniques', 
            category: 'Cooking & Crafts', status: 'Under Review', views: 0, likes: 0, 
            dateAdded: '2024-12-22', lastUpdated: '2024-12-22', approvedBy: 'Pending',
            quiz: { question: 'What temperature should the oven be for baking kringle?', answers: ['175°C', '200°C', '150°C', '225°C'], correctAnswerIndex: 0 },
            safetyRating: 8.8, ageGroup: '12+', duration: '15:42', language: 'Danish'
        },
        {
            id: 'vid_4', youtubeUrl: 'https://youtube.com/watch?v=jkl012', 
            title: 'Nature Photography: Capturing Danish Wildlife', description: 'Professional photography tips for young nature enthusiasts', 
            category: 'Nature & Environment', status: 'Live', views: 28700, likes: 2100, 
            dateAdded: '2024-12-10', lastUpdated: '2024-12-12', approvedBy: 'Prof. Erik Larsen',
            safetyRating: 9.5, ageGroup: '8-16', duration: '10:28', language: 'Danish'
        }
    ];

    const contentStats = {
        totalVideos: enhancedCuratedContent.length,
        liveVideos: enhancedCuratedContent.filter(v => v.status === 'Live').length,
        pendingReview: enhancedCuratedContent.filter(v => v.status === 'Under Review').length,
        totalViews: enhancedCuratedContent.reduce((sum, v) => sum + v.views, 0),
        averageSafetyRating: enhancedCuratedContent.reduce((sum, v) => sum + v.safetyRating, 0) / enhancedCuratedContent.length,
        quizzesAttached: enhancedCuratedContent.filter(v => v.quiz).length
    };

    const handleAddContent = () => {
        const videoToAdd = {
            id: `vid_${Date.now()}`,
            ...newVideo,
            status: 'Under Review',
            views: 0,
            likes: 0,
            dateAdded: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            approvedBy: 'Pending',
            safetyRating: 0,
            ageGroup: 'TBD',
            duration: '0:00',
            language: 'Danish',
            quiz: newVideo.hasQuiz ? newQuiz : undefined
        };
        setCuratedContent([...curatedContent, videoToAdd]);
        setShowAddModal(false);
        setNewVideo({ youtubeUrl: '', title: '', description: '', category: 'science', hasQuiz: false });
        setNewQuiz({ question: '', answers: ['', '', '', ''], correctAnswerIndex: 0 });
    };

    const handleBulkAction = (action: string) => {
        console.log(`Bulk ${action} for items:`, selectedContent);
        setSelectedContent([]);
        setShowBulkModal(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Live': return 'bg-green-100 text-green-800 border-green-200';
            case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Removed': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSafetyRatingColor = (rating: number) => {
        if (rating >= 9) return 'text-green-600 bg-green-50';
        if (rating >= 7) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const filteredContent = enhancedCuratedContent.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             content.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || content.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className={`space-y-8 min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dynamic Content Management</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Curated educational content with remote configuration</p>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => setShowBulkModal(true)}
                        disabled={selectedContent.length === 0}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            selectedContent.length > 0 
                                ? 'border-indigo-300 text-indigo-700 hover:bg-indigo-50' 
                                : isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-400'
                        }`}
                    >
                        Bulk Actions ({selectedContent.length})
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Add Curated Content
                    </button>
                </div>
            </div>

            {/* Content Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Videos</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentStats.totalVideos}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Live Content</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentStats.liveVideos}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending Review</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentStats.pendingReview}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentStats.totalViews.toLocaleString()}</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Safety Rating</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentStats.averageSafetyRating.toFixed(1)}/10</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>With Quizzes</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{contentStats.quizzesAttached}</p>
                </div>
            </div>

            {/* Content Management Table */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Content Library</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage curated educational videos and safety quizzes</p>
                        </div>
                        <div className="flex space-x-3">
                            <input 
                                type="text" 
                                placeholder="Search content..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="all">All Categories</option>
                                <option value="STEM & Science">STEM & Science</option>
                                <option value="Arts & Creativity">Arts & Creativity</option>
                                <option value="Cooking & Crafts">Cooking & Crafts</option>
                                <option value="Nature & Environment">Nature & Environment</option>
                            </select>
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="all">All Status</option>
                                <option value="Live">Live</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Removed">Removed</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={isDark ? 'bg-gray-750' : 'bg-gray-50'}>
                            <tr>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    <input type="checkbox" className="rounded" />
                                </th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Content Details</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Performance</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Safety & Quiz</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                            {filteredContent.map((content) => (
                                <tr key={content.id} className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedContent.includes(content.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedContent([...selectedContent, content.id]);
                                                } else {
                                                    setSelectedContent(selectedContent.filter(id => id !== content.id));
                                                }
                                            }}
                                            className="rounded" 
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                {content.duration}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{content.title}</p>
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{content.category}</p>
                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Added {content.dateAdded}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{content.views.toLocaleString()} views</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{content.likes.toLocaleString()} likes</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Age: {content.ageGroup}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSafetyRatingColor(content.safetyRating)}`}>
                                                Safety: {content.safetyRating}/10
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {content.quiz ? '✓ Quiz Attached' : '○ No Quiz'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                                                {content.status}
                                            </span>
                                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                By: {content.approvedBy}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors">Edit</button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors">Publish</button>
                                        <button className="text-red-600 hover:text-red-900 transition-colors">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Content Modal - Enhanced */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-4xl w-full rounded-xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Add Curated Educational Content
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Content will be pushed to Firebase Remote Config for instant mobile app updates
                            </p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Video Information</h4>
                                    <input
                                        type="url"
                                        placeholder="YouTube URL"
                                        value={newVideo.youtubeUrl}
                                        onChange={(e) => setNewVideo({...newVideo, youtubeUrl: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Video Title"
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                    <textarea
                                        placeholder="Educational Description"
                                        value={newVideo.description}
                                        onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                        rows={3}
                                    />
                                    <select
                                        value={newVideo.category}
                                        onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="science">STEM & Science</option>
                                        <option value="crafts">Arts & Creativity</option>
                                        <option value="cooking">Cooking & Crafts</option>
                                        <option value="nature">Nature & Environment</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Safety Quiz</h4>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newVideo.hasQuiz}
                                                onChange={(e) => setNewVideo({...newVideo, hasQuiz: e.target.checked})}
                                                className="mr-2"
                                            />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Attach Educational Quiz</span>
                                        </label>
                                    </div>
                                    
                                    {newVideo.hasQuiz && (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Quiz Question (e.g., What safety equipment is needed?)"
                                                value={newQuiz.question}
                                                onChange={(e) => setNewQuiz({...newQuiz, question: e.target.value})}
                                                className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                            />
                                            <div className="space-y-2">
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Answer Options (select correct one):</p>
                                                {newQuiz.answers.map((answer, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={newQuiz.correctAnswerIndex === index}
                                                            onChange={() => setNewQuiz({...newQuiz, correctAnswerIndex: index})}
                                                            className="text-indigo-600"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder={`Answer ${index + 1}`}
                                                            value={answer}
                                                            onChange={(e) => {
                                                                const newAnswers = [...newQuiz.answers];
                                                                newAnswers[index] = e.target.value;
                                                                setNewQuiz({...newQuiz, answers: newAnswers});
                                                            }}
                                                            className={`flex-1 px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddContent}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Add to Remote Config
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AnalyticsTab = () => {
    const lineOptions = {
        responsive: true,
        interaction: { mode: 'index' as const, intersect: false },
        plugins: { 
            legend: { display: false },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#fff' }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#6B7280' } },
            y: { grid: { color: 'rgba(107,114,128,0.1)' }, ticks: { color: '#6B7280', callback: (value: any) => `${(value/1000).toFixed(0)}k` } }
        },
        elements: { point: { radius: 0, hoverRadius: 6 } }
    };
    
    const barOptions = { 
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#6B7280', maxRotation: 45 } },
            y: { grid: { color: 'rgba(107,114,128,0.1)' }, ticks: { color: '#6B7280', callback: (value: any) => `${(value/1000).toFixed(0)}k` } }
        }
    };
    
    const pieOptions = {
        responsive: true,
        plugins: { 
            legend: { position: 'right' as const, labels: { color: '#374151', font: { size: 12 } } },
            tooltip: { callbacks: { label: (context: any) => `${context.label}: ${context.parsed.toLocaleString()}` } }
        }
    };

    return (
        <div className="space-y-8 bg-gray-50 min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
                    <p className="text-gray-600 mt-1">Real-time insights into Flimmer's content creation ecosystem</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Export Data</button>
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-600/20">Generate Report</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Monthly Active Families</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{platformMetrics.activeUsers.toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-green-600">+23.5%</span>
                                <span className="text-sm text-gray-500 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Content Uploads (24h)</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{platformMetrics.uploads24h}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-green-600">+12.3%</span>
                                <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">🧠</span>
                                <p className="text-sm font-medium text-gray-600">AI Safety Blocks (24h)</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{platformMetrics.aiBlocks24h}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-red-600">+8.7%</span>
                                <span className="text-sm text-gray-500 ml-1">detection rate</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Parent Approval Rate</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">85.1%</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-green-600">+2.4%</span>
                                <span className="text-sm text-gray-500 ml-1">this month</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Family Growth Trajectory</h3>
                            <p className="text-sm text-gray-600">Monthly active Danish families over time</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">12M</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 rounded-full hover:bg-gray-100">6M</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 rounded-full hover:bg-gray-100">3M</button>
                        </div>
                    </div>
                    <div className="h-80">
                        <Line data={userActivityData} options={lineOptions} />
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Platform Engagement</h3>
                        <p className="text-sm text-gray-600">Activity breakdown (Last 30 days)</p>
                    </div>
                    <div className="h-80">
                        <Doughnut data={contentEngagementData} options={pieOptions} />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Content Moderation Pipeline</h3>
                        <p className="text-sm text-gray-600">AI + Human review workflow efficiency</p>
                    </div>
                    <div className="h-64">
                        <Bar data={moderationActionsData} options={barOptions} />
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
                        <p className="text-sm text-gray-600">Most engaging child-created videos</p>
                    </div>
                    <div className="space-y-4">
                        {topPerformingContent.slice(0, 5).map((item, index) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                    <p className="text-xs text-gray-600">{item.creator}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{(item.views/1000).toFixed(0)}k views</p>
                                    <p className="text-xs text-gray-600">{(item.likes/item.views*100).toFixed(1)}k likes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Content Performance Analytics</h3>
                            <p className="text-sm text-gray-600">Detailed breakdown of top-performing videos</p>
                        </div>
                        <div className="flex space-x-3">
                            <input type="text" placeholder="Search content..." className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                <option>All Categories</option>
                                <option>STEM & Science</option>
                                <option>Arts & Creativity</option>
                                <option>Cooking & Crafts</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Score</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topPerformingContent.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
                                            <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                                        <div className="truncate">{item.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">{item.creator}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.views.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.likes.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{width: `${(item.likes/item.views*100).toFixed(1)}%`}}></div>
                                            </div>
                                            <span className="text-xs font-medium">{(item.likes/item.views*100).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Verified Safe
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SecurityTab = () => {
    const { isDark } = useDarkMode();
    const [newWord, setNewWord] = useState('');
    const [selectedThreat, setSelectedThreat] = useState<any>(null);
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [timeRange, setTimeRange] = useState('24h');

    const securityMetrics = {
        threatsBlocked: 1247,
        vulnerabilitiesFound: 3,
        securityScore: 94.2,
        lastPenTest: '2024-12-15',
        complianceStatus: 'SOC 2 Compliant',
        encryptionCoverage: '100%'
    };

    const threatDetection = [
        {
            id: 1, type: 'Malicious Content Upload', severity: 'HIGH', 
            description: 'AI detected potential CSAM content in video upload attempt',
            timestamp: '2024-12-23 14:23:15', source: 'Content Scanner',
            ipAddress: '192.168.1.45', userAgent: 'Mobile App v2.1.4',
            action: 'Blocked & Reported', riskScore: 9.8,
            details: { userId: 'user_8472', contentSize: '45MB', aiConfidence: '99.7%' }
        },
        {
            id: 2, type: 'Brute Force Attack', severity: 'MEDIUM', 
            description: 'Multiple failed login attempts detected from same IP',
            timestamp: '2024-12-23 13:45:32', source: 'Auth Monitor',
            ipAddress: '203.45.67.89', userAgent: 'Automated Script',
            action: 'IP Temporarily Blocked', riskScore: 6.3,
            details: { attempts: 15, timespan: '10 minutes', targetAccount: 'admin@example.com' }
        },
        {
            id: 3, type: 'Suspicious API Usage', severity: 'LOW', 
            description: 'Unusual API call patterns detected from verified user',
            timestamp: '2024-12-23 12:10:45', source: 'API Gateway',
            ipAddress: '78.132.45.21', userAgent: 'Mobile App v2.1.3',
            action: 'Monitoring Enhanced', riskScore: 3.7,
            details: { userId: 'user_9283', callVolume: '1200/hour', deviation: '+340%' }
        }
    ];

    const enhancedProfanityList = [
        { id: 1, word: '[REDACTED]', category: 'Profanity', addedBy: 'System Admin', timestamp: '2024-12-20', language: 'Danish', severity: 'High' },
        { id: 2, word: '[BLOCKED]', category: 'Hate Speech', addedBy: 'AI System', timestamp: '2024-12-19', language: 'English', severity: 'Critical' },
        { id: 3, word: '[FILTERED]', category: 'Inappropriate', addedBy: 'Moderator Team', timestamp: '2024-12-18', language: 'Danish', severity: 'Medium' }
    ];

    const vulnerabilities = [
        {
            id: 'CVE-2024-1234', severity: 'Medium', package: 'react-player',
            description: 'Cross-site scripting vulnerability in video player component',
            status: 'Patched', patchedDate: '2024-12-20', affectedVersions: '< 2.12.0'
        },
        {
            id: 'SNYK-JS-2024-567', severity: 'Low', package: 'lodash',
            description: 'Prototype pollution in utility functions',
            status: 'Investigating', discoveredDate: '2024-12-22', affectedVersions: '< 4.17.21'
        },
        {
            id: 'GHSA-2024-890', severity: 'High', package: 'firebase-admin',
            description: 'Authentication bypass in admin SDK',
            status: 'Patched', patchedDate: '2024-12-15', affectedVersions: '< 11.5.0'
        }
    ];

    const complianceChecks = [
        { standard: 'GDPR Article 32', requirement: 'Data Encryption', status: 'Compliant', lastAudit: '2024-12-01' },
        { standard: 'SOC 2 Type II', requirement: 'Access Controls', status: 'Compliant', lastAudit: '2024-11-15' },
        { standard: 'ISO 27001', requirement: 'Incident Response', status: 'Compliant', lastAudit: '2024-10-30' },
        { standard: 'COPPA', requirement: 'Child Data Protection', status: 'Under Review', lastAudit: '2024-12-20' }
    ];

    const handleAddWord = () => { 
        if (newWord.trim()) { 
            console.log(`Adding word: ${newWord}`); 
            setNewWord(''); 
        } 
    };

    const getSeverityColor = (severity: string) => {
        switch(severity.toUpperCase()) {
            case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getComplianceColor = (status: string) => {
        switch(status) {
            case 'Compliant': return 'text-green-600 bg-green-50';
            case 'Under Review': return 'text-yellow-600 bg-yellow-50';
            case 'Non-Compliant': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredThreats = threatDetection.filter(threat => 
        filterSeverity === 'all' || threat.severity === filterSeverity.toUpperCase()
    );

    return (
        <div className={`space-y-8 min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Security Operations Center</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Threat detection, vulnerability management, and compliance monitoring</p>
                </div>
                <div className="flex space-x-3">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className={`px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        Security Report
                    </button>
                </div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Threats Blocked</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{securityMetrics.threatsBlocked}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last 24h</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Vulnerabilities</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{securityMetrics.vulnerabilitiesFound}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Security Score</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{securityMetrics.securityScore}/100</p>
                    <p className={`text-xs mt-1 text-green-600`}>Excellent</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Pen Test</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{securityMetrics.lastPenTest}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Passed</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Compliance Status</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{securityMetrics.complianceStatus}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Certified</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Encryption Coverage</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{securityMetrics.encryptionCoverage}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Complete</p>
                </div>
            </div>

            {/* Threat Detection */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>🛡️ Real-time Threat Detection</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Live security incidents and automated responses</p>
                </div>
                <div className="p-6 space-y-4">
                    {filteredThreats.map((threat, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{threat.type}</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                                            {threat.severity}
                                        </span>
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{threat.timestamp}</span>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{threat.description}</p>
                                    <div className="text-xs space-y-1">
                                        <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Source: {threat.source} | IP: {threat.ipAddress}</div>
                                        <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Action: {threat.action}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-bold ${threat.riskScore > 7 ? 'text-red-500' : threat.riskScore > 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {threat.riskScore}/10
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Risk Score</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vulnerability Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>🔍 Vulnerability Scanner</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dependencies and security assessments</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {vulnerabilities.map((vuln, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{vuln.id}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                        {vuln.severity}
                                    </span>
                                </div>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>{vuln.description}</p>
                                <div className="text-xs space-y-1">
                                    <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Package: {vuln.package}</div>
                                    <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Status: {vuln.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>📋 Compliance Monitoring</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Regulatory standards and certifications</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {complianceChecks.map((check, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{check.standard}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getComplianceColor(check.status)}`}>
                                        {check.status}
                                    </span>
                                </div>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>{check.requirement}</p>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last audit: {check.lastAudit}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AITab = () => {
    const { isDark } = useDarkMode();
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [timeRange, setTimeRange] = useState('24h');

    const aiMetrics = {
        totalInferences: 2847291,
        avgLatency: '45ms',
        costPerDay: '$127.50',
        activeModels: 4,
        accuracy: '97.8%',
        errorRate: '0.2%'
    };

    const modelFleet = [
        {
            name: 'Content Safety Scanner', version: 'v2.1.4', status: 'Active',
            inferences: '1.2M/day', latency: '23ms', accuracy: '98.7%',
            cost: '$45.20/day', description: 'Primary content moderation for video uploads'
        },
        {
            name: 'Text Moderator', version: 'v1.8.2', status: 'Active',
            inferences: '850K/day', latency: '12ms', accuracy: '96.4%',
            cost: '$28.90/day', description: 'Chat and comment filtering system'
        },
        {
            name: 'Behavioral Anomaly Detector', version: 'v3.0.1', status: 'Training',
            inferences: '340K/day', latency: '67ms', accuracy: '94.2%',
            cost: '$31.70/day', description: 'Unusual behavior pattern detection'
        },
        {
            name: 'Recommendation Engine', version: 'v2.5.0', status: 'Active',
            inferences: '450K/day', latency: '89ms', accuracy: '91.5%',
            cost: '$21.70/day', description: 'Safe content recommendations for children'
        }
    ];

    return (
        <div className={`space-y-8 min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Operations Center</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Machine learning model fleet management and monitoring</p>
                </div>
                <div className="flex space-x-3">
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        AI Performance Report
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-600/20">
                        Deploy Model
                    </button>
                </div>
            </div>

            {/* AI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Inferences</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aiMetrics.totalInferences.toLocaleString()}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last 24h</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Latency</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aiMetrics.avgLatency}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Excellent</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily Cost</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aiMetrics.costPerDay}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Budget: $200/day</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Models</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aiMetrics.activeModels}</p>
                    <p className={`text-xs mt-1 text-green-600`}>All healthy</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🧠</span>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Fleet Accuracy</p>
                    </div>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aiMetrics.accuracy}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Target: &gt;95%</p>
                </div>
                <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Error Rate</p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aiMetrics.errorRate}</p>
                    <p className={`text-xs mt-1 text-green-600`}>Very low</p>
                </div>
            </div>

            {/* Model Fleet */}
            <div className={`rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>🤖 Production Model Fleet</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active AI models and performance metrics</p>
                </div>
                <div className="p-6 space-y-4">
                    {modelFleet.map((model, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{model.name}</h4>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            model.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                            model.status === 'Training' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {model.status}
                                        </span>
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{model.version}</span>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>{model.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Inferences:</span>
                                            <div className={`mt-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{model.inferences}</div>
                                        </div>
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Latency:</span>
                                            <div className={`mt-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{model.latency}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs">🧠</span>
                                                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy:</span>
                                            </div>
                                            <div className={`mt-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{model.accuracy}</div>
                                        </div>
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Cost:</span>
                                            <div className={`mt-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{model.cost}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('operations');
    const { isDark, toggleDark } = useDarkMode();

    const tabs = [
        { id: 'operations', label: 'Operations', icon: '🚨' },
        { id: 'content', label: 'Content', icon: '📝' },
        { id: 'product', label: 'Product', icon: '🚀' },
        { id: 'security', label: 'Security', icon: '🛡️' },
        { id: 'ai', label: 'AI', icon: '🤖' },
        { id: 'compliance', label: 'Compliance', icon: '📋' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
    ];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'operations':
                return <OperationsTab moderationQueue={mockedQueue} users={allUsers} />;
            case 'content':
                return <ContentManagementTab />;
            case 'product':
                return <ProductTab />;
            case 'security':
                return <SecurityTab />;
            case 'ai':
                return <AITab />;
            case 'compliance':
                return <ComplianceTab />;
            case 'analytics':
                return <AnalyticsTab />;
            default:
                return <OperationsTab moderationQueue={mockedQueue} users={allUsers} />;
        }
    };

    return (
        <DarkModeProvider>
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex">
                    {/* Sidebar Navigation */}
                    <div className={`w-64 min-h-screen ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Admin Dashboard
                                </h1>
                                <button
                                    onClick={toggleDark}
                                    className={`p-2 rounded-md ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {isDark ? '☀️' : '🌙'}
                                </button>
                            </div>
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                                            activeTab === tab.id
                                                ? isDark
                                                    ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-900/20'
                                                    : 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-600/20'
                                                : isDark
                                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </DarkModeProvider>
    );
};

export default Dashboard;