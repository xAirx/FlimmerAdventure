import { NextResponse } from 'next/server';
import type { Vulnerability, MonitoredDependency } from '@/types/admin';

const mockVulnerabilities: Vulnerability[] = [
    { id: 'SNYK-JS-LODASH-12345', severity: 'High', description: 'Prototype Pollution', dependency: 'lodash', path: 'package.json', remediation: 'Upgrade to 4.17.21' },
    { id: 'SNYK-JS-EXPRESS-54321', severity: 'Medium', description: 'Cross-Site Scripting (XSS)', dependency: 'express', path: 'server/package.json', remediation: 'Upgrade to 4.18.2' },
];

const mockDependencies: MonitoredDependency[] = [
    { name: 'react', version: '19.1.0', status: 'Healthy', license: 'MIT' },
    { name: 'next', version: '15.3.5', status: 'Healthy', license: 'MIT' },
    { name: 'firebase', version: '10.12.2', status: 'Healthy', license: 'Apache-2.0' },
];

export async function GET() {
    return NextResponse.json({
        vulnerabilities: mockVulnerabilities,
        dependencies: mockDependencies,
        securityScore: 98.7,
        totalVulnerabilities: 3,
        highSeverity: 1,
        mediumSeverity: 1,
        lowSeverity: 1
    });
} 