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
import DEFAULT_CMR_DATA from './DefaultData'; // Import the default model
import { styles, COLORS } from './styles';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const TransportsScreen = ({ route, navigation }) => {
  const [cmrData, setCmrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();
  window.downloadPdfRef = contentRef;

  // Get transport ID from route params if available
  const transportId = route?.params?.transportId;
  const handlePress = () => {
    navigation.navigate('PDFC')
  };
  // Simulate API fetch with the hardcoded data
  useEffect(() => {
    const loadCMRData = async () => {
      try {
        // Simulate network delay
        setTimeout(() => {
          // Use our hardcoded data model
          setCmrData(DEFAULT_CMR_DATA);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error loading CMR data:", err);
        setError("Failed to load CMR document");
        setLoading(false);
      }
    };

    loadCMRData();
  }, []);

  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>CMR TRANSPORT</Text>
      <Text style={styles.headerSubtitle}>Document Nr. {cmrData?.numar_cmr || 'CMR-2025-5678'}</Text>
    </View>
  );

  const renderCMRDocument = () => {
    // Use cmrData from your component state
    const data = cmrData;
    
    return (
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
              <Text style={styles.cmrCellValue}>{data.expeditor_nume}</Text>
              <Text style={styles.cmrCellValue}>{data.expeditor_adresa}</Text>
              <Text style={styles.cmrCellValue}>{data.expeditor_tara}</Text>
            </View>
          </View>
          
          {/* Row 2 - Destinatar */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>2</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Destinatar (nume, adresa, tara)</Text>
              <Text style={styles.cmrCellValue}>{data.destinatar_nume}</Text>
              <Text style={styles.cmrCellValue}>{data.destinatar_adresa}</Text>
              <Text style={styles.cmrCellValue}>{data.destinatar_tara}</Text>
            </View>
          </View>
          
          {/* Row 3 - Loc de livrare */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>3</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Locul prevazut pentru livrarea marfii</Text>
              <Text style={styles.cmrCellValue}>{data.loc_livrare}</Text>
            </View>
          </View>
          
          {/* Row 4 - Loc de incarcare */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>4</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Locul si data de incarcare a marfii</Text>
              <Text style={styles.cmrCellValue}>{data.loc_incarcare}, {data.data_incarcare}</Text>
            </View>
          </View>
          
          {/* Row 5 - Documente anexate */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>5</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Documente anexate</Text>
              <Text style={styles.cmrCellValue}>---------</Text>
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
              <Text style={styles.cmrTableCellText}>{data.marci_numere}</Text>
            </View>
            <View style={styles.cmrTableCell}>
              <Text style={styles.cmrTableCellText}>{data.numar_colete}</Text>
            </View>
            <View style={styles.cmrTableCell}>
              <Text style={styles.cmrTableCellText}>{data.mod_ambalare}</Text>
            </View>
            <View style={styles.cmrTableCell}>
              <Text style={styles.cmrTableCellText}>{data.natura_marfii}</Text>
            </View>
            <View style={styles.cmrTableCell}>
              <Text style={styles.cmrTableCellText}>{data.nr_static}</Text>
            </View>
            <View style={styles.cmrTableCell}>
              <Text style={styles.cmrTableCellText}>{data.greutate_bruta}</Text>
            </View>
            <View style={styles.cmrTableCell}>
              <Text style={styles.cmrTableCellText}>{data.cubaj}</Text>
            </View>
          </View>
          
          {/* Instructiuni expeditor */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>13</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Instructiunile expeditorului</Text>
              <Text style={styles.cmrCellValue}>{data.instructiuni_expeditor}</Text>
            </View>
          </View>
          
          {/* Prescriptii francare */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>14</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Prescriptii de francare</Text>
              <Text style={styles.cmrCellValue}>{data.prescriptii_francare || '------'}</Text>
            </View>
          </View>
          
          {/* Rambursare */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>15</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Rambursare</Text>
              <Text style={styles.cmrCellValue}>{data.rambursare || '---------'}</Text>
            </View>
          </View>
          
          {/* Transportator */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>16</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Transportator</Text>
              <Text style={styles.cmrCellValue}>{data.transportator || 'C&C Logistic SRL'}</Text>
            </View>
          </View>
          
          {/* Transportatori succesivi */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>17</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Transportatori succesivi</Text>
              <Text style={styles.cmrCellValue}>{data.transportatori_succesivi || '-----------'}</Text>
            </View>
          </View>
          
          {/* Rezerve si observatii */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>18</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Rezerve si observatii ale transportatorilor</Text>
              <Text style={styles.cmrCellValue}>{data.rezerve_observatii || '---------'}</Text>
            </View>
          </View>
          
          {/* Conventii speciale */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>19</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Conventii speciale</Text>
              <Text style={styles.cmrCellValue}>{data.conventii_speciale}</Text>
            </View>
          </View>
          
          {/* De plata */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>20</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>De plata</Text>
              {data.de_plata && typeof data.de_plata === 'object' ? (
                <View style={styles.paymentTable}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Pret transport</Text>
                    <Text style={styles.paymentValue}>{data.de_plata.pret_transport} EUR</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Reduceri</Text>
                    <Text style={styles.paymentValue}>{data.de_plata.reduceri} EUR</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Sold</Text>
                    <Text style={styles.paymentValue}>{data.de_plata.sold} EUR</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Suplimente</Text>
                    <Text style={styles.paymentValue}>{data.de_plata.suplimente} EUR</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Alte cheltuieli</Text>
                    <Text style={styles.paymentValue}>{data.de_plata.alte_cheltuieli} EUR</Text>
                  </View>
                  <View style={[styles.paymentRow, styles.paymentRowTotal]}>
                    <Text style={styles.paymentLabelTotal}>Total</Text>
                    <Text style={styles.paymentValueTotal}>{data.de_plata.total} EUR</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.cmrCellValue}>-</Text>
              )}
            </View>
          </View>
          
          {/* Incheiat la */}
          <View style={styles.cmrRow}>
            <View style={styles.cmrNumberCell}>
              <Text style={styles.cmrCellNumber}>21</Text>
            </View>
            <View style={styles.cmrCell}>
              <Text style={styles.cmrCellLabel}>Incheiat la</Text>
              {data.incheiat_la && typeof data.incheiat_la === 'object' ? (
                <Text style={styles.cmrCellValue}>{data.incheiat_la.locatie}, {data.incheiat_la.data}</Text>
              ) : (
                <Text style={styles.cmrCellValue}>-</Text>
              )}
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
                {data.semnatura_expeditor === "signed-electronically" && (
                  <Text style={styles.electronicSignature}>Semnat electronic</Text>
                )}
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
                {data.semnatura_transportator === "signed-electronically" && (
                  <Text style={styles.electronicSignature}>Semnat electronic</Text>
                )}
              </View>
            </View>
            
            <View style={styles.cmrSignatureBox}>
              <View style={styles.cmrSignatureHeader}>
                <Text style={styles.cmrSignatureNumber}>24</Text>
              </View>
              <View style={styles.cmrSignatureContent}>
                <Text style={styles.cmrSignatureText}>Semnătura și ștampila destinatarului</Text>
                {data.semnatura_destinatar === "signed-electronically" && (
                  <Text style={styles.electronicSignature}>Semnat electronic</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Main"); // or your fallback screen
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
          onPress={() => Alert.alert("Refresh", "Se reîncarcă datele...")}
        >
          <Ionicons name="refresh" size={24} color="#303F9F" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        {renderCMRDocument()}
        <View>
        <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            style={styles.downloadButtonGradient || { borderRadius: 8, marginTop: 16 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={styles.downloadButton || { padding: 16, alignItems: 'center' }} 
              onPress={handlePress}
              activeOpacity={0.9}
            >
              <Text style={styles.downloadButtonText || { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>DESCARCA</Text>
            </TouchableOpacity>
          </LinearGradient>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default TransportsScreen;