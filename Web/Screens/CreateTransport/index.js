import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, COLORS } from './styles';
const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

export default function CreateTransportPage() {
  const [formData, setFormData] = useState({
    truck_combination: '',
    trailer_type: '',
    trailer_number: '',
    detraction: '', // Will now be a dropdown selection
    origin_city: '',
    destination_city: '',
    goods_type: '', // Will now be a dropdown selection
    driver: null // Will store the selected driver ID
  });
  const [authToken, setAuthToken] = useState(null);

  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDriverModalVisible, setDriverModalVisible] = useState(false);
  const [isTruckModalVisible, setTruckModalVisible] = useState(false);
  const [isTrailerModalVisible, setTrailerModalVisible] = useState(false);
  const [isDetractionModalVisible, setDetractionModalVisible] = useState(false);
  const [isGoodsTypeModalVisible, setGoodsTypeModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  // Predefined options for dropdowns
  const truckCombinations = [
    'Cap tractor + Semiremorcă',
    'Cap tractor + Tandem',
    'Autoutilitară',
    'Solo'
  ];

  const trailerTypes = [
    'Prelată',
    'Frigorifică',
    'Cisterna',
    'Platformă',
    'Container',
    'Box'
  ];

  // New dropdown options for Tip Tractare
  const detractionTypes = [
    '4x2',
    '6x2',
    '6x4',
    '8x4'
  ];

  // New dropdown options for Tip Marfa
  const goodsTypes = [
    'Marfă generală',
    'Frigorifică',
    'ADR (substanțe periculoase)',
    'Textile',
    'Mobilier',
    'Autoturisme',
    'Băuturi',
    'Alimente uscate'
  ];

  // Mock data for testing - replace with actual API call
  const mockDriversData = {
    "number_of_drivers": 1,
    "drivers": [
      {
        "id": 2,
        "driver": {
          "average_rating": 0.0,
          "on_road": false
        },
        "dispatcher": null,
        "company": "C&C Logistics",
        "last_login": "2025-05-04T11:39:00.341871Z",
        "email": "pop-ion@gmail.com",
        "name": "Pop Ion",
        "is_active": true,
        "is_admin": false,
        "is_dispatcher": false,
        "is_driver": true
      }
    ]
  };
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
  // Fetch drivers on component mount
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
      console.log(authToken)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched drivers:', data);
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectDriver = (driver) => {
    setSelectedDriver(driver);
    setFormData(prev => ({ ...prev, driver: driver.id }));
    setDriverModalVisible(false);
  };

  const selectTruckCombination = (combination) => {
    setFormData(prev => ({ ...prev, truck_combination: combination }));
    setTruckModalVisible(false);
  };

  const selectTrailerType = (type) => {
    setFormData(prev => ({ ...prev, trailer_type: type }));
    setTrailerModalVisible(false);
  };

  // New functions for the new dropdowns
  const selectDetraction = (detraction) => {
    setFormData(prev => ({ ...prev, detraction: detraction }));
    setDetractionModalVisible(false);
  };

  const selectGoodsType = (goodsType) => {
    setFormData(prev => ({ ...prev, goods_type: goodsType }));
    setGoodsTypeModalVisible(false);
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['truck_combination', 'trailer_type', 'trailer_number', 'origin_city', 'destination_city', 'goods_type', 'driver'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Missing Fields', `Please complete the following fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/transports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transport');
      }

      const data = await response.json();
      navigation.navigate('Route', { transportId: data.id });
      Alert.alert('Success', 'Transport created successfully!');
      console.log('Success:', data);

      // Reset form
      setFormData({
        truck_combination: '',
        trailer_type: '',
        trailer_number: '',
        detraction: '',
        origin_city: '',
        destination_city: '',
        goods_type: '',
        driver: null
      });
      setSelectedDriver(null);

    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Driver selection modal
  const renderDriverModal = () => {
    return (
      <Modal
        visible={isDriverModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDriverModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Șofer</Text>
              <TouchableOpacity onPress={() => setDriverModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={drivers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.driverItem}
                  onPress={() => selectDriver(item)}
                >
                  <Text style={styles.driverName}>{item.name}</Text>
                  <Text style={styles.driverCompany}>{item.company}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    <Text style={[
                      styles.driverStatus,
                      item.is_active ? styles.driverStatusActive : styles.driverStatusInactive
                    ]}>
                      {item.is_active ? 'Activ' : 'Inactiv'}
                    </Text>
                    <Text style={[
                      styles.driverStatus,
                      item.driver && !item.driver.on_road ? styles.driverStatusAvailable : styles.driverStatusOnRoad
                    ]}>
                      {item.driver && !item.driver.on_road ? 'Disponibil' : 'În cursă'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nu există șoferi disponibili</Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  };

  // Truck combination selection modal
  const renderTruckModal = () => {
    return (
      <Modal
        visible={isTruckModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTruckModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Combinație Camion</Text>
              <TouchableOpacity onPress={() => setTruckModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={truckCombinations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectTruckCombination(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // Trailer type selection modal
  const renderTrailerModal = () => {
    return (
      <Modal
        visible={isTrailerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTrailerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Tip Remorcă</Text>
              <TouchableOpacity onPress={() => setTrailerModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={trailerTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectTrailerType(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // New modal for Detraction (Tip Tractare)
  const renderDetractionModal = () => {
    return (
      <Modal
        visible={isDetractionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetractionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Tip Tractare</Text>
              <TouchableOpacity onPress={() => setDetractionModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={detractionTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectDetraction(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // New modal for Goods Type (Tip Marfa)
  const renderGoodsTypeModal = () => {
    return (
      <Modal
        visible={isGoodsTypeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGoodsTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Tip Marfă</Text>
              <TouchableOpacity onPress={() => setGoodsTypeModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={goodsTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectGoodsType(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  if (loading && !isDriverModalVisible && !isTruckModalVisible && !isTrailerModalVisible && !isDetractionModalVisible && !isGoodsTypeModalVisible) {
    return (
      <SafeAreaView style={styles.loadingContainer || { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <View style={styles.loadingCard || { padding: 20, backgroundColor: COLORS.white, borderRadius: 10, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText || { marginTop: 10, color: COLORS.primary, fontSize: 16 }}>Se incarca...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container || { flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.navigationHeader || { flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
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
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchDrivers}
        >
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer || { padding: 16 }}>
        {/* Header Card */}
        <View style={styles.headerCard || { backgroundColor: COLORS.white, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <Text style={styles.headerTitle || { fontSize: 24, fontWeight: 'bold', color: COLORS.primary }}>Creare Transport</Text>
          <Text style={styles.headerSubtitle || { fontSize: 16, color: COLORS.text.light, marginTop: 8 }}>
            Completati detaliile pentru transport nou
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard || { backgroundColor: COLORS.white, borderRadius: 10, padding: 16 }}>
          {/* Driver Selection */}
          <View style={styles.driverSection}>
            <Text style={styles.sectionTitle}>SELECTEAZĂ ȘOFER</Text>
            <TouchableOpacity
              style={styles.driverSelector}
              onPress={() => setDriverModalVisible(true)}
            >
              {selectedDriver ? (
                <View style={styles.selectedDriverContainer}>
                  <Text style={styles.selectedDriverName}>{selectedDriver.name}</Text>
                  <Text style={styles.selectedDriverCompany}>{selectedDriver.company}</Text>
                </View>
              ) : (
                <Text style={styles.driverPlaceholder}>Apasă pentru a selecta un șofer</Text>
              )}
              <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Truck Combination Selection */}
          <View style={styles.inputRow || { flexDirection: 'row', marginBottom: 16 }}>
            <View style={styles.inputWrapper || { flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                COMBINATIE CAMION
              </Text>
              <TouchableOpacity
                style={[styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }, styles.dropdownContainer]}
                onPress={() => setTruckModalVisible(true)}
              >
                <Text style={formData.truck_combination ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.truck_combination || 'Selectează combinație'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper || { flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                TIP REMORCĂ
              </Text>
              <TouchableOpacity
                style={[styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }, styles.dropdownContainer]}
                onPress={() => setTrailerModalVisible(true)}
              >
                <Text style={formData.trailer_type ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.trailer_type || 'Selectează tip remorcă'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Other Form Fields */}
          <View style={styles.inputRow || { flexDirection: 'row', marginBottom: 16 }}>
            <View style={styles.inputWrapper || { flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                NUMĂR REMORCĂ
              </Text>
              <View style={styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }}>
                <TextInput
                  value={formData.trailer_number}
                  onChangeText={(text) => handleChange('trailer_number', text)}
                  style={styles.input || { padding: 12, fontSize: 16 }}
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>

            <View style={styles.inputWrapper || { flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                TIP TRACTARE
              </Text>
              {/* Changed from TextInput to TouchableOpacity for dropdown */}
              <TouchableOpacity
                style={[styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }, styles.dropdownContainer]}
                onPress={() => setDetractionModalVisible(true)}
              >
                <Text style={formData.detraction ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.detraction || 'Selectează tip tractare'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputRow || { flexDirection: 'row', marginBottom: 16 }}>
            <View style={styles.inputWrapper || { flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                ORAȘ ORIGINE
              </Text>
              <View style={styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }}>
                <TextInput
                  value={formData.origin_city}
                  onChangeText={(text) => handleChange('origin_city', text)}
                  style={styles.input || { padding: 12, fontSize: 16 }}
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>

            <View style={styles.inputWrapper || { flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                ORAȘ DESTINAȚIE
              </Text>
              <View style={styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }}>
                <TextInput
                  value={formData.destination_city}
                  onChangeText={(text) => handleChange('destination_city', text)}
                  style={styles.input || { padding: 12, fontSize: 16 }}
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputRow || { flexDirection: 'row', marginBottom: 16 }}>
            <View style={styles.inputWrapper || { flex: 1 }}>
              <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                TIP MARFĂ
              </Text>
              {/* Changed from TextInput to TouchableOpacity for dropdown */}
              <TouchableOpacity
                style={[styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }, styles.dropdownContainer]}
                onPress={() => setGoodsTypeModalVisible(true)}
              >
                <Text style={formData.goods_type ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.goods_type || 'Selectează tip marfă'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper || { flex: 1, marginLeft: 8 }} />
          </View>

          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            style={styles.submitButtonGradient || { borderRadius: 8, marginTop: 16 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              style={styles.submitButton || { padding: 16, alignItems: 'center' }}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText || { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>CREEAZĂ TRANSPORT</Text>
            </TouchableOpacity>
          </LinearGradient>
          
        </View>
      </ScrollView>

      {renderDriverModal()}
      {renderTruckModal()}
      {renderTrailerModal()}
      {renderDetractionModal()} {/* New modal */}
      {renderGoodsTypeModal()} {/* New modal */}
    </SafeAreaView>
  );
}