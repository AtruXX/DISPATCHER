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
import * as DocumentPicker from 'expo-document-picker';

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
  selected: "#E8F5E8",   // Light green background for selected
};

const DOCUMENT_TYPES = [
  { label: 'Certificat de conformitate', value: 'certificat_conformitate' },
  { label: 'Contract de asigurare', value: 'contract_asigurare' },
  { label: 'Inspectii tehnice periodice', value: 'inspectii_tehnice' },
  { label: 'Carte de identitate a vehiculului', value: 'carte_identitate_vehicul' },
  { label: 'EC Certificat de conformitate', value: 'ec_certificat_conformitate' },
  { label: 'Copie conforma', value: 'copie_conforma' },
  { label: 'Procedura de instalare', value: 'procedura_instalare' },
];

const AddDocumentForm = ({ isVisible, onClose, onDocumentAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    incepere_valabilitate: '',
    sfarsit_valabilitate: '',
    data_emitere: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const dropdownAnimation = useState(new Animated.Value(0))[0];

  // Reset form when modal opens
  useEffect(() => {
    if (isVisible) {
      setFormData({
        name: '',
        description: '',
        category: '',
        incepere_valabilitate: '',
        sfarsit_valabilitate: '',
        data_emitere: '',
      });
      setSelectedFile(null);
      setShowDropdown(false);
    }
  }, [isVisible]);

  // Animation for the success toast
  useEffect(() => {
    if (successToast) {
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
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

  // Dropdown animation
  useEffect(() => {
    if (showDropdown) {
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [showDropdown]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file');
      console.error('File selection error:', error);
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
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Numele documentului este obligatoriu');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Validation Error', 'Categoria documentului este obligatorie');
      return false;
    }
    if (!selectedFile) {
      Alert.alert('Validation Error', 'Vă rugăm să atașați un fișier');
      return false;
    }
    
    // Validate dates if they're not empty
    if (formData.incepere_valabilitate && !isValidDateFormat(formData.incepere_valabilitate)) {
      Alert.alert('Validation Error', 'Data de început a valabilității trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    if (formData.sfarsit_valabilitate && !isValidDateFormat(formData.sfarsit_valabilitate)) {
      Alert.alert('Validation Error', 'Data de sfârșit a valabilității trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    if (formData.data_emitere && !isValidDateFormat(formData.data_emitere)) {
      Alert.alert('Validation Error', 'Data emiterii trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Simulate API call since no backend for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessToast(true);
      
      Alert.alert(
        'Success',
        'Documentul a fost adăugat cu succes!',
        [{ text: 'OK', onPress: () => {
          if (onDocumentAdded) {
            onDocumentAdded({ ...formData, file: selectedFile });
          }
          onClose();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to add document: ${error.message}`);
      console.error('Error adding document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const renderDateInput = (dateType, label) => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={formData[dateType]}
          onChangeText={(text) => handleChange(dateType, text)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.light}
          keyboardType="numeric"
        />
        <Text style={styles.dateHint}>Format: YYYY-MM-DD</Text>
      </View>
    );
  };

  const renderCustomDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.dropdownButton, showDropdown && styles.dropdownButtonActive]}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={[
            styles.dropdownButtonText,
            !formData.category && styles.dropdownPlaceholder
          ]}>
            {getSelectedCategoryLabel()}
          </Text>
          <Ionicons 
            name={showDropdown ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={COLORS.medium} 
          />
        </TouchableOpacity>
        
        {/* Render dropdown as a separate Modal for better positioning */}
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
            <View style={styles.dropdownListModal}>
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                {DOCUMENT_TYPES.map((type, index) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.dropdownItem,
                      formData.category === type.value && styles.dropdownItemSelected,
                      index === DOCUMENT_TYPES.length - 1 && styles.dropdownItemLast
                    ]}
                    onPress={() => selectCategory(type)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      formData.category === type.value && styles.dropdownItemTextSelected
                    ]}>
                      {type.label}
                    </Text>
                    {formData.category === type.value && (
                      <Ionicons name="checkmark" size={18} color={COLORS.success} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
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
        <View style={styles.modalContent}>
          {successToast && (
            <Animated.View style={[styles.successToast, { opacity: toastOpacity }]}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.card} />
              <Text style={styles.successToastText}>Documentul a fost adăugat!</Text>
            </Animated.View>
          )}
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Adaugă document</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.card} />
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* File Upload Section */}
            <View style={styles.fileSection}>
              <Text style={styles.sectionTitle}>Fișier document</Text>
              {!selectedFile ? (
                <TouchableOpacity style={styles.fileUploadButton} onPress={handleFileUpload}>
                  <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
                  <Text style={styles.fileUploadText}>Atașează fișier</Text>
                  <Text style={styles.fileUploadSubtext}>PDF, DOC, JPG, PNG</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.filePreview}>
                  <View style={styles.fileInfo}>
                    <Ionicons name="document-outline" size={24} color={COLORS.primary} />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                      <Text style={styles.fileSize}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={removeFile} style={styles.removeFileButton}>
                    <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Form Fields */}
            <View style={styles.formFieldsContainer}>
              <View style={styles.rowContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Numele documentului *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => handleChange('name', text)}
                    placeholder="Introduceți numele documentului"
                    placeholderTextColor={COLORS.light}
                  />
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Categoria documentului *</Text>
                  {renderCustomDropdown()}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Descriere</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                    placeholder="Introduceți descrierea documentului"
                    placeholderTextColor={COLORS.light}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.dateRow}>
                {renderDateInput('data_emitere', 'Data emiterii')}
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateInputHalf}>
                  {renderDateInput('incepere_valabilitate', 'Început valabilitate')}
                </View>
                <View style={styles.dateInputHalf}>
                  {renderDateInput('sfarsit_valabilitate', 'Sfârșit valabilitate')}
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: COLORS.dark }]}>Anulează</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.card} />
                ) : (
                  <>
                    <Ionicons name="add-circle-outline" size={20} color={COLORS.card} />
                    <Text style={[styles.buttonText, { marginLeft: 8 }]}>Adaugă document</Text>
                  </>
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
    backgroundColor: 'rgba(55, 58, 86, 0.5)',
  },
  modalContent: {
    width: '92%',
    maxHeight: '88%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  closeButton: {
    padding: 6,
  },
  formContainer: {
    flex: 1,
  },
  
  // File Section
  fileSection: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  fileUploadButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  fileUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
  fileUploadSubtext: {
    fontSize: 12,
    color: COLORS.medium,
    marginTop: 4,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  fileSize: {
    fontSize: 12,
    color: COLORS.medium,
    marginTop: 2,
  },
  removeFileButton: {
    padding: 4,
  },
  
  // Form Fields
  formFieldsContainer: {
    padding: 20,
  },
  rowContainer: {
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateInputHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.dark,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    color: COLORS.dark,
    fontSize: 16,
  },
  textArea: {
    height: 88,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  
  // Custom Dropdown
  dropdownContainer: {
    position: 'relative',
    zIndex: 9999, // Increased z-index
  },
  
  dropdownButton: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonActive: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: COLORS.dark,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: COLORS.light,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12, // Increased elevation for Android
    zIndex: 10000, // Higher z-index
  },
  dropdownScroll: {
    maxHeight: 280,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.selected,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 15,
    color: COLORS.dark,
    flex: 1,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: COLORS.success,
  },
  
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownListModal: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
    maxHeight: 280,
  },

  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    flexDirection: 'row',
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
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
  
  // Toast
  successToast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.success,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  successToastText: {
    color: COLORS.card,
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 15,
  },
  dateHint: {
    fontSize: 11,
    color: COLORS.medium,
    marginTop: 4,
    fontStyle: 'italic'
  }
});

export default AddDocumentForm;