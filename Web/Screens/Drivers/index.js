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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles'; 

const DriversScreen = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation(); 
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

  // Load auth token on component mount
  useEffect(() => {
    const getAuthToken = () => {
      try {
        console.log("Attempting to get auth token from localStorage");
        const token = localStorage.getItem('authToken');
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
  
  // Fetch drivers when token is available
  useEffect(() => {
    if (authToken) {
      fetchDrivers();
    }
  }, [authToken]);
  
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}drivers`, {
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
      
      // Check if the response has the new format
      if (data.drivers) {
        setDrivers(data.drivers);
      } else {
        // If using old format, keep it as is
        setDrivers(data);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch drivers data');
      console.error('Error fetching drivers:', err);
    }
  };

  const getDriverInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = [
      ['#FF9966', '#FF5E62'],
      ['#36D1DC', '#5B86E5'],
      ['#CB356B', '#BD3F32'],
      ['#3A1C71', '#D76D77'],
      ['#00B4DB', '#0083B0'],
      ['#FEAC5E', '#C779D0'],
      ['#43C6AC', '#191654'],
      ['#834D9B', '#D04ED6']
    ];
    return colors[id % colors.length];
  };

  const renderDriverItem = ({ item }) => {
    const gradientColors = getRandomColor(item.id);
    const isOnRoad = item.driver && item.driver.on_road !== undefined ? item.driver.on_road : item.on_road || false;
    const rating = item.driver && item.driver.average_rating !== undefined ? item.driver.average_rating : (item.rating || 0);
    
    return (
      <View style={styles.driverCardContainer}>
        <View style={styles.driverCard}>
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={gradientColors}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>{getDriverInitials(item.name)}</Text>
            </LinearGradient>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isOnRoad ? '#4CAF50' : '#FF5722' }]} />
            </View>
          </View>
          
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{item.name || 'Nume indisponibil'}</Text>
            {item.email && <Text style={styles.driverEmail}>{item.email}</Text>}
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Companie</Text>
                <Text style={styles.detailValue}>{item.company || 'Nespecificat'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Rating</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
                  <Text style={styles.ratingMax}>/5.0</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, { color: isOnRoad ? '#4CAF50' : '#FF5722' }]}>
                  {isOnRoad ? 'On Road' : 'Available'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Rol</Text>
                <Text style={styles.detailValue}>
                  {item.is_driver && item.is_dispatcher ? 'Driver & Dispatcher' : 
                   item.is_driver ? 'Driver' : 
                   item.is_dispatcher ? 'Dispatcher' : 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    // Get the number of drivers from either the new format or the array length
    const driverCount = drivers.length;
    
    return (
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Soferi</Text>
        <Text style={styles.headerSubtitle}>
          {driverCount} active {driverCount === 1 ? 'driver' : 'drivers'}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#6E78F7" />
          <Text style={styles.loadingText}>Se incarca...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => authToken && fetchDrivers()}>
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
          onPress={fetchDrivers}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>
      {drivers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nu exista soferi inregistrati!</Text>
            <Text style={styles.emptyText}>Nu exista soferi inregistrati in sistem!</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchDrivers}>
              <Text style={styles.refreshButtonText}>Reincarca</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={drivers}
          renderItem={renderDriverItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default DriversScreen;