import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles';

const AddDriverScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hireDate, setHireDate] = useState(new Date());
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(new Date());
  const [showHireDatePicker, setShowHireDatePicker] = useState(false);
  const [showLicenseDatePicker, setShowLicenseDatePicker] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const COLORS = {
    background: "#F6F7FF",    // Lighter lavender for a fresh feel
    card: "#FFFFFF",          // White
    primary: "#6366F1",       // More vibrant purple-blue (primary)
    primaryLight: "#EEF0FF",  // Light primary for subtle highlights
    secondary: "#7C8FFF",     // Enhanced light blue
    accent: "#FF9F7A",        // Warmer soft orange
    accent2: "#78C6FF",       // Brighter sky blue
    dark: "#2D3154",          // Softer dark navy
    medium: "#6E75A4",        // Warmer medium navy-gray
    light: "#A8ADCE",         // Slightly warmer light gray-purple
    border: "#E6E9F9",        // Subtle border
    success: "#4DD4B9",       // Brighter turquoise
    warning: "#FFCA6E",       // Brighter amber
    danger: "#FF8A94",        // Warmer soft red
    shadow: "#6366F1",        // Shadow color based on primary
  };
  
  // Generate username when firstName or lastName changes
  useEffect(() => {
    if (firstName && lastName) {
      // Replace diacritics and special chars, convert to lowercase
      const normalizedFirstName = firstName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      
      const normalizedLastName = lastName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      
      setUsername(`${normalizedLastName}_${normalizedFirstName}`);
    }
  }, [firstName, lastName]);
  
  // Function to generate a random strong password
  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_-+=<>?';
    
    const allChars = lowercase + uppercase + numbers + special;
    let newPassword = '';
    
    // Ensure at least one character from each group
    newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
    newPassword += special.charAt(Math.floor(Math.random() * special.length));
    
    // Fill the rest randomly to reach 16 characters
    for (let i = 4; i < 16; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password to avoid predictable pattern
    newPassword = newPassword
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
    
    setPassword(newPassword);
  };
  
  // Generate a password when component mounts
  useEffect(() => {
    generateStrongPassword();
  }, []);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const onHireDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || hireDate;
    setShowHireDatePicker(false);
    setHireDate(currentDate);
  };

  const onLicenseDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || licenseExpiryDate;
    setShowLicenseDatePicker(false);
    setLicenseExpiryDate(currentDate);
  };

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Eroare', 'Vă rugăm introduceți prenumele');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Eroare', 'Vă rugăm introduceți numele');
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Eroare', 'Vă rugăm introduceți numărul de telefon');
      return false;
    }
    // Basic phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      Alert.alert('Eroare', 'Vă rugăm introduceți un număr de telefon valid (10 cifre)');
      return false;
    }
    return true;
  };

  const handleCreateDriver = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const driverData = {
        nume: lastName,
        prenume: firstName,
        dataAngajarii: formatDate(hireDate),
        nrTelefon: phoneNumber,
        dataExpirariiPermisului: formatDate(licenseExpiryDate),
        username: username,
        password: password, // Include the generated strong password
      };

      // Replace with your actual API endpoint
      const response = await fetch('https://your-api-endpoint.com/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driverData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      // Show success message with credentials
      Alert.alert(
        'Șofer adăugat cu succes',
        `Nume utilizator: ${username}\nParolă: ${password}\n\nVă rugăm să salvați aceste informații într-un loc sigur.`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
      
    } catch (error) {
      console.error('Error creating driver:', error);
      Alert.alert('Eroare', 'A apărut o eroare la adăugarea șoferului. Vă rugăm încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adaugă Șofer Nou</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informații Personale</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Prenume</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Introduceți prenumele"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nume</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Introduceți numele"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Număr de Telefon</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Introduceți numărul de telefon"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informații Cont</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nume Utilizator</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Generat automat"
                value={username}
                editable={false}
              />
            </View>
            <Text style={styles.helpText}>Generat automat din nume și prenume</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Parolă</Text>
            <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Parolă generată automat"
                value={password}
                secureTextEntry={!passwordVisible}
                editable={false}
              />
              <TouchableOpacity 
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ padding: 10 }}
              >
                <Ionicons 
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color={COLORS.medium}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.helpText}>Parolă puternică generată automat</Text>
              <TouchableOpacity 
                onPress={generateStrongPassword}
                style={styles.iconButton}
              >
                <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateDriver}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.card} />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.card} style={styles.buttonIcon} />
              <Text style={styles.createButtonText}>Creează Șofer</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddDriverScreen;