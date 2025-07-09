import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { styles, COLORS } from './EditComponentStyle'; // Import your styles

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

const EditTruckForm = ({ isVisible, onClose, truck, authToken, onTruckUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    last_service_date: '',
    next_service_date: '',
  });
  const [successToast, setSuccessToast] = useState(false);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const COLORS = {
  background: "#F4F5FB", // Light lavender background
  card: "#FFFFFF",       // White
  primary: "#5A5BDE",    // Purple-blue (primary)
  secondary: "#6F89FF",  // Light blue
  accent: "#FF8C66",     // Soft orange
  accent2: "#81C3F8",    // Sky blue
  dark: "#373A56",       // Dark navy
  medium: "#6B6F8D",     // Medium navy-gray
  light: "#A0A4C1",      // Light gray-purple
  border: "#E2E5F1",     // Light border
  success: "#63C6AE",    // Turquoise
  warning: "#FFBD59",    // Amber
  danger: "#FF7285",     // Soft red
};
  // Date picker states
  const [showLastServiceDatePicker, setShowLastServiceDatePicker] = useState(false);
  const [showNextServiceDatePicker, setShowNextServiceDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentDateType, setCurrentDateType] = useState(''); // 'last_service_date' or 'next_service_date'
  
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

  useEffect(() => {
    if (truck) {
      setFormData({
        license_plate: truck.license_plate || '',
        make: truck.make || '',
        model: truck.model || '',
        year: truck.year ? truck.year.toString() : '',
        vin: truck.vin || '',
        last_service_date: truck.last_service_date || '',
        next_service_date: truck.next_service_date || '',
      });
    }
  }, [truck]);

  // Animation for the success toast
  useEffect(() => {
    if (successToast) {
      // Fade in
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setSuccessToast(false);
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast, toastOpacity]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Date validation helper
  const isValidDateFormat = (dateString) => {
    // Basic format validation: YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    // Check if it's a valid date
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validateForm = () => {
    if (!formData.license_plate.trim()) {
      Alert.alert('Validation Error', 'Numărul de înmatriculare este obligatoriu');
      return false;
    }
    if (!formData.make.trim()) {
      Alert.alert('Validation Error', 'Marca este obligatorie');
      return false;
    }
    if (!formData.model.trim()) {
      Alert.alert('Validation Error', 'Modelul este obligatoriu');
      return false;
    }
    
    // Validate dates if they're not empty
    if (formData.last_service_date && !isValidDateFormat(formData.last_service_date)) {
      Alert.alert('Validation Error', 'Data ultimei revizii trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    if (formData.next_service_date && !isValidDateFormat(formData.next_service_date)) {
      Alert.alert('Validation Error', 'Data următoarei revizii trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    
    return true;
  };

  // In your EditTruckForm component, update the handleSubmit function:

const handleSubmit = async () => {
  if (!validateForm()) return;
  try {
    setLoading(true);
    const response = await fetch(`${BASE_URL}trucks/${truck.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }
    console.log('Response:', response);
    const updatedTruck = await response.json();
    
    // Show success toast
    setSuccessToast(true);
    
    // Call the callback to trigger refresh and auto-close
    if (onTruckUpdated) {
      onTruckUpdated(updatedTruck);
    }
    
    // Optional: Keep a brief success message
    setTimeout(() => {
      Alert.alert('Success', 'Camionul a fost actualizat cu succes!');
    }, 100);
    
  } catch (error) {
    Alert.alert('Error', `Failed to update truck: ${error.message}`);
    console.error('Error updating truck:', error);
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    onClose();
  };

  // Date picker functions
  const openDatePicker = (dateType) => {
    setCurrentDateType(dateType);
    const currentDate = formData[dateType] ? new Date(formData[dateType]) : new Date();
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth() + 1);
    
    if (dateType === 'last_service_date') {
      setShowLastServiceDatePicker(true);
    } else {
      setShowNextServiceDatePicker(true);
    }
  };

  const closeDatePicker = () => {
    setShowLastServiceDatePicker(false);
    setShowNextServiceDatePicker(false);
    setCurrentDateType('');
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      closeDatePicker();
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        handleChange(currentDateType, formattedDate);
      }
    }
  };

  const onCalendarDayPress = (day) => {
    handleChange(currentDateType, day.dateString);
    closeDatePicker();
  };

  const renderDateInput = (dateType, label) => {
    const dateValue = formData[dateType];
    const showPicker = dateType === 'last_service_date' ? showLastServiceDatePicker : showNextServiceDatePicker;
    
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => openDatePicker(dateType)}
        >
          <Text style={[
            styles.datePickerText,
            !dateValue && styles.placeholder
          ]}>
            {dateValue || 'YYYY-MM-DD'}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
        <Text style={styles.dateHint}>Format: YYYY-MM-DD</Text>
        
        {showPicker && (
          <Modal
            visible={showPicker}
            transparent={true}
            animationType="fade"
            onRequestClose={closeDatePicker}
          >
            <TouchableOpacity 
              style={styles.datePickerOverlay} 
              activeOpacity={1}
              onPress={closeDatePicker}
            >
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>{label}</Text>
                  <TouchableOpacity onPress={closeDatePicker} style={styles.datePickerCloseButton}>
                    <Text style={styles.datePickerCloseText}>×</Text>
                  </TouchableOpacity>
                </View>
                
                {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                  <DateTimePicker
                    value={dateValue ? new Date(dateValue) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                ) : (
                  <View style={styles.webDatePickerContent}>
                    {/* Year and Month Selectors */}
                    <View style={styles.selectorContainer}>
                      <View style={styles.selectorItem}>
                        <Text style={styles.selectorLabel}>Year</Text>
                        <Picker
                          selectedValue={selectedYear}
                          onValueChange={(year) => setSelectedYear(year)}
                          style={styles.selectorPicker}
                        >
                          {Array.from({ length: 20 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return <Picker.Item key={year} label={year.toString()} value={year} />;
                          })}
                        </Picker>
                      </View>

                      <View style={styles.selectorItem}>
                        <Text style={styles.selectorLabel}>Month</Text>
                        <Picker
                          selectedValue={selectedMonth}
                          onValueChange={(month) => setSelectedMonth(month)}
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
                      key={`calendar-${selectedYear}-${selectedMonth}`}
                      current={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`}
                      onDayPress={onCalendarDayPress}
                      markedDates={{
                        [dateValue || '']: {
                          selected: true,
                          selectedColor: COLORS.primary
                        }
                      }}
                      hideArrows={true}
                      disableMonthChange={true}
                      theme={{
                        calendarBackground: '#FFFFFF',
                        textSectionTitleColor: COLORS.primary,
                        selectedDayBackgroundColor: COLORS.primary,
                        selectedDayTextColor: '#FFFFFF',
                        todayTextColor: COLORS.primary,
                        dayTextColor: COLORS.dark,
                        textDisabledColor: COLORS.light,
                        arrowColor: COLORS.primary,
                        monthTextColor: COLORS.primary,
                        textDayFontWeight: '400',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500'
                      }}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, isMobile && styles.mobileModalContent]}>
          {/* Success Toast Notification */}
          {successToast && (
            <Animated.View style={[styles.successToast, { opacity: toastOpacity }]}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.card} />
              <Text style={styles.successToastText}>Camionul a fost actualizat!</Text>
            </Animated.View>
          )}
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Editeaza camionul</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.card} />
            </TouchableOpacity>
          </LinearGradient>
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Numar de inmatriculare</Text>
              <TextInput
                style={styles.input}
                value={formData.license_plate}
                onChangeText={(text) => handleChange('license_plate', text)}
                placeholder="Enter license plate"
                autoCapitalize="characters"
                placeholderTextColor={COLORS.light}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Marca</Text>
              <TextInput
                style={styles.input}
                value={formData.make}
                onChangeText={(text) => handleChange('make', text)}
                placeholder="Enter make"
                placeholderTextColor={COLORS.light}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Model</Text>
              <TextInput
                style={styles.input}
                value={formData.model}
                onChangeText={(text) => handleChange('model', text)}
                placeholder="Enter model"
                placeholderTextColor={COLORS.light}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>An</Text>
              <TextInput
                style={styles.input}
                value={formData.year}
                onChangeText={(text) => handleChange('year', text)}
                placeholder="Enter year"
                keyboardType="numeric"
                placeholderTextColor={COLORS.light}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Serie de sasiu/VIN</Text>
              <TextInput
                style={styles.input}
                value={formData.vin}
                onChangeText={(text) => handleChange('vin', text)}
                placeholder="Enter VIN"
                placeholderTextColor={COLORS.light}
              />
            </View>
            
            {/* Date inputs with pickers */}
            {renderDateInput('last_service_date', 'Data ultimei revizii')}
            {renderDateInput('next_service_date', 'Data urmatoarei revizii')}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: COLORS.dark }]}>Anuleaza</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.card} />
                ) : (
                  <Text style={styles.buttonText}>Salveaza</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTruckForm;