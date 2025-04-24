import React, { useState, useEffect } from 'react';
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
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TransportsScreen = ({ navigation }) => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  
  // Hardcoded CMR data
  const cmrData = {
    "cmr_id": 10,
    "transport_id": 2,
    "driver_id": 1,
    "expeditor_nume": "AAAAAAA",
    "expeditor_adresa": "B",
    "expeditor_tara": "Cehia",
    "destinatar_nume": "V",
    "destinatar_adresa": "V",
    "destinatar_tara": "Croația",
    "loc_livrare": "V",
    "loc_incarcare": "B",
    "data_incarcare": "2025-04-05",
    "marci_numere": "D",
    "numar_colete": 3,
    "mod_ambalare": "V",
    "natura_marfii": "G",
    "nr_static": "V",
    "greutate_bruta": 32.0,
    "cubaj": 4.0,
    "instructiuni_expeditor": "V",
    "conventii_speciale": "V",
    "prescriptii_francare": "Franco",
    "rambursare": 0.0,
    "transportator": "SC C&C LOGISTIC SRL",
    "transportatori_succesivi": "",
    "rezerve_observatii": "",
    "de_plata": {
      "pret_transport": 350.0,
      "reduceri": 0.0,
      "sold": 350.0,
      "suplimente": 0.0,
      "alte_cheltuieli": 50.0,
      "total": 400.0
    },
    "incheiat_la": {
      "loc": "Cluj-Napoca",
      "data": "2025-04-24"
    }
  };
  
  // Load auth token on component mount
  useEffect(() => {
    const getAuthToken = async () => {
      try {
        console.log("Attempting to get auth token from AsyncStorage");
        const token = await AsyncStorage.getItem('authToken');
        console.log("Token from AsyncStorage:", token ? "Token exists" : "No token found");
        
        if (token) {
          setAuthToken(token);
          console.log("Auth token set in state");
          // Simulate loading data
          setTimeout(() => {
            setTransports([{ id: 1, name: 'Transport 1' }]);
            setLoading(false);
          }, 1000);
        } else {
          console.log("No token found, setting error");
          setError('Authentication required. Please log in first.');
          setLoading(false);
        }
      } catch (err) {
        console.error("Error getting auth token:", err);
        setError('Failed to load authentication token.');
        setLoading(false);
      }
    };
    
    getAuthToken();
  }, []);
  
  const getRandomColor = (id) => {
    const colors = [
      ['#FF9966', '#FF5E62'],
      ['#36D1DC', '#5B86E5'],
      ['#CB356B', '#BD3F32'],
      ['#3A1C71', '#D76D77'],
      ['#00B4DB', '#0083B0'],
      ['#FEAC5E', '#C779D0'],
      ['#43C6AC', '#191654'],
      ['#834D9B', '#D04ED6']
    ];
    return colors[id % colors.length];
  };
  
  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>CMR TRANSPORT</Text>
      
    </View>
  );

  const renderCMRDocument = () => (
    <View style={styles.cmrContainer}>
      <View style={styles.cmrHeader}>
        <View style={styles.cmrLogo}>
          <Text style={styles.cmrLogoText}>C&C LOGISTIC SRL</Text>
        </View>
        <View style={styles.cmrTitle}>
          <Text style={styles.cmrTitleText}>CMR</Text>
          <Text style={styles.cmrSubtitleText}>SCRISOARE DE TRANSPORT INTERNATIONAL</Text>
        </View>
      </View>
      
      {/* CMR Main Content */}
      <View style={styles.cmrContent}>
        {/* Row 1 - Expeditor */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>1</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Expeditor (nume, adresa, tara)</Text>
            <Text style={styles.cmrCellValue}>{cmrData.expeditor_nume}</Text>
            <Text style={styles.cmrCellValue}>{cmrData.expeditor_adresa}</Text>
            <Text style={styles.cmrCellValue}>{cmrData.expeditor_tara}</Text>
          </View>
        </View>
        
        {/* Row 2 - Destinatar */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>2</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Destinatar (nume, adresa, tara)</Text>
            <Text style={styles.cmrCellValue}>{cmrData.destinatar_nume}</Text>
            <Text style={styles.cmrCellValue}>{cmrData.destinatar_adresa}</Text>
            <Text style={styles.cmrCellValue}>{cmrData.destinatar_tara}</Text>
          </View>
        </View>
        
        {/* Row 3 - Loc de livrare */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>3</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Locul prevazut pentru livrarea marfii</Text>
            <Text style={styles.cmrCellValue}>{cmrData.loc_livrare}</Text>
          </View>
        </View>
        
        {/* Row 4 - Loc de incarcare */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>4</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Locul si data de incarcare a marfii</Text>
            <Text style={styles.cmrCellValue}>{cmrData.loc_incarcare}, {cmrData.data_incarcare}</Text>
          </View>
        </View>
        
        {/* Row 5 - Documente anexate */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>5</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Documente anexate</Text>
          </View>
        </View>
        
        {/* Table for Items - Headers */}
        <View style={styles.cmrTableHeader}>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>6</Text>
            <Text style={styles.cmrTableHeaderText}>Marci si numere</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>7</Text>
            <Text style={styles.cmrTableHeaderText}>Nr. de colete</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>8</Text>
            <Text style={styles.cmrTableHeaderText}>Mod de ambalare</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>9</Text>
            <Text style={styles.cmrTableHeaderText}>Natura marfii</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>10</Text>
            <Text style={styles.cmrTableHeaderText}>Nr. statistic</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>11</Text>
            <Text style={styles.cmrTableHeaderText}>Greutate bruta</Text>
          </View>
          <View style={styles.cmrTableHeaderCell}>
            <Text style={styles.cmrTableHeaderText}>12</Text>
            <Text style={styles.cmrTableHeaderText}>Cubaj</Text>
          </View>
        </View>
        
        {/* Table Row */}
        <View style={styles.cmrTableRow}>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.marci_numere}</Text>
          </View>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.numar_colete}</Text>
          </View>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.mod_ambalare}</Text>
          </View>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.natura_marfii}</Text>
          </View>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.nr_static}</Text>
          </View>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.greutate_bruta}</Text>
          </View>
          <View style={styles.cmrTableCell}>
            <Text style={styles.cmrTableCellText}>{cmrData.cubaj}</Text>
          </View>
        </View>
        
        {/* Instructiuni expeditor */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>13</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Instructiunile expeditorului</Text>
            <Text style={styles.cmrCellValue}>{cmrData.instructiuni_expeditor}</Text>
          </View>
        </View>
        
        {/* New section: 14 - Prescriptii francare */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>14</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Prescriptii de francare</Text>
            <Text style={styles.cmrCellValue}>{cmrData.prescriptii_francare}</Text>
          </View>
        </View>
        
        {/* New section: 15 - Rambursare */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>15</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Rambursare</Text>
            <Text style={styles.cmrCellValue}>{cmrData.rambursare}</Text>
          </View>
        </View>
        
        {/* New section: 16 - Transportator */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>16</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Transportator</Text>
            <Text style={styles.cmrCellValue}>{cmrData.transportator}</Text>
          </View>
        </View>
        
        {/* New section: 17 - Transportatori succesivi */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>17</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Transportatori succesivi</Text>
            <Text style={styles.cmrCellValue}>{cmrData.transportatori_succesivi || '-'}</Text>
          </View>
        </View>
        
        {/* New section: 18 - Rezerve si observatii ale transportatorilor */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>18</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Rezerve si observatii ale transportatorilor</Text>
            <Text style={styles.cmrCellValue}>{cmrData.rezerve_observatii || '-'}</Text>
          </View>
        </View>
        
        {/* Conventii speciale */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>19</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Conventii speciale</Text>
            <Text style={styles.cmrCellValue}>{cmrData.conventii_speciale}</Text>
          </View>
        </View>
        
        {/* New section: 20 - De plata */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>20</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>De plata</Text>
            <View style={styles.paymentTable}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Pret transport</Text>
                <Text style={styles.paymentValue}>{cmrData.de_plata.pret_transport} EUR</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Reduceri</Text>
                <Text style={styles.paymentValue}>{cmrData.de_plata.reduceri} EUR</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Sold</Text>
                <Text style={styles.paymentValue}>{cmrData.de_plata.sold} EUR</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Suplimente</Text>
                <Text style={styles.paymentValue}>{cmrData.de_plata.suplimente} EUR</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Alte cheltuieli</Text>
                <Text style={styles.paymentValue}>{cmrData.de_plata.alte_cheltuieli} EUR</Text>
              </View>
              <View style={[styles.paymentRow, styles.paymentRowTotal]}>
                <Text style={styles.paymentLabelTotal}>Total</Text>
                <Text style={styles.paymentValueTotal}>{cmrData.de_plata.total} EUR</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* New section: 21 - Incheiat la */}
        <View style={styles.cmrRow}>
          <View style={styles.cmrNumberCell}>
            <Text style={styles.cmrCellNumber}>21</Text>
          </View>
          <View style={styles.cmrCell}>
            <Text style={styles.cmrCellLabel}>Incheiat la</Text>
            <Text style={styles.cmrCellValue}>{cmrData.incheiat_la.loc}, {cmrData.incheiat_la.data}</Text>
          </View>
        </View>
        
        {/* Signatures */}
        <View style={styles.cmrSignatures}>
          <View style={styles.cmrSignatureBox}>
            <View style={styles.cmrSignatureHeader}>
              <Text style={styles.cmrSignatureNumber}>22</Text>
            </View>
            <View style={styles.cmrSignatureContent}>
              <Text style={styles.cmrSignatureText}>Semnătura și ștampila expeditorului</Text>
            </View>
          </View>
          
          <View style={styles.cmrSignatureBox}>
            <View style={styles.cmrSignatureHeader}>
              <Text style={styles.cmrSignatureNumber}>23</Text>
            </View>
            <View style={styles.cmrSignatureContent}>
              <View style={styles.cmrStamp}>
                <Text style={styles.cmrStampText}>C&C Logistic</Text>
              </View>
              <Text style={styles.cmrSignatureText}>Semnătura și ștampila transportatorului</Text>
            </View>
          </View>
          
          <View style={styles.cmrSignatureBox}>
            <View style={styles.cmrSignatureHeader}>
              <Text style={styles.cmrSignatureNumber}>24</Text>
            </View>
            <View style={styles.cmrSignatureContent}>
              <Text style={styles.cmrSignatureText}>Semnătura și ștampila destinatarului</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#6E78F7" />
          <Text style={styles.loadingText}>Se incarca...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Incearca din nou...</Text>
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
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#303F9F" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => Alert.alert("Info", "Refreshing data...")}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        {renderCMRDocument()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  scrollContent: {
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
  // Header styles
  headerCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
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
    color: '#303F9F',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7986CB',
  },
  // CMR Document styles
  cmrContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  cmrHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    padding: 10,
  },
  cmrLogo: {
    flex: 1,
    justifyContent: 'center',
  },
  cmrLogoText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#303F9F',
  },
  cmrTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cmrTitleText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#303F9F',
  },
  cmrSubtitleText: {
    fontSize: 12,
    color: '#455A64',
  },
  cmrContent: {
    padding: 8,
  },
  cmrRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    minHeight: 60,
  },
  cmrNumberCell: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#CFD8DC',
    backgroundColor: '#F5F5F5',
  },
  cmrCellNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#455A64',
  },
  cmrCell: {
    flex: 1,
    padding: 8,
  },
  cmrCellLabel: {
    fontSize: 12,
    color: '#78909C',
    marginBottom: 4,
  },
  cmrCellValue: {
    fontSize: 14,
    color: '#37474F',
  },
  cmrTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    backgroundColor: '#F5F5F5',
  },
  cmrTableHeaderCell: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#CFD8DC',
  },
  cmrTableHeaderText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#455A64',
  },
  cmrTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    minHeight: 40,
  },
  cmrTableCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#CFD8DC',
  },
  cmrTableCellText: {
    fontSize: 12,
    color: '#37474F',
  },
  // Payment table styles
  paymentTable: {
    marginTop: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  paymentRowTotal: {
    borderTopWidth: 2,
    borderTopColor: '#BDBDBD',
    paddingTop: 8,
    marginTop: 4,
  },
  paymentLabel: {
    fontSize: 12,
    color: '#616161',
  },
  paymentValue: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '500',
  },
  paymentLabelTotal: {
    fontSize: 14,
    color: '#303F9F',
    fontWeight: 'bold',
  },
  paymentValueTotal: {
    fontSize: 14,
    color: '#303F9F',
    fontWeight: 'bold',
  },
  cmrSignatures: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#CFD8DC',
  },
  cmrSignatureBox: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#CFD8DC',
  },
  cmrSignatureHeader: {
    backgroundColor: '#F5F5F5',
    padding: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
  },
  cmrSignatureNumber: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#455A64',
  },
  cmrSignatureContent: {
    minHeight: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmrSignatureText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#78909C',
  },
  cmrStamp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#303F9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cmrStampText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#303F9F',
  },
  // Loading and error styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEFF1',
    padding: 20,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#5C6BC0',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEFF1',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
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
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  transportCardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  transportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  emptyCard: {
    backgroundColor: '#FFFFFF',
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C6BC0',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default TransportsScreen;