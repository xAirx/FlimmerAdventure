import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import PrivacyPolicyModal, { Consent } from '../components/PrivacyPolicyModal';

export default function AuthScreen() {
  const { login } = useAuth();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleLogin = (role: 'parent' | 'child') => {
    const user = {
      id: role === 'parent' ? 'parent123' : 'child456',
      name: role === 'parent' ? "Emma's Parent" : "Emma Johnson",
      role,
      childIds: role === 'parent' ? ['child456'] : undefined,
      parentId: role === 'child' ? 'parent123' : undefined,
    };
    login(user);
  };

  const handlePrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handlePrivacyPolicy}>
          <Text style={styles.logoutText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Flimmer</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => handleLogin('parent')}
          >
            <Text style={styles.buttonText}>Parent Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.childButton]}
            onPress={() => handleLogin('child')}
          >
            <Text style={styles.buttonText}>Child Interface</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        visible={showPrivacyPolicy} 
        onAccept={(consent: Consent) => {
          setShowPrivacyPolicy(false);
          // Handle consent if needed
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  childButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 