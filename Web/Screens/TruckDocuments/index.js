import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles'; // Import styles from styles.js
import DocumentCategoryModal from '../TruckDocuments/DocumentCategory.js';
const TruckDocumentsScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [truckInfo, setTruckInfo] = useState(null);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { truckId, truckData } = route.params || {};
  const BASE_URL = "";
  const [selectedCategory, setSelectedCategory] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
const handleDocumentCategoryPress = (category) => {
  setSelectedCategory(category);
  setModalVisible(true);
};
  const COLORS = {
    background: "#F4F5FB", // Light lavender background
    card: "#FFFFFF", // White
    primary: "#5A5BDE", // Purple-blue (primary)
    secondary: "#6F89FF", // Light blue
    accent: "#FF8C66", // Soft orange
    accent2: "#81C3F8", // Sky blue
    dark: "#373A56", // Dark navy
    medium: "#6B6F8D", // Medium navy-gray
    light: "#A0A4C1", // Light gray-purple
    border: "#E2E5F1", // Light border
    success: "#63C6AE", // Turquoise
    warning: "#FFBD59", // Amber
    danger: "#FF7285", // Soft red
  };

  // Document categories with their icons and colors using the new color scheme
  const documentCategories = [
    {
      id: 1,
      name: 'Certificat de Conformitate',
      description: 'Document în 4 limbi',
      icon: 'certificate',
      color: COLORS.success,
      gradient: [COLORS.success, '#7BDCC0']
    },
    {
      id: 2,
      name: 'Contract de Asigurare',
      description: 'Răspundere civilă',
      icon: 'shield-check',
      color: COLORS.secondary,
      gradient: [COLORS.secondary, COLORS.accent2]
    },
    {
      id: 3,
      name: 'Inspecții Tehnice Periodice',
      description: 'Verificări tehnice',
      icon: 'clipboard-check',
      color: COLORS.warning,
      gradient: [COLORS.warning, '#FFC97A']
    },
    {
      id: 4,
      name: 'Carte de Identitate a Vehiculului',
      description: 'Document de identificare',
      icon: 'card-account-details',
      color: COLORS.primary,
      gradient: [COLORS.primary, '#7A7CE8']
    },
    {
      id: 5,
      name: 'EC Certificat de Conformitate',
      description: 'Certificat European',
      icon: 'certificate-outline',
      color: COLORS.accent,
      gradient: [COLORS.accent, '#FF9E81']
    },
    {
      id: 6,
      name: 'Alte Licențe',
      description: 'Documente suplimentare',
      icon: 'file-document-multiple',
      color: COLORS.medium,
      gradient: [COLORS.medium, COLORS.light]
    }
  ];

  useEffect(() => {
    const getAuthToken = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          setAuthToken(token);
        } else {
          setError('Authentication required. Please log in first.');
        }
      } catch (err) {
        console.error("Error getting auth token:", err);
        setError('Failed to load authentication token.');
      }
    };

    getAuthToken();
  }, []);

  useEffect(() => {
    if (authToken && truckId) {
      fetchTruckDocuments();
      if (truckData) {
        setTruckInfo(truckData);
      }
    }
  }, [authToken, truckId]);

  const fetchTruckDocuments = async () => {
    try {
      setLoading(true);
      // This would be your actual API endpoint for truck documents
      const response = await fetch(`${BASE_URL}trucks/${truckId}/documents/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched truck documents:', data);
      setDocuments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching truck documents:', err);
      // For demo purposes, we'll set mock data
      setDocuments(documentCategories.map(cat => ({
        ...cat,
        documentCount: Math.floor(Math.random() * 5) + 1,
        lastUpdated: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      })));
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nu este specificat';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('ro-RO', options);
  };

 

  const renderDocumentCategory = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.documentCard}
        onPress={() => handleDocumentCategoryPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <MaterialCommunityIcons 
              name={item.icon} 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{item.name}</Text>
            <Text style={styles.documentDescription}>{item.description}</Text>
            
            <View style={styles.documentMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="document-text" size={12} color={COLORS.light} />
                <Text style={styles.metaText}>
                  {item.documentCount || 0} documente
                </Text>
              </View>
              {item.lastUpdated && (
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={12} color={COLORS.light} />
                  <Text style={styles.metaText}>
                    {formatDate(item.lastUpdated)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.light} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.truckInfoCard}>
        <View style={styles.truckHeader}>
          <MaterialCommunityIcons name="truck" size={24} color={COLORS.primary} />
          <View style={styles.truckDetails}>
            <Text style={styles.truckTitle}>
              {truckInfo ? `${truckInfo.make} ${truckInfo.model}` : `Camion #${truckId}`}
            </Text>
            <Text style={styles.truckSubtitle}>
              {truckInfo ? truckInfo.license_plate : 'Documente vehicul'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorii Documente</Text>
        <Text style={styles.sectionSubtitle}>
          {documentCategories.length} categorii disponibile
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Se încarcă documentele...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Eroare</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => authToken && fetchTruckDocuments()}
          >
            <Text style={styles.retryButtonText}>Încearcă din nou</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Documente Caamion</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchTruckDocuments}
        >
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={documentCategories}
        renderItem={renderDocumentCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <DocumentCategoryModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  category={selectedCategory}
  truckId={truckId}
  authToken={authToken}
/>
    </SafeAreaView>
  );
};

export default TruckDocumentsScreen;