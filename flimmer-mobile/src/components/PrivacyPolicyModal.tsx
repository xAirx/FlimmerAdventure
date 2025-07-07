import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export interface Consent {
  essential: boolean;
  activityAnalysis: boolean;
  personalizedContent: boolean;
  locationTracking: boolean;
  marketingEmails: boolean;
  analyticsImprovement: boolean;
  thirdPartyIntegrations: boolean;
  aiRecommendations: boolean;
}

interface PrivacyPolicyModalProps {
  visible: boolean;
  onAccept: (consent: Consent) => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onAccept }) => {
  const [consent, setConsent] = useState<Consent>({
    essential: false,
    activityAnalysis: false,
    personalizedContent: false,
    locationTracking: false,
    marketingEmails: false,
    analyticsImprovement: false,
    thirdPartyIntegrations: false,
    aiRecommendations: false,
  });

  const isAcceptable = consent.essential;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Your Privacy Choices</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.paragraph}>
              We are committed to protecting your family's privacy. Please review and manage your consent for the following data processing activities. You can change these preferences anytime in Settings.
            </Text>
            
            {/* Essential Data */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>🔒 Essential Data (Required)</Text>
                <Text style={styles.description}>Account creation, authentication, content moderation, and core safety features. Required to use the app.</Text>
              </View>
              <Switch
                value={consent.essential}
                onValueChange={(value) => setConsent(c => ({ ...c, essential: value }))}
              />
            </View>

            {/* Activity Analysis */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>🤖 AI Safety Analysis</Text>
                <Text style={styles.description}>Analyze activity patterns to provide proactive safety insights, detect concerning behavior, and improve content recommendations.</Text>
              </View>
              <Switch
                value={consent.activityAnalysis}
                onValueChange={(value) => setConsent(c => ({ ...c, activityAnalysis: value }))}
              />
            </View>

            {/* Personalized Content */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>🎯 Personalized Content</Text>
                <Text style={styles.description}>Customize content recommendations based on your family's interests, age groups, and viewing history to improve relevance.</Text>
              </View>
              <Switch
                value={consent.personalizedContent}
                onValueChange={(value) => setConsent(c => ({ ...c, personalizedContent: value }))}
              />
            </View>

            {/* Location Tracking */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>📍 Location-Based Safety</Text>
                <Text style={styles.description}>Access device location to provide location-based safety alerts, geo-fencing notifications, and emergency assistance features.</Text>
              </View>
              <Switch
                value={consent.locationTracking}
                onValueChange={(value) => setConsent(c => ({ ...c, locationTracking: value }))}
              />
            </View>

            {/* Marketing Emails */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>📧 Safety Tips & Updates</Text>
                <Text style={styles.description}>Receive weekly family safety tips, digital wellness insights, platform updates, and educational content via email.</Text>
              </View>
              <Switch
                value={consent.marketingEmails}
                onValueChange={(value) => setConsent(c => ({ ...c, marketingEmails: value }))}
              />
            </View>

            {/* Analytics Improvement */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>📊 Product Improvement</Text>
                <Text style={styles.description}>Share anonymized usage data to help us improve app performance, fix bugs, and develop new safety features.</Text>
              </View>
              <Switch
                value={consent.analyticsImprovement}
                onValueChange={(value) => setConsent(c => ({ ...c, analyticsImprovement: value }))}
              />
            </View>

            {/* Third Party Integrations */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>🔗 Educational Integrations</Text>
                <Text style={styles.description}>Connect with educational platforms (Khan Academy, Common Sense Media) to enhance learning recommendations and safety resources.</Text>
              </View>
              <Switch
                value={consent.thirdPartyIntegrations}
                onValueChange={(value) => setConsent(c => ({ ...c, thirdPartyIntegrations: value }))}
              />
            </View>

            {/* AI Recommendations */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>🧠 Smart Recommendations</Text>
                <Text style={styles.description}>Use AI to suggest family discussion topics, safety learning modules, and screen time optimization based on your family's patterns.</Text>
              </View>
              <Switch
                value={consent.aiRecommendations}
                onValueChange={(value) => setConsent(c => ({ ...c, aiRecommendations: value }))}
              />
            </View>

            <View style={styles.privacyNote}>
              <Text style={styles.privacyNoteText}>
                💡 <Text style={styles.bold}>Your Control:</Text> You can change any of these preferences at any time in Settings. Essential data is required for core functionality, but all other features are completely optional.
              </Text>
            </View>


          </ScrollView>

          <TouchableOpacity 
            style={[styles.acceptButton, !isAcceptable && styles.acceptButtonDisabled]} 
            onPress={() => onAccept(consent)}
            disabled={!isAcceptable}
          >
            <Text style={styles.acceptButtonText}>Accept and Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContent: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  scrollView: { flexGrow: 0 },
  paragraph: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 20 },
  consentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  consentText: { flex: 1, paddingRight: 15 },
  heading: { fontSize: 17, fontWeight: '600' },
  description: { fontSize: 14, color: '#666', marginTop: 4 },
  acceptButton: { backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  acceptButtonDisabled: { backgroundColor: '#a0c8ff' },
  acceptButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  privacyNote: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 8, 
    padding: 15, 
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  privacyNoteText: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 20,
  },
  bold: { 
    fontWeight: 'bold',
  },
});

export default PrivacyPolicyModal; 