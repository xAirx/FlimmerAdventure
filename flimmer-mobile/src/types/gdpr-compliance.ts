// GDPR Compliance Framework for Flimmer Mobile

export interface GDPRCompliance {
  // Article 6 - Lawful basis for processing
  lawfulBasis: 'consent' | 'legitimate_interest' | 'vital_interest';
  
  // Article 7 - Conditions for consent
  consent: {
    childConsent: boolean; // Age-appropriate consent mechanism
    parentalConsent: boolean;
    withdrawable: boolean;
    granular: boolean; // Specific consent for each feature
    documented: boolean;
  };
  
  // Article 5 - Principles of processing
  principles: {
    lawfulness: boolean;
    fairness: boolean;
    transparency: boolean;
    purposeLimitation: boolean;
    dataMinimisation: boolean;
    accuracy: boolean;
    storageLimitation: boolean;
    integrityConfidentiality: boolean;
    accountability: boolean;
  };
  
  // Article 25 - Data protection by design and by default
  privacyByDesign: {
    dataMinimization: boolean;
    pseudonymization: boolean;
    encryption: boolean;
    accessControls: boolean;
  };
}

export interface ChildDataProtection {
  // Special protection for children under GDPR
  age: number;
  requiresParentalConsent: boolean; // Under 16 in most EU countries
  dataMinimization: boolean; // Extra protection for children
  retentionPolicy: 'until_18' | 'parental_request' | 'service_end';
  
  // Article 17 - Right to erasure ("right to be forgotten")
  rightToErasure: {
    available: boolean;
    automated: boolean;
    timeframe: '30_days';
  };
  
  // Article 20 - Right to data portability
  dataPortability: {
    available: boolean;
    format: 'json' | 'xml' | 'csv';
    automated: boolean;
  };
}

export interface SafetyFeatureCompliance {
  feature: string;
  
  // Ethical assessment
  ethical: {
    benefitsChild: boolean;
    respectsAutonomy: boolean;
    proportionate: boolean;
    transparent: boolean;
  };
  
  // Legal compliance
  legal: {
    gdprCompliant: boolean;
    coppaCompliant: boolean;
    requiresConsent: boolean;
    humanOversight: boolean;
  };
  
  // Risk assessment
  risks: {
    privacyInvasion: 'low' | 'medium' | 'high';
    psychologicalHarm: 'low' | 'medium' | 'high';
    discrimination: 'low' | 'medium' | 'high';
    surveillance: 'low' | 'medium' | 'high';
  };
}

// Implementation examples
export const FEATURE_COMPLIANCE: Record<string, SafetyFeatureCompliance> = {
  realTimeActivityFeed: {
    feature: 'Real-time Activity Feed',
    ethical: {
      benefitsChild: true, // Safety protection
      respectsAutonomy: false, // Constant surveillance
      proportionate: false, // May be excessive
      transparent: true, // Child knows they're monitored
    },
    legal: {
      gdprCompliant: false, // Excessive data processing
      coppaCompliant: true, // With parental consent
      requiresConsent: true,
      humanOversight: true,
    },
    risks: {
      privacyInvasion: 'high',
      psychologicalHarm: 'medium',
      discrimination: 'low',
      surveillance: 'high',
    },
  },
  
  emergencyPanicButton: {
    feature: 'Emergency Panic Button',
    ethical: {
      benefitsChild: true, // Immediate safety
      respectsAutonomy: true, // Emergency override justified
      proportionate: true, // Minimal intervention for safety
      transparent: true, // Clear purpose
    },
    legal: {
      gdprCompliant: true, // Vital interest basis
      coppaCompliant: true,
      requiresConsent: false, // Vital interest
      humanOversight: true,
    },
    risks: {
      privacyInvasion: 'low',
      psychologicalHarm: 'low',
      discrimination: 'low',
      surveillance: 'low',
    },
  },
  
  aiRiskAssessment: {
    feature: 'AI Risk Assessment',
    ethical: {
      benefitsChild: true, // Early intervention
      respectsAutonomy: false, // Automated profiling
      proportionate: true, // If human oversight included
      transparent: true, // Explainable AI required
    },
    legal: {
      gdprCompliant: false, // Article 22 - automated decision-making
      coppaCompliant: true, // With safeguards
      requiresConsent: true,
      humanOversight: true, // Required for compliance
    },
    risks: {
      privacyInvasion: 'medium',
      psychologicalHarm: 'medium',
      discrimination: 'high', // AI bias risk
      surveillance: 'medium',
    },
  },
  
  screenTimeTracking: {
    feature: 'Screen Time Tracking',
    ethical: {
      benefitsChild: true, // Health and wellbeing
      respectsAutonomy: true, // Reasonable parental control
      proportionate: true, // Health-focused
      transparent: true, // Visible to child
    },
    legal: {
      gdprCompliant: true, // Legitimate interest
      coppaCompliant: true,
      requiresConsent: true,
      humanOversight: false, // Automated tracking acceptable
    },
    risks: {
      privacyInvasion: 'low',
      psychologicalHarm: 'low',
      discrimination: 'low',
      surveillance: 'low',
    },
  },
  
  parentNetworking: {
    feature: 'Parent-to-Parent Networking',
    ethical: {
      benefitsChild: false, // Benefits parents, not child
      respectsAutonomy: false, // Child's data discussed
      proportionate: false, // Not necessary for safety
      transparent: false, // Child may not know
    },
    legal: {
      gdprCompliant: false, // Third-party data sharing
      coppaCompliant: false, // Child data in adult networks
      requiresConsent: true,
      humanOversight: true,
    },
    risks: {
      privacyInvasion: 'high',
      psychologicalHarm: 'medium',
      discrimination: 'high',
      surveillance: 'medium',
    },
  },
};

export class GDPRComplianceChecker {
  static assessFeature(feature: SafetyFeatureCompliance): {
    recommended: boolean;
    modifications: string[];
    risks: string[];
  } {
    const issues: string[] = [];
    const modifications: string[] = [];
    const risks: string[] = [];
    
    // Check ethical compliance
    if (!feature.ethical.benefitsChild) {
      issues.push('Feature does not clearly benefit the child');
    }
    
    if (!feature.ethical.respectsAutonomy) {
      modifications.push('Add child agency and consent mechanisms');
    }
    
    if (!feature.ethical.proportionate) {
      modifications.push('Reduce scope to minimum necessary for safety');
    }
    
    // Check legal compliance
    if (!feature.legal.gdprCompliant) {
      modifications.push('Implement GDPR compliance measures');
    }
    
    if (feature.legal.requiresConsent) {
      modifications.push('Implement granular consent management');
    }
    
    // Assess risks
    Object.entries(feature.risks).forEach(([risk, level]) => {
      if (level === 'high') {
        risks.push(`High ${risk} risk - consider alternative approach`);
      } else if (level === 'medium') {
        risks.push(`Medium ${risk} risk - implement safeguards`);
      }
    });
    
    const recommended = issues.length === 0 && 
                       feature.legal.gdprCompliant && 
                       feature.ethical.benefitsChild;
    
    return { recommended, modifications, risks };
  }
}

// Age-appropriate consent mechanism
export interface ChildConsentMechanism {
  age: number;
  consentType: 'visual' | 'simplified_text' | 'interactive_game';
  parentalApproval: boolean;
  explanation: string;
  withdrawalMechanism: 'simple_toggle' | 'parent_request';
}

export const AGE_APPROPRIATE_CONSENT: Record<string, ChildConsentMechanism> = {
  under8: {
    age: 7,
    consentType: 'visual',
    parentalApproval: true,
    explanation: 'Visual icons showing what the app can see',
    withdrawalMechanism: 'parent_request',
  },
  age8to12: {
    age: 10,
    consentType: 'simplified_text',
    parentalApproval: true,
    explanation: 'Simple language explaining data use',
    withdrawalMechanism: 'simple_toggle',
  },
  age13to15: {
    age: 14,
    consentType: 'interactive_game',
    parentalApproval: true,
    explanation: 'Interactive privacy education game',
    withdrawalMechanism: 'simple_toggle',
  },
  age16plus: {
    age: 16,
    consentType: 'simplified_text',
    parentalApproval: false,
    explanation: 'Clear, concise privacy notice',
    withdrawalMechanism: 'simple_toggle',
  },
}; 