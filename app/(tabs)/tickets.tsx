import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { Calendar, Clock, Plus, Ticket as TicketIcon, X, Star, Play, Pause } from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock tickets data
const mockCurrentTickets = [
  {
    id: 1,
    name: '28-day Bee AnyBus',
    type: 'Bus',
    category: 'Student',
    description: 'Any bus in Greater Manchester',
    purchaseDate: '2024-01-15',
    expiryDate: '2024-01-22',
    expiresIn: '3 days 6 hrs',
    price: '£45.00',
    status: 'active',
    qrCode: 'QR_CODE_DATA_1',
    validFrom: '15 Jan 2024',
    validUntil: '22 Jan 2024',
    ticketNumber: 'BN-2024-001234',
    videoUrl: require('../../source/video.mp4'),
  },
  {
    id: 2,
    name: '1-day Bee AnyBus+Tram',
    type: 'Multi',
    category: 'Adult',
    description: 'Any bus in Greater Manchester and any Tram in Selected Zone(s)',
    purchaseDate: '2024-01-20',
    expiryDate: '2024-01-21',
    expiresIn: '8 hours 15 mins',
    price: '£8.50',
    status: 'active',
    qrCode: 'QR_CODE_DATA_2',
    validFrom: '20 Jan 2024',
    validUntil: '21 Jan 2024',
    ticketNumber: 'BN-2024-001235',
    videoUrl: require('../../source/video2.mp4'), // Change to video2.mp4 when available
  },
];

const mockExpiredTickets = [
  {
    id: 3,
    name: '1-day Bee AnyBus+Tram Off-peak',
    type: 'Multi',
    category: 'Adult',
    description: 'Any bus in Greater Manchester and any Tram in Selected Zone(s)',
    purchaseDate: '2024-01-10',
    expiryDate: '2024-08-06',
    price: '£8.50',
    status: 'expired',
    qrCode: 'QR_CODE_DATA_3',
  },
];

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState<'current' | 'expired'>('current');
  const [currentTickets] = useState(mockCurrentTickets);
  const [expiredTickets] = useState(mockExpiredTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showFullScreenTicket, setShowFullScreenTicket] = useState(false);
  
  // Create video player for the selected ticket
  const player = useVideoPlayer(selectedTicket?.videoUrl || null, (player) => {
    player.loop = true;
    player.muted = false;
    player.play(); // Auto-play when the player is ready
  });

  const handleBuyTickets = () => {
    Alert.alert('Buy Tickets', 'Redirecting to ticket purchase...');
  };

  const handleTicketPress = async (ticket: any) => {
    if (ticket.status === 'active') {
      setSelectedTicket(ticket);
      setShowFullScreenTicket(true);
      
      // Hide Android system status bar (battery, time, wifi, etc.)
      if (Platform.OS === 'android') {
        await SystemUI.setBackgroundColorAsync('transparent');
        RNStatusBar.setHidden(true, 'none');
        RNStatusBar.setTranslucent(true);
        RNStatusBar.setBackgroundColor('transparent', true);
      } else if (Platform.OS === 'ios') {
        RNStatusBar.setHidden(true, 'fade');
      }
    } else {
      Alert.alert('Expired Ticket', 'This ticket has expired.');
    }
  };

  const handleCloseFullScreen = async () => {
    setShowFullScreenTicket(false);
    setSelectedTicket(null);
    
    // Show Android system status bar again
    if (Platform.OS === 'android') {
      await SystemUI.setBackgroundColorAsync('#FFD700');
      RNStatusBar.setHidden(false, 'fade');
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor('#FFD700', true);
    } else if (Platform.OS === 'ios') {
      RNStatusBar.setHidden(false, 'fade');
    }
  };

  const handleBuyAgain = (ticket: any) => {
    Alert.alert('Buy Again', `Purchase another ${ticket.name}?`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTicketTypeIcon = (type: string) => {
    if (type === 'Multi') {
      return '🚌 🚊';
    }
    return '🚌';
  };

  const getTicketTypeColor = (type: string, category: string) => {
    if (type === 'Multi') {
      return '#B8E6B8'; // Light green for Multi
    }
    if (category === 'Student') {
      return '#4A5568'; // Dark gray for Student Bus
    }
    return '#B8E6B8'; // Default light green
  };

  const FullScreenTicketView = () => {
    if (!selectedTicket) return null;

    return (
      <Modal
        visible={showFullScreenTicket}
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
        transparent={false}
        onRequestClose={handleCloseFullScreen}
      >
        <View style={styles.fullScreenVideoContainer}>
          {/* Full Screen Video Only */}
          {selectedTicket.videoUrl ? (
            <VideoView
              style={styles.fullScreenVideo}
              player={player}
              allowsFullscreen={false}
              showsTimecodes={false}
              contentFit="cover"
              nativeControls={false}
            />
          ) : (
            <View style={[styles.fullScreenVideo, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#fff', fontSize: 20 }}>Video not available</Text>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  const TicketCard = ({ ticket, showBuyAgain = false }: { ticket: any; showBuyAgain?: boolean }) => (
    <TouchableOpacity
      style={[
        styles.ticketCard,
        ticket.status === 'expired' && styles.expiredTicketCard,
      ]}
      onPress={() => handleTicketPress(ticket)}
      activeOpacity={0.7}
    >
      {/* Ticket Type Header */}
      <View style={[
        styles.ticketTypeHeader,
        { backgroundColor: getTicketTypeColor(ticket.type, ticket.category) }
      ]}>
        <View style={styles.ticketTypeLeft}>
          <Text style={styles.ticketTypeIcon}>{getTicketTypeIcon(ticket.type)}</Text>
          <Text style={[
            styles.ticketTypeText,
            ticket.category === 'Student' && styles.studentText
          ]}>
            {ticket.type}
          </Text>
        </View>
        <View style={styles.ticketTypeRight}>
          <Text style={styles.categoryIcon}>👤</Text>
          <Text style={[
            styles.categoryText,
            ticket.category === 'Student' && styles.studentText
          ]}>
            {ticket.category}
          </Text>
        </View>
      </View>

      {/* Ticket Content */}
      <View style={styles.ticketContent}>
        <Text style={styles.ticketName}>{ticket.name}</Text>
        <Text style={styles.ticketDescription}>{ticket.description}</Text>
      </View>

      {/* Expiry Status */}
      {ticket.status === 'active' && ticket.expiresIn && (
        <View style={styles.expiryContainer}>
          <View style={styles.expiryBadge}>
            <Clock size={16} color="#22C55E" />
            <Text style={styles.expiryText}>Expires in {ticket.expiresIn}</Text>
          </View>
        </View>
      )}

      {/* Expired Date */}
      {ticket.status === 'expired' && (
        <View style={styles.expiredContainer}>
          <View style={styles.expiredInfo}>
            <Calendar size={16} color="#666" />
            <Text style={styles.expiredText}>Expired {formatDate(ticket.expiryDate)}</Text>
          </View>
          {showBuyAgain && (
            <TouchableOpacity
              style={styles.buyAgainButton}
              onPress={() => handleBuyAgain(ticket)}
              activeOpacity={0.7}
            >
              <Text style={styles.buyAgainText}>Buy again</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              activeTab !== 'current' && styles.inactiveHeaderButton
            ]}
            onPress={() => setActiveTab('current')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.headerButtonText,
              activeTab !== 'current' && styles.inactiveHeaderText
            ]}>
              Buy tickets
            </Text>
          </TouchableOpacity>
          
          <View style={styles.headerDivider}>
            <View style={styles.headerUnderline} />
          </View>
          
          <TouchableOpacity
            style={[
              styles.headerButton,
              activeTab === 'current' && styles.activeHeaderButton
            ]}
            onPress={() => setActiveTab('current')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.headerButtonText,
              activeTab === 'current' && styles.activeHeaderText
            ]}>
              My tickets
            </Text>
            {activeTab === 'current' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'current' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('current')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'current' && styles.activeTabText,
            ]}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'expired' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('expired')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'expired' && styles.activeTabText,
            ]}
          >
            Expired
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'current' ? (
          currentTickets.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <TicketIcon size={48} color="#CCC" />
              </View>
              <Text style={styles.emptyTitle}>No current tickets</Text>
              <Text style={styles.emptySubtitle}>
                Looks like you don't have any current or upcoming tickets.
              </Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={handleBuyTickets}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#333" />
                <Text style={styles.buyButtonText}>Buy Tickets</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.ticketsList}>
              {currentTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </View>
          )
        ) : (
          <View style={styles.ticketsList}>
            {expiredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} showBuyAgain />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Buy Button */}
      {currentTickets.length > 0 && (
        <TouchableOpacity
          style={styles.floatingBuyButton}
          onPress={handleBuyTickets}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#333" />
        </TouchableOpacity>
      )}

      {/* Full Screen Ticket View */}
      <FullScreenTicketView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeHeaderButton: {
    position: 'relative',
  },
  inactiveHeaderButton: {
    opacity: 0.5,
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  activeHeaderText: {
    color: '#333',
  },
  inactiveHeaderText: {
    color: '#999',
  },
  headerDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 10,
  },
  headerUnderline: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFD700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFD700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ticketsList: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  expiredTicketCard: {
    opacity: 0.8,
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ticketTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  ticketTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentText: {
    color: '#FFD700',
  },
  ticketTypeRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ticketContent: {
    padding: 16,
    paddingTop: 0,
  },
  ticketName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  expiryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  expiryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#22C55E',
  },
  expiredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  expiredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expiredText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  buyAgainButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyAgainText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  floatingBuyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  // Full Screen Video Styles
  fullScreenVideoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 9999,
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Full Screen Ticket Styles (old - can be removed)
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  fullScreenHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  fullScreenHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  fullScreenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  fullScreenContent: {
    flex: 1,
  },
  fullScreenTicketCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  fullScreenTicketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fullScreenTicketIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  fullScreenTicketType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  fullScreenCategoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fullScreenCategoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  fullScreenTicketDetails: {
    padding: 20,
  },
  fullScreenTicketName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  fullScreenTicketDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  validityContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  validityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  validityLabel: {
    fontSize: 14,
    color: '#666',
  },
  validityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fullScreenExpiryContainer: {
    alignItems: 'center',
  },
  fullScreenExpiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  fullScreenExpiryText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  videoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoContainer: {
    position: 'relative',
    width: screenWidth - 80,
    height: (screenWidth - 80) * 0.5625, // 16:9 aspect ratio
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  videoInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  videoInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  videoSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  additionalInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  instructionsContainer: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  instructionEmoji: {
    fontSize: 18,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});