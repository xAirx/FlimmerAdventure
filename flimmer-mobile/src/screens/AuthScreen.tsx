import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login } = useAuth();

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section with Apps */}
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <Text style={styles.time}>21.32</Text>
          <View style={styles.statusBar}>
            <Text style={styles.signal}>••• 5G</Text>
            <View style={styles.battery}>
              <Text style={styles.batteryText}>16</Text>
            </View>
          </View>
        </View>

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.brandLeft}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🎬</Text>
            </View>
            <Text style={styles.brandName}>Flimmer™</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>800</Text>
            <Text style={styles.pointsIcon}>💎</Text>
          </View>
        </View>

        {/* App Icons Row */}
        <View style={styles.appIcons}>
          <View style={[styles.appIcon, { backgroundColor: '#FFD60A' }]}>
            <Text style={styles.appEmoji}>🏀</Text>
          </View>
          <View style={[styles.appIcon, { backgroundColor: '#0066FF' }]}>
            <Text style={styles.appEmoji}>✂️</Text>
          </View>
          <View style={[styles.appIcon, { backgroundColor: '#8B5CF6' }]}>
            <Text style={styles.appEmoji}>🥑</Text>
          </View>
          <View style={[styles.appIcon, { backgroundColor: '#FBBF24' }]}>
            <Text style={styles.appEmoji}>🧠</Text>
          </View>
          <View style={[styles.appIcon, { backgroundColor: '#EC4899' }]}>
            <Text style={styles.appEmoji}>💄</Text>
          </View>
        </View>
      </View>

      {/* Main Login Card */}
      <View style={styles.loginCard}>
        {/* Video Preview */}
        <View style={styles.videoPreview}>
          <Image 
            source={{ uri: 'https://picsum.photos/400/300?random=auth' }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </View>
          </View>
        </View>

        {/* Login Text */}
        <Text style={styles.loginTitle}>Flimmer er sjovest med en konto</Text>

        {/* Login Buttons */}
        <TouchableOpacity 
          style={styles.createAccountButton}
          onPress={() => handleLogin('child')}
        >
          <Text style={styles.createAccountText}>Opret konto</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => handleLogin('parent')}
        >
          <Text style={styles.loginButtonText}>Log ind</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Preview */}
      <View style={styles.bottomPreview}>
        <Image 
          source={{ uri: 'https://picsum.photos/400/100?random=bottom' }}
          style={styles.bottomImage}
          resizeMode="cover"
        />
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>Hjem</Text>
          </View>
          <View style={styles.navCenter}>
            <View style={styles.centerButton}>
              <Text style={styles.centerIcon}>⭐</Text>
            </View>
          </View>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={styles.navText}>Søg</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Light blue background
  },
  topSection: {
    paddingTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signal: {
    fontSize: 14,
    color: '#000',
  },
  battery: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  batteryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 24,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  pointsIcon: {
    fontSize: 20,
  },
  appIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  appIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appEmoji: {
    fontSize: 30,
  },
  loginCard: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
    color: '#000',
    marginLeft: 4,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 34,
  },
  createAccountButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    marginBottom: 15,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bottomImage: {
    width: '100%',
    height: 80,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  navCenter: {
    alignItems: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    fontSize: 24,
  },
}); 