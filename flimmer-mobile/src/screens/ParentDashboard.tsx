import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

// --- Reusable Components ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoCardTitle}>{title}</Text>
    <Text style={styles.infoCardValue}>{value}</Text>
  </View>
);

// --- Main Component ---
export default function ParentDashboard() {
  const { logout, user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mock data for demonstration
  const mockData = {
    moderationQueue: [
      {
        id: '1',
        title: 'Funny Cat Video',
        creator: 'KittyLover123',
        thumbnail: 'https://picsum.photos/300/200?random=1',
        childName: 'Emma',
        timestamp: '2 minutes ago',
        riskLevel: 'low',
        aiFlags: ['Safe content', 'Age appropriate'],
      },
      {
        id: '2',
        title: 'Minecraft Tutorial: Building a Castle',
        creator: 'MinecraftPro',
        thumbnail: 'https://picsum.photos/300/200?random=2',
        childName: 'Lucas',
        timestamp: '15 minutes ago',
        riskLevel: 'medium',
        aiFlags: ['Contains mild language', 'Gaming content'],
      },
      {
        id: '3',
        title: 'Science Experiment: Volcano',
        creator: 'ScienceKids',
        thumbnail: 'https://picsum.photos/300/200?random=3',
        childName: 'Emma',
        timestamp: '1 hour ago',
        riskLevel: 'low',
        aiFlags: ['Educational', 'Safe content'],
      },
    ],
    users: [
      { id: '1', name: 'Emma', status: 'Active', age: 8 },
      { id: '2', name: 'Lucas', status: 'Active', age: 12 },
    ],
    weeklyStats: {
      totalWatchTime: '12h 34m',
      contentApproved: 24,
      contentRejected: 3,
      safetyAlerts: 1,
    }
  };

  const { moderationQueue = [], users = [] } = mockData;
  const activeChildren = users.filter((u: any) => u.status === 'Active').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Family Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <Section title="📊 Family Overview">
          <View style={styles.infoCardContainer}>
            <InfoCard title="Active Children" value={activeChildren} />
            <InfoCard title="Pending Reviews" value={moderationQueue.length} />
          </View>
          <View style={styles.infoCardContainer}>
            <InfoCard title="This Week Approved" value={mockData.weeklyStats?.contentApproved || 0} />
            <InfoCard title="Safety Alerts" value={mockData.weeklyStats?.safetyAlerts || 0} />
          </View>
        </Section>

        <Section title="⏰ Content Pending Review">
          {moderationQueue.length > 0 ? (
            moderationQueue.map((item: any) => (
              <View key={item.id} style={styles.moderationCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.childName}>👦 {item.childName}</Text>
                    <Text style={styles.contentTitle}>{item.title}</Text>
                    <Text style={styles.creatorName}>by {item.creator}</Text>
                  </View>
                  <View style={styles.cardMeta}>
                    <View style={[styles.riskBadge, 
                      item.riskLevel === 'low' ? styles.lowRisk : 
                      item.riskLevel === 'medium' ? styles.mediumRisk : styles.highRisk
                    ]}>
                      <Text style={styles.riskText}>
                        {item.riskLevel === 'low' ? '✅ LOW' : 
                         item.riskLevel === 'medium' ? '⚠️ MED' : '🚨 HIGH'}
                      </Text>
                    </View>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                  </View>
                </View>
                
                {item.thumbnail && (
                  <Image 
                    source={{ uri: item.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
                
                <View style={styles.aiAnalysis}>
                  <View style={styles.aiHeader}>
                    <Text style={styles.aiIcon}>🛡️</Text>
                    <Text style={styles.aiTitle}>AI Safety Analysis</Text>
                  </View>
                  <Text style={styles.aiFlags}>{item.aiFlags?.join(', ')}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.approveButton}>
                    <Text style={styles.buttonText}>✅ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton}>
                    <Text style={styles.buttonText}>❌ Block</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>🎉 All caught up!</Text>
              <Text style={styles.emptySubtext}>No content waiting for review</Text>
            </View>
          )}
        </Section>


      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { 
      flex: 1, 
      backgroundColor: '#F5F5F5'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    headerLeft: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    logoutButton: {
      backgroundColor: '#FF6B35',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    logoutText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statusInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    time: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    signal: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: theme.spacing.md,
    },
    signalText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    battery: {
      backgroundColor: '#FF4444',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    batteryNumber: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    progressBar: {
      height: 4,
      backgroundColor: '#FF6B35',
      marginHorizontal: theme.spacing.md,
      borderRadius: 2,
    },
    brandHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.card,
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
      marginRight: theme.spacing.md,
    },
    logoEmoji: {
      fontSize: 24,
    },
    brandText: {
      flex: 1,
    },
    brandName: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    brandSubtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
    },
    feedContainer: {
      flex: 1,
    },
    feedContent: {
      padding: theme.spacing.md,
    },
    section: { 
      marginBottom: theme.spacing.lg
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },
    infoCardContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      gap: theme.spacing.sm
    },
    infoCard: { 
      backgroundColor: theme.colors.card, 
      borderRadius: theme.borderRadius.lg, 
      padding: theme.spacing.md, 
      alignItems: 'center', 
      flex: 1,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    infoCardTitle: { 
      fontSize: 14, 
      color: theme.colors.textSecondary 
    },
    infoCardValue: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      color: theme.colors.text,
      marginTop: theme.spacing.xs
    },
    listItem: { 
      backgroundColor: theme.colors.card, 
      borderRadius: theme.borderRadius.lg, 
      padding: theme.spacing.md, 
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    itemTitle: { 
      fontSize: 16, 
      fontWeight: 'bold',
      color: theme.colors.text
    },
    emptyText: { 
      textAlign: 'center', 
      color: theme.colors.textSecondary, 
      fontSize: theme.fontSizes.md,
      marginTop: theme.spacing.md
    },
    moderationCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    cardInfo: {
      flex: 1,
    },
    childName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    contentTitle: {
      fontSize: 14,
      color: theme.colors.text,
      marginTop: 2,
    },
    creatorName: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    cardMeta: {
      alignItems: 'flex-end',
    },
    riskBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 5,
    },
    lowRisk: {
      backgroundColor: '#4CAF50',
    },
    mediumRisk: {
      backgroundColor: '#FF9800',
    },
    highRisk: {
      backgroundColor: '#F44336',
    },
    riskText: {
      color: theme.colors.white,
      fontSize: theme.fontSizes.xs,
      fontWeight: 'bold',
    },
    timestamp: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textSecondary,
    },
    thumbnail: {
      width: '100%',
      height: 120,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    aiAnalysis: {
      backgroundColor: '#F0F8FF',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    aiHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    aiIcon: {
      fontSize: 16,
      marginRight: 6,
    },
    aiTitle: {
      fontSize: theme.fontSizes.xs,
      fontWeight: 'bold',
      color: '#4169E1',
    },
    aiFlags: {
      fontSize: theme.fontSizes.xs,
      color: '#4169E1',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    approveButton: {
      flex: 1,
      backgroundColor: '#4CAF50',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    rejectButton: {
      flex: 1,
      backgroundColor: '#F44336',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.white,
      fontWeight: 'bold',
      fontSize: theme.fontSizes.sm,
    },
    emptyState: {
      alignItems: 'center',
      padding: theme.spacing.xxl,
    },
    emptySubtext: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    itemSubtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
}); 