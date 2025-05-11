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
  Linking,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

const DriversScreen = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [expandedDriverId, setExpandedDriverId] = useState(null);
  const [documents, setDocuments] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState({});
  // Move uploadStates to component level
  const [uploadStates, setUploadStates] = useState({});
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

  const fetchDriverDocuments = async (driverId) => {
    if (documents[driverId]) {
      // Documents already fetched, just toggle expanded state
      setExpandedDriverId(expandedDriverId === driverId ? null : driverId);
      return;
    }

    try {
      setLoadingDocuments(prev => ({ ...prev, [driverId]: true }));

      const response = await fetch(`${BASE_URL}personal-documents/${driverId}`, {
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
      setDocuments(prev => ({ ...prev, [driverId]: data }));
      setExpandedDriverId(driverId); // Expand the driver card
    } catch (err) {
      Alert.alert('Error', `Failed to fetch documents: ${err.message}`);
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocuments(prev => ({ ...prev, [driverId]: false }));
    }
  };

  // Helper functions for upload state - moved from renderDriverItem
  const updateDriverUploadState = (driverId, field, value) => {
    setUploadStates(prev => ({
      ...prev,
      [driverId]: {
        ...(prev[driverId] || {
          isUploadExpanded: false,
          selectedFile: null,
          documentTitle: '',
          documentCategory: '',
          expirationDate: null,
          isUploading: false
        }),
        [field]: value
      }
    }));
  };

  const toggleUploadForm = (driverId) => {
    updateDriverUploadState(
      driverId,
      'isUploadExpanded',
      !(uploadStates[driverId]?.isUploadExpanded || false)
    );
  };

  const handleFileSelect = async (driverId) => {
    try {
      // Using Expo Document Picker
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        updateDriverUploadState(driverId, 'selectedFile', result);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleDateChange = (driverId, event) => {
    // Get the date value from the input element
    const selectedDate = new Date(event.target.value);

    // Update the date if it's valid
    if (!isNaN(selectedDate.getTime())) {
      updateDriverUploadState(driverId, 'expirationDate', selectedDate);
    }
  };

  const handleUploadDocument = async (driverId) => {
    const state = uploadStates[driverId] || {
      isUploadExpanded: false,
      selectedFile: null,
      documentTitle: '',
      documentCategory: '',
      expirationDate: null,
      isUploading: false
    };

    if (!state.selectedFile || !state.documentTitle || !state.documentCategory || !state.expirationDate) {
      Alert.alert('Eroare', 'Toate câmpurile sunt obligatorii.');
      return;
    }

    updateDriverUploadState(driverId, 'isUploading', true);

    try {
      const formData = new FormData();
      formData.append('document', {
        uri: state.selectedFile.uri,
        type: state.selectedFile.mimeType || 'application/octet-stream',
        name: state.selectedFile.name,
      });
      formData.append('title', state.documentTitle);
      formData.append('category', state.documentCategory);
      formData.append('expiration_date', state.expirationDate.toISOString().split('T')[0]);

      const response = await fetch(`${BASE_URL}personal-documents/${driverId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        // Reset form and refresh documents
        setUploadStates(prev => ({
          ...prev,
          [driverId]: {
            isUploadExpanded: false,
            selectedFile: null,
            documentTitle: '',
            documentCategory: '',
            expirationDate: null,
            isUploading: false
          }
        }));

        // Refresh the documents list
        fetchDriverDocuments(driverId);
        Alert.alert('Succes', 'Documentul a fost încărcat cu succes.');
      } else {
        const errorData = await response.json();
        Alert.alert('Eroare', errorData.message || 'A apărut o eroare la încărcarea documentului.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Eroare', 'A apărut o eroare la încărcarea documentului.');
    } finally {
      updateDriverUploadState(driverId, 'isUploading', false);
    }
  };

  const openDocument = (url) => {
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', `Could not open document: ${err.message}`);
    });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => openDocument(item.document)}
    >
      <View style={styles.documentIcon}>
        <Ionicons name="document-text" size={24} color="#303F9F" />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.documentCategory}>Category: {item.category || 'N/A'}</Text>
        <Text style={styles.documentExpiration}>
          Expires: {formatDate(item.expiration_date)}
        </Text>
      </View>
      <Ionicons name="open-outline" size={20} color="#5C6BC0" />
    </TouchableOpacity>
  );

  // Document categories
  const documentCategories = [
    { label: 'Permis de conducere', value: 'driving_license' },
    { label: 'Carte de identitate', value: 'id_card' },
    { label: 'Certificat profesional', value: 'professional_certificate' },
    { label: 'Certificat medical', value: 'medical_certificate' },
    { label: 'Altele', value: 'other' }
  ];

  const renderDriverItem = ({ item }) => {
    const gradientColors = getRandomColor(item.id);
    const isOnRoad = item.driver && item.driver.on_road !== undefined ? item.driver.on_road : item.on_road || false;
    const rating = item.driver && item.driver.average_rating !== undefined ? item.driver.average_rating : (item.rating || 0);
    const isExpanded = expandedDriverId === item.id;
    const driverDocuments = documents[item.id] || [];
    const isLoadingDocs = loadingDocuments[item.id] || false;

    // Get this driver's upload state
    const driverUploadState = uploadStates[item.id] || {
      isUploadExpanded: false,
      selectedFile: null,
      documentTitle: '',
      documentCategory: '',
      expirationDate: null,
      showDatePicker: false,
      isUploading: false
    };

    return (
      <View>
        <View style={styles.driverCardContainer}>
          <View style={styles.driverCard}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={gradientColors}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>{getDriverInitials(item.name)}</Text>
              </LinearGradient>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: isOnRoad ? '#66BB6A' : '#EF5350' }]} />
              </View>
            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{item.name || 'Nume indisponibil'}</Text>
              {item.email && <Text style={styles.driverEmail}>{item.email}</Text>}

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, isExpanded && styles.activeButton]}
                  onPress={() => fetchDriverDocuments(item.id)}
                >
                  <Text style={styles.buttonText}>
                    {isExpanded ? 'Ascunde documente' : 'Vezi documente'}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="white"
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.addButton, driverUploadState.isUploadExpanded && styles.activeButton]}
                  onPress={() => toggleUploadForm(item.id)}
                >
                  <Text style={styles.buttonText}>
                    {driverUploadState.isUploadExpanded ? 'Anulează' : 'Adaugă documente'}
                  </Text>
                  <Ionicons
                    name={driverUploadState.isUploadExpanded ? "close" : "add"}
                    size={16}
                    color="white"
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              </View>

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
                  <Text style={[styles.detailValue, { color: isOnRoad ? '#66BB6A' : '#EF5350' }]}>
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

        {/* Document Upload Form */}
        {driverUploadState.isUploadExpanded && (
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadTitle}>Încarcă un document nou</Text>

            <TouchableOpacity
              style={styles.fileSelectButton}
              onPress={() => handleFileSelect(item.id)}
            >
              <Ionicons name="document-attach" size={20} color="#5C6BC0" />
              <Text style={styles.fileSelectText}>
                {driverUploadState.selectedFile?.name || 'Selectează un fișier'}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Titlu document"
              value={driverUploadState.documentTitle || ''}
              onChangeText={(text) => updateDriverUploadState(item.id, 'documentTitle', text)}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={driverUploadState.documentCategory || ''}
                onValueChange={(itemValue) => updateDriverUploadState(item.id, 'documentCategory', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selectează categoria" value="" />
                {documentCategories.map((category) => (
                  <Picker.Item key={category.value} label={category.label} value={category.value} />
                ))}
              </Picker>
            </View>

            <View style={styles.datePickerContainer}>
              <Ionicons name="calendar" size={20} color="#5C6BC0" style={styles.datePickerIcon} />
              <input
                type="date"
                style={{
                  flex: 1,
                  padding: 16,
                  height: 64,
                  fontSize: 17,
                  color: '#303F9F',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontWeight: '500',
                }}
                min={new Date().toISOString().split('T')[0]}
                value={driverUploadState.expirationDate ? driverUploadState.expirationDate.toISOString().split('T')[0] : ''}
                onChange={(event) => handleDateChange(item.id, event)}
                placeholder="Selectează data expirării"
              />
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleUploadDocument(item.id)}
              disabled={driverUploadState.isUploading}
            >
              {driverUploadState.isUploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="white" />
                  <Text style={styles.uploadButtonText}>Încarcă documentul</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Documents Section - Expanded view */}
        {isExpanded && (
          <View style={styles.documentsContainer}>
            {isLoadingDocs ? (
              <View style={styles.loadingDocsContainer}>
                <ActivityIndicator size="small" color="#5C6BC0" />
                <Text style={styles.loadingDocsText}>Se încarcă documentele...</Text>
              </View>
            ) : driverDocuments.length > 0 ? (
              <FlatList
                data={driverDocuments}
                renderItem={renderDocumentItem}
                keyExtractor={(doc) => doc.id.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.documentSeparator} />}
              />
            ) : (
              <View style={styles.noDocumentsContainer}>
                <Ionicons name="document-outline" size={24} color="#BDBDBD" />
                <Text style={styles.noDocumentsText}>Nu există documente disponibile</Text>
              </View>
            )}
          </View>
        )}
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
          {driverCount} {driverCount === 1 ? 'sofer' : 'soferi'} in cursa
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#5C6BC0" />
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