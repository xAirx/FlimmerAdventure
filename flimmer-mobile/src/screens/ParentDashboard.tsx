import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useParentDashboardData } from '../lib/hooks';

// --- Reusable Components ---
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoCard = ({ title, value }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoCardTitle}>{title}</Text>
    <Text style={styles.infoCardValue}>{value}</Text>
  </View>
);

// --- Main Component ---
export default function ParentDashboard() {
  const { data, isLoading, error, refetch } = useParentDashboardData();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error: {error.message}</Text></View>;
  }

  // Assuming data structure from our hooks
  const { moderationQueue = [], users = [] } = data || {};
  const activeChildren = users.filter(u => u.status === 'Active').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Parent Dashboard</Text>
        </View>

        <Section title="Family Overview">
          <View style={styles.infoCardContainer}>
            <InfoCard title="Active Children" value={activeChildren} />
            <InfoCard title="Pending Approvals" value={moderationQueue.length} />
          </View>
        </Section>

        <Section title="Content Approval Queue">
          {moderationQueue.length > 0 ? (
            moderationQueue.map(item => (
              <View key={item.id} style={styles.listItem}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text>From: {item.creator}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No content to approve.</Text>
          )}
        </Section>
        
        {/* Other sections like Activity Feed can be added here, consuming the same data source */}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollView: { paddingBottom: 20 },
    header: { padding: 16 },
    headerTitle: { fontSize: 34, fontWeight: 'bold' },
    section: { marginTop: 20, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    infoCardContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    infoCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center', width: '48%' },
    infoCardTitle: { fontSize: 16, color: '#6D6D72' },
    infoCardValue: { fontSize: 28, fontWeight: 'bold', marginTop: 4 },
    listItem: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 10 },
    itemTitle: { fontSize: 17, fontWeight: '600' },
    emptyText: { textAlign: 'center', color: '#6D6D72', marginTop: 10 },
}); 