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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EditDocumentForm from './EditDocumentForm';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
// Import Calendar properly if you're using react-native-calendars
import { Calendar } from 'react-native-calendars';

const COLORS = {
  background: "#F4F5FB", // Light lavender background
  card: "#FFFFFF", // White
  primary: "#5A5BDE", // Purple-blue (primary)
  secondary: "#6F89FF", // Light blue
  accent: "#FF8C66", // Soft orange
  accent2: "#81C3F8", // Sky blue
  dark: "#373A56", // Dark navy
  medium: "#6B6F8D", // Medium navy-gray
  light: "#A0A4C1", // Light gray-purple
  border: "#E2E5F1", // Light border
  success: "#63C6AE", // Turquoise
  warning: "#FFBD59", // Amber
  danger: "#FF7285", // Soft red
};

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
const [editingDocumentId, setEditingDocumentId] = useState(null);
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

  const fetchDriverDocuments = async (driverId, forceRefresh = false) => {
  if (documents[driverId] && !forceRefresh) {
    // Documents already fetched, just toggle expanded state
    setExpandedDriverId(expandedDriverId === driverId ? null : driverId);
    return;
  }

    try {
      setLoadingDocuments(prev => ({ ...prev, [driverId]: true }));

      const response = await fetch(`${BASE_URL}personal-documents/driver/${driverId}`, {
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
        showDatePicker: false,
        isUploading: false,
        selectedYear: new Date().getFullYear(), // Add this
        selectedMonth: new Date().getMonth() + 1  // Add this
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
      if (result.type === 'success' || result.canceled === false) {
        const fileData = result.assets ? result.assets[0] : result;


        const cleanFileObject = {
          uri: fileData.uri,
          name: fileData.name || fileData.fileName || 'document',
          mimeType: fileData.mimeType || fileData.type || 'application/octet-stream',
          size: fileData.size || 0
        };
        console.log("Selected file:", cleanFileObject);
        // Update the state with the normalized file data
        updateDriverUploadState(driverId, 'selectedFile', cleanFileObject);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };
  const getDriverRoadStatus = (driverId) => {
    try {
      // Find the driver with the matching ID
      const driver = drivers.find(driver => driver.id === driverId);

      if (!driver) {
        console.warn(`Driver with ID ${driverId} not found`);
        return null;
      }

      // Check if driver object and on_road property exist
      if (driver.driver && typeof driver.driver.on_road !== 'undefined') {
        return driver.driver.on_road;
      }

      console.warn(`Driver state not available for driver ID ${driverId}`);
      return null;
    } catch (error) {
      console.error('Error getting driver state:', error);
      return null;
    }
  };
  // When using the file in the upload function, make sure to construct the form data properly:
  // In handleUploadDocument function:
  const handleUploadDocument = async (driverId) => {
    // Get the current state for this specific driver
    const driverState = uploadStates[driverId] || {
      isUploadExpanded: false,
      selectedFile: null,
      documentTitle: '',
      documentCategory: '',
      expirationDate: null,
      showDatePicker: false,
      isUploading: false
    };

    // Validate required fields
    if (!driverState.selectedFile) {
      console.log("No file selected for driver:", driverId);
      Alert.alert('Error', 'Please select a document to upload');
      return;
    }

    if (!driverState.documentTitle.trim()) {
      Alert.alert('Error', 'Please enter a document title');
      return;
    }

    if (!driverState.documentCategory.trim()) {
      Alert.alert('Error', 'Please select a document category');
      return;
    }

    try {
      // Set uploading state
      updateDriverUploadState(driverId, 'isUploading', true);

      const formData = new FormData();

      // Handle file upload differently based on platform
      if (driverState.selectedFile.uri.startsWith('data:')) {
        // Web platform with base64 data URL
        const response = await fetch(driverState.selectedFile.uri);
        const blob = await response.blob();
        formData.append('document', blob, driverState.selectedFile.name);
      } else {
        // Native platforms (iOS/Android)
        formData.append('document', {
          uri: driverState.selectedFile.uri,
          type: driverState.selectedFile.mimeType,
          name: driverState.selectedFile.name,
        });
      }

      formData.append('title', driverState.documentTitle);
      formData.append('category', driverState.documentCategory);

      if (driverState.expirationDate) {
        formData.append('expiration_date', driverState.expirationDate);
      }

      // Log FormData contents for debugging
      console.log("=== FormData Debug Info ===");
      console.log("Selected file object:", driverState.selectedFile);
      console.log("Document title:", driverState.documentTitle);
      console.log("Document category:", driverState.documentCategory);
      console.log("Expiration date:", driverState.expirationDate);

      // Upload the document
      const response = await fetch(`${BASE_URL}personal-documents/driver/${driverId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          // Don't set Content-Type for FormData - let the browser/RN handle it
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Document uploaded successfully:', result);

      // Success - reset the form
      updateDriverUploadState(driverId, 'selectedFile', null);
      updateDriverUploadState(driverId, 'documentTitle', '');
      updateDriverUploadState(driverId, 'documentCategory', '');
      updateDriverUploadState(driverId, 'expirationDate', null);
      updateDriverUploadState(driverId, 'isUploadExpanded', false);

      Alert.alert('Success', 'Document uploaded successfully');

      // Refresh documents list
      fetchDriverDocuments(driverId, true);

    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      // Reset uploading state
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



  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Fără dată de expirare';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Dată invalidă';

    const today = new Date();
    const expiringSoon = new Date(today);
    expiringSoon.setDate(today.getDate() + 30);

    const isExpired = date < today;
    const isExpiringSoon = !isExpired && date < expiringSoon;

    return {
      formattedDate: date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      isExpired,
      isExpiringSoon
    };
  };
  const renderDocumentItem = ({ item }) => {
  const dateInfo = formatDate(item.expiration_date);
  
  return (
    <View>
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
          <Text style={[
            styles.documentExpiration,
            dateInfo?.isExpired && { color: '#EF5350' },
            dateInfo?.isExpiringSoon && { color: '#FF9800' }
          ]}>
            Expires: {dateInfo?.formattedDate || 'Fără dată de expirare'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editDocumentButton}
          onPress={() => setEditingDocumentId(item.id)}
        >
          <Ionicons name="create-outline" size={20} color="#5C6BC0" />
          <Text style={styles.editDocumentText}>Editează</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Edit Form */}
      {editingDocumentId === item.id && (
  <EditDocumentForm
    document={item}
    driverId={item.user} // or however you get the driver ID
    onClose={() => setEditingDocumentId(null)}
    onSuccess={(driverId) => {
      fetchDriverDocuments(driverId, true); // Use the passed driverId
      setEditingDocumentId(null);
    }}
    authToken={authToken}
    BASE_URL={BASE_URL}
    documentCategories={documentCategories}
  />
)}
    </View>
  );
};

  // Document categories
  const documentCategories = [
    { label: 'Permis de conducere', value: 'permis_de_conducere' },
    { label: 'Carte de identitate', value: 'buletin' },
    { label: 'Contract de munca', value: 'contract_de_munca' },
    { label: 'Certificat medical', value: 'medical_certificate' },
    { label: 'Cereri de concediu', value: 'cereri_de_concediu' },
    { label: 'Atestat', value: 'atestate' }
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
                    {isOnRoad ? 'Pe drum' : 'In pauza'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Rol</Text>
                  <Text style={styles.detailValue}>
                    {item.is_driver && item.is_dispatcher ? 'Sofer & Dispecer' :
                      item.is_driver ? 'Sofer' :
                        item.is_dispatcher ? 'Dispecer' : 'Nespecificat'}
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

            {/* Replace the expiration date input section in the upload form with this updated code */}

            <View style={styles.datePickerContainer}>
              <Text style={styles.inputLabel}>DATA EXPIRǍRII</Text>
              <TouchableOpacity
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => updateDriverUploadState(item.id, 'showDatePicker', true)}
              >
                <Text style={driverUploadState.expirationDate ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {driverUploadState.expirationDate ?
                    new Date(driverUploadState.expirationDate).toLocaleDateString() :
                    'Selectează data'
                  }
                </Text>
                <Ionicons name="calendar" size={20} color="#5C6BC0" />
              </TouchableOpacity>

              {driverUploadState.showDatePicker && (
                <View style={styles.calendarContainer}>
                  {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={driverUploadState.expirationDate ? new Date(driverUploadState.expirationDate) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        updateDriverUploadState(item.id, 'showDatePicker', false);
                        if (selectedDate) {
                          // Format date as YYYY-MM-DD
                          const formattedDate = selectedDate.toISOString().split('T')[0];
                          updateDriverUploadState(item.id, 'expirationDate', formattedDate);
                        }
                      }}
                    />
                 ) : (
<View>
  {/* Year and Month Selectors */}
  <View style={styles.selectorContainer}>
    <View style={styles.selectorItemWithMargin}>
      <Text style={styles.selectorLabel}>Year</Text>
      <Picker
        selectedValue={driverUploadState.selectedYear || new Date().getFullYear()}
        onValueChange={(year) => {
          updateDriverUploadState(item.id, 'selectedYear', year);
        }}
        style={styles.selectorPicker}
      >
        {Array.from({ length: 20 }, (_, i) => {
          const year = new Date().getFullYear() + i;
          return <Picker.Item key={year} label={year.toString()} value={year} />;
        })}
      </Picker>
    </View>
    
    <View style={styles.selectorItemWithMarginLeft}>
      <Text style={styles.selectorLabel}>Month</Text>
      <Picker
        selectedValue={driverUploadState.selectedMonth || new Date().getMonth() + 1}
        onValueChange={(month) => {
          updateDriverUploadState(item.id, 'selectedMonth', month);
        }}
        style={styles.selectorPicker}
      >
        <Picker.Item label="January" value={1} />
        <Picker.Item label="February" value={2} />
        <Picker.Item label="March" value={3} />
        <Picker.Item label="April" value={4} />
        <Picker.Item label="May" value={5} />
        <Picker.Item label="June" value={6} />
        <Picker.Item label="July" value={7} />
        <Picker.Item label="August" value={8} />
        <Picker.Item label="September" value={9} />
        <Picker.Item label="October" value={10} />
        <Picker.Item label="November" value={11} />
        <Picker.Item label="December" value={12} />
      </Picker>
    </View>
  </View>

  {/* Calendar */}
  <Calendar
    key={`upload-calendar-${driverUploadState.selectedYear || new Date().getFullYear()}-${driverUploadState.selectedMonth || new Date().getMonth() + 1}`}
    current={`${driverUploadState.selectedYear || new Date().getFullYear()}-${String(driverUploadState.selectedMonth || new Date().getMonth() + 1).padStart(2, '0')}-01`}
    onDayPress={(day) => {
      updateDriverUploadState(item.id, 'expirationDate', day.dateString);
      updateDriverUploadState(item.id, 'showDatePicker', false);
    }}
    markedDates={{
      [driverUploadState.expirationDate || '']: {
        selected: true,
        selectedColor: "#5C6BC0"
      }
    }}
    hideArrows={true}
    disableMonthChange={true}
    theme={{
      calendarBackground: '#FFFFFF',
      textSectionTitleColor: '#303F9F',
      selectedDayBackgroundColor: '#5C6BC0',
      selectedDayTextColor: '#FFFFFF',
      todayTextColor: '#5C6BC0',
      dayTextColor: '#424242',
      textDisabledColor: '#BDBDBD',
      arrowColor: '#5C6BC0',
      monthTextColor: '#303F9F',
      textDayFontWeight: '400',
      textMonthFontWeight: 'bold',
      textDayHeaderFontWeight: '500'
    }}
  />
</View>
)}
                </View>
              )}
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
                  <Text style={styles.updateButtonText}>Încarcă documentul</Text>
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