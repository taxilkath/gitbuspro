import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Clock, Trash2, Plus } from 'lucide-react-native';

// Mock favorites data
const mockFavorites = [
  {
    id: 1,
    type: 'stop',
    name: 'Hollyhedge Road / nr Brownley Court Road',
    subtitle: '0.01 mi from current location',
    routes: ['11', '729', '752', '769', '810'],
    lastUsed: '2 hours ago',
  },
  {
    id: 2,
    type: 'journey',
    name: 'Home to Work',
    subtitle: 'Manchester City Centre → Stockport Interchange',
    duration: '45 min',
    lastUsed: 'Yesterday',
  },
  {
    id: 3,
    type: 'stop',
    name: 'Piccadilly Gardens',
    subtitle: 'Manchester City Centre',
    routes: ['38', '42', '43', '157', '216'],
    lastUsed: '3 days ago',
  },
  {
    id: 4,
    type: 'journey',
    name: 'Weekend Shopping',
    subtitle: 'Home → Trafford Centre',
    duration: '32 min',
    lastUsed: '1 week ago',
  },
];

export default function FavouritesScreen() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleDeleteFavorite = (id: number) => {
    Alert.alert(
      'Remove Favourite',
      'Are you sure you want to remove this favourite?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter(fav => fav.id !== id));
          },
        },
      ]
    );
  };

  const handleFavoritePress = (favorite: any) => {
    if (favorite.type === 'stop') {
      Alert.alert('Bus Stop', `Navigate to ${favorite.name}?`);
    } else {
      Alert.alert('Journey', `Plan journey: ${favorite.subtitle}?`);
    }
  };

  const handleAddFavorite = () => {
    Alert.alert('Add Favourite', 'Search for stops or save frequent journeys');
  };

  const filteredFavorites = favorites.filter(favorite => {
    if (selectedCategory === 'all') return true;
    return favorite.type === selectedCategory;
  });

  const FavoriteIcon = ({ type }: { type: string }) => {
    if (type === 'stop') {
      return <Text style={styles.favoriteIcon}>🚌</Text>;
    }
    return <Text style={styles.favoriteIcon}>🗺️</Text>;
  };

  const RouteButton = ({ route }: { route: string }) => (
    <View style={styles.routeButton}>
      <Text style={styles.routeText}>{route}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFavorite}
          activeOpacity={0.7}
        >
          <Plus size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === 'all' && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory === 'stop' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory('stop')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === 'stop' && styles.filterTextActive,
              ]}
            >
              Stops
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory === 'journey' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory('journey')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === 'journey' && styles.filterTextActive,
              ]}
            >
              Journeys
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Favorites List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredFavorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Star size={48} color="#CCC" />
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your frequently used stops and journeys for quick access
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleAddFavorite}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Add Favourite</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.favoritesList}>
            {filteredFavorites.map((favorite) => (
              <TouchableOpacity
                key={favorite.id}
                style={styles.favoriteCard}
                onPress={() => handleFavoritePress(favorite)}
                activeOpacity={0.7}
              >
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteIconContainer}>
                    <FavoriteIcon type={favorite.type} />
                  </View>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{favorite.name}</Text>
                    <Text style={styles.favoriteSubtitle}>{favorite.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFavorite(favorite.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>

                {/* Routes for stops */}
                {favorite.type === 'stop' && favorite.routes && (
                  <View style={styles.routesContainer}>
                    {favorite.routes.slice(0, 5).map((route) => (
                      <RouteButton key={route} route={route} />
                    ))}
                    {favorite.routes.length > 5 && (
                      <Text style={styles.moreRoutes}>
                        +{favorite.routes.length - 5} more
                      </Text>
                    )}
                  </View>
                )}

                {/* Duration for journeys */}
                {favorite.type === 'journey' && favorite.duration && (
                  <View style={styles.journeyDetails}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.journeyDuration}>{favorite.duration}</Text>
                  </View>
                )}

                <View style={styles.favoriteFooter}>
                  <Text style={styles.lastUsed}>Last used: {favorite.lastUsed}</Text>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#333',
    fontWeight: '600',
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  favoritesList: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  favoriteSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  routesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  moreRoutes: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  journeyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeyDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  lastUsed: {
    fontSize: 12,
    color: '#888',
  },
});