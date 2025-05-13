import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import {styles} from './styles.js'; 
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

const ModernInteractiveMap = () => {
  // State variables
  const [driverId, setDriverId] = useState('12');
  const [driverIdSet, setDriverIdSet] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1ASQBSUFFS-7_5fHVn4RxIzSuTmSvTC0&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, []);

  // Handle search location
  const handleSearchLocation = (query) => {
    if (!query.trim() || !googleMapRef.current) return;
    
    const placesService = new window.google.maps.places.PlacesService(googleMapRef.current);
    placesService.textSearch(
      { query: query },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
          const place = results[0];
          const location = place.geometry.location;
          
          // Center map on found location
          googleMapRef.current.setCenter(location);
          googleMapRef.current.setZoom(14);
          
          // Set current location for potential saving
          setCurrentLatLng({
            lat: location.lat(),
            lng: location.lng()
          });
          
          openPopup();
          
          // Pre-fill location name with search result
          setLocationName(place.name);
        } else {
          alert("Location not found. Please try a different search term.");
        }
      }
    );
  };

  // Initialize map once API is loaded
  const initializeMap = () => {
    if (mapRef.current && !googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 5,
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
              { "color": COLORS.background }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              { "color": COLORS.accent2 }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              { "color": COLORS.card }
            ]
          }
        ]
      });
      
      setMapLoaded(true);
      
      // Add click listener when driver ID is set
      if (driverIdSet) {
        enableMap();
      }
    }
  };

  // Enable map after driver ID is set
  const enableMap = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
      });
      
      // Add click listener
      window.google.maps.event.addListener(googleMapRef.current, 'click', (event) => {
        setCurrentLatLng({
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        });
        openPopup();
      });
    }
  };

  // Set driver ID and enable map
  const handleSetDriverId = () => {
    if (!driverId.trim()) {
      alert("Please enter a valid Driver ID.");
      return;
    }
    setDriverIdSet(true);
    enableMap();
  };

  // Open popup with animation
  const openPopup = () => {
    setShowPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // Close popup with animation
  const closePopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => setShowPopup(false));
  };

  // Add marker to map
  const addMarker = (lat, lng, title) => {
    if (googleMapRef.current) {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMapRef.current,
        title: title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: COLORS.primary,
          fillOpacity: 1,
          strokeColor: COLORS.card,
          strokeWeight: 2,
          scale: 8
        }
      });
      markersRef.current.push(marker);
    }
  };

  // Clear all markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  // Save location
  const saveLocation = () => {
    if (!locationName.trim()) {
      alert("Please enter a name for this location.");
      return;
    }

    // Add marker to map
    addMarker(currentLatLng.lat, currentLatLng.lng, locationName);

    // Add the location to our list
    setSelectedLocations([
      ...selectedLocations, 
      { 
        name: locationName, 
        lat: currentLatLng.lat, 
        lng: currentLatLng.lng 
      }
    ]);

    // Reset and close popup
    setLocationName('');
    closePopup();
  };

  // Send route
  const sendRoute = () => {
    if (selectedLocations.length === 0) {
      alert("No locations to send!");
      return;
    }

    // Close popup if it's open
    if (showPopup) {
      closePopup();
    }
    
    // Show success message with animation
    setShowSuccess(true);
    Animated.timing(successFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    // Hide success message after 3 seconds and reset
    setTimeout(() => {
      Animated.timing(successFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setShowSuccess(false);
        setSelectedLocations([]);
        clearMarkers();
      });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <View 
        ref={mapRef}
        style={styles.map}
      />

      {/* Search Bar - Only shown when driver is set */}
      {driverIdSet && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.light}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearchLocation(searchQuery)}
            >
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Driver ID Selection */}
      {!driverIdSet && (
        <View style={styles.driverIdPopup}>
          <Text style={styles.popupTitle}>Enter Driver ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Driver ID"
            value={driverId}
            onChangeText={setDriverId}
            keyboardType="numeric"
            placeholderTextColor={COLORS.light}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSetDriverId}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay and Popup */}
      {showPopup && (
        <Animated.View 
          style={[
            styles.overlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles.overlayTouchable}
            onPress={closePopup}
            activeOpacity={1}
          >
            <View style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <Text style={styles.popupTitle}>Enter Location Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Location Name"
                value={locationName}
                onChangeText={setLocationName}
                placeholderTextColor={COLORS.light}
              />
              <TouchableOpacity 
                style={styles.button}
                onPress={saveLocation}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={closePopup}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Location List */}
              <View style={styles.locationList}>
                <Text style={styles.listTitle}>Saved Locations:</Text>
                <ScrollView style={styles.scrollView}>
                  {selectedLocations.map((loc, index) => (
                    <View key={index} style={styles.locationItem}>
                      <Text style={styles.locationItemText}>
                        {index + 1}. {loc.name} ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
              
              {/* Send Route Button */}
              <TouchableOpacity 
                style={[styles.button, styles.sendRouteButton]}
                onPress={sendRoute}
              >
                <Text style={styles.buttonText}>Send Route 📤</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Success Message */}
      {showSuccess && (
        <Animated.View 
          style={[
            styles.successMessage,
            { opacity: successFadeAnim }
          ]}
        >
          <Text style={styles.successText}>Route sent successfully!</Text>
        </Animated.View>
      )}
    </View>
  );
};



export default ModernInteractiveMap;