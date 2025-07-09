import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal,
  Dimensions,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { styles, COLORS } from './AddDocumentStyles.js'; // Import your styles

const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

const DOCUMENT_TYPES = [
  { label: 'Certificat de conformitate', value: 'certificat_conformitate' },
  { label: 'Contract de asigurare', value: 'contract_asigurare' },
  { label: 'Inspectii tehnice periodice', value: 'inspectii_tehnice' },
  { label: 'Carte de identitate a vehiculului', value: 'carte_identitate_vehicul' },
  { label: 'EC Certificat de conformitate', value: 'ec_certificat_conformitate' },
  { label: 'Copie conforma', value: 'copie_conforma' },
  { label: 'Procedura de instalare', value: 'procedura_instalare' },
];

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

const AddTrailerDocumentForm = ({ isVisible, onClose, onDocumentAdded, trailerId, authTokenForm }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    expiration_date: '',
    issuing_date: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  
  // Date picker states
  const [showIssuingDatePicker, setShowIssuingDatePicker] = useState(false);
  const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentDateType, setCurrentDateType] = useState(''); // 'issuing' or 'expiration'

  const COLORS = {
    background: "#F4F5FB",
    card: "#FFFFFF",
    primary: "#5A5BDE",
    secondary: "#6F89FF",
    accent: "#FF8C66",
    accent2: "#81C3F8",
    dark: "#373A56",
    medium: "#6B6F8D",
    light: "#A0A4C1",
    border: "#E2E5F1",
    success: "#63C6AE",
    warning: "#FFBD59",
    danger: "#FF7285",
    selected: "#E8F5E8",
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isVisible) {
      setFormData({
        title: '',
        description: '',
        category: '',
        expiration_date: '',
        issuing_date: '',
      });
      setSelectedFile(null);
      setShowDropdown(false);
      setShowIssuingDatePicker(false);
      setShowExpirationDatePicker(false);
    }
  }, [isVisible]);

  // Success toast timer
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        setSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File upload handler for React Native with expo-document-picker
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/jpg',
          'image/png'
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected file:', file);
        
        // Create a file object compatible with your existing code
        const selectedFileData = {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
          size: file.size,
        };
        
        setSelectedFile(selectedFileData);
      } else {
        console.log('Document picker was cancelled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const selectCategory = (category) => {
    handleChange('category', category.value);
    setShowDropdown(false);
  };

  const getSelectedCategoryLabel = () => {
    const selected = DOCUMENT_TYPES.find(type => type.value === formData.category);
    return selected ? selected.label : 'Selectează categoria documentului';
  };

  // Date validation helper
  const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Eroare', 'Numele documentului este obligatoriu');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Eroare', 'Categoria documentului este obligatorie');
      return false;
    }
    if (!selectedFile) {
      Alert.alert('Eroare', 'Vă rugăm să atașați un fișier');
      return false;
    }
    
    // Validate dates if they're not empty
    if (formData.issuing_date && !isValidDateFormat(formData.issuing_date)) {
      Alert.alert('Eroare', 'Data emiterii trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    if (formData.expiration_date && !isValidDateFormat(formData.expiration_date)) {
      Alert.alert('Eroare', 'Data de sfârșit a valabilității trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Create FormData for React Native
      const formDataToSubmit = new FormData();
      
      // Add form fields
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('category', formData.category);
      
      // Only append dates if they have values
      if (formData.expiration_date) {
        formDataToSubmit.append('expiration_date', formData.expiration_date);
      }
      if (formData.issuing_date) {
        formDataToSubmit.append('issuing_date', formData.issuing_date);
      }
      
      // Handle file upload with blob approach
      if (selectedFile) {
        console.log('Adding file to FormData:', selectedFile);
        
        // Handle file upload differently based on platform
        if (selectedFile.uri && selectedFile.uri.startsWith('data:')) {
          // Web platform with base64 data URL
          const response = await fetch(selectedFile.uri);
          const blob = await response.blob();
          formDataToSubmit.append('document', blob, selectedFile.name || 'document.pdf');
        } else {
          // Native platforms (iOS/Android)
          formDataToSubmit.append('document', {
            uri: selectedFile.uri,
            type: selectedFile.mimeType || selectedFile.type || 'application/pdf',
            name: selectedFile.name || selectedFile.fileName || 'document.pdf',
          });
        }
      }

      console.log('FormData contents:');
      console.log('Title:', formData.title);
      console.log('Description:', formData.description);
      console.log('Category:', formData.category);
      console.log('Selected file:', selectedFile);
      console.log('Trailer ID:', trailerId);

      const response = await fetch(`${BASE_URL}trailer-documents/${trailerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authTokenForm}`,
        },
        body: formDataToSubmit,
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        setSuccessToast(true);
        
        // Call the callback to trigger refresh and auto-close
        if (onDocumentAdded) {
          onDocumentAdded({ ...formData, file: selectedFile });
        }
        
        // Optional: Keep a brief success message
        setTimeout(() => {
          Alert.alert('Succes', 'Documentul remorci a fost adăugat cu succes!');
        }, 100);
        
      } else {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        console.error('Response status:', response.status);
        
        // Try to parse error response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.document && Array.isArray(errorJson.document)) {
            errorMessage = errorJson.document.join(', ');
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.detail) {
            errorMessage = errorJson.detail;
          }
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      Alert.alert('Eroare', `Failed to add trailer document: ${error.message}`);
      console.error('Error adding trailer document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const openDatePicker = (dateType) => {
    setCurrentDateType(dateType);
    const currentDate = formData[dateType] ? new Date(formData[dateType]) : new Date();
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth() + 1);
    
    if (dateType === 'issuing_date') {
      setShowIssuingDatePicker(true);
    } else {
      setShowExpirationDatePicker(true);
    }
  };

  const closeDatePicker = () => {
    setShowIssuingDatePicker(false);
    setShowExpirationDatePicker(false);
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
    const showPicker = dateType === 'issuing_date' ? showIssuingDatePicker : showExpirationDatePicker;
    
    return (
      <View style={[styles.inputGroup, isMobile && styles.mobileDateRowInputGroup]}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.datePickerButton]}
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isMobile && styles.mobileModalContent]}>
          {successToast && (
            <View style={styles.successToast}>
              <Text style={styles.successToastText}>✓ Documentul remorci a fost adăugat!</Text>
            </View>
          )}
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adaugă document remorcă</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* File Upload Section */}
            <View style={styles.fileSection}>
              <Text style={styles.sectionTitle}>Fișier document remorcă</Text>
              {!selectedFile ? (
                <View style={styles.fileUploadArea}>
                  <TouchableOpacity style={styles.fileUploadButton} onPress={handleFileUpload}>
                    <Text style={styles.uploadIcon}>📁</Text>
                    <Text style={styles.fileUploadText}>Atașează fișier</Text>
                    <Text style={styles.fileUploadSubtext}>PDF, DOC, JPG, PNG</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.filePreview}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileIcon}>📄</Text>
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName}>{selectedFile.name}</Text>
                      <Text style={styles.fileSize}>{formatFileSize(selectedFile.size || 0)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={removeFile} style={styles.removeFileButton}>
                    <Text style={styles.removeFileButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Form Fields */}
            <View style={styles.formFieldsContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Numele documentului *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(value) => handleChange('title', value)}
                  placeholder="Introduceți numele documentului"
                  placeholderTextColor={COLORS.light}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria documentului *</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={[styles.dropdownButton, showDropdown && styles.dropdownButtonActive]}
                    onPress={() => setShowDropdown(!showDropdown)}
                  >
                    <Text style={[
                      styles.dropdownButtonText,
                      !formData.category && styles.placeholder
                    ]}>
                      {getSelectedCategoryLabel()}
                    </Text>
                    <Text style={styles.dropdownArrow}>
                      {showDropdown ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                  
                  {showDropdown && (
                    <Modal
                      visible={showDropdown}
                      transparent={true}
                      animationType="fade"
                      onRequestClose={() => setShowDropdown(false)}
                    >
                      <TouchableOpacity 
                        style={styles.dropdownOverlay} 
                        activeOpacity={1}
                        onPress={() => setShowDropdown(false)}
                      >
                        <View style={styles.dropdownList}>
                          <ScrollView showsVerticalScrollIndicator={false}>
                            {DOCUMENT_TYPES.map((type, index) => (
                              <TouchableOpacity
                                key={type.value}
                                style={[
                                  styles.dropdownItem,
                                  index === DOCUMENT_TYPES.length - 1 && styles.dropdownItemLast,
                                  formData.category === type.value && styles.dropdownItemSelected
                                ]}
                                onPress={() => selectCategory(type)}
                              >
                                <Text style={[
                                  styles.dropdownItemText,
                                  formData.category === type.value && styles.dropdownItemSelectedText
                                ]}>
                                  {type.label}
                                </Text>
                                {formData.category === type.value && (
                                  <Text style={styles.checkmark}>✓</Text>
                                )}
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </TouchableOpacity>
                    </Modal>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descriere</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  placeholder="Introduceți descrierea documentului"
                  placeholderTextColor={COLORS.light}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={[styles.dateRow, isMobile && styles.mobileDateRow]}>
                {renderDateInput('issuing_date', 'Data emiterii')}
              </View>

              <View style={[styles.dateRow, isMobile && styles.mobileDateRow]}>
                {renderDateInput('expiration_date', 'Sfârșit valabilitate')}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Anulează
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Text style={[styles.buttonText, styles.submitButtonText]}>
                    Se încarcă...
                  </Text>
                ) : (
                  <>
                    <Text style={[styles.buttonText, styles.submitButtonText, styles.buttonIcon]}>
                      ➕
                    </Text>
                    <Text style={[styles.buttonText, styles.submitButtonText]}>
                      Adaugă document
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddTrailerDocumentForm;