import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  TouchableOpacity,
  
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from './styles'; 
const TrucksScreen = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation(); // Add this line to get the navigation object
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

  // Load auth token on component mount
  useEffect(() => {
    const getAuthToken = () => {
      try {
        console.log("Attempting to get auth token from localStorage");
        const token = localStorage.getItem('authToken'); // FIXED: Changed from setting to getting
        console.log("Token from localStorage:", token ? "Token exists" : "No token found");
        
        if (token) {
          setAuthToken(token);
          console.log("Auth token set in state");
        } else {
          console.log("No token found, setting error");
          setError('Authentication required. Please log in first.');
        }
      } catch (err) {
        console.error("Error getting auth token:", err);
        setError('Failed to load authentication token.');
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };
    
    getAuthToken();
  }, []);
  
  // Fetch trucks when token is available
  useEffect(() => {
    if (authToken) {
      fetchTrucks();
    }
  }, [authToken]);
  
  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}trucks/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`,  
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTrucks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch trucks data');
      console.error('Error fetching trucks:', err);
    }
  };

  const getServiceStatus = (nextServiceDate) => {
    if (!nextServiceDate) return { status: 'unknown', color: '#9E9E9E' };
    
    const today = new Date();
    const serviceDate = new Date(nextServiceDate);
    const diffTime = serviceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', color: '#F44336' };
    } else if (diffDays <= 7) {
      return { status: 'upcoming', color: '#FF9800' };
    } else {
      return { status: 'good', color: '#4CAF50' };
    }
  };

  const getTruckIcon = (make) => {
    const makeNormalized = make?.toLowerCase() || '';
    
    if (makeNormalized.includes('volvo')) {
      return 'truck';
    } else if (makeNormalized.includes('mercedes')) {
      return 'truck-delivery';
    } else if (makeNormalized.includes('scania')) {
      return 'truck-fast';
    } else {
      return 'truck-check';
    }
  };

  const getRandomColor = (id) => {
    const colors = [
      ['#3A1C71', '#D76D77', '#FFAF7B'],
      ['#00B4DB', '#0083B0', '#005F7F'],
      ['#134E5E', '#71B280', '#9BDC92'],
      ['#373B44', '#4286f4', '#9CECFB'],
      ['#8E2DE2', '#4A00E0', '#6E48AA'],
      ['#FF416C', '#FF4B2B', '#FFA07A']
    ];
    return colors[id % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const renderTruckItem = ({ item }) => {
    const gradientColors = getRandomColor(item.id);
    const serviceStatus = getServiceStatus(item.next_service_date);
    
    return (
      <View style={styles.truckCardContainer}>
        <View style={styles.truckCard}>
          <View style={styles.iconSection}>
            <LinearGradient
              colors={gradientColors}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name={getTruckIcon(item.make)} size={30} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.plateContainer}>
              <Text style={styles.plateText}>{item.license_plate}</Text>
            </View>
          </View>
          
          <View style={styles.truckInfo}>
            <View style={styles.truckHeader}>
              <Text style={styles.truckMakeModel}>{item.make} {item.model}</Text>
              <Text style={styles.truckYear}>{item.year}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>VIN</Text>
                  <Text style={styles.detailValue}>{item.vin || 'Not specified'}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ultima vizita la service</Text>
                  <Text style={styles.detailValue}>{formatDate(item.last_service_date)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Urmatoarea vizita la service</Text>
                  <Text style={[styles.detailValue, { color: serviceStatus.color }]}>
                    {formatDate(item.next_service_date)}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.serviceStatusBar, { backgroundColor: serviceStatus.color + '20' }]}>
                <View style={styles.serviceStatusDot}>
                  <View style={[styles.statusDot, { backgroundColor: serviceStatus.color }]} />
                </View>
                <Text style={[styles.serviceStatusText, { color: serviceStatus.color }]}>
                  {serviceStatus.status === 'good' && 'Service up to date'}
                  {serviceStatus.status === 'upcoming' && 'Service due soon'}
                  {serviceStatus.status === 'overdue' && 'Service overdue'}
                  {serviceStatus.status === 'unknown' && 'Service status unknown'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>Flota</Text>
      <Text style={styles.headerSubtitle}>
        {trucks.length} vehicule in flota
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Se încarcă...</Text>
    </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => authToken && fetchTrucks()}>
            <Text style={styles.retryButtonText}>Incearca din nou</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navigationHeader}>
      <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Main"); // or your fallback screen
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#303F9F" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchTrucks}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>
      {trucks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nu s-au gasit camioane</Text>
            <Text style={styles.emptyText}>Nu exista camioane inregistrate in sistem.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchTrucks}>
              <Text style={styles.refreshButtonText}>Reincarca</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={trucks}
          renderItem={renderTruckItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};



export default TrucksScreen;