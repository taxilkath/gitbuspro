import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowUpDown, 
  Clock, 
  MapPin, 
  Navigation, 
  Calendar,
  Settings
} from 'lucide-react-native';

// Mock journey data
const mockJourneys = [
  {
    id: 1,
    from: 'Manchester City Centre',
    to: 'Stockport Interchange',
    duration: '45 min',
    steps: [
      { type: 'walk', duration: '3 min', instruction: 'Walk to Piccadilly Gardens' },
      { type: 'bus', route: '11', duration: '35 min', instruction: 'Take bus 11 to Stockport' },
      { type: 'walk', duration: '7 min', instruction: 'Walk to destination' },
    ],
    departureTime: '14:25',
    arrivalTime: '15:10',
    fare: '£3.80',
    operator: 'Stagecoach',
  },
  {
    id: 2,
    from: 'Manchester City Centre',
    to: 'Stockport Interchange',
    duration: '52 min',
    steps: [
      { type: 'walk', duration: '5 min', instruction: 'Walk to Oxford Road' },
      { type: 'bus', route: '142', duration: '40 min', instruction: 'Take bus 142 to Stockport' },
      { type: 'walk', duration: '7 min', instruction: 'Walk to destination' },
    ],
    departureTime: '14:30',
    arrivalTime: '15:22',
    fare: '£3.80',
    operator: 'First Greater Manchester',
  },
];

export default function PlanScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showJourneys, setShowJourneys] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Now');

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handlePlanJourney = () => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      Alert.alert('Error', 'Please enter both locations');
      return;
    }
    setShowJourneys(true);
  };

  const handleJourneySelect = (journey: any) => {
    Alert.alert(
      'Journey Selected',
      `From: ${journey.from}\nTo: ${journey.to}\nDuration: ${journey.duration}\nFare: ${journey.fare}`
    );
  };

  const StepIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'walk':
        return <Text style={styles.stepIcon}>🚶</Text>;
      case 'bus':
        return <Text style={styles.stepIcon}>🚌</Text>;
      default:
        return <Text style={styles.stepIcon}>📍</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plan your journey</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Journey Planner Form */}
        <View style={styles.plannerCard}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="From"
                value={fromLocation}
                onChangeText={setFromLocation}
                placeholderTextColor="#666"
              />
            </View>
            
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLocations}
              activeOpacity={0.7}
            >
              <ArrowUpDown size={20} color="#666" />
            </TouchableOpacity>
            
            <View style={styles.inputWrapper}>
              <Navigation size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="To"
                value={toLocation}
                onChangeText={setToLocation}
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.timeContainer}>
            <View style={styles.timeWrapper}>
              <Clock size={20} color="#666" style={styles.timeIcon} />
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{selectedTime}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.calendarButton}>
              <Calendar size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Plan Button */}
          <TouchableOpacity
            style={styles.planButton}
            onPress={handlePlanJourney}
            activeOpacity={0.8}
          >
            <Text style={styles.planButtonText}>Plan Journey</Text>
          </TouchableOpacity>
        </View>

        {/* Journey Results */}
        {showJourneys && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Journey Options</Text>
            
            {mockJourneys.map((journey) => (
              <TouchableOpacity
                key={journey.id}
                style={styles.journeyCard}
                onPress={() => handleJourneySelect(journey)}
                activeOpacity={0.7}
              >
                <View style={styles.journeyHeader}>
                  <View style={styles.journeyTimes}>
                    <Text style={styles.departureTime}>{journey.departureTime}</Text>
                    <View style={styles.journeyLine}>
                      <View style={styles.journeyDot} />
                      <View style={styles.journeyLinePath} />
                      <View style={styles.journeyDot} />
                    </View>
                    <Text style={styles.arrivalTime}>{journey.arrivalTime}</Text>
                  </View>
                  <View style={styles.journeyInfo}>
                    <Text style={styles.journeyDuration}>{journey.duration}</Text>
                    <Text style={styles.journeyFare}>{journey.fare}</Text>
                    <Text style={styles.journeyOperator}>{journey.operator}</Text>
                  </View>
                </View>

                <View style={styles.journeySteps}>
                  {journey.steps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                      <StepIcon type={step.type} />
                      <View style={styles.stepDetails}>
                        <Text style={styles.stepInstruction}>{step.instruction}</Text>
                        <Text style={styles.stepDuration}>{step.duration}</Text>
                        {step.route && (
                          <View style={styles.routeBadge}>
                            <Text style={styles.routeText}>{step.route}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Popular Destinations</Text>
          
          <View style={styles.suggestionsList}>
            {[
              'Manchester Airport',
              'Trafford Centre',
              'MediaCity',
              'Salford Quays',
              'Etihad Stadium',
              'Old Trafford',
            ].map((destination, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => setToLocation(destination)}
                activeOpacity={0.7}
              >
                <MapPin size={16} color="#666" />
                <Text style={styles.suggestionText}>{destination}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  plannerCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 6,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  swapButton: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginVertical: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeIcon: {
    marginRight: 12,
  },
  timeButton: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  calendarButton: {
    marginLeft: 12,
    padding: 14,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  planButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultsContainer: {
    margin: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  journeyCard: {
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
  journeyHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  journeyTimes: {
    alignItems: 'center',
    marginRight: 16,
  },
  departureTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  journeyLine: {
    alignItems: 'center',
    marginVertical: 8,
  },
  journeyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  journeyLinePath: {
    width: 2,
    height: 30,
    backgroundColor: '#FFD700',
    marginVertical: 4,
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  journeyInfo: {
    flex: 1,
  },
  journeyDuration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  journeyFare: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 2,
  },
  journeyOperator: {
    fontSize: 14,
    color: '#666',
  },
  journeySteps: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  stepDetails: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  stepDuration: {
    fontSize: 12,
    color: '#666',
  },
  routeBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  routeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  suggestionsContainer: {
    margin: 16,
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  suggestionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});