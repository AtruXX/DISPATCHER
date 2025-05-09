import React, { useState } from 'react';
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
  FlatList,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
// Import Calendar properly if you're using react-native-calendars
import { Calendar } from 'react-native-calendars';

// Define styles directly in the file since the imported styles might be causing issues

import {styles } from './styles';
export default function CreateDriver() {
  const [formData, setFormData] = useState({
    license_plate: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    next_service_date: '',
    last_service_date: ''
  });
  const COLORS = {
    background: "#ECEFF1", // Light background from your TransportScreen
    card: "#F5F5F5", // White card background
    primary: "#303F9F", // Primary blue color
    secondary: "#3F51B5", // Secondary blue
    accent: "#5C6BC0", // Light blue accent
    lightAccent: "#7986CB", // Very light blue text
    text: {
      dark: "#424242", // Dark text
      medium: "#757575", // Medium text
      light: "#9E9E9E", // Light text
    },
    border: "#E0E0E0", // Light border
    success: "#66BB6A", // Green for success messages
    error: "#EF5350", // Red for errors
    warning: "#FFA726", // Orange for warnings
    available: "#81C784", // Green for available drivers
    unavailable: "#E57373", // Red for unavailable drivers
    white: "#FFFFFF", // White color for modal backgrounds
  };
  
  const [loading, setLoading] = useState(false);
  const [showNextServiceDateCalendar, setShowNextServiceDateCalendar] = useState(false);
  const [showLastServiceDateCalendar, setShowLastServiceDateCalendar] = useState(false);
  const [isMakeModalVisible, setMakeModalVisible] = useState(false);
  
  const navigation = useNavigation();

  // Predefined options for make dropdown
  const truckMakes = [
    'Volvo',
    'Mercedes-Benz',
    'Scania',
    'MAN',
    'DAF',
    'Iveco',
    'Renault',
    'Ford'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const selectMake = (make) => {
    setFormData(prev => ({ ...prev, make: make }));
    setMakeModalVisible(false);
  };
  
  const handleNextServiceDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowNextServiceDateCalendar(Platform.OS === 'ios');
    setFormData(prev => ({ 
      ...prev, 
      next_service_date: currentDate.toISOString().split('T')[0]
    }));
  };
  
  const handleLastServiceDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowLastServiceDateCalendar(Platform.OS === 'ios');
    setFormData(prev => ({ 
      ...prev, 
      last_service_date: currentDate.toISOString().split('T')[0]
    }));
  };

  const handleCalendarDayPress = (day) => {
    setFormData(prev => ({ ...prev, next_service_date: day.dateString }));
    setShowNextServiceDateCalendar(false);
  };
  const handleCalendarDayPressLat = (day) => {
    setFormData(prev => ({ ...prev, last_service_date: day.dateString }));
    setShowLastServiceDateCalendar(false);
  };
  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['license_plate', 'vin', 'make', 'model', 'year'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Fields', `Please complete the following fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setLoading(true);
    try {
        console.log(formData);
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
      console.log(token);
      const response = await fetch('https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/trucks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create truck');
      }
      
      const data = await response.json();
      Alert.alert('Success', 'Truck created successfully!');
      console.log('Success:', data);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        vechime:'',
        
      });
      
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Make selection modal
  const renderMakeModal = () => {
    return (
      <Modal
        visible={isMakeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMakeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Marca</Text>
              <TouchableOpacity onPress={() => setMakeModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={truckMakes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={() => selectMake(item)}
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Se incarca...</Text>
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
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Creare Camion</Text>
          <Text style={styles.headerSubtitle}>
            Completati detaliile pentru camion nou
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>NUMĂR ÎNMATRICULARE</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={formData.license_plate}
                  onChangeText={(text) => handleChange('license_plate', text)}
                  style={styles.input}
                  placeholder="B-123-ABC"
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>NUMĂR VIN</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={formData.vin}
                  onChangeText={(text) => handleChange('vin', text)}
                  style={styles.input}
                  placeholder="WDB9634031L123456"
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>MARCĂ</Text>
              <TouchableOpacity 
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setMakeModalVisible(true)}
              >
                <Text style={formData.make ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.make || 'Selectează marca'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>MODEL</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={formData.model}
                  onChangeText={(text) => handleChange('model', text)}
                  style={styles.input}
                  placeholder="Actros"
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>AN FABRICAȚIE</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={formData.year}
                  onChangeText={(text) => handleChange('year', text)}
                  style={styles.input}
                  placeholder="2023"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.text.light}
                />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>DATA ULTIMULUI SERVICE</Text>
              <TouchableOpacity 
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setShowLastServiceDateCalendar(true)}
              >
                <Text style={formData.last_service_date ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.last_service_date || 'Selectează data'}
                </Text>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              {showLastServiceDateCalendar && (
                <View style={styles.calendarContainer}>
                  {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={formData.last_service_date ? new Date(formData.last_service_date) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleLastServiceDateChange}
                    />
                  ) : (
                    <Calendar
                      onDayPress={handleCalendarDayPressLat}
                      markedDates={{
                        [formData.last_service_date]: {
                          selected: true,
                          selectedColor: COLORS.primary
                        }
                      }}
                      theme={{
                        calendarBackground: COLORS.card,
                        textSectionTitleColor: COLORS.text.dark,
                        selectedDayBackgroundColor: COLORS.primary,
                        selectedDayTextColor: COLORS.white,
                        todayTextColor: COLORS.accent,
                        dayTextColor: COLORS.text.dark,
                        textDisabledColor: COLORS.text.light,
                        arrowColor: COLORS.primary,
                        monthTextColor: COLORS.primary,
                        textDayFontWeight: '400',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500'
                      }}
                    />
                  )}
                </View>
              )}
            </View>
            
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>DATA URMĂTORULUI SERVICE</Text>
              <TouchableOpacity 
                style={[styles.inputContainer, styles.dropdownContainer]}
                onPress={() => setShowNextServiceDateCalendar(!showNextServiceDateCalendar)}
              >
                <Text style={formData.next_service_date ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {formData.next_service_date || 'Selectează data'}
                </Text>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              {showNextServiceDateCalendar && (
                <View style={styles.calendarContainer}>
                  {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={formData.next_service_date ? new Date(formData.next_service_date) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleNextServiceDateChange}
                    />
                  ) : (
                    <Calendar
                      onDayPress={handleCalendarDayPress}
                      markedDates={{
                        [formData.next_service_date]: {
                          selected: true,
                          selectedColor: COLORS.primary
                        }
                      }}
                      theme={{
                        calendarBackground: COLORS.card,
                        textSectionTitleColor: COLORS.text.dark,
                        selectedDayBackgroundColor: COLORS.primary,
                        selectedDayTextColor: COLORS.white,
                        todayTextColor: COLORS.accent,
                        dayTextColor: COLORS.text.dark,
                        textDisabledColor: COLORS.text.light,
                        arrowColor: COLORS.primary,
                        monthTextColor: COLORS.primary,
                        textDayFontWeight: '400',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500'
                      }}
                    />
                  )}
                </View>
              )}
            </View>
            <View style={styles.inputWrapper} />
          </View>

          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText}>CREEAZĂ CAMION</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {renderMakeModal()}
    </SafeAreaView>
  );
}