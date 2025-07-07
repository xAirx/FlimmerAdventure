import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

// Types for moderation content
interface ModerationItem {
  id: string;
  type: 'video_upload' | 'image_upload' | 'comment' | 'profile_update' | 'friend_request';
  childName: string;
  title: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  thumbnailUrl?: string;
  riskLevel: 'low' | 'medium' | 'high';
  autoModeration?: {
    confidence: number;
    flags: string[];
  };
}

interface ReportedContent {
  id: string;
  reportedBy: string;
  contentType: 'video' | 'comment' | 'profile';
  reason: string;
  description: string;
  timestamp: Date;
  status: 'under_review' | 'resolved' | 'escalated';
}

// Mock data for content moderation that looks like real social media
const MOCK_MODERATION_QUEUE: ModerationItem[] = [
  {
    id: 'mod-001',
    type: 'video_upload',
    childName: 'Emma',
    title: 'AMAZING DIY Slime Recipe! ✨ So Satisfying',
    description: 'Check out this super easy slime recipe using just 3 ingredients! Perfect for beginners and so much fun to make 🌈',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=slime',
    riskLevel: 'low',
    autoModeration: {
      confidence: 96,
      flags: ['Safe DIY Content', 'Age Appropriate', 'Educational Value']
    }
  },
  {
    id: 'mod-002',
    type: 'video_upload',
    childName: 'Lucas',
    title: 'My Friends at School Being CRAZY! 😂',
    description: 'Just filmed my classmates doing stupid dares at lunch break. Sarah almost got in trouble with Mrs. Johnson lol',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=school',
    riskLevel: 'medium',
    autoModeration: {
      confidence: 78,
      flags: ['Names Mentioned', 'School Setting', 'Risky Behavior']
    }
  },
  {
    id: 'mod-003',
    type: 'video_upload',
    childName: 'Sophie',
    title: 'Room Tour 2024! 💕 My Personal Space',
    description: 'Finally doing a room tour! Here\'s my bedroom, my diary, family photos, and all my personal stuff organized ✨',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=bedroom',
    riskLevel: 'high',
    autoModeration: {
      confidence: 88,
      flags: ['Personal Space Exposed', 'Family Photos Visible', 'Privacy Concerns']
    }
  },
  {
    id: 'mod-004',
    type: 'video_upload',
    childName: 'Emma',
    title: 'Magic Tricks That Will BLOW Your Mind! 🪄',
    description: 'Learn 5 amazing magic tricks you can do at home! These are so easy and will impress all your friends 🎩✨',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=magic',
    riskLevel: 'low',
    autoModeration: {
      confidence: 98,
      flags: ['Educational Content', 'Safe Tutorial', 'Creative Skills']
    }
  },
  {
    id: 'mod-005',
    type: 'video_upload',
    childName: 'Jake',
    title: 'Trying TikTok Challenge - Don\'t Tell My Parents!',
    description: 'Doing the latest viral challenge from TikTok before anyone else! This is kind of dangerous but it looks so cool 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=challenge',
    riskLevel: 'high',
    autoModeration: {
      confidence: 85,
      flags: ['Dangerous Activity', 'Viral Challenge', 'Parental Deception']
    }
  },
  {
    id: 'mod-006',
    type: 'video_upload',
    childName: 'Maya',
    title: 'Cute Puppy Compilation! 🐕 So Adorable',
    description: 'Watch these adorable puppies being cute for 5 minutes straight! This will definitely make your day better 🥰',
    timestamp: new Date(Date.now() - 1000 * 60 * 65),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=puppies',
    riskLevel: 'low',
    autoModeration: {
      confidence: 99,
      flags: ['Animal Content', 'Wholesome', 'Family Friendly']
    }
  },
  {
    id: 'mod-007',
    type: 'video_upload',
    childName: 'Lucas',
    title: 'EPIC Minecraft Build! Check This Out',
    description: 'Building the most INSANE castle in Minecraft survival mode! This took me 3 hours but it was totally worth it 😎',
    timestamp: new Date(Date.now() - 1000 * 60 * 75),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=castle',
    riskLevel: 'low',
    autoModeration: {
      confidence: 94,
      flags: ['Gaming Content', 'Creative Building', 'Safe Content']
    }
  },
  {
    id: 'mod-008',
    type: 'comment',
    childName: 'Sophie',
    title: 'Comment on "Dance Challenge"',
    description: 'Comment: "OMG this is so cool! What school do you go to? We should totally hang out sometime! My address is..."',
    timestamp: new Date(Date.now() - 1000 * 60 * 85),
    status: 'pending',
    riskLevel: 'high',
    autoModeration: {
      confidence: 92,
      flags: ['Personal Information Shared', 'Address Disclosure', 'Meeting Request']
    }
  },
  {
    id: 'mod-009',
    type: 'video_upload',
    childName: 'Emma',
    title: 'Trying Adult Makeup Tutorial 💄',
    description: 'Found my mom\'s makeup and trying to look like those Instagram influencers! Do I look older? Rate me 1-10!',
    timestamp: new Date(Date.now() - 1000 * 60 * 95),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=makeup',
    riskLevel: 'medium',
    autoModeration: {
      confidence: 76,
      flags: ['Age Inappropriate Content', 'Appearance Rating Request', 'Adult Emulation']
    }
  },
  {
    id: 'mod-010',
    type: 'comment',
    childName: 'Jake',
    title: 'Comment on "Cooking Video"',
    description: 'Comment: "Great recipe! I tried it and it was delicious. Thanks for sharing! 👍"',
    timestamp: new Date(Date.now() - 1000 * 60 * 105),
    status: 'pending',
    riskLevel: 'low',
    autoModeration: {
      confidence: 97,
      flags: ['Positive Interaction', 'Safe Comment', 'Encouraging']
    }
  },
  {
    id: 'mod-011',
    type: 'video_upload',
    childName: 'Maya',
    title: 'Family Vacation Vlog - Hawaii Day 3! 🏖️',
    description: 'Day 3 at the Hilton Hawaiian Village! Here\'s our room number, the beach we\'re staying at, and our flight details for tomorrow',
    timestamp: new Date(Date.now() - 1000 * 60 * 115),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=hawaii',
    riskLevel: 'high',
    autoModeration: {
      confidence: 91,
      flags: ['Location Data Shared', 'Hotel Information', 'Travel Schedule Exposed']
    }
  },
  {
    id: 'mod-012',
    type: 'comment',
    childName: 'Lucas',
    title: 'Comment on "Gaming Stream"',
    description: 'Comment: "You suck at this game! Kill yourself noob, nobody wants to watch this garbage 🤮"',
    timestamp: new Date(Date.now() - 1000 * 60 * 125),
    status: 'pending',
    riskLevel: 'high',
    autoModeration: {
      confidence: 95,
      flags: ['Cyberbullying', 'Harmful Language', 'Self-Harm Reference']
    }
  },
  {
    id: 'mod-013',
    type: 'image_upload',
    childName: 'Sophie',
    title: 'My New Outfit! Rate 1-10 💕',
    description: 'Posted a selfie wearing very revealing clothing, posing in suggestive manner. Asking for appearance ratings from strangers.',
    timestamp: new Date(Date.now() - 1000 * 60 * 135),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=outfit',
    riskLevel: 'high',
    autoModeration: {
      confidence: 89,
      flags: ['Suggestive Posing', 'Rating Request', 'Inappropriate Attire']
    }
  },
  {
    id: 'mod-014',
    type: 'image_upload',
    childName: 'Emma',
    title: 'My Art Project - Rainbow Drawing! 🌈',
    description: 'Sharing my colorful rainbow drawing I made for art class. Super proud of how it turned out!',
    timestamp: new Date(Date.now() - 1000 * 60 * 145),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=rainbow',
    riskLevel: 'low',
    autoModeration: {
      confidence: 98,
      flags: ['Educational Content', 'Creative Expression', 'Age Appropriate']
    }
  },
  {
    id: 'mod-015',
    type: 'image_upload',
    childName: 'Jake',
    title: 'School ID Card - Check Out My Photo!',
    description: 'Posted a photo of my school ID card showing my full name, student number, address, and school details.',
    timestamp: new Date(Date.now() - 1000 * 60 * 155),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=idcard',
    riskLevel: 'high',
    autoModeration: {
      confidence: 96,
      flags: ['Personal Information Visible', 'School Data Exposed', 'Privacy Violation']
    }
  },
  {
    id: 'mod-016',
    type: 'image_upload',
    childName: 'Maya',
    title: 'Baking Cookies with Grandma! 🍪',
    description: 'Had so much fun baking chocolate chip cookies with grandma today. They turned out delicious!',
    timestamp: new Date(Date.now() - 1000 * 60 * 165),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=cookies',
    riskLevel: 'low',
    autoModeration: {
      confidence: 97,
      flags: ['Family Activity', 'Safe Content', 'Wholesome Interaction']
    }
  },
  {
    id: 'mod-017',
    type: 'image_upload',
    childName: 'Lucas',
    title: 'Found This Cool Website - Check the URL!',
    description: 'Screenshot of a website with questionable content. URL visible in browser bar leads to inappropriate site.',
    timestamp: new Date(Date.now() - 1000 * 60 * 175),
    status: 'pending',
    thumbnailUrl: 'https://picsum.photos/300/400?random=website',
    riskLevel: 'medium',
    autoModeration: {
      confidence: 84,
      flags: ['External Link Shared', 'Website Content Review Needed', 'Potential Inappropriate Content']
    }
  },
  {
    id: 'mod-018',
    type: 'profile_update',
    childName: 'Sophie',
    title: 'Updated Profile Bio',
    description: 'New bio: "Single and ready to mingle! Looking for older guys to chat with. DM me! Snap: sophie_cutie2024"',
    timestamp: new Date(Date.now() - 1000 * 60 * 185),
    status: 'pending',
    riskLevel: 'high',
    autoModeration: {
      confidence: 93,
      flags: ['Age Inappropriate Language', 'Contact Information Shared', 'Seeking Adult Contact']
    }
  },
];

const MOCK_REPORTED_CONTENT: ReportedContent[] = [
  {
    id: 'report-001',
    reportedBy: 'Emma\'s Parent',
    contentType: 'video',
    reason: 'Cyberbullying',
    description: 'Video shows my child being made fun of by classmates. Multiple kids are calling her names and laughing at her in the background.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'under_review',
  },
  {
    id: 'report-002',
    reportedBy: 'Community Member',
    contentType: 'comment',
    reason: 'Personal Information Sharing',
    description: 'Comment reveals full home address, phone number, and school name. This is extremely dangerous for a child.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: 'escalated',
  },
  {
    id: 'report-003',
    reportedBy: 'Jake\'s Parent',
    contentType: 'video',
    reason: 'Dangerous Activity',
    description: 'Video shows children attempting to climb on roof of school building during lunch break. Very unsafe behavior.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    status: 'resolved',
  },
  {
    id: 'report-004',
    reportedBy: 'Concerned Teacher',
    contentType: 'comment',
    reason: 'False Report - Safe Content',
    description: 'Reported comment was actually positive encouragement. "Great job on your science project!" - No policy violation found.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    status: 'resolved',
  },
  {
    id: 'report-005',
    reportedBy: 'Anonymous User',
    contentType: 'video',
    reason: 'Age Inappropriate Content',
    description: 'Child is attempting to recreate adult makeup tutorials and asking viewers to "rate how mature I look" - concerning behavior.',
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    status: 'under_review',
  },
  {
    id: 'report-006',
    reportedBy: 'Maya\'s Guardian',
    contentType: 'comment',
    reason: 'Stranger Contact Attempt',
    description: 'Unknown adult user asking my daughter to meet in person and requesting her to keep it secret from parents.',
    timestamp: new Date(Date.now() - 1000 * 60 * 360),
    status: 'escalated',
  },
  {
    id: 'report-007',
    reportedBy: 'School Administrator',
    contentType: 'video',
    reason: 'False Report - Educational Content',
    description: 'Video was reported as "inappropriate" but shows student presenting legitimate school science project. No violation found.',
    timestamp: new Date(Date.now() - 1000 * 60 * 420),
    status: 'resolved',
  },
  {
    id: 'report-008',
    reportedBy: 'Safety Volunteer',
    contentType: 'comment',
    reason: 'Self-Harm Reference',
    description: 'Comment includes phrases like "I want to disappear" and "nobody would care if I was gone" - needs immediate attention.',
    timestamp: new Date(Date.now() - 1000 * 60 * 480),
    status: 'escalated',
  },
];

export default function ModerationScreen() {
  const { user } = useAuth();
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>(MOCK_MODERATION_QUEUE);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>(MOCK_REPORTED_CONTENT);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'approval' | 'reports' | 'settings'>('approval');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleApproveContent = (itemId: string) => {
    setModerationQueue(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, status: 'approved' as const }
          : item
      )
    );
    Alert.alert('Content Approved', 'The content has been approved and published.');
  };

  const handleRejectContent = (itemId: string) => {
    Alert.alert(
      'Reject Content',
      'Please provide feedback to help your child understand why this content was rejected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Too Personal',
          onPress: () => {
            setModerationQueue(prev => 
              prev.map(item => 
                item.id === itemId 
                  ? { ...item, status: 'rejected' as const }
                  : item
              )
            );
            Alert.alert('Content Rejected', 'Educational feedback has been sent to your child.');
          }
        },
        {
          text: 'Safety Concern',
          onPress: () => {
            setModerationQueue(prev => 
              prev.map(item => 
                item.id === itemId 
                  ? { ...item, status: 'rejected' as const }
                  : item
              )
            );
            Alert.alert('Content Rejected', 'Safety guidance has been sent to your child.');
          }
        },
      ]
    );
  };

  const handleReviewContent = (item: ModerationItem) => {
    Alert.alert(
      'Content Review',
      `${item.childName} wants to ${item.type === 'video_upload' ? 'upload' : 'post'}: "${item.title}"\n\n${item.description}\n\nAI Analysis: ${item.autoModeration?.flags.join(', ')}`,
      [
        { text: 'View Details', onPress: () => Alert.alert('Details', 'Full content review would open here') },
        { text: 'Approve', onPress: () => handleApproveContent(item.id) },
        { text: 'Reject', style: 'destructive', onPress: () => handleRejectContent(item.id) },
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
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderApprovalTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>📋 Content Approval Queue</Text>
      <Text style={styles.sectionSubtitle}>
        Review content before it's published. Our AI has pre-screened these items.
      </Text>
      
      {moderationQueue.filter(item => item.status === 'pending').map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.moderationCard}
          onPress={() => handleReviewContent(item)}
        >
          <View style={styles.videoHeader}>
            <View style={styles.childInfo}>
              <View style={styles.childAvatar}>
                <Text style={styles.childAvatarText}>{item.childName[0]}</Text>
              </View>
              <View style={styles.childDetails}>
                <Text style={styles.childName}>👦 {item.childName}</Text>
                <Text style={styles.videoTimestamp}>{getTimeAgo(item.timestamp)}</Text>
              </View>
            </View>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.riskLevel) }]}>
              <Text style={styles.riskText}>{item.riskLevel.toUpperCase()}</Text>
            </View>
          </View>

          {item.thumbnailUrl && (
            <View style={styles.videoContainer}>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.videoThumbnail} />
              {item.type === 'video_upload' && (
                <>
                  <View style={styles.playOverlay}>
                    <View style={styles.playButton}>
                      <Text style={styles.playButtonText}>▶️</Text>
                    </View>
                  </View>
                  <View style={styles.videoDuration}>
                    <Text style={styles.videoDurationText}>2:34</Text>
                  </View>
                </>
              )}
              {item.type === 'image_upload' && (
                <View style={styles.imageTypeIndicator}>
                  <Text style={styles.imageTypeText}>📷 IMAGE</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.videoDescription}>{item.description}</Text>
          </View>
          
          {item.autoModeration && (
            <View style={styles.aiAnalysis}>
              <Text style={styles.aiTitle}>🤖 AI Analysis ({item.autoModeration.confidence}% confidence)</Text>
              <Text style={styles.aiFlags}>{item.autoModeration.flags.join(' • ')}</Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleApproveContent(item.id)}
            >
              <Text style={styles.buttonText}>✅ Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleRejectContent(item.id)}
            >
              <Text style={styles.buttonText}>❌ Reject</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {moderationQueue.filter(item => item.status === 'pending').length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>🎉 All caught up!</Text>
          <Text style={styles.emptySubtext}>No content waiting for approval</Text>
        </View>
      )}
    </View>
  );

  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🚨 Community Reports</Text>
      <Text style={styles.sectionSubtitle}>
        Content reported by the community for review
      </Text>
      
      {reportedContent.map(report => (
        <View key={report.id} style={styles.reportCard}>
          <Text style={styles.reportReason}>Reported: {report.reason}</Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
          <Text style={styles.reportMeta}>
            By {report.reportedBy} • {getTimeAgo(report.timestamp)}
          </Text>
        </View>
      ))}

      {reportedContent.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>✨ No reports</Text>
          <Text style={styles.emptySubtext}>Community is behaving well!</Text>
        </View>
      )}
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>⚙️ Moderation Settings</Text>
      
      <View style={styles.settingCard}>
        <Text style={styles.settingTitle}>Auto-Approval Settings</Text>
        <Text style={styles.settingDescription}>
          Content with 95%+ confidence from AI safety scan can be auto-approved
        </Text>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Configure</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingCard}>
        <Text style={styles.settingTitle}>Notification Preferences</Text>
        <Text style={styles.settingDescription}>
          Get notified when content needs review
        </Text>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingCard}>
        <Text style={styles.settingTitle}>Family Guidelines</Text>
        <Text style={styles.settingDescription}>
          Customize content guidelines for your family
        </Text>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.statusInfo}>
          <Text style={styles.time}>21.32</Text>
          <View style={styles.signal}>
            <Text style={styles.signalText}>••• 5G</Text>
            <View style={styles.battery}>
              <Text style={styles.batteryNumber}>16</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Orange Progress Bar */}
      <View style={styles.progressBar} />

      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </View>
          <View style={styles.brandText}>
            <Text style={styles.brandName}>Family Moderation</Text>
            <Text style={styles.brandSubtitle}>Keep your family safe</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'approval' && styles.activeTab]}
          onPress={() => setSelectedTab('approval')}
        >
          <Text style={[styles.tabText, selectedTab === 'approval' && styles.activeTabText]}>
            📋 Queue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reports' && styles.activeTab]}
          onPress={() => setSelectedTab('reports')}
        >
          <Text style={[styles.tabText, selectedTab === 'reports' && styles.activeTabText]}>
            🚨 Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'settings' && styles.activeTab]}
          onPress={() => setSelectedTab('settings')}
        >
          <Text style={[styles.tabText, selectedTab === 'settings' && styles.activeTabText]}>
            ⚙️ Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Tab Content */}
        {selectedTab === 'approval' && renderApprovalTab()}
        {selectedTab === 'reports' && renderReportsTab()}
        {selectedTab === 'settings' && renderSettingsTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    padding: theme.spacing.md,
  },
  tabContent: {
    paddingBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
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
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  contentTitle: {
    fontSize: theme.fontSizes.md,
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
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  aiAnalysis: {
    backgroundColor: '#F0F8FF',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  aiTitle: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
    color: '#4169E1',
    marginBottom: 5,
  },
  aiFlags: {
    fontSize: theme.fontSizes.xs,
    color: '#4169E1',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF4444',
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
  emptyText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  reportCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  reportReason: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  reportDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  reportMeta: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  settingCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  settingButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  settingButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.fontSizes.sm,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  childAvatarText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
  },
  childDetails: {
    flex: 1,
  },
  videoTimestamp: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  videoContainer: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
    marginLeft: 4,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
  },
  videoInfo: {
    marginBottom: theme.spacing.sm,
  },
  videoTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  videoDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  imageTypeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageTypeText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
  },
}); 