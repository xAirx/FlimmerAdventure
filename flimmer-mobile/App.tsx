import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Import Context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { APIProvider } from './src/context/APIProvider';

// Import Components
import PrivacyPolicyModal, { Consent } from './src/components/PrivacyPolicyModal';

// Import Screens
import AuthScreen from './src/screens/AuthScreen';
import ParentDashboard from './src/screens/ParentDashboard';
import ChildInterface from './src/screens/ChildInterface';
import LiveActivityScreen from './src/screens/LiveActivityScreen';
import SafetyIntelligence from './src/screens/SafetyIntelligence';
import SettingsScreen from './src/screens/SettingsScreen';

// --- Navigation ---
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const PRIVACY_CONSENT_KEY = '@privacy_consent';

const ParentTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={ParentDashboard} />
    <Tab.Screen name="Live Activity" component={LiveActivityScreen} />
    <Tab.Screen name="Safety AI" component={SafetyIntelligence} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();
  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (user.role === 'parent' ? <Stack.Screen name="ParentTabs" component={ParentTabs} /> : <Stack.Screen name="ChildInterface" component={ChildInterface} />) : <Stack.Screen name="Auth" component={AuthScreen} />}
    </Stack.Navigator>
  );
};

// --- Main App Component ---
export default function App() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConsent = async () => {
      try {
        const storedConsent = await AsyncStorage.getItem(PRIVACY_CONSENT_KEY);
        if (storedConsent) {
          setConsent(JSON.parse(storedConsent));
        }
      } catch (e) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };
    checkConsent();
  }, []);

  const handleAcceptConsent = async (newConsent: Consent) => {
    try {
      await AsyncStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify(newConsent));
      setConsent(newConsent);
    } catch (e) {
      // Handle error
    }
  };

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <APIProvider>
          {consent?.essential ? (
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          ) : (
            <PrivacyPolicyModal visible={true} onAccept={handleAcceptConsent} />
          )}
        </APIProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
