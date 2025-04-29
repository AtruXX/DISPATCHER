// CreateTransportPage.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
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

      // Optionally reset form
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
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Transport</Text>

      {Object.keys(formData).map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          value={formData[field]}
          onChangeText={(text) => handleChange(field, text)}
          style={styles.input}
        />
      ))}

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});
