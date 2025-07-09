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
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateCMRPDF } from '../PDFGenerator/index'; // Import your PDF generation function
// Replace this with your actual API base URL
const API_BASE_URL = 'https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/'; // Update this with your actual URL

const TransportsScreen = ({ route, navigation }) => {
  const [cmrData, setCmrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const contentRef = useRef();
  window.downloadPdfRef = contentRef;

  const transportId = route?.params?.transportId;
  const handleDownloadPDF = async () => {
  try {
    if (!cmrData) {
      Alert.alert('Error', 'No CMR data available to download');
      return;
    }

    if (Platform.OS === 'web') {
      // Use web PDF generation
      Alert.alert('Generating PDF', 'Please wait while we generate your CMR document...');
      await generateCMRPDF(cmrData);
      Alert.alert('Success', 'CMR document has been downloaded to your Downloads folder!');
    } else {
      // For mobile platforms, you might want to show a different message
      Alert.alert('Feature Not Available', 'PDF download is currently only available on web version');
    }
    
  } catch (error) {
    console.error('PDF generation error:', error);
    Alert.alert('Error', 'Failed to generate PDF. Please try again.');
  }
};
// 3. REPLACE YOUR EXISTING handlePress FUNCTION WITH THIS:
const handlePress = () => {
  handleDownloadPDF(); // This will now download the PDF instead of navigating
};

  

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

 // Updated renderCMRDocument function to match the exact photo layout
const renderCMRDocument = () => {
  const data = cmrData;
  
  if (!data) {
    return (
      <View style={styles.cmrContainer}>
        <Text style={styles.cmrCellValue}>No CMR data available</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.cmrContainer}>
      {/* Header Section - Exactly like photo */}
      <View style={styles.cmrHeaderSection}>
        <View style={styles.cmrHeaderTop}>
          <View style={styles.cmrCopyInfo}>
            <Text style={styles.cmrCopyNumber}>1</Text>
            <Text style={styles.cmrCopyText}>Exemplaire de l'expéditeur</Text>
            <Text style={styles.cmrCopyText}>Absender (Name, Anschrift, Land)</Text>
          </View>
          <View style={styles.cmrHeaderCenter}>
            <Text style={styles.cmrHeaderTitle}>SCRISOARE DE TRANSPORT INTERNATIONAL</Text>
            <Text style={styles.cmrHeaderTitle}>INTERNATIONALER FRACHTBRIEF</Text>
            <Text style={styles.cmrBigText}>CMR</Text>
            <Text style={styles.cmrSmallText}>ACEST TRANSPORT E SUPUS INDEPENDENT DE</Text>
            <Text style={styles.cmrSmallText}>ORICE CLAUZA CONTRARA, CONVENTIEI</Text>
            <Text style={styles.cmrSmallText}>RELATIVE LA CONTRACTUL DE TRANSPORT</Text>
            <Text style={styles.cmrSmallText}>INTERNATIONAL DE MARFURI PE SOSELE</Text>
            <Text style={styles.cmrSmallText}>(C.M.R.)</Text>
          </View>
          <View style={styles.cmrHeaderRight}>
            <Text style={styles.cmrSmallText}>DIESE BEFÖRDERUNG UNTERLIEGT TROTZ</Text>
            <Text style={styles.cmrSmallText}>ENTGEGENSTEHENDER ABMACHUNG DEM</Text>
            <Text style={styles.cmrSmallText}>ÜBEREINKOMMEN ÜBER DEN BEFÖRDERUNGS-</Text>
            <Text style={styles.cmrSmallText}>VERTRAG IM INTERNATIONALEN STRASSEN-</Text>
            <Text style={styles.cmrSmallText}>GÜTERVERKEHR (CMR)</Text>
          </View>
        </View>
        
        {/* Company Logo/Header Area */}
        <View style={styles.cmrCompanyHeader}>
          <Text style={styles.cmrCompanyName}>C&C Logistic</Text>
          <Text style={styles.cmrCompanyDetails}>e-mail: office@cnclogistic.ro, site: www.cnclogistic.ro</Text>
        </View>
      </View>

      {/* Main content area with two columns - Exact layout */}
      <View style={styles.cmrMainRow}>
        {/* Left Column */}
        <View style={styles.cmrLeftColumn}>
          {/* Section 1 - Expeditor */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>1</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Expeditor (nume, adresa, țara)</Text>
              <Text style={styles.cmrCellLabelSmall}>Absender (Name, Anschrift, Land)</Text>
              <Text style={styles.cmrCellValue}>{data?.expeditor_nume || ''}</Text>
              <Text style={styles.cmrCellValue}>{data?.expeditor_adresa || ''}</Text>
              <Text style={styles.cmrCellValue}>{data?.expeditor_tara || ''}</Text>
            </View>
          </View>

          {/* Section 2 - Destinatar */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>2</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Destinatar (nume, adresa, țara)</Text>
              <Text style={styles.cmrCellLabelSmall}>Empfänger (Name, Anschrift, Land)</Text>
              <Text style={styles.cmrCellValue}>{data?.destinatar_nume || ''}</Text>
              <Text style={styles.cmrCellValue}>{data?.destinatar_adresa || ''}</Text>
              <Text style={styles.cmrCellValue}>{data?.destinatar_tara || ''}</Text>
            </View>
          </View>

          {/* Section 3 - Locul prevăzut pentru livrarea mărfii */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>3</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Locul prevăzut pentru livrarea mărfii</Text>
              <Text style={styles.cmrCellLabelSmall}>Bestimmungsort des Gutes</Text>
              <Text style={styles.cmrCellLabelSmall}>Localitatea/Ort</Text>
              <Text style={styles.cmrCellValue}>{data?.loc_livrare || ''}</Text>
              <Text style={styles.cmrCellLabelSmall}>Țara/Land</Text>
              <Text style={styles.cmrCellLabelSmall}>Data/Datum</Text>
            </View>
          </View>

          {/* Section 4 - Locul și data încărcării mărfii */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>4</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Locul și data încărcării mărfii</Text>
              <Text style={styles.cmrCellLabelSmall}>Ort und Tag der Übernahme des Gutes</Text>
              <Text style={styles.cmrCellLabelSmall}>Țara/Land</Text>
              <Text style={styles.cmrCellValue}>{data?.loc_incarcare || ''}</Text>
              <Text style={styles.cmrCellLabelSmall}>Data/Datum</Text>
              <Text style={styles.cmrCellValue}>{data?.data_incarcare || ''}</Text>
            </View>
          </View>

          {/* Section 5 - Documente anexate */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>5</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Documente anexate</Text>
              <Text style={styles.cmrCellLabelSmall}>Beigefügte Dokumente</Text>
            </View>
          </View>

          {/* Section 13 - Instrucțiunile expeditorului */}
          <View style={styles.cmrLargeRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>13</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Instrucțiunile expeditorului (formalități vamă și oficiale)</Text>
              <Text style={styles.cmrCellLabelSmall}>Anweisungen des Absenders (Zoll-und sonstige Behandlung)</Text>
              <Text style={styles.cmrCellValue}>{data?.instructiuni_expeditor || ''}</Text>
            </View>
          </View>

          {/* Section 14 & 21 - Combined row */}
          <View style={styles.cmrFareSection}>
            <View style={styles.cmrFareLeft}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>14</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Prescripții de francare</Text>
                <Text style={styles.cmrCellLabelSmall}>Frachtahlungsanweisungen</Text>
                <View style={styles.cmrCheckboxSection}>
                  <View style={styles.cmrCheckbox}></View>
                  <Text style={styles.cmrCheckboxText}>Franco/Frei</Text>
                </View>
                <View style={styles.cmrCheckboxSection}>
                  <View style={styles.cmrCheckbox}>
                    <Text style={styles.cmrCheckMark}>X</Text>
                  </View>
                  <Text style={styles.cmrCheckboxText}>Non franco/Unfrei</Text>
                </View>
              </View>
            </View>
            <View style={styles.cmrFareRight}>
              <View style={styles.cmrNumberCell}>
                <Text style={styles.cmrCellNumber}>21</Text>
              </View>
              <View style={styles.cmrCell}>
                <Text style={styles.cmrCellLabel}>Încheiat la</Text>
                <Text style={styles.cmrCellLabelSmall}>Ausgefertigt in</Text>
                <Text style={styles.cmrCellValue}>
                  {data?.incheiat_la && typeof data.incheiat_la === 'object' ? 
                    `${data.incheiat_la?.locatie || ''}` : ''}
                </Text>
                <View style={styles.cmrDateSection}>
                  <Text style={styles.cmrCellLabelSmall}>Data</Text>
                  <Text style={styles.cmrCellLabelSmall}>Datum</Text>
                  <Text style={styles.cmrCellValue}>
                    {data?.incheiat_la && typeof data.incheiat_la === 'object' ? 
                      `${data.incheiat_la?.data || ''}` : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.cmrRightColumn}>
          {/* Section 16 - Transportator */}
          <View style={styles.cmrCarrierSection}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>16</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Transportator</Text>
              <Text style={styles.cmrCellLabelSmall}>Frachtführer</Text>
              <Text style={styles.cmrCompanyValue}>SC C&C LOGISTIC SRL</Text>
              <Text style={styles.cmrCellValue}>Str. Mareșal Ion Antonescu nr. 6, ap. 131, Cluj-Napoca</Text>
              <Text style={styles.cmrCellValue}>România</Text>
              <View style={styles.cmrVehicleDetails}>
                <Text style={styles.cmrCellLabelSmall}>Autovehicul: marca _________ Tone _______</Text>
                <Text style={styles.cmrCellLabelSmall}>Număr circulație _________________</Text>
                <Text style={styles.cmrCellLabelSmall}>Remorci: 1 ____________________</Text>
                <Text style={styles.cmrCellLabelSmall}>2 ____________________________</Text>
              </View>
            </View>
          </View>

          {/* Section 17 - Transportatori succesivi */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>17</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Transportatori succesivi (nume, adresă, țară)</Text>
              <Text style={styles.cmrCellLabelSmall}>Nachfolgende Frachtführer (Name, Anschrift, Land)</Text>
            </View>
          </View>

          {/* Section 18 - Rezerve și observații ale transportatorilor */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>18</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Rezerve și observații ale transportatorilor</Text>
              <Text style={styles.cmrCellLabelSmall}>Vorbehalte und Bemerkungen der Frachtführer</Text>
              <Text style={styles.cmrCellValue}>{data?.rezerve_observatii || ''}</Text>
            </View>
          </View>

          {/* Section 19 - Convenții speciale */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>19</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Convenții speciale</Text>
              <Text style={styles.cmrCellLabelSmall}>Besondere Vereinbarungen</Text>
              <Text style={styles.cmrCellValue}>{data?.conventii_speciale || ''}</Text>
            </View>
          </View>

          {/* Section 20 - De plată - EXACT like photo */}
          <View style={styles.cmrPaymentSection}>
            <View style={styles.cmrPaymentHeader}>
              <View style={styles.cmrPaymentNumber}>
                <Text style={styles.cmrCellNumber}>20</Text>
              </View>
              <View style={styles.cmrPaymentTitle}>
                <Text style={styles.cmrCellLabel}>De plată</Text>
                <Text style={styles.cmrCellLabelSmall}>Zu zahlen von</Text>
              </View>
            </View>
            
            <View style={styles.cmrPaymentGrid}>
              {/* Header row */}
              <View style={styles.cmrPaymentHeaderRow}>
                <View style={styles.cmrPaymentHeaderCell}>
                  <Text style={styles.cmrCellLabelSmall}>Expeditor</Text>
                  <Text style={styles.cmrCellLabelSmall}>Absender</Text>
                </View>
                <View style={styles.cmrPaymentHeaderCell}>
                  <Text style={styles.cmrCellLabelSmall}>Valuta</Text>
                </View>
                <View style={styles.cmrPaymentHeaderCell}>
                  <Text style={styles.cmrCellLabelSmall}>Destinatar</Text>
                </View>
              </View>
              
              {/* Payment rows - EXACT German/Romanian labels */}
              <View style={styles.cmrPaymentRow}>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentLabel}>Preț transport/Fracht</Text>
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
                  <Text style={styles.cmrPaymentLabel}>Reduceri/Ermäßigungen</Text>
                </View>
                <View style={styles.cmrPaymentCell}></View>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentValue}>{data?.de_plata?.reduceri || ''}</Text>
                </View>
              </View>
              
              <View style={styles.cmrPaymentRow}>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentLabel}>Sold/Zwischensumme</Text>
                </View>
                <View style={styles.cmrPaymentCell}></View>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentValue}>{data?.de_plata?.sold || ''}</Text>
                </View>
              </View>
              
              <View style={styles.cmrPaymentRow}>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentLabel}>Sporuri/Zuschläge</Text>
                </View>
                <View style={styles.cmrPaymentCell}></View>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentValue}>{data?.de_plata?.suplimente || ''}</Text>
                </View>
              </View>
              
              <View style={styles.cmrPaymentRow}>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentLabel}>Accesori/Nebengebühren</Text>
                </View>
                <View style={styles.cmrPaymentCell}></View>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentValue}>{data?.de_plata?.alte_cheltuieli || ''}</Text>
                </View>
              </View>
              
              <View style={styles.cmrPaymentRow}>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentLabel}>Diverse/Sonstiges</Text>
                </View>
                <View style={styles.cmrPaymentCell}></View>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentValue}></Text>
                </View>
              </View>
              
              <View style={styles.cmrPaymentRow}>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentLabel}>Total de plată</Text>
                  <Text style={styles.cmrCellLabelSmall}>Zu zahlende Gesamtsumme</Text>
                </View>
                <View style={styles.cmrPaymentCell}></View>
                <View style={styles.cmrPaymentCell}>
                  <Text style={styles.cmrPaymentValue}>{data?.de_plata?.total || ''}</Text>
                </View>
              </View>

              {/* Section 15 - Rambursare - in the black bar */}
              <View style={styles.cmrReimbursementRow}>
                <View style={styles.cmrReimbursementNumber}>
                  <Text style={styles.cmrWhiteText}>15</Text>
                </View>
                <View style={styles.cmrReimbursementContent}>
                  <Text style={styles.cmrWhiteText}>Rambursare</Text>
                  <Text style={styles.cmrWhiteText}>Rückerstattung</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Table Section - Cargo details (6-12) - EXACT labels */}
      <View style={styles.cmrTableSection}>
        <View style={styles.cmrTableHeader}>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>6</Text>
            <Text style={styles.cmrTableHeaderText}>Mărci și numere</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Marken und Nummern</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>7</Text>
            <Text style={styles.cmrTableHeaderText}>Nr. de colete</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Anzahl der Packstücke</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>8</Text>
            <Text style={styles.cmrTableHeaderText}>Mod de ambalare</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Art der Verpackung</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>9</Text>
            <Text style={styles.cmrTableHeaderText}>Natura mărfii</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Bezeichnung des Gutes</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>10</Text>
            <Text style={styles.cmrTableHeaderText}>Nr. statistic</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Statistic-nummer</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>11</Text>
            <Text style={styles.cmrTableHeaderText}>Greutatea brută kg</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Bruttogewicht kg</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderNumber}>12</Text>
            <Text style={styles.cmrTableHeaderText}>Cubaj</Text>
            <Text style={styles.cmrTableHeaderTextSmall}>Umfang in m³</Text>
          </View>
        </View>
        
        {/* Table data rows */}
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
        
        {/* ADR Section - EXACT layout */}
        <View style={styles.cmrTableBottomSection}>
          <View style={styles.cmrClassSection}>
            <View style={styles.cmrClassRow}>
              <Text style={styles.cmrClassLabel}>Class</Text>
              <View style={styles.cmrClassBox}></View>
              <Text style={styles.cmrClassLabel}>Cifră</Text>
              <View style={styles.cmrClassBox}></View>
              <Text style={styles.cmrClassLabel}>Literă</Text>
              <View style={styles.cmrClassBox}></View>
              <Text style={styles.cmrClassLabel}>(ADR*)</Text>
            </View>
            <View style={styles.cmrClassRow}>
              <Text style={styles.cmrClassLabel}>Clase</Text>
              <View style={styles.cmrClassBox}></View>
              <Text style={styles.cmrClassLabel}>Ziffer</Text>
              <View style={styles.cmrClassBox}></View>
              <Text style={styles.cmrClassLabel}>Buchstabe</Text>
              <View style={styles.cmrClassBox}></View>
            </View>
          </View>
        </View>
      </View>

      {/* Signature Section - EXACT layout like photo */}
      <View style={styles.cmrSignatureSection}>
        <View style={styles.cmrSignatureBox}>
          <View style={styles.cmrSignatureHeader}>
            <Text style={styles.cmrSignatureNumber}>22</Text>
          </View>
          <View style={styles.cmrSignatureContent}>
            <Text style={styles.cmrSignatureText}>Semnătura și ștampila expeditorului:</Text>
            <Text style={styles.cmrSignatureText}>Unterschrift und Stempel des Absenders</Text>
            {data?.semnatura_expeditor === "signed-electronically" && (
              <Text style={styles.cmrElectronicSignature}>Semnat electronic</Text>
            )}
          </View>
        </View>
        
        <View style={styles.cmrSignatureBox}>
          <View style={styles.cmrSignatureHeader}>
            <Text style={styles.cmrSignatureNumber}>23</Text>
          </View>
          <View style={styles.cmrSignatureContent}>
            <View style={styles.cmrStampArea}>
              <Text style={styles.cmrStampText}>C & C</Text>
              <Text style={styles.cmrStampText}>Logistic</Text>
              <Text style={styles.cmrStampText}>S.R.L.</Text>
              <Text style={styles.cmrStampText}>Cluj-Napoca</Text>
            </View>
            <Text style={styles.cmrSignatureText}>Semnătura și ștampila transportatorului:</Text>
            <Text style={styles.cmrSignatureText}>Unterschrift und Stempel des Frachtführers</Text>
            {data?.semnatura_transportator === "signed-electronically" && (
              <Text style={styles.cmrElectronicSignature}>Semnat electronic</Text>
            )}
          </View>
        </View>
        
        <View style={styles.cmrSignatureBox}>
          <View style={styles.cmrSignatureHeader}>
            <Text style={styles.cmrSignatureNumber}>24</Text>
          </View>
          <View style={styles.cmrSignatureContent}>
            <Text style={styles.cmrSignatureText}>Recepția mărfii</Text>
            <Text style={styles.cmrSignatureText}>Gut empfangen</Text>
            <View style={styles.cmrSignatureRight}>
              <Text style={styles.cmrSignatureText}>Data</Text>
              <Text style={styles.cmrSignatureText}>Datum</Text>
            </View>
            <View style={styles.cmrDateLine}></View>
            <Text style={styles.cmrSignatureText}>Semnătura și ștampila destinatarului:</Text>
            <Text style={styles.cmrSignatureText}>Unterschrift und Stempel des Empfängers</Text>
            {data?.semnatura_destinatar === "signed-electronically" && (
              <Text style={styles.cmrElectronicSignature}>Semnat electronic</Text>
            )}
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