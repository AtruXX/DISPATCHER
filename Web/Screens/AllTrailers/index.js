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
import EditTrailerForm from '/Users/ioanagavrila/Desktop/DISPATCHER/Web/Screens/AllTrailers/EditComponents.js';
import AddDocumentForm from '/Users/ioanagavrila/Desktop/DISPATCHER/Web/Screens/AllTrailers/AddDocuments.js';

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

const TrailersScreen = ({ onSearch }) => {
  const [trailersData, setTrailersData] = useState({ number_of_trailer: 0, trailers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";
  const [filteredTrailers, setFilteredTrailers] = useState(trailersData.trailers || []);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isAddDocumentsFormVisible, setIsAddDocumentsFormVisible] = useState(false);

  const handleViewDocuments = (trailer) => {
    navigation.navigate('DocumentsTrailer', {
      trailerId: trailer.id,
      trailerData: trailer
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

  // Fetch trailers when token is available
  useEffect(() => {
    if (authToken) {
      fetchTrailers();
    }
  }, [authToken]);

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}trailers/`, {
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
      console.log('Fetched trailers:', data);
      setTrailersData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch trailers data');
      console.error('Error fetching trailers:', err);
    }
  };

  const handleEditTrailer = (trailer) => {
    setSelectedTrailer(trailer);
    setIsEditFormVisible(true);
  };

  const handleAddDocuments = (trailer) => {
    setSelectedTrailer(trailer);
    setIsAddDocumentsFormVisible(true);
  };

  const handleTrailerUpdated = async (updatedTrailer) => {
    console.log('Trailer updated successfully, refreshing data...');
    setIsEditFormVisible(false);
    setSelectedTrailer(null);

    try {
      await fetchTrailers();
      console.log('Trailers data refreshed after update');
    } catch (error) {
      console.error('Error refreshing trailers data after update:', error);
      const updatedTrailers = trailersData.trailers.map(trailer =>
        trailer.id === updatedTrailer.id ? updatedTrailer : trailer
      );
      setTrailersData({
        ...trailersData,
        trailers: updatedTrailers
      });
    }
  };

  const handleDocumentAdded = async (documentData) => {
    console.log('Document added successfully, refreshing data...');
    setIsAddDocumentsFormVisible(false);
    setSelectedTrailer(null);

    try {
      await fetchTrailers();
      console.log('Trailers data refreshed after document addition');
    } catch (error) {
      console.error('Error refreshing trailers data after document addition:', error);
    }
  };

  const handleDeleteTrailer = (trailer) => {
    console.log('Delete button pressed for trailer:', trailer.license_plate);
    console.log('Alert function available:', typeof Alert);
    deleteTrailer(trailer.id);
    
  };

  const deleteTrailer = async (trailerId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}trailers/${trailerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Trailer deleted successfully');
      Alert.alert('Succes', 'Remorca a fost ștearsă cu succes.');

      // Refresh the trailers list
      await fetchTrailers();
    } catch (err) {
      setLoading(false);
      console.error('Error deleting trailer:', err);
      Alert.alert(
        'Eroare',
        'Nu s-a putut șterge remorca. Încearcă din nou mai târziu.'
      );
    }
  };

  const handleCloseEditForm = () => {
    setIsEditFormVisible(false);
    setSelectedTrailer(null);
  };

  const handleCloseAddDocumentsForm = () => {
    setIsAddDocumentsFormVisible(false);
    setSelectedTrailer(null);
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

  const getTrailerIcon = (type) => {
    const typeNormalized = type?.toLowerCase() || '';

    switch (typeNormalized) {
      case 'frigo':
      case 'refrigerated':
        return 'truck-trailer';
      case 'dry_van':
        return 'truck-cargo-container';
      case 'flatbed':
        return 'truck-flatbed';
      case 'tanker':
        return 'gas-cylinder';
      default:
        return 'truck-trailer';
    }
  };

  const getTrailerStatusColor = (status) => {
    const statusNormalized = status?.toLowerCase() || '';

    switch (statusNormalized) {
      case 'active':
        return '#4CAF50';
      case 'maintenance':
        return '#FF9800';
      case 'out_of_service':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getTrailerStatusText = (status) => {
    const statusNormalized = status?.toLowerCase() || '';

    switch (statusNormalized) {
      case 'active':
        return 'Activ';
      case 'maintenance':
        return 'Mentenanță';
      case 'out_of_service':
        return 'Scos din serviciu';
      default:
        return 'Necunoscut';
    }
  };

  const getTrailerTypeText = (type) => {
    const typeNormalized = type?.toLowerCase() || '';

    switch (typeNormalized) {
      case 'frigo':
      case 'refrigerated':
        return 'Frigorific';
      case 'dry_van':
        return 'Dry Van';
      case 'flatbed':
        return 'Platformă';
      case 'tanker':
        return 'Cisternă';
      default:
        return type || 'Necunoscut';
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

  // Filter trailers based on search query
  useEffect(() => {
    const filtered = trailersData.trailers?.filter(trailer =>
      trailer.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    setFilteredTrailers(filtered);
    if (onSearch) {
      onSearch(filtered);
    }
  }, [searchQuery, trailersData.trailers, onSearch]);

  // Handle search when user presses search button
  const handleSearch = (searchText) => {
    setSearchQuery(searchText);
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const renderTrailerItem = ({ item }) => {
    const gradientColors = getRandomColor(item.id);
    const serviceStatus = getServiceStatus(item.next_service_date);
    const statusColor = getTrailerStatusColor(item.status);

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
              <MaterialCommunityIcons name={getTrailerIcon(item.type)} size={30} color="#FFFFFF" />
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
                  <Text style={styles.detailLabel}>Tip</Text>
                  <Text style={styles.detailValue}>{getTrailerTypeText(item.type)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[styles.detailValue, { color: statusColor }]}>
                    {getTrailerStatusText(item.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Serie de sasiu/VIN</Text>
                  <Text style={styles.detailValue}>{item.vin || 'Not specified'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Companie</Text>
                  <Text style={styles.detailValue}>{item.company || 'Not specified'}</Text>
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
                  onPress={() => handleEditTrailer(item)}
                >
                  <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Editeaza</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    console.log('Delete TouchableOpacity pressed');
                    handleDeleteTrailer(item);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.deleteButtonText}>Șterge Remorca</Text>
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
        <Text style={styles.headerTitle}>Remorci</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTrailers.length} {filteredTrailers.length === 1 ? 'remorcă' : 'remorci'} {searchQuery ? 'găsite' : 'in flota'}
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
          <TouchableOpacity style={styles.retryButton} onPress={() => authToken && fetchTrailers()}>
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
          onPress={fetchTrailers}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>

      {trailersData.number_of_trailer === 0 || !trailersData.trailers || trailersData.trailers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nu s-au gasit remorci</Text>
            <Text style={styles.emptyText}>Nu exista remorci inregistrate in sistem.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchTrailers}>
              <Text style={styles.refreshButtonText}>Reincarca</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : filteredTrailers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Niciun rezultat</Text>
            <Text style={styles.emptyText}>
              Nu s-a găsit nicio remorcă cu numărul de înmatriculare "{searchQuery}".
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
          data={filteredTrailers}
          renderItem={renderTrailerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Edit Trailer Modal Form */}
      {selectedTrailer && (
        <EditTrailerForm
          isVisible={isEditFormVisible}
          onClose={handleCloseEditForm}
          trailer={selectedTrailer}
          authToken={authToken}
          onTrailerUpdated={handleTrailerUpdated}
        />
      )}

      {/* Add Document Modal Form */}
      {selectedTrailer && (
        <AddDocumentForm
          isVisible={isAddDocumentsFormVisible}
          onClose={handleCloseAddDocumentsForm}
          trailer={selectedTrailer}
          authToken={authToken}
          onDocumentAdded={handleDocumentAdded}
          trailerId={selectedTrailer.id}
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 5,
  },
});

// Merge additional styles with the imported styles
Object.assign(styles, additionalStyles);

export default TrailersScreen;