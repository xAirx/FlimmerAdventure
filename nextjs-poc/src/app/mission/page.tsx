'use client';

import React from 'react';
import { DarkModeProvider, useDarkMode } from '@/components/DarkModeProvider';
import clsx from 'clsx';

const MissionContent: React.FC = () => {
    const { isDark } = useDarkMode();

    const challenges = [
        {
            title: 'Children are exposed to online dangers',
            description: 'Predators, cyberbullying, and inappropriate content are just a click away—even on "safe" platforms.',
            impact: 'Danish families overwhelmingly concerned about children\'s online safety but lack effective tools'
        },
        {
            title: 'Parents lack visibility and control',
            description: 'Most tools are reactive, not proactive, and don\'t provide real-time oversight or actionable insights.',
            impact: 'Parents feel powerless to protect their children in digital spaces'
        },
        {
            title: 'No bridge for meaningful safety discussions',
            description: 'Families struggle to talk about digital risks, and children often hide problems.',
            impact: 'Critical safety conversations don\'t happen until it\'s too late'
        },
        {
            title: 'Complex privacy regulations',
            description: 'GDPR, Article 8 compliance is treated as a checkbox, risking fines and eroding trust.',
            impact: 'Platforms risk legal consequences while failing to build real trust'
        },
        {
            title: 'Anonymity enables bad actors',
            description: 'Unverified adults can access children\'s spaces on most platforms.',
            impact: 'Children\'s safety compromised by lack of identity verification'
        },
        {
            title: 'Lack of transparency and data rights',
            description: 'Parents and children can\'t easily access, export, or delete their data.',
            impact: 'Families have no real control over their digital footprint'
        },
        {
            title: 'Fragmented experience across devices',
            description: 'Most solutions don\'t sync in real time or work seamlessly across web and mobile.',
            impact: 'Safety gaps when switching between devices'
        },
        {
            title: 'Harmful content can be stored before detection',
            description: 'Many platforms rely on manual review or slow AI moderation.',
            impact: 'Damage done before content can be removed'
        }
    ];

    return (
        <div className={clsx('min-h-screen', isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900')}>
            {/* Hero Section */}
            <div className="relative py-24 px-6 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                
                <div className="relative max-w-5xl mx-auto text-center">
                    <div className="mb-6">
                        <div className={clsx(
                            'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border',
                            isDark ? 'bg-gray-800/50 border-gray-600 text-gray-300' : 'bg-white/80 border-gray-200 text-gray-600'
                        )}>
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Industry Analysis
                        </div>
                    </div>
                    
                    <h1 className={clsx(
                        'text-6xl font-bold mb-6 leading-tight tracking-tight',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                        The Digital Safety
                        <span className={clsx('block', isDark ? 'text-blue-400' : 'text-blue-600')}>Challenge</span>
                    </h1>
                    
                    <p className={clsx(
                        'text-xl leading-relaxed mb-16 max-w-4xl mx-auto font-light',
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    )}>
                        Children today face unprecedented online risks while parents lack the tools and visibility 
                        needed to protect them effectively.
                    </p>
                    
                    {/* Stats Bar */}
                    <div className={clsx(
                        'flex justify-center items-center space-x-8 py-6 px-8 rounded-2xl border',
                        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200 shadow-lg'
                    )}>
                        <div className="text-center">
                            <div className={clsx('text-2xl font-bold', isDark ? 'text-blue-400' : 'text-blue-600')}>8</div>
                            <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Critical Issues</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div className="text-center">
                            <div className={clsx('text-2xl font-bold', isDark ? 'text-red-400' : 'text-red-600')}>67%</div>
                            <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Parents Concerned</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div className="text-center">
                            <div className={clsx('text-2xl font-bold', isDark ? 'text-yellow-400' : 'text-yellow-600')}>0</div>
                            <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Effective Solutions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Challenge Section */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={clsx(
                            'text-4xl font-bold mb-4',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            The Challenge
                        </h2>
                        <div className={clsx(
                            'w-24 h-1 mx-auto rounded-full',
                            isDark ? 'bg-blue-500' : 'bg-blue-600'
                        )}></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {challenges.map((challenge, index) => (
                            <div key={index} className={clsx(
                                'group relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                                isDark 
                                    ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg'
                            )}>
                                {/* Number Badge */}
                                <div className={clsx(
                                    'absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                    isDark ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                                )}>
                                    {index + 1}
                                </div>
                                
                                <h3 className={clsx(
                                    'text-xl font-semibold mb-4 pr-8',
                                    isDark ? 'text-red-400' : 'text-red-600'
                                )}>
                                    {challenge.title}
                                </h3>
                                
                                <p className={clsx(
                                    'text-lg mb-6 leading-relaxed',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    {challenge.description}
                                </p>
                                
                                <div className={clsx(
                                    'p-4 rounded-xl border-l-4',
                                    isDark ? 'bg-gray-700/50 border-l-blue-500' : 'bg-gray-50 border-l-blue-500'
                                )}>
                                    <p className={clsx(
                                        'text-sm font-medium',
                                        isDark ? 'text-blue-300' : 'text-blue-700'
                                    )}>
                                        Impact: {challenge.impact}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Market Context */}
            <div className={clsx('py-24 px-6', isDark ? 'bg-gray-800/50' : 'bg-white')}>
                <div className="max-w-5xl mx-auto">
                    <div className={clsx(
                        'p-16 rounded-3xl border relative overflow-hidden',
                        isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200 shadow-xl'
                    )}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
                            }}></div>
                        </div>
                        
                        <div className="relative">
                            <div className="text-center mb-12">
                                <h2 className={clsx(
                                    'text-4xl font-bold mb-4',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    The Market Reality
                                </h2>
                                <div className={clsx(
                                    'w-24 h-1 mx-auto rounded-full',
                                    isDark ? 'bg-blue-500' : 'bg-blue-600'
                                )}></div>
                            </div>
                            
                            <div className="space-y-8 text-lg leading-relaxed">
                                <p className={clsx(isDark ? 'text-gray-300' : 'text-gray-700')}>
                                    Most digital safety solutions are reactive, fragmented, and treat privacy as an afterthought. 
                                    They fail to address the fundamental challenges families face in protecting children online.
                                </p>
                                <p className={clsx(isDark ? 'text-gray-300' : 'text-gray-700')}>
                                    Danish families are particularly concerned about children's online safety, 
                                    yet current solutions don't meet this demand.
                                </p>
                                <div className={clsx(
                                    'p-6 rounded-2xl border-l-4',
                                    isDark ? 'bg-blue-900/30 border-l-blue-400' : 'bg-blue-50 border-l-blue-500'
                                )}>
                                    <p className={clsx(
                                        'font-semibold text-lg',
                                        isDark ? 'text-blue-300' : 'text-blue-700'
                                    )}>
                                        The industry needs a new approach that combines verified identity, human oversight, 
                                        and intelligent technology to truly protect children while empowering parents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MissionPage: React.FC = () => {
    return (
        <DarkModeProvider>
            <MissionContent />
        </DarkModeProvider>
    );
};

export default MissionPage; 