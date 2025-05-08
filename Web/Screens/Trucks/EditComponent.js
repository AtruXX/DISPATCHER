import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
      // Also keep the alert for additional confirmation
      Alert.alert(
        'Success',
        'Camionul a fost actualizat cu succes!',
        [{ text: 'OK', onPress: () => {
          if (onTruckUpdated) {
            onTruckUpdated(updatedTruck);
          }
          onClose();
        }}]
      );
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

  const renderDateInput = (dateType) => {
    const placeholder = dateType === 'last_service_date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD';
    
    return (
      <TextInput
        style={styles.input}
        value={formData[dateType]}
        onChangeText={(text) => handleChange(dateType, text)}
        placeholder={placeholder}
        placeholderTextColor={COLORS.light}
        keyboardType="numeric"
      />
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
        <View style={styles.modalContent}>
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
          <ScrollView style={styles.formContainer}>
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Data ultimei revizii</Text>
              {renderDateInput('last_service_date')}
              <Text style={styles.dateHint}>Format: YYYY-MM-DD</Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Data urmatoarei revizii</Text>
              {renderDateInput('next_service_date')}
              <Text style={styles.dateHint}>Format: YYYY-MM-DD</Text>
            </View>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 58, 86, 0.5)', // Dark navy with opacity
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#A7A9AF',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  closeButton: {
    padding: 6,
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: COLORS.medium,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    color: COLORS.dark,
  },
  dateInput: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: COLORS.dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: COLORS.light,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Success toast styles
  successToast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.success,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  successToastText: {
    color: COLORS.card,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // Date input hint text
  dateHint: {
    fontSize: 12,
    color: COLORS.medium,
    marginTop: 2,
    fontStyle: 'italic'
  }
});

export default EditTruckForm;