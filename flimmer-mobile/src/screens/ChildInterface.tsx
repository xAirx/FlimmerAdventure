import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

interface Video {
  id: string;
  creator: string;
  title: string;
  thumbnailUrl: string;
  avatarUrl: string;
  isAd?: boolean;
  isApproved: boolean;
  isPending: boolean;
  likes?: number;
  comments?: number;
}

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    creator: 'Flamesman1',
    title: 'Den Uoriginale Film Fabrik',
    thumbnailUrl: 'https://picsum.photos/400/600?random=1',
    avatarUrl: 'https://picsum.photos/100/100?random=10',
    isApproved: true,
    isPending: false,
    likes: 1200,
    comments: 89,
  },
  {
    id: '2',
    creator: 'Ree Park',
    title: 'Forhindringsløb mod ABER - REKLAME',
    thumbnailUrl: 'https://picsum.photos/400/600?random=2',
    avatarUrl: 'https://picsum.photos/100/100?random=11',
    isAd: true,
    isApproved: true,
    isPending: false,
    likes: 890,
    comments: 45,
  },
  {
    id: '3',
    creator: 'Den Kreative Idé',
    title: 'Perleplader for begyndere',
    thumbnailUrl: 'https://picsum.photos/400/600?random=3',
    avatarUrl: 'https://picsum.photos/100/100?random=12',
    isApproved: true,
    isPending: false,
    likes: 2100,
    comments: 156,
  },
  {
    id: '4',
    creator: 'Familie Hansen',
    title: 'Sjov science eksperiment hjemme',
    thumbnailUrl: 'https://picsum.photos/400/600?random=4',
    avatarUrl: 'https://picsum.photos/100/100?random=13',
    isApproved: true,
    isPending: false,
    likes: 750,
    comments: 23,
  },
  {
    id: '5',
    creator: 'Kreativ Kalle',
    title: 'Lav din egen slime!',
    thumbnailUrl: 'https://picsum.photos/400/600?random=5',
    avatarUrl: 'https://picsum.photos/100/100?random=14',
    isApproved: true,
    isPending: false,
    likes: 3200,
    comments: 287,
  },
];

export default function ChildInterface() {
  const { user, logout } = useAuth();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [userPoints, setUserPoints] = useState(800); // Match the UI showing 800 points
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('For You');

  const handleEarnPoints = (action: string, points: number) => {
    setUserPoints(prev => prev + points);
    Alert.alert(
      '🎉 Points Earned!',
      `Du fik ${points} point for ${action}! Total: ${userPoints + points} point`,
      [{ text: 'Fedt!', style: 'default' }]
    );
  };

  const VideoCard = ({ item, index }: { item: Video; index: number }) => (
    <View style={styles.videoCard}>
      <TouchableOpacity 
        style={styles.videoTouchable}
        onPress={() => setSelectedVideo(item)}
      >
        {/* Video Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: item.thumbnailUrl }} 
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          {/* Play button overlay - only show if not an ad */}
          {!item.isAd && (
            <View style={styles.playOverlay}>
              <View style={styles.playButtonSmall}>
                <Text style={styles.playButtonSmallText}>▶</Text>
              </View>
            </View>
          )}
          {/* Ad badge */}
          {item.isAd && (
            <View style={styles.adOverlay}>
              <Text style={styles.adText}>REKLAME - REE PARK SAFARI</Text>
              <View style={styles.adLogo}>
                <Text style={styles.adLogoText}>REE PARK</Text>
              </View>
            </View>
          )}
        </View>

        {/* Creator Info */}
        <View style={styles.creatorSection}>
          <Image 
            source={{ uri: item.avatarUrl }}
            style={styles.creatorAvatar}
          />
          <View style={styles.creatorTextInfo}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.creatorName}>{item.creator}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with Logout */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flimmer</Text>
        <Text style={styles.points}>💎 {userPoints}</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {['For You', 'Following', 'Live', 'Gaming'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryTab, selectedCategory === category && styles.activeCategoryTab]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clean Video Feed */}
      <ScrollView 
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
      >
        {videos.map((video, index) => (
          <VideoCard key={video.id} item={video} index={index} />
        ))}
      </ScrollView>

      {/* Enhanced Video Detail Modal */}
      {selectedVideo && (
        <Modal
          visible={!!selectedVideo}
          animationType="slide"
          transparent={false}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalScrollView}>
              {/* Video Preview */}
              <View style={styles.videoPreview}>
                <Image 
                  source={{ uri: selectedVideo.thumbnailUrl }}
                  style={styles.modalThumbnail}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.modalPlayButton}
                  onPress={() => handleEarnPoints('at se en video', 5)}
                >
                  <Text style={styles.modalPlayButtonText}>▶️ Afspil Video</Text>
                </TouchableOpacity>
              </View>

              {/* Points Header */}
              <View style={styles.pointsHeader}>
                <Text style={styles.pointsHeaderText}>💎 Dine Point: {userPoints}</Text>
              </View>

              {/* Video Info */}
              <View style={styles.modalVideoInfo}>
                <Text style={styles.modalVideoTitle}>{selectedVideo.title}</Text>
                <Text style={styles.modalCreator}>af {selectedVideo.creator}</Text>
                <View style={styles.videoStats}>
                  <Text style={styles.videoStat}>👍 {selectedVideo.likes || 0}</Text>
                  <Text style={styles.videoStat}>💬 {selectedVideo.comments || 0}</Text>
                </View>
              </View>

              {/* Game Actions */}
              <View style={styles.gameSection}>
                <Text style={styles.gameSectionTitle}>🎮 Hjælp med at holde alle sikre!</Text>
                <Text style={styles.gameSectionSubtitle}>Optjen point ved at være en sikkerhedshelt</Text>

                <View style={styles.safetyActions}>
                  <TouchableOpacity 
                    style={styles.safetyAction}
                    onPress={() => handleEarnPoints('at markere godt indhold', 10)}
                  >
                    <Text style={styles.actionActionIcon}>👍</Text>
                    <Text style={styles.actionTitle}>Det er fedt!</Text>
                    <Text style={styles.actionDescription}>Marker videoer der er sjove og sikre</Text>
                    <Text style={styles.actionPoints}>+10 point</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.safetyAction}
                    onPress={() => handleEarnPoints('at lære om sikkerhed', 15)}
                  >
                    <Text style={styles.actionActionIcon}>🎓</Text>
                    <Text style={styles.actionTitle}>Lær noget nyt</Text>
                    <Text style={styles.actionDescription}>Opdag sikkerhedstips og tricks</Text>
                    <Text style={styles.actionPoints}>+15 point</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.safetyAction}
                    onPress={() => handleEarnPoints('at dele med familien', 20)}
                  >
                    <Text style={styles.actionActionIcon}>👨‍👩‍👧‍👦</Text>
                    <Text style={styles.actionTitle}>Del med familien</Text>
                    <Text style={styles.actionDescription}>Vis fede videoer til dine forældre</Text>
                    <Text style={styles.actionPoints}>+20 point</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.safetyAction}
                    onPress={() => {
                      Alert.alert(
                        'Sikkerhedshjælper',
                        'Hvis noget virker forkert eller gør dig utilpas, skal du altid fortælle det til en voksen! Du kan optjene point for at holde dig selv og andre sikre.',
                        [{ text: 'Forstået!', onPress: () => handleEarnPoints('at lære om rapportering', 25) }]
                      );
                    }}
                  >
                    <Text style={styles.actionActionIcon}>🛡️</Text>
                    <Text style={styles.actionTitle}>Sikkerhed først</Text>
                    <Text style={styles.actionDescription}>Rapporter alt der ikke virker rigtigt</Text>
                    <Text style={styles.actionPoints}>+25 point</Text>
                  </TouchableOpacity>
                </View>

                {/* Rewards */}
                <View style={styles.rewardsSection}>
                  <Text style={styles.rewardsTitle}>🎁 Optjen fede belønninger!</Text>
                  <View style={styles.rewardsList}>
                    <View style={styles.rewardItem}>
                      <Text style={styles.rewardIcon}>🌟</Text>
                      <Text style={styles.rewardText}>100 point = Særligt badge</Text>
                    </View>
                    <View style={styles.rewardItem}>
                      <Text style={styles.rewardIcon}>🎨</Text>
                      <Text style={styles.rewardText}>250 point = Tilpasset avatar</Text>
                    </View>
                    <View style={styles.rewardItem}>
                      <Text style={styles.rewardIcon}>🏆</Text>
                      <Text style={styles.rewardText}>500 point = Familie filmaften</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedVideo(null)}
              >
                <Text style={styles.closeButtonText}>✕ Luk</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  activeCategoryTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  categoryText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
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
    width: 20,
    height: 10,
    backgroundColor: theme.colors.text,
    borderRadius: 2,
    marginLeft: theme.spacing.sm,
  },
  batteryNumber: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    margin: theme.spacing.md,
  },
  feedContainer: {
    flex: 1,
  },
  videoCard: {
    width: width,
    height: height - 160,
    marginBottom: 0,
  },
  videoTouchable: {
    flex: 1,
  },
  thumbnailContainer: {
    position: 'relative',
    flex: 1,
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
  playButtonSmall: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  playButtonSmallText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
  },
  adOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
  },
  adLogo: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  adLogoText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  creatorSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  creatorTextInfo: {
    flexDirection: 'column',
  },
  videoTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  creatorName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.text,
  },
  navText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
  },
  centerButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  centerIcon: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalScrollView: {
    flex: 1,
  },
  videoPreview: {
    position: 'relative',
    height: 250,
  },
  modalThumbnail: {
    width: '100%',
    height: '100%',
  },
  modalPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalPlayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsHeader: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  pointsHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalVideoInfo: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  modalVideoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalCreator: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  videoStats: {
    flexDirection: 'row',
    gap: 20,
  },
  videoStat: {
    fontSize: 16,
    color: '#666',
  },
  gameSection: {
    padding: 20,
  },
  gameSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  safetyActions: {
    gap: 12,
    marginBottom: 20,
  },
  safetyAction: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  rewardsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  rewardsList: {
    gap: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rewardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rewardText: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#666',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

}); 