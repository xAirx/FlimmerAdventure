import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface LiveActivity {
  id: string;
  childName: string;
  action: string;
  timestamp: Date;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  details: string;
  canIntervene: boolean;
}

interface ChildLocation {
  id: string;
  name: string;
  location: string;
  activity: string;
  isOnline: boolean;
  batteryLevel: number;
  lastUpdate: Date;
}

const MOCK_LIVE_ACTIVITIES: LiveActivity[] = [
  {
    id: 'live-001',
    childName: 'Emma',
    action: 'Started watching video',
    timestamp: new Date(Date.now() - 1000 * 30),
    location: 'Living Room',
    riskLevel: 'low',
    details: 'Video: "DIY Science Experiments" - Educational content',
    canIntervene: true,
  },
  {
    id: 'live-002',
    childName: 'Jake',
    action: 'Attempting to upload video',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    location: 'Bedroom',
    riskLevel: 'medium',
    details: 'Video contains unidentified objects - flagged for review',
    canIntervene: true,
  },
  {
    id: 'live-003',
    childName: 'Emma',
    action: 'Commented on video',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    location: 'Kitchen',
    riskLevel: 'low',
    details: 'Comment: "This is so cool! I want to try this too!"',
    canIntervene: false,
  },
];

const MOCK_CHILD_LOCATIONS: ChildLocation[] = [
  {
    id: 'child-001',
    name: 'Emma',
    location: 'Living Room',
    activity: 'Watching videos',
    isOnline: true,
    batteryLevel: 78,
    lastUpdate: new Date(Date.now() - 1000 * 30),
  },
  {
    id: 'child-002',
    name: 'Jake',
    location: 'School',
    activity: 'Offline - In class',
    isOnline: false,
    batteryLevel: 45,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 45),
  },
];

export default function LiveActivityScreen() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<LiveActivity[]>(MOCK_LIVE_ACTIVITIES);
  const [childLocations, setChildLocations] = useState<ChildLocation[]>(MOCK_CHILD_LOCATIONS);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new random activity
      const newActivity: LiveActivity = {
        id: `live-${Date.now()}`,
        childName: Math.random() > 0.5 ? 'Emma' : 'Jake',
        action: ['Opened app', 'Started video', 'Paused video', 'Liked video'][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
        location: ['Living Room', 'Bedroom', 'Kitchen', 'Backyard'][Math.floor(Math.random() * 4)],
        riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
        details: 'Real-time activity detected',
        canIntervene: Math.random() > 0.3,
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleIntervene = (activity: LiveActivity) => {
    Alert.alert(
      'Intervention Options',
      `What would you like to do about ${activity.childName}'s activity?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Message',
          onPress: () => {
            Alert.alert('Message Sent', `Sent gentle reminder to ${activity.childName}`);
          },
        },
        {
          text: 'Pause Activity',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Activity Paused', `${activity.childName}'s current activity has been paused`);
          },
        },
        {
          text: 'Call Now',
          onPress: () => {
            Alert.alert('Calling...', `Calling ${activity.childName} now`);
          },
        },
      ]
    );
  };

  const handleLocationAlert = (child: ChildLocation) => {
    Alert.alert(
      'Location Tracking',
      `${child.name} is currently at: ${child.location}\nLast updated: ${child.lastUpdate.toLocaleTimeString()}`,
      [
        { text: 'OK' },
        {
          text: 'Request Location Update',
          onPress: () => {
            Alert.alert('Location Update Requested', 'Your child will receive a notification to update their location.');
          },
        },
      ]
    );
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8C00';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔴 Live Activity Monitor</Text>
          <Text style={styles.subtitle}>Real-time tracking of your children's activities</Text>
        </View>

        {/* Child Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Current Locations</Text>
          {childLocations.map(child => (
            <TouchableOpacity
              key={child.id}
              style={styles.locationCard}
              onPress={() => handleLocationAlert(child)}
            >
              <View style={styles.locationHeader}>
                <Text style={styles.childName}>{child.name}</Text>
                <View style={styles.locationStatus}>
                  <View style={[styles.statusDot, { backgroundColor: child.isOnline ? '#4CAF50' : '#999' }]} />
                  <Text style={styles.statusText}>{child.isOnline ? 'Online' : 'Offline'}</Text>
                </View>
              </View>
              <Text style={styles.locationText}>📍 {child.location}</Text>
              <Text style={styles.activityText}>{child.activity}</Text>
              <View style={styles.locationFooter}>
                <Text style={styles.batteryText}>🔋 {child.batteryLevel}%</Text>
                <Text style={styles.updateTime}>Updated {getTimeAgo(child.lastUpdate)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Live Activity Feed</Text>
          {activities.map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityChild}>{activity.childName}</Text>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                </View>
                <View style={styles.activityMeta}>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(activity.riskLevel) }]}>
                    <Text style={styles.riskText}>{activity.riskLevel.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.activityTime}>{getTimeAgo(activity.timestamp)}</Text>
                </View>
              </View>
              
              <Text style={styles.activityLocation}>📍 {activity.location}</Text>
              <Text style={styles.activityDetails}>{activity.details}</Text>
              
              {activity.canIntervene && (
                <TouchableOpacity
                  style={styles.interveneButton}
                  onPress={() => handleIntervene(activity)}
                >
                  <Text style={styles.interveneButtonText}>🚨 Intervene</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>📱</Text>
              <Text style={styles.quickActionText}>Send Message to All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>⏸️</Text>
              <Text style={styles.quickActionText}>Pause All Activities</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>🔔</Text>
              <Text style={styles.quickActionText}>Request Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>🏠</Text>
              <Text style={styles.quickActionText}>Family Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    color: '#666',
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  activityChild: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityAction: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  riskText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  interveneButton: {
    backgroundColor: '#FF4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  interveneButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
}); 