import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Switch,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import ChildSettingsModal, { ChildSettings } from '../components/ChildSettingsModal';
import { Consent } from '../components/PrivacyPolicyModal';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  icon: string;
}

interface Child {
  id: string;
  name: string;
  age: number;
}

const MOCK_SETTINGS: SettingItem[] = [
  // Core Safety & Privacy
  {
    id: 'direct-messaging',
    title: 'Direct Messaging',
    description: 'Allow child to send/receive private messages from other children',
    type: 'toggle',
    value: false,
    icon: '💬',
  },
  {
    id: 'comment-permissions',
    title: 'Public Comments',
    description: 'Allow others to comment on child\'s videos',
    type: 'toggle',
    value: true,
    icon: '💭',
  },
  {
    id: 'content-downloads',
    title: 'Download Permissions',
    description: 'Allow others to download child\'s content',
    type: 'toggle',
    value: false,
    icon: '⬇️',
  },
  
  // Communication & Notifications
  {
    id: 'parent-notifications',
    title: 'Content Approval Notifications',
    description: 'Get notified when content needs approval before publishing',
    type: 'toggle',
    value: true,
    icon: '🔔',
  },
  {
    id: 'content-moderation',
    title: 'Content Pre-Approval Required',
    description: 'All content must be approved by parents before publishing',
    type: 'toggle',
    value: true,
    icon: '🛡️',
  },
  
  // Social Features
  {
    id: 'friend-requests',
    title: 'Friend Requests',
    description: 'Allow child to send/accept friend requests from verified families',
    type: 'toggle',
    value: false,
    icon: '👋',
  },
  {
    id: 'collaboration-features',
    title: 'Video Collaboration',
    description: 'Allow child to create content with other verified children',
    type: 'toggle',
    value: false,
    icon: '🤝',
  },
];

const MOCK_CHILDREN: Child[] = [
  { id: 'child1', name: 'Emma Johnson', age: 12 },
  { id: 'child2', name: 'Jake Johnson', age: 8 },
];

const initialSettings: Record<string, ChildSettings> = {
  child1: { contentFilterLevel: 'pre_teen', screenTimeLimitHours: 2 },
  child2: { contentFilterLevel: 'young_child', screenTimeLimitHours: 1 },
};

const PRIVACY_CONSENT_KEY = '@privacy_consent';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const SettingsRow: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <View style={styles.row}>
    <View style={styles.rowTextContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      {description && <Text style={styles.rowDescription}>{description}</Text>}
    </View>
    {children}
  </View>
);

const Chevron = () => <Text style={styles.chevron}>{'>'}</Text>;

const getFilterLevelText = (level: ChildSettings['contentFilterLevel']) => {
  return level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<SettingItem[]>(MOCK_SETTINGS);
  const [notifications, setNotifications] = useState({ safetyAlerts: true, contentApprovals: true });
  const [childSettings, setChildSettings] = useState(initialSettings);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    const loadConsent = async () => {
      const storedConsent = await AsyncStorage.getItem(PRIVACY_CONSENT_KEY);
      if (storedConsent) {
        setConsent(JSON.parse(storedConsent));
      }
    };
    loadConsent();
  }, []);

  const handleConsentChange = async (key: keyof Consent, value: boolean) => {
    if (!consent) return;
    const newConsent = { ...consent, [key]: value };
    setConsent(newConsent);
    await AsyncStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const handleToggleSetting = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, value: !setting.value }
        : setting
    ));
  };

  const handleNavigationSetting = (settingId: string, title: string) => {
    Alert.alert(
      title,
      'This feature will be available in the full version.',
      [{ text: 'OK' }]
    );
  };

  const handleActionSetting = (settingId: string) => {
    switch (settingId) {
      case 'export-data':
        Alert.alert('Export Data', 'Your family safety data will be exported to a secure file.');
        break;
      case 'delete-account':
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => logout() },
          ]
        );
        break;
      default:
        Alert.alert('Action', 'This action will be available in the full version.');
    }
  };

  const handleDataExport = async () => {
    Alert.alert(
      'Export Your Data',
      'We will prepare a complete export of your data and send it to your email address within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export Data', 
          onPress: () => {
            // Simulate data export
            Alert.alert('Data Export Requested', 'You will receive an email with your data export within 24 hours.');
          }
        }
      ]
    );
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted within 24 hours. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            // Simulate account deletion
            Alert.alert(
              'Account Deletion Initiated',
              'Your account will be permanently deleted within 24 hours. You will receive a confirmation email.',
              [{ text: 'OK', onPress: logout }]
            );
          }
        }
      ]
    );
  };

  const handleShareData = async () => {
    const userData = {
      profile: {
        id: user?.id,
        name: user?.name,
        role: user?.role,
        createdAt: new Date().toISOString(),
      },
      settings: settings.map(setting => ({
        id: setting.id,
        title: setting.title,
        description: setting.description,
        type: setting.type,
        value: setting.value,
        icon: setting.icon,
      })),
      consentRecords: settings.map(setting => ({
        type: setting.id,
        granted: setting.value,
        timestamp: new Date().toISOString(),
      })),
      dataRetention: {
        retentionPeriod: '12 months',
        automaticDeletion: true,
        nextDeletionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }
    };

    try {
      await Share.share({
        message: `My Flimmer Data Export:\n\n${JSON.stringify(userData, null, 2)}`,
        title: 'Flimmer Data Export'
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share data export');
    }
  };

  const handleChildSettings = (childName: string) => {
    Alert.alert(`Manage ${childName}'s Settings`, "This is where you would configure screen time, content filters, and other child-specific rules.");
  };

  const handleManageSubscription = () => {
    Alert.alert("Manage Subscription", "This would open your app's subscription management page or a web view to your payment provider (e.g., RevenueCat, Stripe).");
  };

  const handleOpenChildSettings = (child: Child) => {
    setSelectedChild(child);
    setIsModalVisible(true);
  };

  const handleSaveChildSettings = (childId: string, newSettings: ChildSettings) => {
    setChildSettings(prev => ({ ...prev, [childId]: newSettings }));
  };

  const renderSettingItem = (setting: SettingItem) => {
    return (
      <View key={setting.id} style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingIcon}>{setting.icon}</Text>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingDescription}>{setting.description}</Text>
          </View>
          <View style={styles.settingControl}>
            {setting.type === 'toggle' && (
              <Switch
                value={setting.value}
                onValueChange={() => handleToggleSetting(setting.id)}
                trackColor={{ false: '#e0e0e0', true: '#FF6B35' }}
                thumbColor={setting.value ? '#fff' : '#f4f3f4'}
              />
            )}
            {setting.type === 'navigation' && (
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => handleNavigationSetting(setting.id, setting.title)}
              >
                <Text style={styles.navigationButtonText}>Configure</Text>
              </TouchableOpacity>
            )}
            {setting.type === 'action' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleActionSetting(setting.id)}
              >
                <Text style={styles.actionButtonText}>Execute</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <SettingsSection title="Account">
          <SettingsRow title="Name" description={user?.name || 'User'}>
            <Text style={styles.userInfoText}>{user?.name || 'User'}</Text>
          </SettingsRow>
          <TouchableOpacity onPress={logout}>
            <SettingsRow title="Logout" description="Sign out of your account">
              <Chevron />
            </SettingsRow>
          </TouchableOpacity>
        </SettingsSection>

        <SettingsSection title="Child Management">
          {MOCK_CHILDREN.map(child => (
            <TouchableOpacity key={child.id} onPress={() => handleOpenChildSettings(child)}>
              <SettingsRow title={child.name} description={`Filter Level: ${getFilterLevelText(childSettings[child.id].contentFilterLevel)}`}>
                <Chevron />
              </SettingsRow>
            </TouchableOpacity>
          ))}
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsRow title="Safety Alerts" description="Receive push notifications for critical safety events">
            <Switch
              value={notifications.safetyAlerts}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, safetyAlerts: value }))}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications.safetyAlerts ? '#f5dd4b' : '#f4f3f4'}
            />
          </SettingsRow>
          <SettingsRow title="Content Approvals" description="Get notified when content needs your review">
            <Switch
              value={notifications.contentApprovals}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, contentApprovals: value }))}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications.contentApprovals ? '#f5dd4b' : '#f4f3f4'}
            />
          </SettingsRow>
        </SettingsSection>
        
        <SettingsSection title="Consent Management">
          <SettingsRow title="AI-Powered Safety Analysis" description="Proactive safety insights and alerts">
            <Switch
              value={consent?.activityAnalysis}
              onValueChange={(value) => handleConsentChange('activityAnalysis', value)}
            />
          </SettingsRow>
          <SettingsRow title="Essential Data Processing" description="Required for core app functionality">
            <Switch value={true} disabled={true} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Subscription & Privacy">
            <TouchableOpacity onPress={handleManageSubscription}>
              <SettingsRow title="Manage Subscription" description="View plan details and manage your billing">
                  <Chevron />
              </SettingsRow>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDataExport}>
              <SettingsRow title="Export Personal Data" description="Download a copy of your account data">
                  <Chevron />
              </SettingsRow>
            </TouchableOpacity>
        </SettingsSection>

        <SettingsSection title="Danger Zone">
            <TouchableOpacity onPress={handleAccountDeletion}>
              <SettingsRow title="Delete Account" description="Permanently delete your account and all data">
                  <Text style={styles.deleteText}>Delete</Text>
              </SettingsRow>
            </TouchableOpacity>
        </SettingsSection>

      </ScrollView>

      {selectedChild && (
        <ChildSettingsModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          child={selectedChild}
          initialSettings={childSettings[selectedChild.id]}
          onSave={handleSaveChildSettings}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { padding: 20, paddingTop: 40, paddingBottom: 10 },
  headerTitle: { fontSize: 34, fontWeight: 'bold' },
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 13, color: '#6D6D72', paddingLeft: 16, marginBottom: 8, textTransform: 'uppercase' },
  sectionCard: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  rowTextContainer: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 17, color: '#000' },
  rowDescription: { fontSize: 13, color: '#6D6D72', paddingTop: 2 },
  chevron: { fontSize: 22, color: '#C7C7CC' },
  userInfoText: { fontSize: 17, color: '#6D6D72' },
  deleteText: { fontSize: 17, color: 'red' },
  scrollView: {
    flex: 1,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingControl: {
    marginLeft: 12,
  },
  navigationButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  navigationButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});