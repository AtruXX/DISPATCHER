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
    FlatList,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, COLORS } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
// Import Calendar properly if you're using react-native-calendars
import { Calendar } from 'react-native-calendars';
// CMR Data Model - Default values for the form


export default function CreateTransportPage() {
    const [formData, setFormData] = useState({
        expeditor_nume: "",
        expeditor_adresa: "",
        expeditor_tara: "",
        // Destinatar (Recipient) information - Section 2
        destinatar_nume: "",
        destinatar_adresa: "",
        destinatar_tara: "",
        // Location information - Sections 3-4
        loc_livrare: "",
        loc_incarcare: "",
        data_incarcare: "",
        // Cargo details - Sections 6-12
        marci_numere: "",
        numar_colete: "",
        mod_ambalare: "",
        natura_marfii: "",
        nr_static: "",
        greutate_bruta: "",
        cubaj: "",
        // Special instructions - Section 13
        instructiuni_expeditor: "",
        // Special conventions - Section 19
        conventii_speciale: "",
        // Payment information - Section 20
        de_plata: {
            pret_transport: "",
            reduceri: "",
            sold: "",
            suplimente: "",
            alte_cheltuieli: "",
            total: ""
        },
        // Closure information - Section 21
        incheiat_la: {
            locatie: "",
            data: ""
        },
        // Signatures - Sections 22-24
        semnatura_expeditor: "",
        semnatura_transportator: "",
        semnatura_destinatar: "",
        // Additional fields
        numar_cmr: "",
        data_emitere: "",
        transportator: "",
        transportatori_succesivi: "",
        rezerve_observatii: "",
        prescriptii_francare: "",
        rambursare: ""
    });
    // First, add these state variables at the top with your other state declarations
    const [showDataIncarcarePickerVisible, setShowDataIncarcarePickerVisible] = useState(false);
    const [showDataEmiterePickerVisible, setShowDataEmiterePickerVisible] = useState(false);
    const [showIncheiereDataPickerVisible, setShowIncheiereDataPickerVisible] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDriverModalVisible, setDriverModalVisible] = useState(false);
    const [isTruckModalVisible, setTruckModalVisible] = useState(false);
    const [isTrailerModalVisible, setTrailerModalVisible] = useState(false);
    const [isDetractionModalVisible, setDetractionModalVisible] = useState(false);
    const [isGoodsTypeModalVisible, setGoodsTypeModalVisible] = useState(false);
    const [showCMRForm, setShowCMRForm] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

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
    const navigation = useNavigation();
    const [uploadStates, setUploadStates] = useState({});


    const toggleUploadForm = (driverId) => {
        updateDriverUploadState(
            driverId,
            'isUploadExpanded',
            !(uploadStates[driverId]?.isUploadExpanded || false)
        );
    };
    // Function to update CMR data fields
    // Function to update top-level CMR data fields
    const handleCMRChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Function to update nested CMR data fields (e.g., de_plata or incheiat_la)
    const handleNestedCMRChange = (parentField, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [field]: value
            }
        }));
    };




    const handleSubmit = async () => {
        // Validate required fields for the basic transport form
        // Update with actual required CMR fields
        const requiredFields = ['expeditor_nume', 'destinatar_nume', 'loc_livrare']; // Add any other required fields
        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            Alert.alert('Missing Fields', `Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }

        console.log('Submitting form data:', formData);

        setLoading(true);
        try {
            console.log('Submitting form data:', formData);
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/transport-cmr/1', {
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
            Alert.alert('Success', 'Transport CMR edited successfully!');
            console.log('Success:', data);

            // Reset form
            setFormData({

                expeditor_nume: "",
                expeditor_adresa: "",
                expeditor_tara: "",
                // Destinatar (Recipient) information - Section 2
                destinatar_nume: "",
                destinatar_adresa: "",
                destinatar_tara: "",
                // Location information - Sections 3-4
                loc_livrare: "",
                loc_incarcare: "",
                data_incarcare: "",
                // Cargo details - Sections 6-12
                marci_numere: "",
                numar_colete: "",
                mod_ambalare: "",
                natura_marfii: "",
                nr_static: "",
                greutate_bruta: "",
                cubaj: "",
                // Special instructions - Section 13
                instructiuni_expeditor: "",
                // Special conventions - Section 19
                conventii_speciale: "",
                // Payment information - Section 20
                de_plata: {
                    pret_transport: "",
                    reduceri: "",
                    sold: "",
                    suplimente: "",
                    alte_cheltuieli: "",
                    total: ""
                },
                // Closure information - Section 21
                incheiat_la: {
                    locatie: "",
                    data: ""
                },
                // Signatures - Sections 22-24
                semnatura_expeditor: "",
                semnatura_transportator: "",
                semnatura_destinatar: "",
                // Additional fields
                numar_cmr: "",
                data_emitere: "",
                transportator: "",
                transportatori_succesivi: "",
                rezerve_observatii: "",
                prescriptii_francare: "",
                rambursare: ""
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



    // Render the CMR form fields
    const renderCMRForm = () => {
        if (!showCMRForm) return null;

        return (
            <View style={styles.cmrFormContainer || { marginTop: 16, backgroundColor: COLORS.white, borderRadius: 10, padding: 16 }}>
                <Text style={styles.sectionTitle}>INFORMAȚII CMR</Text>

                {/* Expeditor Section */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>1. EXPEDITOR</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>NUME</Text>
                        <TextInput
                            value={formData.expeditor_nume}
                            onChangeText={(text) => handleCMRChange('expeditor_nume', text)}
                            style={styles.input}
                            placeholder="Nume expeditor"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ADRESĂ</Text>
                        <TextInput
                            value={formData.expeditor_adresa}
                            onChangeText={(text) => handleCMRChange('expeditor_adresa', text)}
                            style={styles.input}
                            placeholder="Adresă expeditor"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ȚARĂ</Text>
                        <TextInput
                            value={formData.expeditor_tara}
                            onChangeText={(text) => handleCMRChange('expeditor_tara', text)}
                            style={styles.input}
                            placeholder="Țară expeditor"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>
                </View>

                {/* Destinatar Section */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>2. DESTINATAR</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>NUME</Text>
                        <TextInput
                            value={formData.destinatar_nume}
                            onChangeText={(text) => handleCMRChange('destinatar_nume', text)}
                            style={styles.input}
                            placeholder="Nume destinatar"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ADRESĂ</Text>
                        <TextInput
                            value={formData.destinatar_adresa}
                            onChangeText={(text) => handleCMRChange('destinatar_adresa', text)}
                            style={styles.input}
                            placeholder="Adresă destinatar"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ȚARĂ</Text>
                        <TextInput
                            value={formData.destinatar_tara}
                            onChangeText={(text) => handleCMRChange('destinatar_tara', text)}
                            style={styles.input}
                            placeholder="Țară destinatar"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>
                </View>

                {/* Location Information */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>LOCAȚII & DATE</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>LOC LIVRARE</Text>
                        <TextInput
                            value={formData.loc_livrare}
                            onChangeText={(text) => handleCMRChange('loc_livrare', text)}
                            style={styles.input}
                            placeholder="Loc de livrare"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>LOC ÎNCĂRCARE</Text>
                        <TextInput
                            value={formData.loc_incarcare}
                            onChangeText={(text) => handleCMRChange('loc_incarcare', text)}
                            style={styles.input}
                            placeholder="Loc de încărcare"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.inputLabel}>DATA ÎNCĂRCARE</Text>
                            <TouchableOpacity
                                style={[styles.input, styles.dropdownContainer]}
                                onPress={() => setShowDataIncarcarePickerVisible(true)}
                            >
                                <Text style={formData.data_incarcare ? styles.dropdownText : styles.dropdownPlaceholder}>
                                    {formData.data_incarcare ? new Date(formData.data_incarcare).toLocaleDateString() : 'Selectează data'}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#5C6BC0" />
                            </TouchableOpacity>

                            {showDataIncarcarePickerVisible && (
                                <View style={styles.calendarContainer}>
                                    {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                                        <DateTimePicker
                                            value={formData.data_incarcare ? new Date(formData.data_incarcare) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowDataIncarcarePickerVisible(false);
                                                if (selectedDate) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        data_incarcare: selectedDate.toISOString().split('T')[0]
                                                    }));
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Calendar
                                            onDayPress={(day) => {
                                                const selectedDate = new Date(day.timestamp);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    data_incarcare: selectedDate.toISOString().split('T')[0]
                                                }));
                                                setShowDataIncarcarePickerVisible(false);
                                            }}
                                            markedDates={{
                                                [formData.data_incarcare ? formData.data_incarcare : '']: {
                                                    selected: true,
                                                    selectedColor: "#5C6BC0"
                                                }
                                            }}
                                            theme={{
                                                calendarBackground: '#FFFFFF',
                                                textSectionTitleColor: '#303F9F',
                                                selectedDayBackgroundColor: '#5C6BC0',
                                                selectedDayTextColor: '#FFFFFF',
                                                todayTextColor: '#5C6BC0',
                                                dayTextColor: '#424242',
                                                textDisabledColor: '#BDBDBD',
                                                arrowColor: '#5C6BC0',
                                                monthTextColor: '#303F9F',
                                                textDayFontWeight: '400',
                                                textMonthFontWeight: 'bold',
                                                textDayHeaderFontWeight: '500'
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                </View>
                </View>


                {/* Cargo Details */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>DETALII MARFĂ</Text>

                    <View style={styles.inputRow || { flexDirection: 'row' }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>MĂRCI/NUMERE</Text>
                            <TextInput
                                value={formData.marci_numere}
                                onChangeText={(text) => handleCMRChange('marci_numere', text)}
                                style={styles.input}
                                placeholder="Mărci/Numere"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>NUMĂR COLETE</Text>
                            <TextInput
                                value={formData.numar_colete}
                                onChangeText={(text) => handleCMRChange('numar_colete', text)}
                                style={styles.input}
                                placeholder="Număr colete"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow || { flexDirection: 'row', marginTop: 12 }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>MOD AMBALARE</Text>
                            <TextInput
                                value={formData.mod_ambalare}
                                onChangeText={(text) => handleCMRChange('mod_ambalare', text)}
                                style={styles.input}
                                placeholder="Mod ambalare"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>NATURA MĂRFII</Text>
                            <TextInput
                                value={formData.natura_marfii}
                                onChangeText={(text) => handleCMRChange('natura_marfii', text)}
                                style={styles.input}
                                placeholder="Natura mărfii"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow || { flexDirection: 'row', marginTop: 12 }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>NR. STATIC</Text>
                            <TextInput
                                value={formData.nr_static}
                                onChangeText={(text) => handleCMRChange('nr_static', text)}
                                style={styles.input}
                                placeholder="Nr. static"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>GREUTATE BRUTĂ (kg)</Text>
                            <TextInput
                                value={formData.greutate_bruta}
                                onChangeText={(text) => handleCMRChange('greutate_bruta', text)}
                                style={styles.input}
                                placeholder="Greutate brută"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>CUBAJ (m³)</Text>
                        <TextInput
                            value={formData.cubaj}
                            onChangeText={(text) => handleCMRChange('cubaj', text)}
                            style={styles.input}
                            placeholder="Cubaj"
                            keyboardType="numeric"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>INSTRUCȚIUNI & CONVENȚII</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>INSTRUCȚIUNI EXPEDITOR</Text>
                        <TextInput
                            value={formData.instructiuni_expeditor}
                            onChangeText={(text) => handleCMRChange('instructiuni_expeditor', text)}
                            style={[styles.input, { height: 80 }]}
                            placeholder="Instrucțiuni expeditor"
                            multiline={true}
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>CONVENȚII SPECIALE</Text>
                        <TextInput
                            value={formData.conventii_speciale}
                            onChangeText={(text) => handleCMRChange('conventii_speciale', text)}
                            style={[styles.input, { height: 80 }]}
                            placeholder="Convenții speciale"
                            multiline={true}
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>
                </View>

                {/* Payment Information */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>INFORMAȚII PLATĂ</Text>

                    <View style={styles.inputRow || { flexDirection: 'row' }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>PREȚ TRANSPORT</Text>
                            <TextInput
                                value={formData.de_plata.pret_transport}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'pret_transport', text)}
                                style={styles.input}
                                placeholder="Preț transport"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>REDUCERI</Text>
                            <TextInput
                                value={formData.de_plata.reduceri}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'reduceri', text)}
                                style={styles.input}
                                placeholder="Reduceri"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow || { flexDirection: 'row', marginTop: 12 }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>SOLD</Text>
                            <TextInput
                                value={formData.de_plata.sold}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'sold', text)}
                                style={styles.input}
                                placeholder="Sold"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>SUPLIMENTE</Text>
                            <TextInput
                                value={formData.de_plata.suplimente}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'suplimente', text)}
                                style={styles.input}
                                placeholder="Suplimente"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow || { flexDirection: 'row', marginTop: 12 }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>ALTE CHELTUIELI</Text>
                            <TextInput
                                value={formData.de_plata.alte_cheltuieli}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'alte_cheltuieli', text)}
                                style={styles.input}
                                placeholder="Alte cheltuieli"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>TOTAL</Text>
                            <TextInput
                                value={formData.de_plata.total}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'total', text)}
                                style={styles.input}
                                placeholder="Total"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                    </View>
                </View>

                {/* Closure Information */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>ÎNCHEIERE</Text>

                    <View style={styles.inputRow || { flexDirection: 'row' }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>LOCAȚIE</Text>
                            <TextInput
                                value={formData.incheiat_la.locatie}
                                onChangeText={(text) => handleNestedCMRChange('incheiat_la', 'locatie', text)}
                                style={styles.input}
                                placeholder="Locație"
                                placeholderTextColor={COLORS.text.light}
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.inputLabel}>DATA ÎNCHEIERE</Text>
                            <TouchableOpacity
                                style={[styles.input, styles.dropdownContainer]}
                                onPress={() => setShowIncheiereDataPickerVisible(true)}
                            >
                                <Text style={formData.incheiat_la.data ? styles.dropdownText : styles.dropdownPlaceholder}>
                                    {formData.incheiat_la.data ? new Date(formData.incheiat_la.data).toLocaleDateString() : 'Selectează data'}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#5C6BC0" />
                            </TouchableOpacity>

                            {showIncheiereDataPickerVisible && (
                                <View style={styles.calendarContainer}>
                                    {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                                        <DateTimePicker
                                            value={formData.incheiat_la.data ? new Date(formData.incheiat_la.data) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowIncheiereDataPickerVisible(false);
                                                if (selectedDate) {
                                                  setFormData(prev => ({
                                                    ...prev,
                                                    incheiat_la: {
                                                      ...prev.incheiat_la,  // Preserve other properties like locatie
                                                      data: selectedDate.toISOString().split('T')[0]
                                                    }
                                                  }));
                                                }
                                              }}
                                        />
                                    ) : (
                                        <Calendar
                                            onDayPress={(day) => {
                                                const selectedDate = new Date(day.timestamp);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    incheiat_la: {
                                                        ...prev.incheiat_la,  // Preserve other properties like locatie
                                                        data: selectedDate.toISOString().split('T')[0]
                                                      }                                                }));
                                                setShowIncheiereDataPickerVisible(false);
                                            }}
                                            markedDates={{
                                                [formData.incheiat_la.data ? formData.incheiat_la.data : '']: {
                                                    selected: true,
                                                    selectedColor: "#5C6BC0"
                                                }
                                            }}
                                            theme={{
                                                calendarBackground: '#FFFFFF',
                                                textSectionTitleColor: '#303F9F',
                                                selectedDayBackgroundColor: '#5C6BC0',
                                                selectedDayTextColor: '#FFFFFF',
                                                todayTextColor: '#5C6BC0',
                                                dayTextColor: '#424242',
                                                textDisabledColor: '#BDBDBD',
                                                arrowColor: '#5C6BC0',
                                                monthTextColor: '#303F9F',
                                                textDayFontWeight: '400',
                                                textMonthFontWeight: 'bold',
                                                textDayHeaderFontWeight: '500'
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                        </View>
                    </View>
                </View>

                {/* Additional Information */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>INFORMAȚII SUPLIMENTARE</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>NUMĂR CMR</Text>
                        <TextInput
                            value={formData.numar_cmr}
                            onChangeText={(text) => handleCMRChange('numar_cmr', text)}
                            style={styles.input}
                            placeholder="Număr CMR"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.inputLabel}>DATA EMITERE</Text>
                            <TouchableOpacity
                                style={[styles.input, styles.dropdownContainer]}
                                onPress={() => setShowDataEmiterePickerVisible(true)}
                            >
                                <Text style={formData.data_emitere ? styles.dropdownText : styles.dropdownPlaceholder}>
                                    {formData.data_emitere ? new Date(formData.data_emitere).toLocaleDateString() : 'Selectează data'}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#5C6BC0" />
                            </TouchableOpacity>

                            {showDataEmiterePickerVisible && (
                                <View style={styles.calendarContainer}>
                                    {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                                        <DateTimePicker
                                            value={formData.data_emitere ? new Date(formData.data_emitere) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowDataIncarcarePickerVisible(false);
                                                if (selectedDate) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        data_incarcare: selectedDate.toISOString().split('T')[0]
                                                    }));
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Calendar
                                            onDayPress={(day) => {
                                                const selectedDate = new Date(day.timestamp);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    data_emitere: selectedDate.toISOString().split('T')[0]
                                                }));
                                                setShowDataEmiterePickerVisible(false);
                                            }}
                                            markedDates={{
                                                [formData.data_emitere ? formData.data_emitere : '']: {
                                                    selected: true,
                                                    selectedColor: "#5C6BC0"
                                                }
                                            }}
                                            theme={{
                                                calendarBackground: '#FFFFFF',
                                                textSectionTitleColor: '#303F9F',
                                                selectedDayBackgroundColor: '#5C6BC0',
                                                selectedDayTextColor: '#FFFFFF',
                                                todayTextColor: '#5C6BC0',
                                                dayTextColor: '#424242',
                                                textDisabledColor: '#BDBDBD',
                                                arrowColor: '#5C6BC0',
                                                monthTextColor: '#303F9F',
                                                textDayFontWeight: '400',
                                                textMonthFontWeight: 'bold',
                                                textDayHeaderFontWeight: '500'
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                            </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>TRANSPORTATOR</Text>
                        <TextInput
                            value={formData.transportator}
                            onChangeText={(text) => handleCMRChange('transportator', text)}
                            style={styles.input}
                            placeholder="Transportator"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>TRANSPORTATORI SUCCESIVI</Text>
                        <TextInput
                            value={formData.transportatori_succesivi}
                            onChangeText={(text) => handleCMRChange('transportatori_succesivi', text)}
                            style={styles.input}
                            placeholder="Transportatori succesivi"
                            placeholderTextColor={COLORS.text.light}
                        />
                    </View>
                </View>
            </View>
        );
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                    <Text style={styles.headerTitle}>Completeaza CMR</Text>
                </View>

                {/* Your transport form fields */}
                {/* ... */}

                {/* CMR Toggle */}
                <View style={styles.cmrToggleContainer}>
                    <Text style={styles.cmrToggleText}>Adaugă informații CMR</Text>
                    <TouchableOpacity
                        onPress={() => setShowCMRForm(!showCMRForm)}
                        style={[styles.cmrToggleButton, showCMRForm && styles.cmrToggleButtonActive]}
                    >
                        <Ionicons
                            name={showCMRForm ? "checkmark-circle" : "add-circle-outline"}
                            size={24}
                            color={showCMRForm ? COLORS.white : COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

                {/* CMR Form */}
                {renderCMRForm()}
                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading ? styles.submitButtonDisabled : null]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitButtonText}> Submit </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* All modals */}

        </SafeAreaView>
    )
};