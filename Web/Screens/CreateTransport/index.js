import React, { useState, useEffect } from 'react';
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
  StatusBar,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, COLORS } from './styles';

export default function CreateTransportPage() {
  const [formData, setFormData] = useState({
    truck_combination: '',
    trailer_type: '',
    trailer_number: '',
    detraction: '',
    origin_city: '',
    destination_city: '',
    goods_type: '',
    driver: null // Will store the selected driver ID
  });
  
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDriverModalVisible, setDriverModalVisible] = useState(false);
  
  const navigation = useNavigation();

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('authToken');

      const response = await fetch('https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/drivers',{
        method: 'GET',
        
      })
      const data = await response.json();
      
      if (data && data.drivers) {
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Alert.alert('Error', 'Failed to fetch drivers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectDriver = (driver) => {
    setSelectedDriver(driver);
    setFormData(prev => ({ ...prev, driver: driver.id }));
    setDriverModalVisible(false);
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['truck_combination', 'trailer_type', 'trailer_number', 'origin_city', 'destination_city', 'goods_type', 'driver'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Fields', `Please complete the following fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/transports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
            'Authorization': `Token ${token}`,
            
        
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transport');
      }
      
      const data = await response.json();
      Alert.alert('Success', 'Transport created successfully!');
      console.log('Success:', data);
      
      // Reset form
      setFormData({
        truck_combination: '',
        trailer_type: '',
        trailer_number: '',
        detraction: '',
        origin_city: '',
        destination_city: '',
        goods_type: '',
        driver: null
      });
      setSelectedDriver(null);
      
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Driver selection modal
  const renderDriverModal = () => {
    return (
      <Modal
        visible={isDriverModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDriverModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selectează Șofer</Text>
              <TouchableOpacity onPress={() => setDriverModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={drivers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.driverItem}
                  onPress={() => selectDriver(item)}
                >
                  <Text style={styles.driverName}>{item.name}</Text>
                  <Text style={styles.driverCompany}>{item.company}</Text>
                  <View style={{flexDirection: 'row', marginTop: 4}}>
                    <Text style={[
                      styles.driverStatus, 
                      item.is_active ? styles.driverStatusActive : styles.driverStatusInactive
                    ]}>
                      {item.is_active ? 'Activ' : 'Inactiv'}
                    </Text>
                    <Text style={[
                      styles.driverStatus,
                      item.driver && !item.driver.on_road ? styles.driverStatusAvailable : styles.driverStatusOnRoad
                    ]}>
                      {item.driver && !item.driver.on_road ? 'Disponibil' : 'În cursă'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nu există șoferi disponibili</Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  };

  if (loading && !isDriverModalVisible) {
    return (
      <SafeAreaView style={styles.loadingContainer || { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <View style={styles.loadingCard || { padding: 20, backgroundColor: COLORS.white, borderRadius: 10, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText || { marginTop: 10, color: COLORS.primary, fontSize: 16 }}>Se incarca...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Define form fields in the order you want them to appear
  const formFields = [
    { key: 'truck_combination', label: 'COMBINATIE CAMION' },
    { key: 'trailer_type', label: 'TIP REMORCĂ' },
    { key: 'trailer_number', label: 'NUMĂR REMORCĂ' },
    { key: 'detraction', label: 'TIP TRACTARE' },
    { key: 'origin_city', label: 'ORAȘ ORIGINE' },
    { key: 'destination_city', label: 'ORAȘ DESTINAȚIE' },
    { key: 'goods_type', label: 'TIP MARFĂ' },
  ];

  // Group form fields for two-column layout
  const fieldPairs = [];
  for (let i = 0; i < formFields.length; i += 2) {
    if (i + 1 < formFields.length) {
      fieldPairs.push([formFields[i], formFields[i + 1]]);
    } else {
      fieldPairs.push([formFields[i]]);
    }
  }

  return (
    <SafeAreaView style={styles.container || { flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.navigationHeader || { flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
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
          onPress={fetchDrivers}
        >
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer || { padding: 16 }}>
        {/* Header Card */}
        <View style={styles.headerCard || { backgroundColor: COLORS.white, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <Text style={styles.headerTitle || { fontSize: 24, fontWeight: 'bold', color: COLORS.primary }}>Creare Transport</Text>
          <Text style={styles.headerSubtitle || { fontSize: 16, color: COLORS.text.light, marginTop: 8 }}>
            Completati detaliile pentru transport nou
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard || { backgroundColor: COLORS.white, borderRadius: 10, padding: 16 }}>
          {/* Driver Selection */}
          <View style={styles.driverSection}>
            <Text style={styles.sectionTitle}>SELECTEAZĂ ȘOFER</Text>
            <TouchableOpacity 
              style={styles.driverSelector}
              onPress={() => setDriverModalVisible(true)}
            >
              {selectedDriver ? (
                <View style={styles.selectedDriverContainer}>
                  <Text style={styles.selectedDriverName}>{selectedDriver.name}</Text>
                  <Text style={styles.selectedDriverCompany}>{selectedDriver.company}</Text>
                </View>
              ) : (
                <Text style={styles.driverPlaceholder}>Apasă pentru a selecta un șofer</Text>
              )}
              <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          {fieldPairs.map((pair, index) => (
            <View key={index} style={styles.inputRow || { flexDirection: 'row', marginBottom: 16 }}>
              {pair.map((field) => (
                <View key={field.key} style={styles.inputWrapper || { flex: 1, marginRight: pair.length > 1 ? 8 : 0 }}>
                  <Text style={styles.inputLabel || { fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                    {field.label}
                  </Text>
                  <View style={styles.inputContainer || { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, overflow: 'hidden' }}>
                    <TextInput
                      value={formData[field.key]}
                      onChangeText={(text) => handleChange(field.key, text)}
                      style={styles.input || { padding: 12, fontSize: 16 }}
                      placeholderTextColor={COLORS.text.light}
                    />
                  </View>
                </View>
              ))}
              {pair.length === 1 && <View style={styles.inputWrapper || { flex: 1, marginLeft: 8 }} />}
            </View>
          ))}

          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            style={styles.submitButtonGradient || { borderRadius: 8, marginTop: 16 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={styles.submitButton || { padding: 16, alignItems: 'center' }} 
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText || { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>CREEAZĂ TRANSPORT</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {renderDriverModal()}
    </SafeAreaView>
  );
}

// Inline styles have been removed as they're now in the styles.js file