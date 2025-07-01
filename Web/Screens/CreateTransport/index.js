import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform, StyleSheet, TouchableOpacity, Image, Easing, Animated, ActivityIndicator, Linking, Alert, Picker, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { styles } from "./styles";

const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

const FormPage = () => {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    driver: '',
    truck: '',
    trailer: '',
    arrival: '', // arrival city
    departure: '', // departure city
    type_goods: '',
    day_expected_to_deliver: '',
    client_email: '',
    // Auto-filled fields
    truck_license_plate: '',
    truck_make: '',
    truck_model: '',
    trailer_license_plate: '',
    trailer_type: '',
  });
  
  const [error, setError] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trucksData, setTrucksData] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [trailer, setTrailer] = useState([]);
  
  // Modal states for custom dropdowns
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showGoodsModal, setShowGoodsModal] = useState(false);
  
  // Calendar states - only for delivery date
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);

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
      fetchTrucks();
      fetchTrailers();
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
      console.log('Fetched trucks:', data);
      
      // Handle different API response formats
      if (Array.isArray(data)) {
        setTrucksData(data);
      } else if (data.trucks && Array.isArray(data.trucks)) {
        setTrucksData(data.trucks);
      } else {
        console.warn('Unexpected trucks data format:', data);
        setTrucksData([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setTrucksData([]); // Set empty array on error
      Alert.alert('Error', 'Failed to fetch trucks data');
      console.error('Error fetching trucks:', err);
    }
  };

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}trailers/`, {
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
      console.log('Fetched trailers:', data);
      
      // Handle different API response formats
      if (Array.isArray(data)) {
        setTrailer(data);
      } else if (data.trailers && Array.isArray(data.trailers)) {
        setTrailer(data.trailers);
      } else {
        console.warn('Unexpected trailers data format:', data);
        setTrailer([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setTrailer([]); // Set empty array on error
      Alert.alert('Error', 'Failed to fetch trailers data');
      console.error('Error fetching trailers:', err);
    }
  };

  const goodsTypeOptions = [
    { value: '', label: 'Selecteaza tipul de marfa transportata' },
    { value: 'Electronice', label: 'Electronice' },
    { value: 'Materiale de constructii', label: 'Materiale de constructii' },
    { value: 'Marfuri alimentare proaspete', label: 'Marfuri alimentare proaspete(Fructe/legume)' },
    { value: 'Marfuri alimentare congelate', label: 'Marfuri alimentare congelate' },
    { value: 'Combustibili', label: 'Combustibili' },
    { value: 'Farmaceutice', label: 'Farmaceutice' },
    { value: 'Cosmetice', label: 'Cosmetice' },
    { value: 'Produse perisabile', label: 'Perisabile' },
  ];

  // Calendar handlers - only for delivery date
  const handleDeliveryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDeliveryCalendar(Platform.OS === 'ios');
    setFormData(prev => ({
      ...prev,
      day_expected_to_deliver: currentDate.toISOString().split('T')[0]
    }));
  };

  const handleDeliveryCalendarDayPress = (day) => {
    setFormData(prev => ({ ...prev, day_expected_to_deliver: day.dateString }));
    setShowDeliveryCalendar(false);
  };

  // Custom dropdown handlers
  const handleDriverSelect = (driver) => {
    setFormData(prev => ({ ...prev, driver: driver.id }));
    setShowDriverModal(false);
  };

  const handleTruckSelect = (truck) => {
    setFormData(prev => ({ 
      ...prev, 
      truck: truck.id,
      truck_license_plate: truck.license_plate,
      truck_make: truck.make,
      truck_model: truck.model
    }));
    setShowTruckModal(false);
  };

  const handleTrailerSelect = (trailerItem) => {
    setFormData(prev => ({ 
      ...prev, 
      trailer: trailerItem.id,
      trailer_license_plate: trailerItem.license_plate,
      trailer_type: trailerItem.type
    }));
    setShowTrailerModal(false);
  };

  const handleGoodsSelect = (goods) => {
    setFormData(prev => ({ ...prev, type_goods: goods.value }));
    setShowGoodsModal(false);
  };

  // Get selected item labels
  const getSelectedDriverLabel = () => {
    const selected = drivers.find(d => d.id === formData.driver);
    return selected ? selected.name : 'Select Driver';
  };

  const getSelectedTruckLabel = () => {
    const selected = trucksData.find(t => t.id === formData.truck);
    return selected ? `${selected.license_plate} - ${selected.model}` : 'Select Truck';
  };

  const getSelectedTrailerLabel = () => {
    const selected = trailer.find(t => t.id === formData.trailer);
    return selected ? `${selected.license_plate} - ${selected.type}` : 'Select Trailer';
  };

  const getSelectedGoodsLabel = () => {
    const selected = goodsTypeOptions.find(g => g.value === formData.type_goods);
    return selected ? selected.label : 'Selecteaza tipul de marfa transportata';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.driver) newErrors.driver = 'Driver is required';
    if (!formData.truck) newErrors.truck = 'Truck is required';
    if (!formData.trailer) newErrors.trailer = 'Trailer is required';
    if (!formData.arrival.trim()) newErrors.arrival = 'Arrival city is required';
    if (!formData.departure.trim()) newErrors.departure = 'Departure city is required';
    if (!formData.type_goods) newErrors.type_goods = 'Type of goods is required';
    if (!formData.day_expected_to_deliver) newErrors.day_expected_to_deliver = 'Expected delivery date is required';
    if (!formData.client_email.trim()) newErrors.client_email = 'Client email is required';

    // Email validation
    if (formData.client_email && !/\S+@\S+\.\S+/.test(formData.client_email)) {
      newErrors.client_email = 'Please enter a valid email address';
    }

    // Date validation - only for delivery date
    if (formData.day_expected_to_deliver) {
      const deliveryDate = new Date(formData.day_expected_to_deliver);
      const today = new Date();
      if (deliveryDate < today) {
        newErrors.day_expected_to_deliver = 'Delivery date cannot be in the past';
      }
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      try {
        const response = await fetch(`${BASE_URL}transports`, {
          method: 'POST',
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          Alert.alert("Success", "Form submitted successfully!");
          handleReset();
        } else {
          throw new Error('Failed to submit form');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        setError({ submit: 'Failed to submit form. Please try again.' });
      } finally {
        setSubmitted(false);
      }
    } else {
      setError(validationErrors);
    }
  };

  const handleReset = () => {
    setFormData({
      driver: '',
      truck: '',
      trailer: '',
      arrival: '', // arrival city
      departure: '', // departure city
      type_goods: '',
      day_expected_to_deliver: '',
      client_email: '',
      truck_license_plate: '',
      truck_make: '',
      truck_model: '',
      trailer_license_plate: '',
      trailer_type: '',
    });
    setError({});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#5C6BC0" />
          <Text style={styles.loadingText}>Se incarca...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Transport Form</Text>
          <Text style={styles.headerSubtitle}>Create new transport assignment</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Driver Selection */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>DRIVER *</Text>
            <TouchableOpacity
              style={[styles.inputContainer, styles.dropdownContainer]}
              onPress={() => setShowDriverModal(true)}
            >
              <Text style={formData.driver ? styles.dropdownText : styles.dropdownPlaceholder}>
                {getSelectedDriverLabel()}
              </Text>
              <Feather name="chevron-down" size={20} color="#5C6BC0" />
            </TouchableOpacity>
            {error.driver && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.driver}</Text>}
          </View>

          {/* Vehicle Selection Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>TRUCK *</Text>
              <TouchableOpacity
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setShowTruckModal(true)}
              >
                <Text style={formData.truck ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {getSelectedTruckLabel()}
                </Text>
                <Feather name="chevron-down" size={20} color="#5C6BC0" />
              </TouchableOpacity>
              {error.truck && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.truck}</Text>}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>TRAILER *</Text>
              <TouchableOpacity
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setShowTrailerModal(true)}
              >
                <Text style={formData.trailer ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {getSelectedTrailerLabel()}
                </Text>
                <Feather name="chevron-down" size={20} color="#5C6BC0" />
              </TouchableOpacity>
              {error.trailer && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.trailer}</Text>}
            </View>
          </View>

          {/* Auto-filled Vehicle Details */}
          {formData.truck && (
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>NUMAR INMATRICULARE CAMION</Text>
                <View style={[styles.inputContainer, { backgroundColor: '#F0F0F0' }]}>
                  <Text style={styles.input}>{formData.truck_license_plate}</Text>
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>MARCA / MODEL</Text>
                <View style={[styles.inputContainer, { backgroundColor: '#F0F0F0' }]}>
                  <Text style={styles.input}>{formData.truck_make} {formData.truck_model}</Text>
                </View>
              </View>
            </View>
          )}

          {formData.trailer && (
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>NUMAR INMATRICULARE REMORCA</Text>
                <View style={[styles.inputContainer, { backgroundColor: '#F0F0F0' }]}>
                  <Text style={styles.input}>{formData.trailer_license_plate}</Text>
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>TIP REMORCA</Text>
                <View style={[styles.inputContainer, { backgroundColor: '#F0F0F0' }]}>
                  <Text style={styles.input}>{formData.trailer_type}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Cities Row */}
          <View style={styles.inputRow}>
            {/* Arrival City */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>ARRIVAL CITY *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={formData.arrival}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, arrival: text }))}
                  placeholder="Enter arrival city"
                />
              </View>
              {error.arrival && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.arrival}</Text>}
            </View>

            {/* Departure City */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>DEPARTURE CITY *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={formData.departure}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, departure: text }))}
                  placeholder="Enter departure city"
                />
              </View>
              {error.departure && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.departure}</Text>}
            </View>
          </View>

          {/* Goods and Delivery Row */}
          <View style={styles.inputRow}>
            {/* Type of Goods */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>TYPE OF GOODS *</Text>
              <TouchableOpacity
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setShowGoodsModal(true)}
              >
                <Text style={formData.type_goods ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {getSelectedGoodsLabel()}
                </Text>
                <Feather name="chevron-down" size={20} color="#5C6BC0" />
              </TouchableOpacity>
              {error.type_goods && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.type_goods}</Text>}
            </View>

            {/* Expected Delivery Date */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>EXPECTED DELIVERY DATE *</Text>
              <TouchableOpacity
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setShowDeliveryCalendar(true)}
              >
                <Text style={formData.day_expected_to_deliver ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.day_expected_to_deliver ? new Date(formData.day_expected_to_deliver).toLocaleDateString() : 'Select delivery date'}
                </Text>
                <Feather name="calendar" size={20} color="#5C6BC0" />
              </TouchableOpacity>

              {showDeliveryCalendar && (
                <View style={styles.calendarContainer}>
                  {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={formData.day_expected_to_deliver ? new Date(formData.day_expected_to_deliver) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDeliveryDateChange}
                    />
                  ) : (
                    <Calendar
                      onDayPress={handleDeliveryCalendarDayPress}
                      markedDates={{
                        [formData.day_expected_to_deliver]: {
                          selected: true,
                          selectedColor: "#303F9F"
                        }
                      }}
                      theme={{
                        calendarBackground: '#F5F5F5',
                        textSectionTitleColor: '#424242',
                        selectedDayBackgroundColor: '#303F9F',
                        selectedDayTextColor: '#FFFFFF',
                        todayTextColor: '#5C6BC0',
                        dayTextColor: '#424242',
                        textDisabledColor: '#9E9E9E',
                        arrowColor: '#303F9F',
                        monthTextColor: '#303F9F',
                        textDayFontWeight: '400',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500'
                      }}
                    />
                  )}
                </View>
              )}
              {error.day_expected_to_deliver && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.day_expected_to_deliver}</Text>}
            </View>
          </View>

          {/* Client Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>CLIENT EMAIL *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.client_email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, client_email: text }))}
                placeholder="client@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {error.client_email && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>{error.client_email}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButtonGradient}
            onPress={handleSubmit}
            disabled={submitted}
          >
            <View style={styles.submitButton}>
              {submitted ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Transport</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Submit Error */}
          {error.submit && <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 8 }}>{error.submit}</Text>}
        </View>

        {/* Custom Modals */}
        {/* Driver Modal */}
        {showDriverModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Driver</Text>
                <TouchableOpacity onPress={() => setShowDriverModal(false)}>
                  <Feather name="x" size={24} color="#303F9F" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {Array.isArray(drivers) && drivers.map(driver => (
                  <TouchableOpacity
                    key={driver.id}
                    style={styles.optionItem}
                    onPress={() => handleDriverSelect(driver)}
                  >
                    <Text style={styles.optionText}>{driver.name || 'Unknown Driver'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Truck Modal */}
        {showTruckModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Truck</Text>
                <TouchableOpacity onPress={() => setShowTruckModal(false)}>
                  <Feather name="x" size={24} color="#303F9F" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {Array.isArray(trucksData) && trucksData.map(truck => (
                  <TouchableOpacity
                    key={truck.id}
                    style={styles.optionItem}
                    onPress={() => handleTruckSelect(truck)}
                  >
                    <Text style={styles.optionText}>
                      {truck.license_plate || 'N/A'} - {truck.model || 'N/A'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Trailer Modal */}
        {showTrailerModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Trailer</Text>
                <TouchableOpacity onPress={() => setShowTrailerModal(false)}>
                  <Feather name="x" size={24} color="#303F9F" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {Array.isArray(trailer) && trailer.map(trailerItem => (
                  <TouchableOpacity
                    key={trailerItem.id}
                    style={styles.optionItem}
                    onPress={() => handleTrailerSelect(trailerItem)}
                  >
                    <Text style={styles.optionText}>
                      {trailerItem.license_plate || 'N/A'} - {trailerItem.type || 'N/A'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Goods Type Modal */}
        {showGoodsModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Type of Goods</Text>
                <TouchableOpacity onPress={() => setShowGoodsModal(false)}>
                  <Feather name="x" size={24} color="#303F9F" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {goodsTypeOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.optionItem}
                    onPress={() => handleGoodsSelect(option)}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FormPage;