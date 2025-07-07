import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';

interface SafetyInsight {
  id: string;
  type: 'trend' | 'warning' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  actionRequired: boolean;
  data?: any;
}

interface RiskTrend {
  category: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

const MOCK_SAFETY_INSIGHTS: SafetyInsight[] = [
  {
    id: 'insight-001',
    type: 'warning',
    title: 'Unusual Content Pattern Detected',
    description: 'Emma has been viewing content with mature themes 40% more than usual this week. This could indicate exposure to inappropriate content or peer influence.',
    severity: 'high',
    confidence: 85,
    actionRequired: true,
  },
  {
    id: 'insight-002',
    type: 'trend',
    title: 'Positive Engagement Trend',
    description: 'Jake\'s content creation has increased 60% this month, with 95% of uploads being educational or creative content.',
    severity: 'low',
    confidence: 92,
    actionRequired: false,
  },
  {
    id: 'insight-003',
    type: 'recommendation',
    title: 'Screen Time Optimization',
    description: 'Based on usage patterns, consider implementing a 30-minute break every 2 hours for optimal digital wellness.',
    severity: 'medium',
    confidence: 78,
    actionRequired: false,
  },
  {
    id: 'insight-004',
    type: 'achievement',
    title: 'Safety Milestone Reached',
    description: 'Your family has maintained 100% safe content consumption for 30 days straight! 🎉',
    severity: 'low',
    confidence: 100,
    actionRequired: false,
  },
];

const MOCK_RISK_TRENDS: RiskTrend[] = [
  {
    category: 'Content Risk',
    current: 15,
    previous: 22,
    trend: 'down',
    description: 'Inappropriate content exposure decreased',
  },
  {
    category: 'Screen Time',
    current: 180,
    previous: 165,
    trend: 'up',
    description: 'Daily screen time increased by 15 minutes',
  },
  {
    category: 'Social Interaction',
    current: 8,
    previous: 8,
    trend: 'stable',
    description: 'Healthy social engagement maintained',
  },
  {
    category: 'Digital Wellness',
    current: 85,
    previous: 78,
    trend: 'up',
    description: 'Overall digital wellness score improved',
  },
];

export default function SafetyIntelligence() {
  const [selectedTab, setSelectedTab] = useState<'insights' | 'trends' | 'recommendations'>('insights');
  const [insights, setInsights] = useState<SafetyInsight[]>(MOCK_SAFETY_INSIGHTS);

  const handleInsightAction = (insight: SafetyInsight) => {
    Alert.alert(
      'Safety Action',
      `What would you like to do about: ${insight.title}?`,
      [
        { text: 'Dismiss', style: 'cancel' },
        {
          text: 'Get More Details',
          onPress: () => {
            Alert.alert('Detailed Analysis', `AI Confidence: ${insight.confidence}%\n\nThis insight was generated based on behavioral pattern analysis, content scanning, and comparative safety metrics.`);
          },
        },
        {
          text: 'Take Action',
          onPress: () => {
            Alert.alert('Action Taken', 'Safety measures have been implemented based on this insight.');
            setInsights(prev => prev.filter(i => i.id !== insight.id));
          },
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8C00';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'trend': return '📈';
      case 'recommendation': return '💡';
      case 'achievement': return '🏆';
      default: return '📊';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const renderInsightsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🤖 AI Safety Insights</Text>
      {insights.map(insight => (
        <TouchableOpacity
          key={insight.id}
          style={[styles.insightCard, { borderLeftColor: getSeverityColor(insight.severity) }]}
          onPress={() => handleInsightAction(insight)}
        >
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>{getTypeIcon(insight.type)}</Text>
            <View style={styles.insightInfo}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightType}>{insight.type.toUpperCase()}</Text>
            </View>
            <View style={styles.insightMeta}>
              <Text style={styles.confidenceText}>{insight.confidence}%</Text>
              {insight.actionRequired && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>ACTION</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.insightDescription}>{insight.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTrendsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>📊 Risk Trends</Text>
      {MOCK_RISK_TRENDS.map(trend => (
        <View key={trend.category} style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendCategory}>{trend.category}</Text>
            <Text style={styles.trendIcon}>{getTrendIcon(trend.trend)}</Text>
          </View>
          <View style={styles.trendMetrics}>
            <View style={styles.trendValue}>
              <Text style={styles.trendNumber}>{trend.current}</Text>
              <Text style={styles.trendLabel}>Current</Text>
            </View>
            <View style={styles.trendValue}>
              <Text style={[styles.trendNumber, { color: '#666' }]}>{trend.previous}</Text>
              <Text style={styles.trendLabel}>Previous</Text>
            </View>
            <View style={styles.trendChange}>
              <Text style={[
                styles.trendChangeText,
                { color: trend.trend === 'up' ? '#4CAF50' : trend.trend === 'down' ? '#FF4444' : '#666' }
              ]}>
                {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}
                {Math.abs(trend.current - trend.previous)}
              </Text>
            </View>
          </View>
          <Text style={styles.trendDescription}>{trend.description}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderRecommendationsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>💡 AI Recommendations</Text>
      
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>🛡️ Enhanced Safety Measures</Text>
        <Text style={styles.recommendationDescription}>
          Based on current trends, consider implementing these safety enhancements:
        </Text>
        <View style={styles.recommendationList}>
          <Text style={styles.recommendationItem}>• Enable stricter content filtering during evening hours</Text>
          <Text style={styles.recommendationItem}>• Set up peer influence monitoring alerts</Text>
          <Text style={styles.recommendationItem}>• Schedule weekly family digital wellness check-ins</Text>
        </View>
      </View>

      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>📱 Screen Time Optimization</Text>
        <Text style={styles.recommendationDescription}>
          Personalized recommendations for healthy screen time:
        </Text>
        <View style={styles.recommendationList}>
          <Text style={styles.recommendationItem}>• Implement 20-20-20 rule reminders</Text>
          <Text style={styles.recommendationItem}>• Create device-free zones in bedrooms</Text>
          <Text style={styles.recommendationItem}>• Encourage outdoor activities during peak usage times</Text>
        </View>
      </View>

      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>👥 Parent Network Suggestions</Text>
        <Text style={styles.recommendationDescription}>
          Connect with other parents for enhanced safety:
        </Text>
        <View style={styles.recommendationList}>
          <Text style={styles.recommendationItem}>• Join local parent safety groups</Text>
          <Text style={styles.recommendationItem}>• Share safety tips with trusted parents</Text>
          <Text style={styles.recommendationItem}>• Participate in community safety initiatives</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Safety Intelligence</Text>
        <Text style={styles.subtitle}>AI-powered insights for family digital safety</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'insights' && styles.activeTab]}
          onPress={() => setSelectedTab('insights')}
        >
          <Text style={[styles.tabText, selectedTab === 'insights' && styles.activeTabText]}>
            🤖 Insights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'trends' && styles.activeTab]}
          onPress={() => setSelectedTab('trends')}
        >
          <Text style={[styles.tabText, selectedTab === 'trends' && styles.activeTabText]}>
            📊 Trends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recommendations' && styles.activeTab]}
          onPress={() => setSelectedTab('recommendations')}
        >
          <Text style={[styles.tabText, selectedTab === 'recommendations' && styles.activeTabText]}>
            💡 Tips
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {selectedTab === 'insights' && renderInsightsTab()}
      {selectedTab === 'trends' && renderTrendsTab()}
      {selectedTab === 'recommendations' && renderRecommendationsTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  insightType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  insightMeta: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  actionBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  trendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  trendIcon: {
    fontSize: 20,
  },
  trendMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendValue: {
    alignItems: 'center',
  },
  trendNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  trendLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  trendChange: {
    alignItems: 'center',
  },
  trendChangeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendDescription: {
    fontSize: 14,
    color: '#666',
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  recommendationList: {
    paddingLeft: 8,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
}); 