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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles'; 
const TransportsScreen = ({ navigation }) => {
  const [transports, setTransports] = useState([]);
  const [totalTransports, setTotalTransports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

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
  
  // Fetch transports when token is available
  useEffect(() => {
    if (authToken) {
      fetchTransports();
    }
  }, [authToken]);
  
  const fetchTransports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}transports`, {
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
      console.log('Fetched transports:', data);
      
      // Set the total number of transports and the transports array
      setTotalTransports(data.number_of_transports || 0);
      setTransports(data.transports || []);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch transports data');
      console.error('Error fetching transports:', err);
    }
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

  // Helper function to get status color based on status_transport
  const getStatusColor = (status) => {
    switch(status) {
      case 'not started':
        return '#FFA500'; // Orange
      case 'in progress':
        return '#3F51B5'; // Blue
      case 'completed':
        return '#4CAF50'; // Green
      case 'delayed':
        return '#F44336'; // Red
      default:
        return '#3F51B5'; // Default blue
    }
  };

  const renderTransportItem = ({ item }) => {
    const gradientColors = getRandomColor(item.id);
    const statusColor = getStatusColor(item.status_transport);
    
    return (
      <View style={styles.transportCardContainer}>
        <View style={styles.transportCard}>
          <View style={styles.iconSection}>
            <LinearGradient
              colors={gradientColors}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.iconText}>#{item.id}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.transportInfo}>
            <View style={styles.transportHeader}>
              <Text style={styles.transportTitle}>Transport #{item.id}</Text>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => navigation.navigate('CMR', { transportId: item.id })}
              >
                <Text style={styles.editButtonText}>Vezi CMR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => navigation.navigate('CompleteCMR', { transportId: item.id })}
              >
                <Text style={styles.editButtonText}>Completeaza CMR</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Sofer</Text>
                <Text style={styles.detailValue}>{item.driver ? `ID: ${item.driver}` : 'Not assigned'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, { color: statusColor }]}>
                  {item.status_transport || 'Pending'}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Origine</Text>
                <Text style={styles.detailValue}>{item.origin_city || 'N/A'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Destinatie</Text>
                <Text style={styles.detailValue}>{item.destination_city || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tip marfa</Text>
                <Text style={styles.detailValue}>{item.goods_type || 'N/A'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Numar trailer</Text>
                <Text style={styles.detailValue}>{item.trailer_number || 'None'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>Transporturi</Text>
      <Text style={styles.headerSubtitle}>
        {totalTransports} transporturi active
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
          <TouchableOpacity style={styles.retryButton} onPress={() => authToken && fetchTransports()}>
            <Text style={styles.retryButtonText}>Incearca din nou...</Text>
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
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#303F9F" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchTransports}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>
      
      {transports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nu s-au gasit transporturi!</Text>
            <Text style={styles.emptyText}>Nu exista transporturi inregistrate in sistem</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchTransports}>
              <Text style={styles.refreshButtonText}>Reincarca</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={transports}
          renderItem={renderTransportItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default TransportsScreen;