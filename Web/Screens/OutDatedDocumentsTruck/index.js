import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const ExpiredDocuments = () => {
  const [documentsData, setDocumentsData] = useState({ 
    expiring_truck_documents: 0, 
    titles: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { truckId } = route.params;
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

  // Fetch expired documents when token is available
  useEffect(() => {
    if (authToken && truckId) {
      fetchExpiredDocuments();
    }
  }, [authToken, truckId]);

  const fetchExpiredDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}truck/expired/${truckId}`, {
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
      console.log('Fetched expired documents:', data);
      setDocumentsData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch expired documents data');
      console.error('Error fetching expired documents:', err);
    }
  };

  const getRandomColor = (index) => {
    const colors = [
      ['#F44336', '#E91E63', '#FF5722'],
      ['#FF9800', '#FF5722', '#FFC107'],
      ['#9C27B0', '#673AB7', '#3F51B5'],
      ['#2196F3', '#03A9F4', '#00BCD4'],
      ['#009688', '#4CAF50', '#8BC34A'],
      ['#607D8B', '#795548', '#9E9E9E']
    ];
    return colors[index % colors.length];
  };

  const formatDocumentName = (name) => {
    // Convert snake_case to readable format
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderDocumentItem = ({ item, index }) => {
    const gradientColors = getRandomColor(index);

    return (
      <View style={styles.documentCardContainer}>
        <View style={styles.documentCard}>
          <View style={styles.iconSection}>
            <LinearGradient
              colors={gradientColors}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons 
                name="file-document-alert" 
                size={30} 
                color="#FFFFFF" 
              />
            </LinearGradient>
          </View>

          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
              {formatDocumentName(item)}
            </Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Document Expirat</Text>
            </View>
          </View>

          <View style={styles.warningIcon}>
            <Ionicons name="warning" size={24} color="#F44336" />
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>Documente Expirate</Text>
      <Text style={styles.headerSubtitle}>
        {documentsData.expiring_truck_documents} {documentsData.expiring_truck_documents === 1 ? 'document expirat' : 'documente expirate'}
      </Text>
    </View>
  );

  if (loading) {
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
                navigation.navigate("Main");
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#303F9F" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchExpiredDocuments}
          >
            <Ionicons name="refresh" size={24} color="#303F9F" />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#303F9F" />
          <Text style={styles.loadingText}>Se încarcă documentele expirate...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
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
                navigation.navigate("Main");
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#303F9F" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => authToken && fetchExpiredDocuments()}
          >
            <Ionicons name="refresh" size={24} color="#303F9F" />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => authToken && fetchExpiredDocuments()}
            >
              <Text style={styles.retryButtonText}>Încearcă din nou</Text>
            </TouchableOpacity>
          </View>
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
              navigation.navigate("Main");
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#303F9F" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchExpiredDocuments}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>

      {documentsData.expiring_truck_documents === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons 
              name="shield-check" 
              size={64} 
              color="#4CAF50" 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Niciun document expirat!</Text>
            <Text style={styles.emptyText}>
              Toate documentele pentru acest camion sunt valide.
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={fetchExpiredDocuments}
            >
              <Text style={styles.refreshButtonText}>Reîncarcă</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={documentsData.titles}
          renderItem={renderDocumentItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ExpiredDocuments;