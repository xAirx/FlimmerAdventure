'use client';

import { useState, useContext } from 'react';
import clsx from 'clsx';
import {
    UserGroupIcon,
    VideoCameraIcon,
    ShieldCheckIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    LockClosedIcon,
    DocumentCheckIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    TrophyIcon,
    EyeIcon,
    ClockIcon,
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowTrendingUpIcon,
    PlayIcon,
    PhotoIcon,
    DocumentTextIcon,
    FireIcon,
    ShieldExclamationIcon,
    BellIcon,
    CogIcon,
    ArrowTopRightOnSquareIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { DarkModeContext } from '@/components/DarkModeProvider';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

// Data interfaces aligned with Flimmer's content moderation focus
interface Child {
    id: number;
    name: string;
    age: number;
    avatar: string;
    verificationStatus: 'verified' | 'pending';
    contentSubmissions: number;
    safetyScore: number;
    diamondBalance: number;
    weeklyProgress: number[];
    completedQuizzes: number;
    totalQuizzes: number;
    lastActivity: string;
    favoriteCategory: string;
}

interface ContentSubmission {
    id: number;
    childName: string;
    title: string;
    type: 'video' | 'photo' | 'text';
    thumbnailUrl: string;
    uploadedAt: string;
    aiSafetyScore: number;
    aiAnalysis: string;
    status: 'pending' | 'approved' | 'rejected' | 'needs_discussion';
    category: string;
    views?: number;
    likes?: number;
    duration?: string;
    fileSize?: string;
}

interface SafetyModule {
    id: number;
    title: string;
    description: string;
    category: 'digital_literacy' | 'online_safety' | 'privacy_awareness' | 'cyber_bullying';
    ageGroup: string;
    progress: number;
    completed: boolean;
    diamondReward: number;
    timeToComplete: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    completedAt?: string;
}

interface FamilyDiscussion {
    id: number;
    topic: string;
    childName: string;
    status: 'open' | 'resolved';
    lastMessage: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
    messageCount: number;
    category: 'safety' | 'content' | 'general' | 'technical';
}

interface PrivacySetting {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
    lawfulBasis: 'consent' | 'legitimate_interest' | 'parental_responsibility';
    required: boolean;
    lastModified?: string;
    impactLevel: 'low' | 'medium' | 'high';
}

// Enhanced Mock Data with realistic metrics
const mockChildren: Child[] = [
    { 
        id: 1, 
        name: 'Emma', 
        age: 12, 
        avatar: '👧', 
        verificationStatus: 'verified', 
        contentSubmissions: 23, 
        safetyScore: 94,
        diamondBalance: 1250,
        weeklyProgress: [85, 88, 92, 89, 94, 91, 96],
        completedQuizzes: 18,
        totalQuizzes: 20,
        lastActivity: '2 hours ago',
        favoriteCategory: 'Educational Content'
    },
    { 
        id: 2, 
        name: 'Jake', 
        age: 8, 
        avatar: '👦', 
        verificationStatus: 'verified', 
        contentSubmissions: 15, 
        safetyScore: 88,
        diamondBalance: 850,
        weeklyProgress: [82, 85, 83, 87, 88, 90, 85],
        completedQuizzes: 12,
        totalQuizzes: 16,
        lastActivity: '1 hour ago',
        favoriteCategory: 'Creative Arts'
    },
    { 
        id: 3, 
        name: 'Lily', 
        age: 10, 
        avatar: '👧', 
        verificationStatus: 'pending', 
        contentSubmissions: 8, 
        safetyScore: 82,
        diamondBalance: 420,
        weeklyProgress: [75, 78, 80, 82, 79, 83, 85],
        completedQuizzes: 6,
        totalQuizzes: 12,
        lastActivity: '30 minutes ago',
        favoriteCategory: 'Dance & Music'
    },
];

const mockContentQueue: ContentSubmission[] = [
    { 
        id: 1, 
        childName: 'Emma', 
        title: 'My Science Experiment: Making Slime', 
        type: 'video', 
        thumbnailUrl: '/placeholder.svg', 
        uploadedAt: '2 hours ago',
        aiSafetyScore: 15, 
        aiAnalysis: 'Educational content showing safe slime-making with proper materials. Clear instructions and safety precautions demonstrated. No personal information visible.', 
        status: 'pending',
        category: 'Education/Science',
        duration: '4:32',
        fileSize: '127 MB',
        views: 0,
        likes: 0
    },
    { 
        id: 2, 
        childName: 'Jake', 
        title: 'Drawing my favorite animal - Golden Retriever', 
        type: 'photo', 
        thumbnailUrl: '/placeholder.svg', 
        uploadedAt: '45 minutes ago',
        aiSafetyScore: 5, 
        aiAnalysis: 'Child\'s artwork showing a dog drawing. Creative expression with no safety concerns. Age-appropriate content with artistic merit.', 
        status: 'pending',
        category: 'Creative/Art',
        fileSize: '2.3 MB',
        views: 0,
        likes: 0
    },
    {
        id: 3,
        childName: 'Lily',
        title: 'Learning the Floss Dance',
        type: 'video',
        thumbnailUrl: '/placeholder.svg',
        uploadedAt: '15 minutes ago',
        aiSafetyScore: 25,
        aiAnalysis: 'Dance video with appropriate choreography and clothing. Background shows home environment with no identifying information. Age-appropriate music selection.',
        status: 'pending',
        category: 'Entertainment/Dance',
        duration: '2:48',
        fileSize: '89 MB',
        views: 0,
        likes: 0
    },
    {
        id: 4,
        childName: 'Emma',
        title: 'Rainbow Cupcakes Recipe Tutorial',
        type: 'photo',
        thumbnailUrl: '/placeholder.svg',
        uploadedAt: '5 minutes ago',
        aiSafetyScore: 10,
        aiAnalysis: 'Recipe photo showing colorful cupcakes and ingredients list. Educational cooking content with clear presentation. No personal information displayed.',
        status: 'pending',
        category: 'Cooking/Baking',
        fileSize: '3.1 MB',
        views: 0,
        likes: 0
    },
];

const mockSafetyModules: SafetyModule[] = [
    { 
        id: 1, 
        title: 'Password Safety & Digital Identity', 
        description: 'Master the art of creating unbreakable passwords and understanding digital identity protection', 
        category: 'digital_literacy', 
        ageGroup: '8-12', 
        progress: 100, 
        completed: true,
        diamondReward: 100,
        timeToComplete: '15 min',
        difficulty: 'beginner',
        completedAt: '3 days ago'
    },
    { 
        id: 2, 
        title: 'Stranger Danger in the Digital World', 
        description: 'Advanced techniques for identifying and safely handling contact from unknown individuals online', 
        category: 'online_safety', 
        ageGroup: '8-12', 
        progress: 75, 
        completed: false,
        diamondReward: 150,
        timeToComplete: '20 min',
        difficulty: 'intermediate'
    },
    { 
        id: 3, 
        title: 'Personal Information Protection Master Class', 
        description: 'Comprehensive guide to understanding and protecting personal data in the digital age', 
        category: 'privacy_awareness', 
        ageGroup: '8-12', 
        progress: 60, 
        completed: false,
        diamondReward: 200,
        timeToComplete: '25 min',
        difficulty: 'advanced'
    },
    { 
        id: 4, 
        title: 'Cyberbullying Prevention & Kind Communication', 
        description: 'Learn effective strategies for preventing cyberbullying and promoting positive online interactions', 
        category: 'cyber_bullying', 
        ageGroup: '8-12', 
        progress: 85, 
        completed: false,
        diamondReward: 175,
        timeToComplete: '18 min',
        difficulty: 'intermediate'
    },
    { 
        id: 5, 
        title: 'Two-Factor Authentication for Young Users', 
        description: 'Advanced security concepts including 2FA setup and management for enhanced account protection', 
        category: 'digital_literacy', 
        ageGroup: '10-14', 
        progress: 30, 
        completed: false,
        diamondReward: 250,
        timeToComplete: '30 min',
        difficulty: 'advanced'
    },
    { 
        id: 6, 
        title: 'Social Media Safety Fundamentals', 
        description: 'Essential skills for safe social media interaction and content sharing', 
        category: 'online_safety', 
        ageGroup: '10-14', 
        progress: 0, 
        completed: false,
        diamondReward: 200,
        timeToComplete: '22 min',
        difficulty: 'intermediate'
    }
];

const mockDiscussions: FamilyDiscussion[] = [
    { 
        id: 1, 
        topic: 'Jake wants to join Roblox - Safety Discussion', 
        childName: 'Jake', 
        status: 'open', 
        lastMessage: 'Can we review the parental controls and chat settings together?', 
        timestamp: '1 hour ago', 
        priority: 'high',
        messageCount: 8,
        category: 'safety'
    },
    { 
        id: 2, 
        topic: 'Emma\'s Social Media Readiness Assessment', 
        childName: 'Emma', 
        status: 'open', 
        lastMessage: 'I understand privacy settings now. When can I create my first account?', 
        timestamp: '3 hours ago', 
        priority: 'high',
        messageCount: 15,
        category: 'safety'
    },
    { 
        id: 3, 
        topic: 'Lily received friend request from unknown person', 
        childName: 'Lily', 
        status: 'open', 
        lastMessage: 'I blocked them like you taught me. Did I do the right thing?', 
        timestamp: '10 minutes ago', 
        priority: 'high',
        messageCount: 4,
        category: 'safety'
    },
    { 
        id: 4, 
        topic: 'Family Screen Time Planning for Winter Break', 
        childName: 'All', 
        status: 'resolved', 
        lastMessage: 'Agreed on 3 hours per day with educational content priority', 
        timestamp: '1 day ago', 
        priority: 'medium',
        messageCount: 12,
        category: 'general'
    },
    { 
        id: 5, 
        topic: 'Content Creation Guidelines Review', 
        childName: 'Emma', 
        status: 'open', 
        lastMessage: 'Can we go over the new video editing tools and safety checks?', 
        timestamp: '2 days ago', 
        priority: 'medium',
        messageCount: 6,
        category: 'content'
    }
];

const mockPrivacySettings: PrivacySetting[] = [
    { 
        id: 'content_analysis', 
        label: 'AI Content Safety Analysis', 
        description: 'Analyze all uploaded content for safety using Google Cloud Vision AI and proprietary safety algorithms', 
        enabled: true, 
        lawfulBasis: 'parental_responsibility', 
        required: true,
        lastModified: '2024-01-15',
        impactLevel: 'high'
    },
    { 
        id: 'safety_notifications', 
        label: 'Real-time Safety Alert System', 
        description: 'Receive instant notifications about potential safety concerns and unusual activity patterns', 
        enabled: true, 
        lawfulBasis: 'legitimate_interest', 
        required: false,
        lastModified: '2024-01-12',
        impactLevel: 'medium'
    },
    { 
        id: 'educational_tracking', 
        label: 'Safety Education Progress Analytics', 
        description: 'Track completion, engagement, and performance metrics for digital safety education modules', 
        enabled: true, 
        lawfulBasis: 'consent', 
        required: false,
        lastModified: '2024-01-10',
        impactLevel: 'low'
    },
    { 
        id: 'behavioral_insights', 
        label: 'Family Digital Wellness Insights', 
        description: 'Generate weekly reports on family digital habits and safety progress for informed discussions', 
        enabled: true, 
        lawfulBasis: 'consent', 
        required: false,
        lastModified: '2024-01-08',
        impactLevel: 'medium'
    },
    { 
        id: 'data_export', 
        label: 'Transparent Data Export Access', 
        description: 'Allow comprehensive exporting of all family data for transparency and portability rights', 
        enabled: true, 
        lawfulBasis: 'consent', 
        required: false,
        lastModified: '2024-01-05',
        impactLevel: 'low'
    },
    { 
        id: 'marketing_emails', 
        label: 'Product & Safety Update Communications', 
        description: 'Receive monthly newsletters about new safety features, educational content, and platform updates', 
        enabled: false, 
        lawfulBasis: 'legitimate_interest', 
        required: false,
        lastModified: '2024-01-01',
        impactLevel: 'low'
    },
];

// --- ENHANCED TAB COMPONENTS ---

const FamilyOverviewTab = ({ children }: { children: Child[] }) => {
    const { isDark } = useContext(DarkModeContext);
    
    // Enhanced family metrics with more comprehensive data
    const familyMetrics = [
      { 
        label: 'Total Family Members', 
        value: children.length,
        change: '+0%',
        trend: 'stable',
        icon: UserGroupIcon,
        color: 'blue'
      },
      { 
        label: 'Content Awaiting Review', 
        value: mockContentQueue.filter(c => c.status === 'pending').length,
        change: '-25%',
        trend: 'down',
        icon: VideoCameraIcon,
        color: 'yellow'
      },
      { 
        label: 'Safety Modules Completed', 
        value: mockSafetyModules.filter(m => m.completed).length,
        change: '+12%',
        trend: 'up',
        icon: ShieldCheckIcon,
        color: 'green'
      },
      { 
        label: 'Active Discussions', 
        value: mockDiscussions.filter(d => d.status === 'open').length,
        change: '+8%',
        trend: 'up',
        icon: ChatBubbleLeftRightIcon,
        color: 'purple'
      },
      { 
        label: 'Total Diamond Balance', 
        value: children.reduce((acc, child) => acc + child.diamondBalance, 0),
        change: '+15%',
        trend: 'up',
        icon: TrophyIcon,
        color: 'amber'
      },
      { 
        label: 'Average Safety Score', 
        value: Math.round(children.reduce((acc, child) => acc + child.safetyScore, 0) / children.length),
        change: '+3%',
        trend: 'up',
        icon: StarIcon,
        color: 'emerald'
      }
    ];

    const getVerificationColor = (status: string) => {
      switch (status) {
        case 'verified': return isDark ? 'text-green-400 bg-green-900/50' : 'text-green-600 bg-green-100';
        case 'pending': return isDark ? 'text-yellow-400 bg-yellow-900/50' : 'text-yellow-600 bg-yellow-100';
        default: return isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-100';
      }
    };

    const getMetricColor = (color: string) => {
      const colors = {
        blue: isDark ? 'bg-blue-900/50 border-blue-800' : 'bg-blue-50 border-blue-200',
        yellow: isDark ? 'bg-yellow-900/50 border-yellow-800' : 'bg-yellow-50 border-yellow-200',
        green: isDark ? 'bg-green-900/50 border-green-800' : 'bg-green-50 border-green-200',
        purple: isDark ? 'bg-purple-900/50 border-purple-800' : 'bg-purple-50 border-purple-200',
        amber: isDark ? 'bg-amber-900/50 border-amber-800' : 'bg-amber-50 border-amber-200',
        emerald: isDark ? 'bg-emerald-900/50 border-emerald-800' : 'bg-emerald-50 border-emerald-200',
      };
      return colors[color as keyof typeof colors] || colors.blue;
    };

    const getTrendColor = (trend: string) => {
      switch (trend) {
        case 'up': return isDark ? 'text-green-400' : 'text-green-600';
        case 'down': return isDark ? 'text-red-400' : 'text-red-600';
        default: return isDark ? 'text-gray-400' : 'text-gray-600';
      }
    };

    // Chart data for family progress
    const weeklyProgressData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: children.map((child, index) => ({
        label: child.name,
        data: child.weeklyProgress,
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(34, 197, 94)', 
          'rgb(251, 146, 60)'
        ][index],
        backgroundColor: [
          'rgba(99, 102, 241, 0.1)',
          'rgba(34, 197, 94, 0.1)', 
          'rgba(251, 146, 60, 0.1)'
        ][index],
        tension: 0.4,
        fill: true,
      }))
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#e5e7eb' : '#374151'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
          grid: { color: isDark ? '#374151' : '#e5e7eb' }
        },
        y: {
          ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
          grid: { color: isDark ? '#374151' : '#e5e7eb' },
          min: 70,
          max: 100
        }
      }
    };

    return (
      <div className="space-y-8">
          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMetrics.map(metric => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={metric.label} 
                    className={clsx(
                      'p-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
                      getMetricColor(metric.color),
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
                    )}
                  >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'p-2 rounded-lg',
                            isDark ? 'bg-gray-700' : 'bg-white'
                          )}>
                            <Icon className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <p className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
                              {metric.label}
                            </p>
                            <p className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                              {typeof metric.value === 'number' && metric.label.includes('Diamond') 
                                ? metric.value.toLocaleString() 
                                : metric.value}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={clsx('text-sm font-medium', getTrendColor(metric.trend))}>
                            {metric.change}
                          </span>
                          <ArrowTrendingUpIcon className={clsx('h-4 w-4 mt-1', getTrendColor(metric.trend))} />
                        </div>
                      </div>
                  </div>
                );
              })}
          </div>

          {/* Enhanced Children Grid - MOVED TO MIDDLE */}
          <div className={clsx(
            'rounded-xl shadow-sm border p-8',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
          )}>
              <h2 className={clsx('text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900')}>
                Your Children's Profiles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {children.map(child => (
                      <div 
                        key={child.id} 
                        className={clsx(
                          'border rounded-xl p-6 transition-all duration-200 hover:shadow-lg',
                          isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
                        )}
                      >
                          <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                  <div className={clsx(
                                    'text-3xl rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold',
                                    isDark ? 'bg-gray-700 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                  )}>
                                    {child.name.charAt(0)}
                                  </div>
                                  <div>
                                      <h3 className={clsx('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
                                        {child.name}
                                      </h3>
                                      <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                        Age {child.age} • {child.lastActivity}
                                      </p>
                                      <span className={clsx('px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block', getVerificationColor(child.verificationStatus))}>
                                          {child.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending Verification'}
                                      </span>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Enhanced metrics */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className={clsx('text-center p-3 rounded-lg', isDark ? 'bg-gray-800' : 'bg-gray-50')}>
                              <p className={clsx('text-2xl font-bold', isDark ? 'text-blue-400' : 'text-blue-600')}>
                                {child.safetyScore}
                              </p>
                              <p className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Safety Score
                              </p>
                            </div>
                            <div className={clsx('text-center p-3 rounded-lg', isDark ? 'bg-gray-800' : 'bg-gray-50')}>
                              <p className={clsx('text-2xl font-bold', isDark ? 'text-amber-400' : 'text-amber-600')}>
                                {child.diamondBalance}
                              </p>
                              <p className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                💎 Diamonds
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                  Safety Education
                                </span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                  {child.completedQuizzes}/{child.totalQuizzes}
                                </span>
                              </div>
                              <div className={clsx('w-full rounded-full h-2', isDark ? 'bg-gray-700' : 'bg-gray-200')}>
                                  <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${(child.completedQuizzes / child.totalQuizzes) * 100}%` }}
                                  ></div>
                              </div>
                            </div>

                            <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                              <span className="font-medium">Favorite:</span> {child.favoriteCategory}
                            </div>
                            <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                              <span className="font-medium">Content:</span> {child.contentSubmissions} submissions
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-6">
                              <button className={clsx(
                                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                isDark 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              )}>
                                  📊 View Analytics
                              </button>
                              <button className={clsx(
                                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                isDark 
                                  ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              )}>
                                  ⚙️ Settings
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* MitID Verification Status - Enhanced */}
          <div className={clsx(
            'rounded-xl shadow-sm border p-8',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
          )}>
              <h2 className={clsx('text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900')}>
                🇩🇰 MitID Verification Status
              </h2>
              <div className={clsx(
                'p-6 rounded-xl border flex items-center justify-between',
                isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
              )}>
                  <div>
                      <p className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
                        Parent Identity Verification
                      </p>
                      <p className={clsx('text-2xl font-bold mt-1', isDark ? 'text-green-400' : 'text-green-700')}>
                        ✓ Verified with MitID
                      </p>
                      <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        Verified on Jan 15, 2024 • Compliant with GDPR Article 8 requirements for children's platforms
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={clsx('px-3 py-1 text-xs font-medium rounded-full', isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800')}>
                          Danish Citizen
                        </span>
                        <span className={clsx('px-3 py-1 text-xs font-medium rounded-full', isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800')}>
                          GDPR Compliant
                        </span>
                      </div>
                  </div>
                  <div className={clsx('p-4 rounded-full', isDark ? 'bg-green-900/30' : 'bg-green-100')}>
                      <LockClosedIcon className={clsx('h-8 w-8', isDark ? 'text-green-400' : 'text-green-600')} />
                  </div>
              </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className={clsx(
            'rounded-xl shadow-sm border p-8',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
          )}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={clsx('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                Family Safety Progress This Week
              </h2>
              <div className="flex items-center gap-2">
                <ChartBarIcon className={clsx('h-5 w-5', isDark ? 'text-gray-400' : 'text-gray-600')} />
                <span className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Daily Safety Scores
                </span>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={weeklyProgressData} options={chartOptions} />
            </div>
          </div>
      </div>
  );
};

const ContentApprovalsTab = ({ contentQueue, onApprove }: { contentQueue: ContentSubmission[], onApprove: (id: number, action: 'approve' | 'reject' | 'discuss') => void }) => {
    const { isDark } = useContext(DarkModeContext);
    
    const getScoreColor = (score: number) => {
        if (score > 75) return isDark ? 'text-red-400' : 'text-red-600';
        if (score > 50) return isDark ? 'text-yellow-400' : 'text-yellow-600';
        return isDark ? 'text-green-400' : 'text-green-600';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return '✅';
            case 'rejected': return '❌';
            case 'needs_discussion': return '💬';
            default: return '⏳';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <PlayIcon className="h-6 w-6" />;
            case 'photo': return <PhotoIcon className="h-6 w-6" />;
            case 'text': return <DocumentTextIcon className="h-6 w-6" />;
            default: return <DocumentCheckIcon className="h-6 w-6" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700';
            case 'photo': return isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700';
            case 'text': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700';
            default: return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    // Content metrics
    const contentMetrics = [
        {
            label: 'Total Submissions',
            value: contentQueue.length,
            icon: VideoCameraIcon,
            change: '+12%',
            color: 'blue'
        },
        {
            label: 'Pending Review',
            value: contentQueue.filter(c => c.status === 'pending').length,
            icon: ClockIcon,
            change: '-8%',
            color: 'yellow'
        },
        {
            label: 'Approved Today',
            value: contentQueue.filter(c => c.status === 'approved').length,
            icon: CheckCircleIcon,
            change: '+25%',
            color: 'green'
        },
        {
            label: 'AI Safety Flagged',
            value: contentQueue.filter(c => c.aiSafetyScore > 50).length,
            icon: ShieldExclamationIcon,
            change: '-15%',
            color: 'red'
        },
        {
            label: 'Average Safety Score',
            value: Math.round(contentQueue.reduce((acc, c) => acc + c.aiSafetyScore, 0) / contentQueue.length),
            icon: StarIcon,
            change: '+5%',
            color: 'purple'
        },
        {
            label: 'Discussion Required',
            value: contentQueue.filter(c => c.status === 'needs_discussion').length,
            icon: ChatBubbleLeftRightIcon,
            change: '+10%',
            color: 'amber'
        }
    ];

    const getMetricColor = (color: string) => {
        const colors = {
            blue: isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
            yellow: isDark ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200',
            green: isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200',
            red: isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200',
            purple: isDark ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200',
            amber: isDark ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="space-y-8">
            {/* Content Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentMetrics.map(metric => {
                    const Icon = metric.icon;
                    return (
                        <div 
                            key={metric.label} 
                            className={clsx(
                                'p-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
                                getMetricColor(metric.color),
                                isDark ? 'bg-gray-800' : 'bg-white'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        'p-2 rounded-lg',
                                        isDark ? 'bg-gray-700' : 'bg-white'
                                    )}>
                                        <Icon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
                                            {metric.label}
                                        </p>
                                        <p className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                            {metric.value}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={clsx('text-sm font-medium', 
                                        metric.change.startsWith('+') 
                                            ? (isDark ? 'text-green-400' : 'text-green-600')
                                            : (isDark ? 'text-red-400' : 'text-red-600')
                                    )}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Enhanced Content Queue */}
            <div className={clsx(
                'rounded-xl shadow-sm border p-8',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
            )}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                            📹 Content Moderation Queue
                        </h2>
                        <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            AI-powered pre-screening • Advanced safety analysis • Real-time review workflow
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={clsx('px-4 py-2 rounded-lg border', isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')}>
                            <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                Queue: {contentQueue.filter(c => c.status === 'pending').length} pending
                            </span>
                        </div>
                        <button className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                            isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        )}>
                            ⚙️ Queue Settings
                        </button>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {contentQueue.map(item => (
                        <div 
                            key={item.id} 
                            className={clsx(
                                'border rounded-xl p-6 transition-all duration-200 hover:shadow-lg',
                                isDark ? 'border-gray-600 bg-gray-900/50' : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                            )}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Content Preview */}
                                <div className="flex-shrink-0">
                                    <div className={clsx(
                                        'w-full lg:w-56 h-32 rounded-xl flex items-center justify-center border-2 border-dashed transition-colors',
                                        isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-100'
                                    )}>
                                        <div className="text-center">
                                            <div className={clsx('p-3 rounded-full mb-2 mx-auto w-fit', getTypeColor(item.type))}>
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <span className={clsx('text-xs font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                {item.type.toUpperCase()}
                                            </span>
                                            {item.duration && (
                                                <div className={clsx('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                                    {item.duration}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Content Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className={clsx('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className={clsx('font-medium', isDark ? 'text-blue-400' : 'text-blue-600')}>
                                                    👤 {item.childName}
                                                </span>
                                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                    🕒 {item.uploadedAt}
                                                </span>
                                                <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getTypeColor(item.type))}>
                                                    📂 {item.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{getStatusIcon(item.status)}</span>
                                            <div className={clsx(
                                                'px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1',
                                                item.aiSafetyScore <= 25 
                                                    ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800')
                                                    : item.aiSafetyScore <= 75 
                                                        ? (isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                                                        : (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')
                                            )}>
                                                <span>🧠</span>
                                                <span>Risk: {item.aiSafetyScore}/100</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Enhanced AI Analysis */}
                                    <div className={clsx(
                                        'p-4 rounded-lg border',
                                        isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                                    )}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={clsx('p-1 rounded', isDark ? 'bg-purple-900/50' : 'bg-purple-100')}>
                                                    <ShieldCheckIcon className={clsx('h-4 w-4', isDark ? 'text-purple-400' : 'text-purple-600')} />
                                                </div>
                                                <span className={clsx('text-sm font-semibold', isDark ? 'text-purple-400' : 'text-purple-700')}>
                                                    AI Safety Analysis
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                {item.fileSize && (
                                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                        📦 {item.fileSize}
                                                    </span>
                                                )}
                                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                    👁️ {item.views || 0} views
                                                </span>
                                            </div>
                                        </div>
                                        <p className={clsx('text-sm leading-relaxed', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                            {item.aiAnalysis}
                                        </p>
                                    </div>
                                    
                                    {/* Enhanced Action Buttons */}
                                    {item.status === 'pending' && (
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            <button 
                                                onClick={() => onApprove(item.id, 'approve')} 
                                                className={clsx(
                                                    'flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                                                    isDark 
                                                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20' 
                                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'
                                                )}
                                            >
                                                <CheckCircleIcon className="h-4 w-4" />
                                                Approve & Publish
                                            </button>
                                            <button 
                                                onClick={() => onApprove(item.id, 'discuss')} 
                                                className={clsx(
                                                    'flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                                                    isDark 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20' 
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                                )}
                                            >
                                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                Discuss with Child
                                            </button>
                                            <button 
                                                onClick={() => onApprove(item.id, 'reject')} 
                                                className={clsx(
                                                    'flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                                                    isDark 
                                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20' 
                                                        : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
                                                )}
                                            >
                                                <XCircleIcon className="h-4 w-4" />
                                                Reject Content
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {contentQueue.length === 0 && (
                        <div className={clsx('text-center py-16', isDark ? 'text-gray-400' : 'text-gray-500')}>
                            <div className={clsx('p-6 rounded-full mx-auto w-fit mb-4', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                                <VideoCameraIcon className="w-16 h-16" />
                            </div>
                            <h3 className={clsx('text-xl font-semibold mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                All caught up! 🎉
                            </h3>
                            <p className="text-lg">No content awaiting approval</p>
                            <p className="text-sm mt-2">When your children submit new content, it will appear here for review.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SafetyEducationTab = () => {
    const { isDark } = useContext(DarkModeContext);
    
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'digital_literacy': return isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800';
            case 'online_safety': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800';
            case 'privacy_awareness': return isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-800';
            case 'cyber_bullying': return isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800';
            default: return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700';
            case 'intermediate': return isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
            case 'advanced': return isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700';
            default: return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '🌱';
            case 'intermediate': return '🔥';
            case 'advanced': return '💎';
            default: return '📚';
        }
    };

    // Education metrics
    const educationMetrics = [
        {
            label: 'Modules Available',
            value: mockSafetyModules.length,
            icon: AcademicCapIcon,
            change: '+2 new',
            color: 'blue'
        },
        {
            label: 'Modules Completed',
            value: mockSafetyModules.filter(m => m.completed).length,
            icon: CheckCircleIcon,
            change: '+33%',
            color: 'green'
        },
        {
            label: 'Total Diamonds Earned',
            value: mockSafetyModules.filter(m => m.completed).reduce((acc, m) => acc + m.diamondReward, 0),
            icon: TrophyIcon,
            change: '+25%',
            color: 'amber'
        },
        {
            label: 'Average Progress',
            value: Math.round(mockSafetyModules.reduce((acc, m) => acc + m.progress, 0) / mockSafetyModules.length) + '%',
            icon: ChartBarIcon,
            change: '+12%',
            color: 'purple'
        },
        {
            label: 'Time Invested',
            value: '2.5h',
            icon: ClockIcon,
            change: '+45 min',
            color: 'emerald'
        },
        {
            label: 'Safety Knowledge',
            value: '94%',
            icon: StarIcon,
            change: '+8%',
            color: 'indigo'
        }
    ];

    const getMetricColor = (color: string) => {
        const colors = {
            blue: isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
            green: isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200',
            amber: isDark ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200',
            purple: isDark ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200',
            emerald: isDark ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200',
            indigo: isDark ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50 border-indigo-200',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    // Chart data for category progress
    const categoryData = {
        labels: ['Digital Literacy', 'Online Safety', 'Privacy Awareness', 'Cyber Bullying'],
        datasets: [{
            data: [
                mockSafetyModules.filter(m => m.category === 'digital_literacy').reduce((acc, m) => acc + m.progress, 0) / mockSafetyModules.filter(m => m.category === 'digital_literacy').length,
                mockSafetyModules.filter(m => m.category === 'online_safety').reduce((acc, m) => acc + m.progress, 0) / mockSafetyModules.filter(m => m.category === 'online_safety').length,
                mockSafetyModules.filter(m => m.category === 'privacy_awareness').reduce((acc, m) => acc + m.progress, 0) / mockSafetyModules.filter(m => m.category === 'privacy_awareness').length,
                mockSafetyModules.filter(m => m.category === 'cyber_bullying').reduce((acc, m) => acc + m.progress, 0) / mockSafetyModules.filter(m => m.category === 'cyber_bullying').length
            ],
            backgroundColor: [
                isDark ? 'rgba(99, 102, 241, 0.8)' : 'rgba(59, 130, 246, 0.8)',
                isDark ? 'rgba(34, 197, 94, 0.8)' : 'rgba(16, 185, 129, 0.8)',
                isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(139, 92, 246, 0.8)',
                isDark ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                isDark ? 'rgb(99, 102, 241)' : 'rgb(59, 130, 246)',
                isDark ? 'rgb(34, 197, 94)' : 'rgb(16, 185, 129)',
                isDark ? 'rgb(168, 85, 247)' : 'rgb(139, 92, 246)',
                isDark ? 'rgb(239, 68, 68)' : 'rgb(239, 68, 68)'
            ],
            borderWidth: 2
        }]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: 20
                }
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Education Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationMetrics.map(metric => {
                    const Icon = metric.icon;
                    return (
                        <div 
                            key={metric.label} 
                            className={clsx(
                                'p-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
                                getMetricColor(metric.color),
                                isDark ? 'bg-gray-800' : 'bg-white'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        'p-2 rounded-lg',
                                        isDark ? 'bg-gray-700' : 'bg-white'
                                    )}>
                                        <Icon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
                                            {metric.label}
                                        </p>
                                        <p className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                            {metric.value}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={clsx('text-sm font-medium', 
                                        metric.change.startsWith('+') 
                                            ? (isDark ? 'text-green-400' : 'text-green-600')
                                            : (isDark ? 'text-blue-400' : 'text-blue-600')
                                    )}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress by Category Chart */}
                <div className={clsx(
                    'lg:col-span-1 rounded-xl shadow-sm border p-6',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
                )}>
                    <h3 className={clsx('text-lg font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
                        📊 Progress by Category
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={categoryData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Safety Education Modules */}
                <div className={clsx(
                    'lg:col-span-2 rounded-xl shadow-sm border p-8',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
                )}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                🎓 Digital Safety Academy
                            </h2>
                            <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Interactive learning • Gamified experience • Age-appropriate content
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={clsx('px-4 py-2 rounded-lg border', isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')}>
                                <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                    💎 Total Rewards: {mockSafetyModules.reduce((acc, m) => acc + m.diamondReward, 0)} diamonds
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {mockSafetyModules.map(module => (
                            <div 
                                key={module.id} 
                                className={clsx(
                                    'border rounded-xl p-6 transition-all duration-200 hover:shadow-lg',
                                    isDark ? 'border-gray-600 bg-gray-900/50' : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-2xl">
                                                {module.completed ? '🏆' : getDifficultyIcon(module.difficulty)}
                                            </div>
                                            <div>
                                                <h3 className={clsx('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
                                                    {module.title}
                                                </h3>
                                                <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={clsx('px-3 py-1 text-xs font-medium rounded-full', getCategoryColor(module.category))}>
                                                {module.category.replace('_', ' ')}
                                            </span>
                                            <span className={clsx('px-3 py-1 text-xs font-medium rounded-full', getDifficultyColor(module.difficulty))}>
                                                {getDifficultyIcon(module.difficulty)} {module.difficulty}
                                            </span>
                                            <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                👥 Ages {module.ageGroup} • ⏱️ {module.timeToComplete}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className={clsx('text-2xl font-bold', isDark ? 'text-amber-400' : 'text-amber-600')}>
                                                💎 {module.diamondReward}
                                            </div>
                                            <div className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                Reward
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {module.completed ? (
                                                <div className="text-center">
                                                    <span className="text-3xl">✅</span>
                                                    <p className={clsx('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                        {module.completedAt}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className={clsx('text-2xl font-bold', isDark ? 'text-blue-400' : 'text-blue-600')}>
                                                        {module.progress}%
                                                    </div>
                                                    <span className="text-2xl">📚</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Enhanced Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                            Learning Progress
                                        </span>
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {module.progress}%
                                        </span>
                                    </div>
                                    <div className={clsx('w-full rounded-full h-3', isDark ? 'bg-gray-700' : 'bg-gray-200')}>
                                        <div 
                                            className={clsx(
                                                'h-3 rounded-full transition-all duration-500',
                                                module.completed 
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                            )}
                                            style={{ width: `${module.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Enhanced Action Button */}
                                <div className="mt-6">
                                    {module.completed ? (
                                        <div className="flex items-center justify-between">
                                            <button className={clsx(
                                                'px-6 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                                                isDark ? 'bg-gray-700 text-gray-400 cursor-default' : 'bg-gray-100 text-gray-600 cursor-default'
                                            )}>
                                                <CheckCircleIcon className="h-4 w-4" />
                                                Completed ✓
                                            </button>
                                            <button className={clsx(
                                                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                                isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'
                                            )}>
                                                📊 View Certificate
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button className={clsx(
                                                'flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2',
                                                isDark 
                                                    ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white hover:from-orange-700 hover:to-red-600 shadow-lg shadow-orange-900/20' 
                                                    : 'bg-gradient-to-r from-orange-600 to-red-500 text-white hover:from-orange-700 hover:to-red-600 shadow-lg shadow-orange-600/20'
                                            )}>
                                                <PlayIcon className="h-4 w-4" />
                                                {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
                                            </button>
                                            <button className={clsx(
                                                'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                                isDark ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            )}>
                                                ℹ️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FamilyDiscussionsTab = () => {
    const { isDark } = useContext(DarkModeContext);
    
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return isDark ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return isDark ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return isDark ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-200';
            default: return isDark ? 'text-gray-400 bg-gray-800 border-gray-700' : 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'safety': return isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700';
            case 'content': return isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700';
            case 'general': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700';
            case 'technical': return isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700';
            default: return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'safety': return '🛡️';
            case 'content': return '📹';
            case 'general': return '💬';
            case 'technical': return '⚙️';
            default: return '💭';
        }
    };

    // Discussion metrics
    const discussionMetrics = [
        {
            label: 'Total Discussions',
            value: mockDiscussions.length,
            icon: ChatBubbleLeftRightIcon,
            change: '+3 this week',
            color: 'blue'
        },
        {
            label: 'Open Conversations',
            value: mockDiscussions.filter(d => d.status === 'open').length,
            icon: ExclamationTriangleIcon,
            change: '+2 today',
            color: 'yellow'
        },
        {
            label: 'High Priority',
            value: mockDiscussions.filter(d => d.priority === 'high').length,
            icon: FireIcon,
            change: 'Need attention',
            color: 'red'
        },
        {
            label: 'Safety Topics',
            value: mockDiscussions.filter(d => d.category === 'safety').length,
            icon: ShieldCheckIcon,
            change: '+1 new',
            color: 'purple'
        },
        {
            label: 'Messages Exchanged',
            value: mockDiscussions.reduce((acc, d) => acc + d.messageCount, 0),
            icon: ChatBubbleLeftRightIcon,
            change: '+18 today',
            color: 'green'
        },
        {
            label: 'Resolution Rate',
            value: Math.round((mockDiscussions.filter(d => d.status === 'resolved').length / mockDiscussions.length) * 100) + '%',
            icon: CheckCircleIcon,
            change: '+12%',
            color: 'emerald'
        }
    ];

    const getMetricColor = (color: string) => {
        const colors = {
            blue: isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
            yellow: isDark ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200',
            red: isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200',
            purple: isDark ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200',
            green: isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200',
            emerald: isDark ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const openDiscussions = mockDiscussions.filter(d => d.status === 'open');
    const resolvedDiscussions = mockDiscussions.filter(d => d.status === 'resolved');

    return (
        <div className="space-y-8">
            {/* Discussion Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discussionMetrics.map(metric => {
                    const Icon = metric.icon;
                    return (
                        <div 
                            key={metric.label} 
                            className={clsx(
                                'p-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
                                getMetricColor(metric.color),
                                isDark ? 'bg-gray-800' : 'bg-white'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        'p-2 rounded-lg',
                                        isDark ? 'bg-gray-700' : 'bg-white'
                                    )}>
                                        <Icon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
                                            {metric.label}
                                        </p>
                                        <p className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                            {metric.value}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={clsx('text-sm font-medium', 
                                        metric.change.includes('+') 
                                            ? (isDark ? 'text-green-400' : 'text-green-600')
                                            : (isDark ? 'text-blue-400' : 'text-blue-600')
                                    )}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Discussions */}
            <div className={clsx(
                'rounded-xl shadow-sm border p-8',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
            )}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                            🗣️ Active Family Conversations
                        </h2>
                        <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Real-time communication • Safety-focused • Educational opportunities
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={clsx('px-4 py-2 rounded-lg border', isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')}>
                            <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                {openDiscussions.length} active topics
                            </span>
                        </div>
                        <button className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                            isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        )}>
                            💬 New Discussion
                        </button>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {openDiscussions.map(discussion => (
                        <div 
                            key={discussion.id} 
                            className={clsx(
                                'border rounded-xl p-6 transition-all duration-200 hover:shadow-lg',
                                getPriorityColor(discussion.priority),
                                isDark ? 'bg-gray-900/50' : 'bg-gradient-to-r from-white to-gray-50'
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="text-3xl">
                                        {getCategoryIcon(discussion.category)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className={clsx('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
                                                {discussion.topic}
                                            </h3>
                                            <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', getCategoryColor(discussion.category))}>
                                                {discussion.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm mb-3">
                                            <span className={clsx('font-medium', isDark ? 'text-blue-400' : 'text-blue-600')}>
                                                👤 {discussion.childName}
                                            </span>
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                🕒 {discussion.timestamp}
                                            </span>
                                            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', 
                                                discussion.priority === 'high' 
                                                    ? (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700')
                                                    : discussion.priority === 'medium'
                                                        ? (isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                                                        : (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700')
                                            )}>
                                                {discussion.priority} priority
                                            </span>
                                        </div>
                                        <div className={clsx(
                                            'p-4 rounded-lg border border-l-4',
                                            isDark ? 'bg-gray-800 border-gray-600 border-l-blue-500' : 'bg-gray-50 border-gray-200 border-l-blue-500'
                                        )}>
                                            <p className={clsx('text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                                Latest Message:
                                            </p>
                                            <p className={clsx('text-sm italic', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                "{discussion.lastMessage}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className={clsx('px-3 py-1 text-xs font-medium rounded-full', 
                                        discussion.status === 'open' 
                                            ? (isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800') 
                                            : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800')
                                    )}>
                                        {discussion.status}
                                    </span>
                                    <div className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                        💬 {discussion.messageCount} messages
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-6">
                                <button className={clsx(
                                    'flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                                    isDark 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                )}>
                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                    Continue Discussion
                                </button>
                                {discussion.status === 'open' && (
                                    <button className={clsx(
                                        'flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                                        isDark 
                                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20' 
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'
                                    )}>
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Mark Resolved
                                    </button>
                                )}
                                <button className={clsx(
                                    'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                    isDark 
                                        ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                )}>
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                    View Full Thread
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {openDiscussions.length === 0 && (
                        <div className={clsx('text-center py-16', isDark ? 'text-gray-400' : 'text-gray-500')}>
                            <div className={clsx('p-6 rounded-full mx-auto w-fit mb-4', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                                <ChatBubbleLeftRightIcon className="w-16 h-16" />
                            </div>
                            <h3 className={clsx('text-xl font-semibold mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                All conversations resolved! 🎉
                            </h3>
                            <p className="text-lg">No active discussions need your attention</p>
                            <p className="text-sm mt-2">When safety topics arise, they'll appear here for family discussion.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Resolved Discussions */}
            {resolvedDiscussions.length > 0 && (
                <div className={clsx(
                    'rounded-xl shadow-sm border p-8',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
                )}>
                    <h3 className={clsx('text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900')}>
                        ✅ Recently Resolved Discussions
                    </h3>
                    <div className="space-y-4">
                        {resolvedDiscussions.slice(0, 3).map(discussion => (
                            <div 
                                key={discussion.id}
                                className={clsx(
                                    'border rounded-lg p-4 transition-colors',
                                    isDark ? 'border-gray-600 bg-gray-900/30' : 'border-gray-200 bg-gray-50'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">✅</span>
                                        <div>
                                            <h4 className={clsx('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                                                {discussion.topic}
                                            </h4>
                                            <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                                with {discussion.childName} • {discussion.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                    <button className={clsx(
                                        'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
                                        isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'
                                    )}>
                                        View Summary
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className={clsx(
                'rounded-xl shadow-sm border p-6',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
            )}>
                <h3 className={clsx('text-lg font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
                    🚀 Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button className={clsx(
                        'flex items-center gap-3 p-4 rounded-lg border transition-colors text-left',
                        isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    )}>
                        <div className={clsx('p-2 rounded', isDark ? 'bg-green-900/50' : 'bg-green-100')}>
                            <ChatBubbleLeftRightIcon className={clsx('h-5 w-5', isDark ? 'text-green-400' : 'text-green-600')} />
                        </div>
                        <div>
                            <h4 className={clsx('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                                Start Safety Discussion
                            </h4>
                            <p className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Begin a new conversation
                            </p>
                        </div>
                    </button>
                    
                    <button className={clsx(
                        'flex items-center gap-3 p-4 rounded-lg border transition-colors text-left',
                        isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    )}>
                        <div className={clsx('p-2 rounded', isDark ? 'bg-blue-900/50' : 'bg-blue-100')}>
                            <QuestionMarkCircleIcon className={clsx('h-5 w-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
                        </div>
                        <div>
                            <h4 className={clsx('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                                Safety Q&A
                            </h4>
                            <p className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Common safety questions
                            </p>
                        </div>
                    </button>
                    
                    <button className={clsx(
                        'flex items-center gap-3 p-4 rounded-lg border transition-colors text-left',
                        isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    )}>
                        <div className={clsx('p-2 rounded', isDark ? 'bg-purple-900/50' : 'bg-purple-100')}>
                            <CogIcon className={clsx('h-5 w-5', isDark ? 'text-purple-400' : 'text-purple-600')} />
                        </div>
                        <div>
                            <h4 className={clsx('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                                Discussion Settings
                            </h4>
                            <p className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Manage preferences
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const PrivacySettingsTab = () => {
    const { isDark } = useContext(DarkModeContext);
    const [settings, setSettings] = useState(mockPrivacySettings);

    const toggleSetting = (id: string) => {
        setSettings(prev => prev.map(setting => 
            setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
        ));
    };

    const getLawfulBasisColor = (basis: string) => {
        switch (basis) {
            case 'consent': return isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800';
            case 'legitimate_interest': return isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
            case 'parental_responsibility': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800';
            default: return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800';
        }
    };

    const getImpactLevelColor = (level: string) => {
        switch (level) {
            case 'high': return isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700';
            case 'medium': return isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
            case 'low': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700';
            default: return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    const getImpactIcon = (level: string) => {
        switch (level) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    // Privacy metrics
    const privacyMetrics = [
        {
            label: 'Active Settings',
            value: settings.filter(s => s.enabled).length,
            icon: CogIcon,
            change: '6 of 6',
            color: 'blue'
        },
        {
            label: 'GDPR Compliance',
            value: '100%',
            icon: ShieldCheckIcon,
            change: 'Fully compliant',
            color: 'green'
        },
        {
            label: 'Data Retention',
            value: '7 days',
            icon: ClockIcon,
            change: 'Auto-cleanup',
            color: 'purple'
        },
        {
            label: 'Consent Status',
            value: 'Updated',
            icon: DocumentCheckIcon,
            change: 'Jan 15, 2024',
            color: 'emerald'
        },
        {
            label: 'Data Exports',
            value: '2',
            icon: ArrowTopRightOnSquareIcon,
            change: 'Last 30 days',
            color: 'amber'
        },
        {
            label: 'Privacy Score',
            value: '98/100',
            icon: StarIcon,
            change: 'Excellent',
            color: 'indigo'
        }
    ];

    const getMetricColor = (color: string) => {
        const colors = {
            blue: isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
            green: isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200',
            purple: isDark ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200',
            emerald: isDark ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200',
            amber: isDark ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200',
            indigo: isDark ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50 border-indigo-200',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const gdprRights = [
        { right: 'Right to Access', description: 'Download all your family data', icon: '📥', action: 'Export Data' },
        { right: 'Right to Rectification', description: 'Update incorrect information', icon: '✏️', action: 'Update Profile' },
        { right: 'Right to Erasure', description: 'Delete your account permanently', icon: '🗑️', action: 'Delete Account' },
        { right: 'Right to Portability', description: 'Transfer data to another service', icon: '📤', action: 'Transfer Data' },
        { right: 'Right to Object', description: 'Withdraw consent for processing', icon: '🚫', action: 'Withdraw Consent' },
        { right: 'Right to Information', description: 'Contact our Data Protection Officer', icon: '📞', action: 'Contact DPO' }
    ];

    return (
        <div className="space-y-8">
            {/* Privacy Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privacyMetrics.map(metric => {
                    const Icon = metric.icon;
                    return (
                        <div 
                            key={metric.label} 
                            className={clsx(
                                'p-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
                                getMetricColor(metric.color),
                                isDark ? 'bg-gray-800' : 'bg-white'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        'p-2 rounded-lg',
                                        isDark ? 'bg-gray-700' : 'bg-white'
                                    )}>
                                        <Icon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
                                            {metric.label}
                                        </p>
                                        <p className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                            {metric.value}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={clsx('text-sm font-medium', isDark ? 'text-blue-400' : 'text-blue-600')}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Enhanced Privacy Settings */}
            <div className={clsx(
                'rounded-xl shadow-sm border p-8',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
            )}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                            🔐 Privacy & Data Processing Settings
                        </h2>
                        <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            GDPR Article 8 compliant • Transparent data processing • Full parental control
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={clsx('px-4 py-2 rounded-lg border', isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')}>
                            <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                🇩🇰 Danish GDPR Compliance
                            </span>
                        </div>
                        <button className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                            isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        )}>
                            📊 Privacy Report
                        </button>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {settings.map(setting => (
                        <div 
                            key={setting.id} 
                            className={clsx(
                                'border rounded-xl p-6 transition-all duration-200 hover:shadow-lg',
                                isDark ? 'border-gray-600 bg-gray-900/50' : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className={clsx('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
                                            {setting.label}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {setting.required && (
                                                <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')}>
                                                    Required
                                                </span>
                                            )}
                                            <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', getImpactLevelColor(setting.impactLevel))}>
                                                {getImpactIcon(setting.impactLevel)} {setting.impactLevel} impact
                                            </span>
                                        </div>
                                    </div>
                                    <p className={clsx('text-sm mb-4 leading-relaxed', isDark ? 'text-gray-300' : 'text-gray-600')}>
                                        {setting.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className={clsx('px-3 py-1 font-medium rounded-full', getLawfulBasisColor(setting.lawfulBasis))}>
                                            Legal basis: {setting.lawfulBasis.replace('_', ' ')}
                                        </span>
                                        {setting.lastModified && (
                                            <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                                Last modified: {setting.lastModified}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                            {setting.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                        <button
                                            onClick={() => !setting.required && toggleSetting(setting.id)}
                                            disabled={setting.required}
                                            className={clsx(
                                                'relative w-16 h-8 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                                                setting.enabled 
                                                    ? (isDark ? 'bg-blue-600' : 'bg-blue-600')
                                                    : (isDark ? 'bg-gray-600' : 'bg-gray-300'),
                                                setting.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            )}
                                        >
                                            <div className={clsx(
                                                'absolute top-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out',
                                                setting.enabled ? 'translate-x-8' : 'translate-x-1'
                                            )} />
                                        </button>
                                    </div>
                                    
                                    <button className={clsx(
                                        'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
                                        isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'
                                    )}>
                                        ℹ️ Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* GDPR Rights Section */}
            <div className={clsx(
                'rounded-xl shadow-sm border p-8',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
            )}>
                <div className="flex items-center gap-3 mb-8">
                    <div className={clsx('p-3 rounded-full', isDark ? 'bg-blue-900/50' : 'bg-blue-100')}>
                        <ShieldCheckIcon className={clsx('h-8 w-8', isDark ? 'text-blue-400' : 'text-blue-600')} />
                    </div>
                    <div>
                        <h3 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                            🇪🇺 Your GDPR Data Rights
                        </h3>
                        <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Exercise your rights under European and Danish data protection law
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gdprRights.map(right => (
                        <div 
                            key={right.right}
                            className={clsx(
                                'border rounded-xl p-6 transition-all duration-200 hover:shadow-lg',
                                isDark ? 'border-gray-600 bg-gray-900/30' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
                            )}
                        >
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-3">{right.icon}</div>
                                <h4 className={clsx('font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                    {right.right}
                                </h4>
                                <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                    {right.description}
                                </p>
                            </div>
                            <button className={clsx(
                                'w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                                isDark 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                            )}>
                                {right.action}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Additional GDPR Information */}
                <div className={clsx(
                    'mt-8 p-6 rounded-xl border',
                    isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                )}>
                    <div className="flex items-start gap-4">
                        <div className={clsx('p-2 rounded-lg', isDark ? 'bg-blue-900/50' : 'bg-blue-100')}>
                            <BellIcon className={clsx('h-6 w-6', isDark ? 'text-blue-400' : 'text-blue-600')} />
                        </div>
                        <div className="flex-1">
                            <h4 className={clsx('font-bold mb-2', isDark ? 'text-blue-400' : 'text-blue-700')}>
                                🇩🇰 Danish Data Protection Authority Oversight
                            </h4>
                            <p className={clsx('text-sm leading-relaxed', isDark ? 'text-blue-300' : 'text-blue-600')}>
                                Flimmer operates under the supervision of the Danish Data Protection Authority (Datatilsynet). 
                                All data processing complies with Danish GDPR implementation and children's privacy regulations. 
                                You have the right to lodge a complaint with Datatilsynet if you believe your rights have been violated.
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                                <button className={clsx(
                                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                    isDark ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'
                                )}>
                                    📋 View Privacy Policy
                                </button>
                                <button className={clsx(
                                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                    isDark ? 'border border-blue-600 text-blue-400 hover:bg-blue-900/30' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                                )}>
                                    🏛️ Contact Datatilsynet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function ParentControlsPage() {
    const { isDark, toggleDark } = useContext(DarkModeContext);
    const [children, setChildren] = useState<Child[]>(mockChildren);
    const [contentQueue, setContentQueue] = useState<ContentSubmission[]>(mockContentQueue);
    const [activeTab, setActiveTab] = useState('Family Overview');

    // Event Handlers
    const handleContentApproval = (id: number, action: 'approve' | 'reject' | 'discuss') => {
        setContentQueue(prev => prev.map(item => 
            item.id === id ? { 
                ...item, 
                status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'needs_discussion' 
            } : item
        ));
    };

    // Enhanced Tab Configuration with icons
    const tabs = {
        'Family Overview': { icon: UserGroupIcon, badge: null },
        'Content Approvals': { icon: VideoCameraIcon, badge: contentQueue.filter(c => c.status === 'pending').length },
        'Safety Education': { icon: AcademicCapIcon, badge: mockSafetyModules.filter(m => !m.completed).length },
        // 'Family Discussions': { icon: ChatBubbleLeftRightIcon, badge: mockDiscussions.filter(d => d.status === 'open').length },
        'Privacy Settings': { icon: LockClosedIcon, badge: null },
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Family Overview': return <FamilyOverviewTab children={children} />;
            case 'Content Approvals': return <ContentApprovalsTab contentQueue={contentQueue} onApprove={handleContentApproval} />;
            case 'Safety Education': return <SafetyEducationTab />;
            // case 'Family Discussions': return <FamilyDiscussionsTab />;
            case 'Privacy Settings': return <PrivacySettingsTab />;
            default: return <FamilyOverviewTab children={children} />;
        }
    };

    return (
        <div className={clsx('flex h-screen', isDark ? 'bg-gray-900' : 'bg-white')}>
            {/* Enhanced Sidebar */}
            <aside className={clsx(
                'w-80 border-r p-6 flex flex-col',
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}>
                {/* Header with Dark Mode Toggle */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                🛡️ Flimmer Parent
                            </h1>
                            <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Content Safety & Digital Education Platform
                            </p>
                        </div>
                        <button
                            onClick={toggleDark}
                            className={clsx(
                                'p-2 rounded-lg transition-colors',
                                isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                    
                    {/* Quick Stats & MitID Verification - Unified Card */}
                    <div className={clsx(
                        'rounded-xl border p-4 mb-8',
                        isDark ? 'bg-gradient-to-r from-blue-900/20 to-green-900/10 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200'
                    )}>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                👥 {children.length} children
                            </span>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                💎 {children.reduce((acc, child) => acc + child.diamondBalance, 0).toLocaleString('en-US')} diamonds
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                ⭐ {Math.round(children.reduce((acc, child) => acc + child.safetyScore, 0) / children.length)}% avg safety
                            </span>
                            <span className={clsx('font-medium', isDark ? 'text-green-400' : 'text-green-600')}>
                                🇩🇰 MitID Verified
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800')}>Danish Citizen</span>
                            <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800')}>GDPR Compliant</span>
                        </div>
                        <div className={clsx('text-xs mt-2', isDark ? 'text-gray-400' : 'text-gray-500')}>Parent identity verified with MitID • GDPR Article 8 compliant</div>
                    </div>
                </div>

                {/* Enhanced Navigation */}
                <nav className="flex flex-col space-y-2 flex-1">
                    {Object.entries(tabs).map(([tabName, { icon: Icon, badge }]) => (
                        <button
                            key={tabName}
                            onClick={() => setActiveTab(tabName)}
                            className={clsx(
                                'flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                                activeTab === tabName 
                                    ? (isDark 
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/20' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20'
                                    )
                                    : (isDark 
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5" />
                                <span>{tabName}</span>
                            </div>
                            {badge !== null && badge > 0 && (
                                <span className={clsx(
                                    'px-2 py-1 text-xs font-bold rounded-full',
                                    activeTab === tabName 
                                        ? 'bg-white/20 text-white' 
                                        : (isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600')
                                )}>
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
                
                {/* Enhanced Footer */}
                <div className={clsx('mt-auto pt-6 border-t space-y-4', isDark ? 'border-gray-700' : 'border-gray-200')}>
                    {/* Compliance Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={clsx('p-2 rounded-lg text-center', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                            <div className="text-lg mb-1">🔒</div>
                            <div className={clsx('font-medium', isDark ? 'text-green-400' : 'text-green-600')}>
                                GDPR
                            </div>
                            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Compliant
                            </div>
                        </div>
                        <div className={clsx('p-2 rounded-lg text-center', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                            <div className="text-lg mb-1">🛡️</div>
                            <div className={clsx('font-medium', isDark ? 'text-blue-400' : 'text-blue-600')}>
                                Privacy
                            </div>
                            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                by Design
                            </div>
                        </div>
                        <div className={clsx('p-2 rounded-lg text-center', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                            <div className="text-lg mb-1">🇩🇰</div>
                            <div className={clsx('font-medium', isDark ? 'text-amber-400' : 'text-amber-600')}>
                                MitID
                            </div>
                            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Verified
                            </div>
                        </div>
                        <div className={clsx('p-2 rounded-lg text-center', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                            <div className="text-lg mb-1">🎯</div>
                            <div className={clsx('font-medium', isDark ? 'text-purple-400' : 'text-purple-600')}>
                                Child
                            </div>
                            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Focused
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <button className={clsx(
                            'flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                            isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        )}>
                            📞 Support
                        </button>
                        <button className={clsx(
                            'flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                            isDark ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        )}>
                            📖 Guide
                        </button>
                    </div>

                    {/* Version Info */}
                    <div className={clsx('text-xs text-center', isDark ? 'text-gray-500' : 'text-gray-400')}>
                        <p>Flimmer Parent v2.1.0</p>
                        <p className="mt-1">🏗️ Enterprise Edition</p>
                    </div>
                </div>
            </aside>

            {/* Enhanced Main Content */}
            <main className={clsx(
                'flex-1 overflow-y-auto',
                isDark ? 'bg-gray-900' : 'bg-gray-50/50'
            )}>
                <div className="p-8">
                    {/* Content Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className={clsx('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                    {activeTab}
                                </h1>
                                <p className={clsx('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                    {activeTab === 'Family Overview' && 'Comprehensive overview of your family\'s digital safety journey'}
                                    {activeTab === 'Content Approvals' && 'Review and approve content created by your children'}
                                    {activeTab === 'Safety Education' && 'Interactive digital safety learning modules and progress tracking'}
                                    {activeTab === 'Family Discussions' && 'Open conversations about digital safety and responsible online behavior'}
                                    {activeTab === 'Privacy Settings' && 'Comprehensive data protection controls and GDPR compliance management'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={clsx('px-4 py-2 rounded-lg border text-sm', isDark ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-200 bg-white text-gray-700')}>
                                    🕒 Last updated: 2 min ago
                                </div>
                                <button className={clsx(
                                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                )}>
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tab Content */}
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
} 