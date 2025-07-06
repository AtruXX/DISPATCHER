import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import * as DocumentPicker from 'expo-document-picker';
import { styles } from '/Users/ioanagavrila/Desktop/DISPATCHER/Web/Screens/Drivers/EditDocumentFormStyles';

const EditDocumentForm = ({
  document,
  driverId,
  onClose,
  onSuccess,
  authToken,
  BASE_URL,
  documentCategories
}) => {
  const [editState, setEditState] = useState({
    selectedFile: null,
    documentTitle: document.title || '',
    documentCategory: document.category || '',
    expirationDate: document.expiration_date || null,
    showDatePicker: false,
    isUpdating: false
  });

  const updateEditState = (field, value) => {
    setEditState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = async () => {
    try {
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
        
        console.log("Selected new file:", cleanFileObject);
        updateEditState('selectedFile', cleanFileObject);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleUpdateDocument = async () => {
    try {
      updateEditState('isUpdating', true);

      const formData = new FormData();
      let hasChanges = false;

      // Only append fields that have changed
      if (editState.documentTitle !== document.title) {
        formData.append('title', editState.documentTitle);
        hasChanges = true;
      }

      if (editState.documentCategory !== document.category) {
        formData.append('category', editState.documentCategory);
        hasChanges = true;
      }

      if (editState.expirationDate !== document.expiration_date) {
        formData.append('expiration_date', editState.expirationDate);
        hasChanges = true;
      }

      // Only append file if a new one was selected
      if (editState.selectedFile) {
        if (editState.selectedFile.uri.startsWith('data:')) {
          // Web platform with base64 data URL
          const response = await fetch(editState.selectedFile.uri);
          const blob = await response.blob();
          formData.append('document', blob, editState.selectedFile.name);
        } else {
          // Native platforms (iOS/Android)
          formData.append('document', {
            uri: editState.selectedFile.uri,
            type: editState.selectedFile.mimeType,
            name: editState.selectedFile.name,
          });
        }
        hasChanges = true;
      }

      if (!hasChanges) {
        Alert.alert('Info', 'Nu au fost detectate modificări');
        return;
      }

      // Log what we're sending
      console.log("=== Edit FormData Debug Info ===");
      console.log("Document ID:", document.id);
      console.log("Selected file:", editState.selectedFile);
      console.log("Document title:", editState.documentTitle);
      console.log("Document category:", editState.documentCategory);
      console.log("Expiration date:", editState.expirationDate);

      // Update the document using PATCH
      const response = await fetch(`${BASE_URL}personal-documents/driver/${driverId}/${document.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${authToken}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Document updated successfully:', result);

      Alert.alert('Succes', 'Documentul a fost actualizat cu succes');
      onSuccess(driverId); 
      onClose(); 

    } catch (error) {
      console.error('Error updating document:', error);
      Alert.alert('Eroare', 'Nu s-a putut actualiza documentul. Încearcă din nou.');
    } finally {
      updateEditState('isUpdating', false);
    }
  };

  return (
    <View style={styles.editContainer}>
      <View style={styles.editHeader}>
        <Text style={styles.uploadTitle}>Editează documentul</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#445580" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.fileSelectButton}
        onPress={handleFileSelect}
      >
        <Ionicons name="document-attach" size={20} color="#5C6BC0" />
        <Text style={styles.fileSelectText}>
          {editState.selectedFile?.name || 'Schimbă fișierul (opțional)'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.textInput}
        placeholder="Titlu document"
        value={editState.documentTitle}
        onChangeText={(text) => updateEditState('documentTitle', text)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={editState.documentCategory}
          onValueChange={(itemValue) => updateEditState('documentCategory', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selectează categoria" value="" />
          {documentCategories.map((category) => (
            <Picker.Item key={category.value} label={category.label} value={category.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.inputLabel}>DATA EXPIRĂRII</Text>
        <TouchableOpacity
          style={[styles.inputContainer, styles.dropdownContainer]}
          onPress={() => updateEditState('showDatePicker', true)}
        >
          <Text style={editState.expirationDate ? styles.dropdownText : styles.dropdownPlaceholder}>
            {editState.expirationDate ?
              new Date(editState.expirationDate).toLocaleDateString() :
              'Selectează data'
            }
          </Text>
          <Ionicons name="calendar" size={20} color="#5C6BC0" />
        </TouchableOpacity>

        {editState.showDatePicker && (
          <View style={styles.calendarContainer}>
            {Platform.OS === 'ios' || Platform.OS === 'android' ? (
              <DateTimePicker
                value={editState.expirationDate ? new Date(editState.expirationDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  updateEditState('showDatePicker', false);
                  if (selectedDate) {
                    const formattedDate = selectedDate.toISOString().split('T')[0];
                    updateEditState('expirationDate', formattedDate);
                  }
                }}
              />
            ) : (
              <Calendar
                onDayPress={(day) => {
                  updateEditState('expirationDate', day.dateString);
                  updateEditState('showDatePicker', false);
                }}
                markedDates={{
                  [editState.expirationDate || '']: {
                    selected: true,
                    selectedColor: "#5C6BC0"
                  }
                }}
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
            )}
          </View>
        )}
      </View>

      <View style={styles.uploadButton}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>Anulează</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateDocument}
          disabled={editState.isUpdating}
        >
          {editState.isUpdating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.updateButtonText}>Actualizează</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditDocumentForm;