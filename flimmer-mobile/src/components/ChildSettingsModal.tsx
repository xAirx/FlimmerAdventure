import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';

// --- Types ---
interface Child {
  id: string;
  name: string;
}

export interface ChildSettings {
  contentFilterLevel: 'young_child' | 'pre_teen' | 'teen';
  screenTimeLimitHours: number;
}

interface ChildSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  child: Child | null;
  initialSettings: ChildSettings;
  onSave: (childId: string, newSettings: ChildSettings) => void;
}

// --- Component ---
const ChildSettingsModal: React.FC<ChildSettingsModalProps> = ({ visible, onClose, child, initialSettings, onSave }) => {
  const [settings, setSettings] = useState<ChildSettings>(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  if (!child) return null;

  const handleSave = () => {
    onSave(child.id, settings);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Settings for {child.name}</Text>
          
          {/* Content Filtering */}
          <Text style={styles.sectionTitle}>Content Filtering</Text>
          <View style={styles.segmentedControl}>
            {['young_child', 'pre_teen', 'teen'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.segment,
                  settings.contentFilterLevel === level && styles.segmentActive,
                ]}
                onPress={() => setSettings(s => ({ ...s, contentFilterLevel: level as any }))}
              >
                <Text style={[styles.segmentText, settings.contentFilterLevel === level && styles.segmentTextActive]}>
                  {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Screen Time */}
          <Text style={styles.sectionTitle}>Daily Screen Time Limit</Text>
          <View style={styles.screenTimeContainer}>
            <TouchableOpacity style={styles.timeButton} onPress={() => setSettings(s => ({ ...s, screenTimeLimitHours: Math.max(0, s.screenTimeLimitHours - 0.5) }))}>
              <Text style={styles.timeButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{settings.screenTimeLimitHours} hours</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setSettings(s => ({ ...s, screenTimeLimitHours: s.screenTimeLimitHours + 0.5 }))}>
              <Text style={styles.timeButtonText}>+</Text>
            </TouchableOpacity>
          </View>



          {/* Actions */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- Styles ---
const styles = StyleSheet.create({
    modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        paddingBottom: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10, color: '#333' },
    segmentedControl: { flexDirection: 'row', width: '100%', borderRadius: 8, borderWidth: 1, borderColor: '#007AFF', overflow: 'hidden' },
    segment: { flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
    segmentActive: { backgroundColor: '#007AFF' },
    segmentText: { color: '#007AFF', fontWeight: '500' },
    segmentTextActive: { color: 'white' },
    screenTimeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
    timeButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    timeButtonText: { fontSize: 24, fontWeight: 'bold' },
    timeText: { fontSize: 22, fontWeight: '600', marginHorizontal: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 20 },
    rowTitle: { fontSize: 17 },
    buttonContainer: { marginTop: 30, flexDirection: 'column', gap: 10 },
    button: { borderRadius: 10, padding: 15, alignItems: 'center' },
    saveButton: { backgroundColor: '#007AFF' },
    cancelButton: { backgroundColor: '#ccc' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});

export default ChildSettingsModal; 