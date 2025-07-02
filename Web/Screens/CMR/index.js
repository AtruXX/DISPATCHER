import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // You'll need to install this
import DEFAULT_CMR_DATA from './DefaultData'; // Keep as fallback
import { styles, COLORS } from './styles';
import { jsPDF } from "jspdf";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Replace this with your actual API base URL
const API_BASE_URL = 'https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/'; // Update this with your actual URL

const TransportsScreen = ({ route, navigation }) => {
  const [cmrData, setCmrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const contentRef = useRef();
  window.downloadPdfRef = contentRef;

  // Get transport ID from route params
  const transportId = route?.params?.transportId;

  const handlePress = () => {
    navigation.navigate('PDFC')
  };

  // Function to get auth token from localStorage
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
          setLoading(false); // FIXED: Set loading to false when no token
        }
      } catch (err) {
        console.error("Error getting auth token:", err);
        setError('Failed to load authentication token.');
        setLoading(false); // FIXED: Set loading to false on error
      }
      // REMOVED: finally block that was setting loading to false prematurely
    };

    getAuthToken();
  }, []);

  // Function to fetch CMR data from API
  // Function to fetch CMR data from API with enhanced debugging
const fetchCMRData = async (transportId) => {
  try {
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    if (!transportId) {
      throw new Error('Transport ID is required');
    }

    console.log("=== API CALL DEBUG INFO ===");
    console.log("Transport ID:", transportId);
    console.log("Auth Token (first 10 chars):", authToken.substring(0, 10) + "...");
    console.log("Full URL:", `${API_BASE_URL}transport-cmr/${transportId}`);
    console.log("=========================");
    
    const response = await fetch(`${API_BASE_URL}transport-cmr/${transportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${authToken}`, // Try different formats if this doesn't work
        'Content-Type': 'application/json',
        // Add these if your API requires them:
        // 'Accept': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      // Get more details about the error
      let errorMessage = `Server error: ${response.status}`;
      
      try {
        const errorBody = await response.text();
        console.log("Error response body:", errorBody);
        errorMessage += ` - ${errorBody}`;
      } catch (e) {
        console.log("Could not read error response body");
      }

      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Check your permissions or token format.');
      } else if (response.status === 404) {
        throw new Error('CMR document not found');
      } else {
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    console.log("API Response data:", data);
    
    // FIXED: API returns an array, extract the first object
    if (Array.isArray(data) && data.length > 0) {
      const cmrDocument = data[0];
      
      // FIXED: Calculate total if not provided by API
      if (cmrDocument.de_plata && !cmrDocument.de_plata.total) {
        const { pret_transport, reduceri, suplimente, alte_cheltuieli } = cmrDocument.de_plata;
        const total = (
          parseFloat(pret_transport || 0) + 
          parseFloat(suplimente || 0) + 
          parseFloat(alte_cheltuieli || 0) - 
          parseFloat(reduceri || 0)
        ).toFixed(2);
        cmrDocument.de_plata.total = total;
      }
      
      return cmrDocument;
    } else if (!Array.isArray(data)) {
      return data; // In case API changes to return single object
    } else {
      throw new Error('No CMR document found in response');
    }
  } catch (error) {
    console.error('Error fetching CMR data:', error);
    throw error;
  }
};

  const loadCMRData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (transportId && authToken) { // FIXED: Check for both transportId AND authToken
        // Try to fetch from API
        try {
          const apiData = await fetchCMRData(transportId);
          setCmrData(apiData);
          setLoading(false); // FIXED: Set loading to false on success
        } catch (apiError) {
          console.error('API fetch failed:', apiError);
          
          // Show error message but also offer to use default data for development
          Alert.alert(
            'Error Loading Data',
            `Failed to load CMR data: ${apiError.message}\n\nWould you like to use sample data instead?`,
            [
              {
                text: 'Retry',
                onPress: () => loadCMRData(),
              },
              {
                text: 'Use Sample',
                onPress: () => {
                  setCmrData(DEFAULT_CMR_DATA);
                  setLoading(false);
                },
              },
              {
                text: 'Go Back',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
            ]
          );
          setLoading(false); // FIXED: Set loading to false when showing alert
          return;
        }
      } else if (transportId && !authToken) {
        // Transport ID provided but no auth token
        console.warn('Transport ID provided but no auth token available');
        setError('Authentication required. Please log in first.');
        setLoading(false);
      } else {
        // No transport ID provided, use default data
        console.warn('No transport ID provided, using default data');
        setCmrData(DEFAULT_CMR_DATA);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error loading CMR data:", err);
      setError(err.message || "Failed to load CMR document");
      setLoading(false);
    }
  };

  // FIXED: Load CMR data when authToken is available
  useEffect(() => {
    if (authToken) {
      loadCMRData(); // FIXED: Call the correct function name
    }
  }, [authToken, transportId]); // FIXED: Added transportId as dependency

  // Function to retry loading data
  const retryLoadData = () => {
    setError(null);
    loadCMRData(); // FIXED: Call the correct function name
  };


  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>CMR TRANSPORT</Text>
      <Text style={styles.headerSubtitle}>Document Nr. {cmrData?.numar_cmr || 'CMR-2025-5678'}</Text>
    </View>
  );

 const renderCMRDocument = () => {
  // Use cmrData from your component state
  const data = cmrData;
  
  // FIXED: Add null check to prevent errors
  if (!data) {
    return (
      <View style={styles.cmrContainer}>
        <Text style={styles.cmrCellValue}>No CMR data available</Text>
      </View>
    );
  }
  
  return (
 <View style={styles.cmrContainer}>
      {/* Header Section */}
      <View style={styles.cmrHeaderSection}>
        <View style={styles.cmrHeaderTop}>
          <View style={styles.cmrCopyInfo}>
            <Text style={styles.cmrCopyNumber}>1</Text>
            <Text style={styles.cmrCopyText}>Copy for sender</Text>
            <Text style={styles.cmrCopyText}>Exemplaire de l'expéditeur</Text>
          </View>
          <View style={styles.cmrHeaderRight}>
            <View style={styles.cmrHeaderRightLeft}>
              <Text style={styles.cmrInternationalText}>INTERNATIONAL</Text>
              <Text style={styles.cmrInternationalText}>CONSIGNMENT NOTE</Text>
            </View>
            <View style={styles.cmrHeaderRightCenter}>
              <Text style={styles.cmrBigText}>CMR</Text>
            </View>
            <View style={styles.cmrHeaderRightRight}>
              <Text style={styles.cmrTransportText}>LETTRE DE VOITURE</Text>
              <Text style={styles.cmrTransportText}>INTERNATIONALE</Text>
            </View>
          </View>
        </View>
        
        {/* Disclaimer text */}
        <View style={{padding: 6, borderTopWidth: 1, borderTopColor: '#DC143C'}}>
          <Text style={{fontSize: 9, color: '#000000', textAlign: 'center', lineHeight: 12}}>
            This transport is subject, notwithstanding any clause to the contrary: • La Convention relative au contrat de{'\n'}
            transport international de marchandises par route (CMR).
          </Text>
        </View>
      </View>

      <View style={styles.cmrContent}>
        {/* Main content area with two columns */}
        <View style={styles.cmrMainRow}>
          {/* Left Column */}
          <View style={styles.cmrLeftColumn}>
            {/* Section 1 - Sender */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>1</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Sender (name, address, country)</Text>
                <Text style={styles.cmrCellLabelSmall}>Expéditeur (nom, adresse, pays)</Text>
                <Text style={styles.cmrCellValue}>{data?.expeditor_nume || ''}</Text>
                <Text style={styles.cmrCellValue}>{data?.expeditor_adresa || ''}</Text>
                <Text style={styles.cmrCellValue}>{data?.expeditor_tara || ''}</Text>
                <View style={styles.cmrCountrySection}>
                  <Text style={styles.cmrCountryLabel}>1 a) Country</Text>
                  <View style={styles.cmrCountryBox}>
                    <Text style={styles.cmrCountryText}></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Section 2 - Consignee */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>2</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Consignee (name, address, country)</Text>
                <Text style={styles.cmrCellLabelSmall}>Destinataire (nom, adresse, pays)</Text>
                <Text style={styles.cmrCellValue}>{data?.destinatar_nume || ''}</Text>
                <Text style={styles.cmrCellValue}>{data?.destinatar_adresa || ''}</Text>
                <Text style={styles.cmrCellValue}>{data?.destinatar_tara || ''}</Text>
                <View style={styles.cmrCountrySection}>
                  <Text style={styles.cmrCountryLabel}>2 a) Country</Text>
                  <View style={styles.cmrCountryBox}>
                    <Text style={styles.cmrCountryText}></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Section 3 - Place of delivery */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>3</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Place of delivery of the goods (city, country)</Text>
                <Text style={styles.cmrCellLabelSmall}>Lieu prévu pour la livraison de la marchandise (lieu, pays)</Text>
                <Text style={styles.cmrCellValue}>{data?.loc_livrare || ''}</Text>
                <View style={styles.cmrCountrySection}>
                  <Text style={styles.cmrCountryLabel}>3 a) km to border</Text>
                  <View style={styles.cmrCountryBox}>
                    <Text style={styles.cmrCountryText}></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Section 4 - Place and date of taking over */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>4</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Place and date of taking over of the goods (city, country, date)</Text>
                <Text style={styles.cmrCellLabelSmall}>Lieu et date de la prise en charge de la marchandise (lieu, pays, date)</Text>
                <Text style={styles.cmrCellValue}>{data?.loc_incarcare || ''}, {data?.data_incarcare || ''}</Text>
                <View style={styles.cmrCountrySection}>
                  <Text style={styles.cmrCountryLabel}>4 a) km to border</Text>
                  <View style={styles.cmrCountryBox}>
                    <Text style={styles.cmrCountryText}></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Section 5 - Documents attached */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>5</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Documents attached</Text>
                <Text style={styles.cmrCellLabelSmall}>Documents annexés</Text>
                <Text style={styles.cmrCellValue}></Text>
              </View>
            </View>

            {/* Sections 13, 14, 21, 22 at bottom */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>13</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Sender's instructions (for customs and other procedures)</Text>
                <Text style={styles.cmrCellLabelSmall}>Instructions de l'expéditeur</Text>
                <Text style={styles.cmrCellValue}>{data?.instructiuni_expeditor || ''}</Text>
              </View>
            </View>

            <View style={styles.cmrFareSection}>
              <View style={styles.cmrFareLeft}>
                <View style={styles.cmrNumberCell}>
                  <Text style={styles.cmrCellNumber}>14</Text>
                </View>
                <View style={styles.cmrCell}>
                  <Text style={styles.cmrCellLabel}>Fare is payed by</Text>
                  <Text style={styles.cmrCellLabelSmall}>Prescriptions d'affranchissement</Text>
                  <View style={styles.cmrCheckboxSection}>
                    <View style={styles.cmrCheckbox}>
                      <Text style={styles.cmrCheckMark}></Text>
                    </View>
                    <Text style={styles.cmrCheckboxText}>sender / franco</Text>
                  </View>
                  <View style={styles.cmrCheckboxSection}>
                    <View style={styles.cmrCheckbox}>
                      <Text style={styles.cmrCheckMark}>X</Text>
                    </View>
                    <Text style={styles.cmrCheckboxText}>consignee / non franco</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cmrFareRight}>
                <View style={styles.cmrNumberCell}>
                  <Text style={styles.cmrCellNumber}>15</Text>
                </View>
                <View style={styles.cmrCell}>
                  <Text style={styles.cmrCellLabel}>Reimbursement</Text>
                  <Text style={styles.cmrCellLabelSmall}>Remboursement</Text>
                  <Text style={styles.cmrCellValue}>{data?.rambursare || ''}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>21</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Established in (city)</Text>
                <Text style={styles.cmrCellLabelSmall}>Etabli à (lieu)</Text>
                <Text style={styles.cmrCellValue}>
                  {data?.incheiat_la && typeof data.incheiat_la === 'object' ? 
                    `${data.incheiat_la?.locatie || ''}` : ''}
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                  <Text style={styles.cmrCellLabelSmall}>Day</Text>
                  <Text style={styles.cmrCellValue}>
                    {data?.incheiat_la && typeof data.incheiat_la === 'object' ? 
                      `${data.incheiat_la?.data || ''}` : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.cmrRightColumn}>
            {/* Section 16 - Carrier */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>16</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Carrier (name, address, country)</Text>
                <Text style={styles.cmrCellLabelSmall}>Transporteur (nom, adresse, pays)</Text>
                <Text style={styles.cmrCellValue}>{data?.transportator || 'C&C Logistic SRL'}</Text>
                <View style={styles.cmrCountrySection}>
                  <Text style={styles.cmrCountryLabel}>16 a) Vat Id</Text>
                  <View style={[styles.cmrCountryBox, {width: 60}]}>
                    <Text style={styles.cmrCountryText}></Text>
                  </View>
                </View>
                <View style={{marginTop: 5}}>
                  <Text style={styles.cmrCellLabelSmall}>Vehicle reg. num.</Text>
                  <Text style={styles.cmrCellLabelSmall}>Num. du véh.</Text>
                  <Text style={styles.cmrCellLabelSmall}>and trail. reg.</Text>
                  <Text style={styles.cmrCellLabelSmall}>et les remorq.</Text>
                </View>
              </View>
            </View>

            {/* Section 17 - Successive carrier */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>17</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Successive carrier (name, address, country)</Text>
                <Text style={styles.cmrCellLabelSmall}>Transporteur successifs (nom, adresse, pays)</Text>
                <Text style={styles.cmrCellValue}>{data?.transportatori_succesivi || ''}</Text>
                <View style={{marginTop: 5}}>
                  <Text style={styles.cmrCellLabelSmall}>Vehicle reg. num.</Text>
                  <Text style={styles.cmrCellLabelSmall}>Num. du véh.</Text>
                  <Text style={styles.cmrCellLabelSmall}>and trail. reg.</Text>
                  <Text style={styles.cmrCellLabelSmall}>et les remorq.</Text>
                </View>
              </View>
            </View>

            {/* Section 18 - Carrier's reservation */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>18</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Carrier's reservation and observations</Text>
                <Text style={styles.cmrCellLabelSmall}>Réserves et observations du transporteur</Text>
                <Text style={styles.cmrCellValue}>{data?.rezerve_observatii || ''}</Text>
              </View>
            </View>

            {/* Section 19 - Special agreements */}
            <View style={styles.cmrRow}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>19</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Special agreements</Text>
                <Text style={styles.cmrCellLabelSmall}>Conventions particulières</Text>
                <Text style={styles.cmrCellValue}>{data?.conventii_speciale || ''}</Text>
              </View>
            </View>

            {/* Section 20 - Payment */}
            <View style={styles.cmrPaymentSection}>
              <View style={styles.cmrPaymentHeader}>
                <View style={styles.cmrPaymentNumber}>
                  <Text style={styles.cmrCellNumber}>20</Text>
                </View>
                <View style={styles.cmrPaymentTitle}>
                  <Text style={styles.cmrCellLabel}>To be paid by</Text>
                  <Text style={styles.cmrCellLabelSmall}>A payer par</Text>
                </View>
              </View>
              
              <View style={styles.cmrPaymentGrid}>
                <View style={styles.cmrPaymentHeaderRow}>
                  <View style={styles.cmrPaymentHeaderCell}>
                    <Text style={styles.cmrCellLabelSmall}>Sender</Text>
                    <Text style={styles.cmrCellLabelSmall}>Expéditeur</Text>
                  </View>
                  <View style={styles.cmrPaymentHeaderCell}>
                    <Text style={styles.cmrCellLabelSmall}>Currency</Text>
                    <Text style={styles.cmrCellLabelSmall}>Monnaie</Text>
                  </View>
                  <View style={styles.cmrPaymentHeaderCell}>
                    <Text style={styles.cmrCellLabelSmall}>Consignee</Text>
                    <Text style={styles.cmrCellLabelSmall}>Le destinataire</Text>
                  </View>
                </View>
                
                <View style={styles.cmrPaymentRow}>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentLabel}>Transport price</Text>
                    <Text style={styles.cmrCellLabelSmall}>Prix de transport</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>EUR</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>{data?.de_plata?.pret_transport || ''}</Text>
                  </View>
                </View>
                
                <View style={styles.cmrPaymentRow}>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentLabel}>Discount</Text>
                    <Text style={styles.cmrCellLabelSmall}>Réductions</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}></Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>{data?.de_plata?.reduceri || ''}</Text>
                  </View>
                </View>
                
                <View style={styles.cmrPaymentRow}>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentLabel}>Charges</Text>
                    <Text style={styles.cmrCellLabelSmall}>Solde</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}></Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>{data?.de_plata?.sold || ''}</Text>
                  </View>
                </View>
                
                <View style={styles.cmrPaymentRow}>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentLabel}>Supplements</Text>
                    <Text style={styles.cmrCellLabelSmall}>Suppléments</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}></Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>{data?.de_plata?.suplimente || ''}</Text>
                  </View>
                </View>
                
                <View style={styles.cmrPaymentRow}>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentLabel}>Additional costs</Text>
                    <Text style={styles.cmrCellLabelSmall}>Frais accessoires</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}></Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>{data?.de_plata?.alte_cheltuieli || ''}</Text>
                  </View>
                </View>
                
                <View style={styles.cmrPaymentRow}>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentLabel}>TOTAL</Text>
                    <Text style={styles.cmrCellLabelSmall}>Le / Au</Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}></Text>
                  </View>
                  <View style={styles.cmrPaymentCell}>
                    <Text style={styles.cmrPaymentValue}>{data?.de_plata?.total || ''}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Table Section - Cargo details (6-12) */}
        <View style={styles.cmrTableSection}>
          <View style={styles.cmrTableHeader}>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>6</Text>
              <Text style={styles.cmrTableHeaderText}>Marks and No's</Text>
              <Text style={styles.cmrTableHeaderText}>Marques et</Text>
              <Text style={styles.cmrTableHeaderText}>numéros</Text>
            </View>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>7</Text>
              <Text style={styles.cmrTableHeaderText}>Number of</Text>
              <Text style={styles.cmrTableHeaderText}>packages</Text>
              <Text style={styles.cmrTableHeaderText}>Nombre des</Text>
              <Text style={styles.cmrTableHeaderText}>colis</Text>
            </View>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>8</Text>
              <Text style={styles.cmrTableHeaderText}>Method of</Text>
              <Text style={styles.cmrTableHeaderText}>packing</Text>
              <Text style={styles.cmrTableHeaderText}>Mode de</Text>
              <Text style={styles.cmrTableHeaderText}>l'emballage</Text>
            </View>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>9</Text>
              <Text style={styles.cmrTableHeaderText}>Nature of the goods</Text>
              <Text style={styles.cmrTableHeaderText}>Nature de la</Text>
              <Text style={styles.cmrTableHeaderText}>marchandise</Text>
            </View>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>10</Text>
              <Text style={styles.cmrTableHeaderText}>Numero de tarif</Text>
              <Text style={styles.cmrTableHeaderText}>No. de tarif</Text>
            </View>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>11</Text>
              <Text style={styles.cmrTableHeaderText}>Gross weight (kg)</Text>
              <Text style={styles.cmrTableHeaderText}>Poids brut (kg)</Text>
            </View>
            <View style={styles.cmrTableHeaderCell}>
              <Text style={styles.cmrTableHeaderNumber}>12</Text>
              <Text style={styles.cmrTableHeaderText}>Volume m³</Text>
              <Text style={styles.cmrTableHeaderText}>Cubage en</Text>
            </View>
          </View>
          
          <View style={styles.cmrTableData}>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.marci_numere || ''}</Text>
            </View>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.numar_colete || ''}</Text>
            </View>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.mod_ambalare || ''}</Text>
            </View>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.natura_marfii || ''}</Text>
            </View>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.nr_static || ''}</Text>
            </View>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.greutate_bruta || ''}</Text>
            </View>
            <View style={styles.cmrTableDataCell}>
              <Text style={styles.cmrTableCellText}>{data?.cubaj || ''}</Text>
            </View>
          </View>
          
          {/* Class and danger goods section */}
          <View style={styles.cmrTableBottomSection}>
            <View style={styles.cmrClassSection}>
              <View style={styles.cmrClassRow}>
                <Text style={styles.cmrClassLabel}>Class</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>Number</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>Letter</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>ADR 8.5</Text>
              </View>
              <View style={styles.cmrClassRow}>
                <Text style={styles.cmrClassLabel}>Classe</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>Chiffre</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>Lettre</Text>
                <View style={styles.cmrClassBox}></View>
              </View>
              <View style={styles.cmrClassRow}>
                <Text style={styles.cmrClassLabel}>Class</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>Number</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>Letter</Text>
                <View style={styles.cmrClassBox}></View>
                <Text style={styles.cmrClassLabel}>ADR 8.5</Text>
              </View>
            </View>
            <View style={styles.cmrClassSection}>
              <Text style={styles.cmrCellLabelSmall}>danger      substance</Text>
            </View>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.cmrSignatureSection}>
          <View style={styles.cmrSignatureBox}>
            <View style={styles.cmrSignatureHeader}>
              <Text style={styles.cmrSignatureNumber}>22</Text>
            </View>
            <View style={styles.cmrSignatureContent}>
              <Text style={styles.cmrSignatureText}>Signature and stamp of the sender</Text>
              <Text style={styles.cmrSignatureText}>Signature et timbre de l'expéditeur</Text>
              {data?.semnatura_expeditor === "signed-electronically" && (
                <Text style={styles.cmrSignatureText}>Semnat electronic</Text>
              )}
            </View>
          </View>
          
          <View style={styles.cmrSignatureBox}>
            <View style={styles.cmrSignatureHeader}>
              <Text style={styles.cmrSignatureNumber}>23</Text>
            </View>
            <View style={styles.cmrSignatureContent}>
              <Text style={styles.cmrSignatureText}>Signature and stamp of the carrier</Text>
              <Text style={styles.cmrSignatureText}>Signature et timbre du transporteur</Text>
              {data?.semnatura_transportator === "signed-electronically" && (
                <Text style={styles.cmrSignatureText}>Semnat electronic</Text>
              )}
            </View>
          </View>
          
          <View style={styles.cmrSignatureBox}>
            <View style={styles.cmrSignatureHeader}>
              <Text style={styles.cmrSignatureNumber}>24</Text>
            </View>
            <View style={styles.cmrSignatureContent}>
              <Text style={styles.cmrSignatureText}>Goods received (location)</Text>
              <Text style={styles.cmrSignatureText}>Marchandises reçues à (location)</Text>
              <View style={styles.cmrDateLine}></View>
              <Text style={styles.cmrDateText}>date</Text>
              <Text style={styles.cmrSignatureText}>Signature and stamp of the consignee</Text>
              <Text style={styles.cmrSignatureText}>Signature et timbre du destinataire</Text>
              {data?.semnatura_destinatar === "signed-electronically" && (
                <Text style={styles.cmrSignatureText}>Semnat electronic</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Also make sure to update the main render to include the conditional check:
// Updated main render with proper error handling
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
        style={styles.printButton}
        onPress={() => Alert.alert("Print", "Document se printează...")}
      >
        <Ionicons name="print" size={24} color="#303F9F" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={retryLoadData}
      >
        <Ionicons name="refresh" size={24} color="#303F9F" />
      </TouchableOpacity>
    </View>
    
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {renderHeader()}
      {cmrData && renderCMRDocument()}
      
      {/* Fixed: Wrap everything in proper containers */}
      <View style={{ marginTop: 16 }}>
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.downloadButtonGradient || { borderRadius: 8 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity 
            style={styles.downloadButton || { padding: 16, alignItems: 'center' }} 
            onPress={handlePress}
            activeOpacity={0.9}
          >
            <Text style={styles.downloadButtonText || { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>
              DESCARCA
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default TransportsScreen;