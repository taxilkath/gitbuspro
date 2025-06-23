import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ChevronUp } from 'lucide-react-native';
import * as Location from 'expo-location';

// Mock data for bus stops
const mockBusStops = [
  {
    id: 1,
    name: 'Hollyhedge Road / nr Brownley Court Road',
    distance: '0.01 mi',
    routes: ['11', '729', '752', '769', '810'],
    coordinates: { latitude: 53.4808, longitude: -2.2426 },
  },
  {
    id: 2,
    name: 'Manchester City Centre',
    distance: '0.15 mi',
    routes: ['142', '143', '147', '192'],
    coordinates: { latitude: 53.4839, longitude: -2.2446 },
  },
  {
    id: 3,
    name: 'Piccadilly Gardens',
    distance: '0.23 mi',
    routes: ['38', '42', '43', '157', '216'],
    coordinates: { latitude: 53.4809, longitude: -2.2374 },
  },
  {
    id: 4,
    name: 'Oxford Road Station',
    distance: '0.31 mi',
    routes: ['41', '42', '142', '143'],
    coordinates: { latitude: 53.4744, longitude: -2.2421 },
  },
];

// Mock live updates
const mockLiveUpdates = [
  {
    route: '11',
    destination: 'Stockport Interchange',
    type: 'Stagecoach',
    arrivalTime: '3 min',
    color: '#FFD700',
  },
  {
    route: '729',
    destination: 'Altrincham',
    type: 'First Manchester',
    arrivalTime: '7 min',
    color: '#FFD700',
  },
  {
    route: '752',
    destination: 'Didsbury',
    type: 'Stagecoach',
    arrivalTime: '12 min',
    color: '#FFD700',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyExpanded, setNearbyExpanded] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  // Removed location permission requests as per user request
  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== 'granted') {
  //         Alert.alert('Permission denied', 'Allow location access to find nearby stops');
  //         return;
  //       }
  //       let location = await Location.getCurrentPositionAsync({});
  //       setLocation(location);
  //     }
  //   })();
  // }, []);

  const handleStopPress = (stop: any) => {
    Alert.alert('Bus Stop', `Selected: ${stop.name}`);
  };

  const RouteButton = ({ route, isLive = false }: { route: string; isLive?: boolean }) => (
    <TouchableOpacity
      style={[styles.routeButton, isLive && styles.liveRouteButton]}
      activeOpacity={0.7}
    >
      <Text style={[styles.routeText, isLive && styles.liveRouteText]}>{route}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stops, routes or places"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubText}>Bus stops and routes will appear here</Text>
          {/* Bus stop markers */}
          <View style={styles.markerContainer}>
            <View style={[styles.marker, { top: 100, left: 150 }]}>
              <View style={styles.busIcon}>
                <Text style={styles.busIconText}>🚌</Text>
              </View>
            </View>
            <View style={[styles.marker, { top: 120, left: 200 }]}>
              <View style={styles.busIcon}>
                <Text style={styles.busIconText}>🚌</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Nearby Section */}
      <View style={styles.nearbyContainer}>
        <TouchableOpacity
          style={styles.nearbyHeader}
          onPress={() => setNearbyExpanded(!nearbyExpanded)}
          activeOpacity={0.7}
        >
          <View>
            <Text style={styles.nearbyTitle}>Nearby</Text>
            <Text style={styles.nearbySubtitle}>Current location</Text>
          </View>
          <ChevronUp
            size={24}
            color="#666"
            style={[
              styles.chevron,
              { transform: [{ rotate: nearbyExpanded ? '0deg' : '180deg' }] },
            ]}
          />
        </TouchableOpacity>

        {nearbyExpanded && (
          <ScrollView style={styles.stopsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilter(!showFilter)}
                activeOpacity={0.7}
              >
                <Filter size={16} color="#666" />
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
              <Text style={styles.updateText}>Last updated just now</Text>
            </View>

            {mockBusStops.map((stop) => (
              <TouchableOpacity
                key={stop.id}
                style={styles.stopCard}
                onPress={() => handleStopPress(stop)}
                activeOpacity={0.7}
              >
                <View style={styles.stopHeader}>
                  <View style={styles.stopIcon}>
                    <Text style={styles.stopIconText}>🚌</Text>
                  </View>
                  <View style={styles.stopInfo}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    <Text style={styles.stopDistance}>{stop.distance}</Text>
                  </View>
                </View>

                <View style={styles.routesContainer}>
                  {stop.routes.map((route) => (
                    <RouteButton key={route} route={route} />
                  ))}
                </View>

                {/* Live updates for first stop */}
                {stop.id === 1 && (
                  <View style={styles.liveUpdatesContainer}>
                    {mockLiveUpdates.map((update, index) => (
                      <View key={index} style={styles.liveUpdate}>
                        <RouteButton route={update.route} isLive />
                        <View style={styles.liveUpdateInfo}>
                          <Text style={styles.liveDestination}>{update.destination}</Text>
                          <Text style={styles.liveType}>{update.type}</Text>
                        </View>
                        <View style={styles.arrivalTime}>
                          <Text style={styles.arrivalText}>{update.arrivalTime}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#E8E8E8',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  mapSubText: {
    fontSize: 14,
    color: '#888',
  },
  markerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
  },
  busIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busIconText: {
    fontSize: 18,
  },
  nearbyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  nearbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  nearbySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chevron: {
    // Transform handled inline
  },
  stopsContainer: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  updateText: {
    fontSize: 12,
    color: '#888',
  },
  stopCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stopDistance: {
    fontSize: 14,
    color: '#666',
  },
  routesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  routeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  liveRouteButton: {
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: '#FFC000',
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  liveRouteText: {
    color: '#333',
  },
  liveUpdatesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  liveUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveUpdateInfo: {
    flex: 1,
    marginLeft: 12,
  },
  liveDestination: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  liveType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  arrivalTime: {
    alignItems: 'flex-end',
  },
  arrivalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});