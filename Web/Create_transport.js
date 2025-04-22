// CreateTransportPage.js

import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
const COLORS = {
    background: "#F4F5FB",     // Light lavender background
    card: "#FFFFFF",           // White
    primary: "#5A5BDE",        // Purple-blue (primary)
    secondary: "#6F89FF",      // Light blue
    accent: "#FF8C66",         // Soft orange
    accent2: "#81C3F8",        // Sky blue
    dark: "#373A56",           // Dark navy
    medium: "#6B6F8D",         // Medium navy-gray
    light: "#A0A4C1",          // Light gray-purple
    border: "#E2E5F1",         // Light border
    success: "#63C6AE",        // Turquoise
    warning: "#FFBD59",        // Amber
    danger: "#FF7285",         // Soft red
  };
export default function CreateTransportPage() {
  const [formData, setFormData] = useState({
    driver_id: '',
    status_truck: '',
    status_truck_text: '',
    status_goods: '',
    truck_combination: '',
    status_coupling: '',
    trailer_type: '',
    trailer_number: '',
    status_trailer_wagon: '',
    status_trailer_wagon_description: '',
    status_loaded_truck: '',
    detraction: '',
    status_transport: '',
    delay_estimation: '',
    truck_id: '',
    trailer_id: ''
  });
  const navigation = useNavigation(); // Add this line to get the navigation object

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        driver_id: parseInt(formData.driver_id),
        truck_id: parseInt(formData.truck_id),
        trailer_id: parseInt(formData.trailer_id),
      };

      const response = await fetch('https://atrux-717ecf8763ea.herokuapp.com/create_transport/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transport');
      }

      Alert.alert('Success', 'Transport created successfully!');
      console.log('Success:', data);

      setFormData({
        driver_id: '',
        status_truck: '',
        status_truck_text: '',
        status_goods: '',
        truck_combination: '',
        status_coupling: '',
        trailer_type: '',
        trailer_number: '',
        status_trailer_wagon: '',
        status_trailer_wagon_description: '',
        status_loaded_truck: '',
        detraction: '',
        status_transport: '',
        delay_estimation: '',
        truck_id: '',
        trailer_id: ''
      });
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Creare Transport...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {Object.keys(formData).map((field) => (
          <TextInput
            key={field}
            placeholder={field.replace(/_/g, ' ').toUpperCase()}
            value={formData[field]}
            onChangeText={(text) => handleChange(field, text)}
            style={styles.input}
            placeholderTextColor={COLORS.medium}
          />
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Creeaza</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.medium,
    marginTop: 10,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.medium,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
    color: COLORS.dark,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  }
});
