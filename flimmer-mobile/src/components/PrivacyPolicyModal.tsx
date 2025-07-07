import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export interface Consent {
  essential: boolean;
  activityAnalysis: boolean;
  locationTracking: boolean;
}

interface PrivacyPolicyModalProps {
  visible: boolean;
  onAccept: (consent: Consent) => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onAccept }) => {
  const [consent, setConsent] = useState<Consent>({
    essential: false,
    activityAnalysis: false,
    locationTracking: false,
  });

  const isAcceptable = consent.essential;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Your Privacy Choices</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.paragraph}>
              We are committed to protecting your family's privacy. Please review and manage your consent for the following data processing activities.
            </Text>
            
            {/* Essential Data */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>Essential Data (Required)</Text>
                <Text style={styles.description}>We need to process basic account and activity data to provide our core safety features. This is required to use the app.</Text>
              </View>
              <Switch
                value={consent.essential}
                onValueChange={(value) => setConsent(c => ({ ...c, essential: value }))}
              />
            </View>

            {/* Activity Analysis */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>AI-Powered Safety Analysis</Text>
                <Text style={styles.description}>Allow us to analyze activity patterns to provide proactive safety insights and alerts. You can change this later.</Text>
              </View>
              <Switch
                value={consent.activityAnalysis}
                onValueChange={(value) => setConsent(c => ({ ...c, activityAnalysis: value }))}
              />
            </View>

            {/* Location Tracking */}
            <View style={styles.consentRow}>
              <View style={styles.consentText}>
                <Text style={styles.heading}>Location Tracking</Text>
                <Text style={styles.description}>Enable location-based features like safety alerts for specific places. This is optional and can be changed later.</Text>
              </View>
              <Switch
                value={consent.locationTracking}
                onValueChange={(value) => setConsent(c => ({ ...c, locationTracking: value }))}
              />
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
});

export default PrivacyPolicyModal; 