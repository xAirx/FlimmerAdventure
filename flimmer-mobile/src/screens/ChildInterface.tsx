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

      {/* Video Feed */}
      <ScrollView 
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      >
        {videos.map((video, index) => (
          <VideoCard key={video.id} item={video} index={index} />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Hjem</Text>
        </TouchableOpacity>
        
        <View style={styles.navCenter}>
          <View style={styles.centerButton}>
            <Text style={styles.centerIcon}>⭐</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navText}>Søg</Text>
        </TouchableOpacity>
      </View>

      {/* Enhanced Game Modal */}
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
  feedContent: {
    padding: theme.spacing.md,
  },
  videoCard: {
    width: width,
    height: height - 100,
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.background,
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  modalPlayButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
  },
  pointsHeader: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  pointsHeaderText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
  },
  modalVideoInfo: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  modalVideoTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalCreator: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  gameSection: {
    padding: theme.spacing.md,
  },
  gameSectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  gameSectionSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  safetyActions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  safetyAction: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionActionIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  actionDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionPoints: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  rewardsSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  rewardsTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  rewardsList: {
    gap: theme.spacing.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  rewardText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  closeButton: {
    backgroundColor: theme.colors.textSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
  },
}); 