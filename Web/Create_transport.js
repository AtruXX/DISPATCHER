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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  background: "#ECEFF1", // Light background from your TransportScreen
  card: "#FFFFFF", // White card background
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
  
  const navigation = useNavigation();
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

  // Group form fields for two-column layout
  const formFields = Object.keys(formData);
  const fieldPairs = [];
  
  for (let i = 0; i < formFields.length; i += 2) {
    if (i + 1 < formFields.length) {
      fieldPairs.push([formFields[i], formFields[i + 1]]);
    } else {
      fieldPairs.push([formFields[i]]);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Se proceseaza...</Text>
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
        <TouchableOpacity 
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Creare Transport</Text>
          <Text style={styles.headerSubtitle}>
            Completati detaliile pentru transport nou
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {fieldPairs.map((pair, index) => (
            <View key={index} style={styles.inputRow}>
              {pair.map((field) => (
                <View key={field} style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>
                    {field.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      value={formData[field]}
                      onChangeText={(text) => handleChange(field, text)}
                      style={styles.input}
                      placeholderTextColor={COLORS.text.light}
                    />
                  </View>
                </View>
              ))}
              {pair.length === 1 && <View style={styles.inputWrapper} />}
            </View>
          ))}

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
              <Text style={styles.submitButtonText}>CREEAZĂ TRANSPORT</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
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
  },
  headerCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightAccent,
  },
  formCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.text.light,
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text.dark,
  },
  submitButtonGradient: {
    borderRadius: 10,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loadingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '80%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '500',
  },
});