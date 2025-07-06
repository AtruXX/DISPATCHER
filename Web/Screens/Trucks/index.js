import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import EditTruckForm from './EditComponent';
import AddDocumentForm from './AddDocuments';

// Simple Search Bar Component
const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  style 
}) => {
  const [inputText, setInputText] = useState('');

  const handleSearch = () => {
    onSearch(inputText);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setInputText('');
    onClear();
  };

  return (
    <View style={[searchStyles.searchContainer, style]}>
      <View style={searchStyles.searchBar}>
        <TextInput
          style={searchStyles.searchInput}
          placeholder={placeholder}
          value={inputText}
          onChangeText={setInputText}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          placeholderTextColor="#888"
          onSubmitEditing={handleSearch}
        />
        
        <TouchableOpacity
          onPress={handleSearch}
          style={searchStyles.searchButton}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>

        {inputText && inputText.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={searchStyles.clearButton}
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#888" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const TrucksScreen = ({ onSearch }) => {
  const [trucksData, setTrucksData] = useState({ number_of_trucks: 0, trucks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";
  const [filteredTrucks, setFilteredTrucks] = useState(trucksData.trucks || []);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isAddDocumentsFormVisible, setIsAddDocumentsFormVisible] = useState(false);

  const handleViewDocuments = (truck) => {
    navigation.navigate('Documentstruck', {
      truckId: truck.id,
      truckData: truck
    });
  };

  // Load auth token on component mount
  useEffect(() => {
    const getAuthToken = () => {
      try {
        console.log("Attempting to get auth token from localStorage");
        const token = localStorage.getItem('authToken');
        console.log("Token from localStorage:", token ? "Token exists" : "No token found");

        if (token) {
          setAuthToken(token);
          console.log("Auth token set in state");
        } else {
          console.log("No token found, setting error");
          setError('Authentication required. Please log in first.');
        }
      } catch (err) {
        console.error("Error getting auth token:", err);
        setError('Failed to load authentication token.');
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    getAuthToken();
  }, []);

  // Fetch trucks when token is available
  useEffect(() => {
    if (authToken) {
      fetchTrucks();
    }
  }, [authToken]);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}trucks/`, {
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
      console.log('Fetched trucks:', data);
      setTrucksData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch trucks data');
      console.error('Error fetching trucks:', err);
    }
  };

  const handleEditTruck = (truck) => {
    setSelectedTruck(truck);
    setIsEditFormVisible(true);
  };

  const handleAddDocuments = (truck) => {
    setSelectedTruck(truck);
    setIsAddDocumentsFormVisible(true);
  };

  const handleTruckUpdated = async (updatedTruck) => {
    console.log('Truck updated successfully, refreshing data...');
    setIsEditFormVisible(false);
    setSelectedTruck(null);
    
    try {
      await fetchTrucks();
      console.log('Trucks data refreshed after update');
    } catch (error) {
      console.error('Error refreshing trucks data after update:', error);
      const updatedTrucks = trucksData.trucks.map(truck => 
        truck.id === updatedTruck.id ? updatedTruck : truck
      );
      setTrucksData({
        ...trucksData,
        trucks: updatedTrucks
      });
    }
  };

  const handleDocumentAdded = async (documentData) => {
    console.log('Document added successfully, refreshing data...');
    setIsAddDocumentsFormVisible(false);
    setSelectedTruck(null);
    
    try {
      await fetchTrucks();
      console.log('Trucks data refreshed after document addition');
    } catch (error) {
      console.error('Error refreshing trucks data after document addition:', error);
    }
  };

  const handleCloseEditForm = () => {
    setIsEditFormVisible(false);
    setSelectedTruck(null);
  };

  const handleCloseAddDocumentsForm = () => {
    setIsAddDocumentsFormVisible(false);
    setSelectedTruck(null);
  };

  const getServiceStatus = (nextServiceDate) => {
    if (!nextServiceDate) return { status: 'unknown', color: '#9E9E9E' };

    const today = new Date();
    const serviceDate = new Date(nextServiceDate);
    const diffTime = serviceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', color: '#F44336' };
    } else if (diffDays <= 7) {
      return { status: 'upcoming', color: '#FF9800' };
    } else {
      return { status: 'good', color: '#4CAF50' };
    }
  };

  const getTruckIcon = (make) => {
    const makeNormalized = make?.toLowerCase() || '';

    if (makeNormalized.includes('volvo')) {
      return 'truck';
    } else if (makeNormalized.includes('mercedes')) {
      return 'truck-delivery';
    } else if (makeNormalized.includes('scania')) {
      return 'truck-fast';
    } else {
      return 'truck-check';
    }
  };

  const getRandomColor = (id) => {
    const colors = [
      ['#3A1C71', '#D76D77', '#FFAF7B'],
      ['#00B4DB', '#0083B0', '#005F7F'],
      ['#134E5E', '#71B280', '#9BDC92'],
      ['#373B44', '#4286f4', '#9CECFB'],
      ['#8E2DE2', '#4A00E0', '#6E48AA'],
      ['#FF416C', '#FF4B2B', '#FFA07A']
    ];
    return colors[id % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Filter trucks based on search query
  useEffect(() => {
    const filtered = trucksData.trucks?.filter(truck =>
      truck.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    setFilteredTrucks(filtered);
    if (onSearch) {
      onSearch(filtered);
    }
  }, [searchQuery, trucksData.trucks, onSearch]);

  // Handle search when user presses search button
  const handleSearch = (searchText) => {
    setSearchQuery(searchText);
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const renderTruckItem = ({ item }) => {
    const gradientColors = getRandomColor(item.id);
    const serviceStatus = getServiceStatus(item.next_service_date);

    return (
      <View style={styles.truckCardContainer}>
        <View style={styles.truckCard}>
          <View style={styles.iconSection}>
            <LinearGradient
              colors={gradientColors}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name={getTruckIcon(item.make)} size={30} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.plateContainer}>
              <Text style={styles.plateText}>{item.license_plate}</Text>
            </View>
          </View>

          <View style={styles.truckInfo}>
            <View style={styles.truckHeader}>
              <Text style={styles.truckMakeModel}>{item.make} {item.model}</Text>
              <Text style={styles.truckYear}>{item.year}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Serie de sasiu/VIN</Text>
                  <Text style={styles.detailValue}>{item.vin || 'Not specified'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ultima vizita la service</Text>
                  <Text style={styles.detailValue}>{formatDate(item.last_service_date)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Urmatoarea vizita la service</Text>
                  <Text style={[styles.detailValue, { color: serviceStatus.color }]}>
                    {formatDate(item.next_service_date)}
                  </Text>
                </View>
              </View>

              <View style={[styles.serviceStatusBar, { backgroundColor: serviceStatus.color + '20' }]}>
                <View style={styles.serviceStatusDot}>
                  <View style={[styles.statusDot, { backgroundColor: serviceStatus.color }]} />
                </View>
                <Text style={[styles.serviceStatusText, { color: serviceStatus.color }]}>
                  {serviceStatus.status === 'good' && 'Revizie la zi'}
                  {serviceStatus.status === 'upcoming' && 'Revizia se apropie'}
                  {serviceStatus.status === 'overdue' && 'Revizia este depășită'}
                  {serviceStatus.status === 'unknown' && 'Stare revizie necunoscută'}
                </Text>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleAddDocuments(item)}
                >
                  <Ionicons name="folder-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Adauga Documente</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleViewDocuments(item)}
                >
                  <Ionicons name="folder-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Vezi Documente</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditTruck(item)}
                >
                  <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Editeaza</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Flota</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTrucks.length} {filteredTrucks.length === 1 ? 'vehicul' : 'vehicule'} {searchQuery ? 'găsite' : 'in flota'}
        </Text>
      </View>
      
      {/* Search Bar with Manual Search */}
      <SearchBar
        placeholder="Caută după numărul de înmatriculare..."
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Se încarcă...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => authToken && fetchTrucks()}>
            <Text style={styles.retryButtonText}>Incearca din nou</Text>
          </TouchableOpacity>
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
          <Ionicons name="arrow-back" size={24} color="#303F9F" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchTrucks}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>

      {trucksData.number_of_trucks === 0 || !trucksData.trucks || trucksData.trucks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nu s-au gasit camioane</Text>
            <Text style={styles.emptyText}>Nu exista camioane inregistrate in sistem.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchTrucks}>
              <Text style={styles.refreshButtonText}>Reincarca</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : filteredTrucks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Niciun rezultat</Text>
            <Text style={styles.emptyText}>
              Nu s-a găsit niciun camion cu numărul de înmatriculare "{searchQuery}".
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.refreshButtonText}>Șterge filtrul</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredTrucks}
          renderItem={renderTruckItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Edit Truck Modal Form */}
      {selectedTruck && (
        <EditTruckForm
          isVisible={isEditFormVisible}
          onClose={handleCloseEditForm}
          truck={selectedTruck}
          authToken={authToken}
          onTruckUpdated={handleTruckUpdated}
        />
      )}

      {/* Add Document Modal Form */}
      {selectedTruck && (
        <AddDocumentForm
          isVisible={isAddDocumentsFormVisible}
          onClose={handleCloseAddDocumentsForm}
          truck={selectedTruck}
          authToken={authToken}
          onDocumentAdded={handleDocumentAdded}
          truckId={selectedTruck.id}
          authTokenForm={authToken}
        />
      )}
    </SafeAreaView>
  );
};

// Search Bar Styles
const searchStyles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
});

// Add edit button styles to existing styles
const additionalStyles = StyleSheet.create({
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 5,
  },
});

// Merge additional styles with the imported styles
Object.assign(styles, additionalStyles);

export default TrucksScreen;