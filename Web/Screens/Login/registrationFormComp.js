// RegistrationForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const RegistrationForm = ({ visible, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Romanian phone number validation (can be adjusted)
    const phoneRegex = /^(\+40|0040|0)[67]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const sendRegistrationRequest = async () => {
    // Validate inputs
    if (!phoneNumber.trim()) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți numărul de telefon');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți adresa de email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți o adresă de email validă');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți un număr de telefon valid');
      return;
    }

    setIsLoading(true);

    try {
      // Option 1: Using a backend service (recommended)
      // Replace with your actual backend endpoint
      const response = await fetch('YOUR_BACKEND_ENDPOINT/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Clear form
        setPhoneNumber('');
        setEmail('');
        
        // Show success message
        Alert.alert(
          'Succes',
          'Cererea dumneavoastră a fost înregistrată, vă vom contacta cât mai curând posibil!',
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Option 2: Fallback to email client (if backend fails)
      // This opens the user's email app
      const subject = encodeURIComponent('Cerere de înregistrare');
      const body = encodeURIComponent(
        `Cerere nouă de înregistrare:\n\nTelefon: ${phoneNumber}\nEmail: ${email}\nData: ${new Date().toLocaleString('ro-RO')}`
      );
      const emailUrl = `mailto:ioanavalerya@gmail.com?subject=${subject}&body=${body}`;
      
      try {
        const { Linking } = require('react-native');
        await Linking.openURL(emailUrl);
        
        // Show success message
        Alert.alert(
          'Succes',
          'Cererea dumneavoastră a fost înregistrată, vă vom contacta cât mai curând posibil!',
          [{ text: 'OK', onPress: onClose }]
        );
        
        // Clear form
        setPhoneNumber('');
        setEmail('');
      } catch (linkingError) {
        Alert.alert(
          'Eroare',
          'Nu s-a putut trimite cererea. Vă rugăm să încercați din nou mai târziu.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Înregistrare</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Număr de telefon *</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Ex: 0712345678"
                keyboardType="phone-pad"
                maxLength={15}
              />

              <Text style={styles.label}>Adresa de email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Ex: nume@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={sendRegistrationRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Trimite cererea</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.infoText}>
                * Câmpurile marcate sunt obligatorii
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default RegistrationForm;