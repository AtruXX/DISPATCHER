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
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles, COLORS } from './styles';

const UpdateCMRPage = ({ route }) => {
    // Get the transport ID from route params
    const { transportId } = route.params || {};
    const navigation = useNavigation();
    
    // State for form data
    const [formData, setFormData] = useState({
        expeditor_nume: '',
        expeditor_adresa: '',
        expeditor_tara: '',
        // Destinatar (Recipient) information - Section 2
        destinatar_nume: '',
        destinatar_adresa: '',
        destinatar_tara: '',
        // Location information - Sections 3-4
        loc_livrare: '',
        loc_incarcare: '',
        data_incarcare: '',
        // Cargo details - Sections 6-12
        marci_numere: '',
        numar_colete: '',
        mod_ambalare: '',
        natura_marfii: '',
        nr_static: '',
        greutate_bruta: '',
        cubaj: '',
        // Special instructions - Section 13
        instructiuni_expeditor: '',
        // Special conventions - Section 19
        conventii_speciale: '',
        // Payment information - Section 20
        de_plata: {
            pret_transport: '',
            reduceri: '',
            sold: '',
            suplimente: '',
            alte_cheltuieli: '',
        },
        // Closure information - Section 21
        incheiat_la: {
            locatie: '',
            data: ''
        },
        // Signatures - Sections 22-24
        semnatura_expeditor: '',
        semnatura_transportator: '',
        semnatura_destinatar: '',
        // Additional fields
        numar_cmr: '',
        data_emitere: '',
        transportator: '',
        transportatori_succesivi: '',
        rezerve_observatii: '',
        prescriptii_francare: '',
        rambursare: ''
    });
    
    // UI state
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showCMRForm, setShowCMRForm] = useState(true);
    
    // Date picker visibility state
    const [showDataIncarcarePickerVisible, setShowDataIncarcarePickerVisible] = useState(false);
    const [showDataEmiterePickerVisible, setShowDataEmiterePickerVisible] = useState(false);
    const [showIncheiereDataPickerVisible, setShowIncheiereDataPickerVisible] = useState(false);
    
    // Auth token
    const [authToken, setAuthToken] = useState(null);
    const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

    // Helper function to get placeholder text
    const getPlaceholder = (fieldName, value) => {
        // If value exists, use it as placeholder
        if (value) return value;
        
        // Otherwise return a descriptive placeholder based on field name
        const placeholders = {
            // Expeditor
            expeditor_nume: 'Nume expeditor',
            expeditor_adresa: 'Adresă expeditor',
            expeditor_tara: 'Țară expeditor',
            // Destinatar
            destinatar_nume: 'Nume destinatar',
            destinatar_adresa: 'Adresă destinatar',
            destinatar_tara: 'Țară destinatar',
            // Locations
            loc_livrare: 'Loc de livrare',
            loc_incarcare: 'Loc de încărcare',
            // Cargo
            marci_numere: 'Mărci/Numere',
            numar_colete: 'Număr colete',
            mod_ambalare: 'Mod ambalare',
            natura_marfii: 'Natura mărfii',
            nr_static: 'Nr. static',
            greutate_bruta: 'Greutate brută',
            cubaj: 'Cubaj',
            // Instructions
            instructiuni_expeditor: 'Instrucțiuni expeditor',
            conventii_speciale: 'Convenții speciale',
            // Payment
            'de_plata.pret_transport': 'Preț transport',
            'de_plata.reduceri': 'Reduceri',
            'de_plata.sold': 'Sold',
            'de_plata.suplimente': 'Suplimente',
            'de_plata.alte_cheltuieli': 'Alte cheltuieli',
            // Closure
            'incheiat_la.locatie': 'Locație',
            // Additional
            numar_cmr: 'Număr CMR',
            transportator: 'Transportator',
            transportatori_succesivi: 'Transportatori succesivi',
            rezerve_observatii: 'Rezerve și observații',
            prescriptii_francare: 'Prescripții francare',
            rambursare: 'Rambursare'
        };
        
        return placeholders[fieldName] || 'Completați acest câmp';
    };

    // Function to load the CMR data
    const loadCMRData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setError('Authentication required. Please log in first.');
                setLoading(false);
                return;
            }
            
            setAuthToken(token);
            
            const response = await fetch(`${BASE_URL}transport-cmr/${transportId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to load CMR data');
            }
            
            const cmrData = await response.json();
            console.log('Loaded CMR data:', cmrData);
            
            // Format the data for the form
            const formattedData = {
                ...cmrData[0],
                // Use the existing de_plata object or provide defaults for all properties
                de_plata: cmrData.de_plata ? {
                  ...cmrData.de_plata,
                  pret_transport: cmrData.de_plata.pret_transport || '',
                  reduceri: cmrData.de_plata.reduceri || '',
                  sold: cmrData.de_plata.sold || '',
                  suplimente: cmrData.de_plata.suplimente || '',
                  alte_cheltuieli: cmrData.de_plata.alte_cheltuieli || ''
                } : {
                  pret_transport: '',
                  reduceri: '',
                  sold: '',
                  suplimente: '',
                  alte_cheltuieli: ''
                },
                
                // Do the same for incheiat_la
                incheiat_la: cmrData.incheiat_la ? {
                  ...cmrData.incheiat_la,
                  locatie: cmrData.incheiat_la.locatie || '',
                  data: cmrData.incheiat_la.data || ''
                } : {
                  locatie: '',
                  data: ''
                }
              };
            
            // Update the form data
            setFormData(formattedData);
            
        } catch (error) {
            console.error('Error loading CMR data:', error);
            setError('Failed to load CMR data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Load the CMR data on component mount
    useEffect(() => {
        if (transportId) {
            loadCMRData();
        } else {
            setError('No transport ID provided');
            setLoading(false);
        }
    }, [transportId]);

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

    // Function to submit the updated CMR data
    const handleSubmit = async () => {
        const requiredFields = ['expeditor_nume', 'destinatar_nume', 'loc_livrare'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            Alert.alert('Missing Fields', `Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }
    
        // Fields that should be numbers
        const integerFields = ['numar_colete', 'nr_static', 'numar_cmr', 'cubaj', 'greutate_bruta'];
        const floatFields = ['pret_transport', 'reduceri', 'sold', 'suplimente', 'alte_cheltuieli'];
    
        // Cleanup function for empty/numeric values
        const cleanField = (value, isNumeric = false) => {
            if (value === "") return null;
            if (isNumeric && !isNaN(value)) return Number(value);
            return value;
        };
    
        // Clean up the form data
        const cleanedFormData = {
            ...formData,
            // Numeric + date cleanup
            numar_colete: cleanField(formData.numar_colete, true),
            nr_static: cleanField(formData.nr_static, true),
            numar_cmr: cleanField(formData.numar_cmr, true),
            cubaj: cleanField(formData.cubaj, true),
            greutate_bruta: cleanField(formData.greutate_bruta, true),
            data_emitere: formData.data_emitere || null,
            data_incarcare: formData.data_incarcare || null,
            incheiat_la: {
                locatie: formData.incheiat_la.locatie || "",
                data: formData.incheiat_la.data || null,
            },
            de_plata: {
                pret_transport: cleanField(formData.de_plata.pret_transport, true),
                reduceri: cleanField(formData.de_plata.reduceri, true),
                sold: cleanField(formData.de_plata.sold, true),
                suplimente: cleanField(formData.de_plata.suplimente, true),
                alte_cheltuieli: cleanField(formData.de_plata.alte_cheltuieli, true)
            }
        };
    
        console.log('Submitting updated form data:', cleanedFormData);
    
        setSubmitting(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication required. Please log in first.');
            }
            
            const response = await fetch(`${BASE_URL}transport-cmr/${transportId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(cleanedFormData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update CMR');
            }
    
            const data = await response.json();
            Alert.alert('Success', 'CMR updated successfully!');
            console.log('Success:', data);
    
            // Navigate back after successful update
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate("Main");
            }
    
        } catch (error) {
            console.error('Error:', error.message);
            Alert.alert('Error', error.message);
        } finally {
            setSubmitting(false);
        }
    };

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
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />

                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ADRESĂ</Text>
                        <TextInput
                            value={formData.expeditor_adresa}
                            onChangeText={(text) => handleCMRChange('expeditor_adresa', text)}
                            style={styles.input}
                            placeholder="Adresă expeditor"
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ȚARĂ</Text>
                        <TextInput
                            value={formData.expeditor_tara}
                            onChangeText={(text) => handleCMRChange('expeditor_tara', text)}
                            style={styles.input}
                            placeholder="Țară expeditor"
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                            placeholder={getPlaceholder('destinatar_nume', formData.destinatar_nume)}
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ADRESĂ</Text>
                        <TextInput
                            value={formData.destinatar_adresa}
                            onChangeText={(text) => handleCMRChange('destinatar_adresa', text)}
                            style={styles.input}
                            placeholder={getPlaceholder('destinatar_adresa', formData.destinatar_adresa)}
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ȚARĂ</Text>
                        <TextInput
                            value={formData.destinatar_tara}
                            onChangeText={(text) => handleCMRChange('destinatar_tara', text)}
                            style={styles.input}
                            placeholder={getPlaceholder('destinatar_tara', formData.destinatar_tara)}
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>LOC ÎNCĂRCARE</Text>
                        <TextInput
                            value={formData.loc_incarcare}
                            onChangeText={(text) => handleCMRChange('loc_incarcare', text)}
                            style={styles.input}
                            placeholder="Loc de încărcare"
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>NUMĂR COLETE</Text>
                            <TextInput
                                value={formData.numar_colete?.toString() || ''}
                                onChangeText={(text) => handleCMRChange('numar_colete', text)}
                                style={styles.input}
                                placeholder="Număr colete"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text?.light || "#999"}
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
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>NATURA MĂRFII</Text>
                            <TextInput
                                value={formData.natura_marfii}
                                onChangeText={(text) => handleCMRChange('natura_marfii', text)}
                                style={styles.input}
                                placeholder="Natura mărfii"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow || { flexDirection: 'row', marginTop: 12 }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>NR. STATIC</Text>
                            <TextInput
                                value={formData.nr_static?.toString() || ''}
                                onChangeText={(text) => handleCMRChange('nr_static', text)}
                                style={styles.input}
                                placeholder="Nr. static"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>GREUTATE BRUTĂ (kg)</Text>
                            <TextInput
                                value={formData.greutate_bruta?.toString() || ''}
                                onChangeText={(text) => handleCMRChange('greutate_bruta', text)}
                                style={styles.input}
                                placeholder="Greutate brută"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>CUBAJ (m³)</Text>
                        <TextInput
                            value={formData.cubaj?.toString() || ''}
                            onChangeText={(text) => handleCMRChange('cubaj', text)}
                            style={styles.input}
                            placeholder="Cubaj"
                            keyboardType="numeric"
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                                value={formData.de_plata?.pret_transport?.toString() || ''}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'pret_transport', text)}
                                style={styles.input}
                                placeholder={getPlaceholder('de_plata.pret_transport', formData.de_plata?.pret_transport)}
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>REDUCERI</Text>
                            <TextInput
                                value={formData.de_plata?.reduceri?.toString() || ''}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'reduceri', text)}
                                style={styles.input}
                                placeholder={getPlaceholder('de_plata.reduceri', formData.de_plata?.reduceri)}
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow || { flexDirection: 'row', marginTop: 12 }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>SOLD</Text>
                            <TextInput
                                value={formData.de_plata?.sold?.toString() || ''}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'sold', text)}
                                style={styles.input}
                                placeholder={getPlaceholder('de_plata.sold', formData.de_plata?.sold)}
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>

                        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>SUPLIMENTE</Text>
                            <TextInput
                                value={formData.de_plata?.suplimente?.toString() || ''}
                                onChangeText={(text) => handleNestedCMRChange('de_plata', 'suplimente', text)}
                                style={styles.input}
                                placeholder={getPlaceholder('de_plata.suplimente', formData.de_plata?.suplimente)}
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ALTE CHELTUIELI</Text>
                        <TextInput
                            value={formData.de_plata?.alte_cheltuieli?.toString() || ''}
                            onChangeText={(text) => handleNestedCMRChange('de_plata', 'alte_cheltuieli', text)}
                            style={styles.input}
                            placeholder={getPlaceholder('de_plata.alte_cheltuieli', formData.de_plata?.alte_cheltuieli)}
                            keyboardType="numeric"
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>
                </View>

                {/* Closure Information */}
                <View style={styles.cmrSection}>
                    <Text style={styles.cmrSectionTitle}>ÎNCHEIERE</Text>

                    <View style={styles.inputRow || { flexDirection: 'row' }}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>LOCAȚIE</Text>
                            <TextInput
                                value={formData.incheiat_la?.locatie || ''}
                                onChangeText={(text) => handleNestedCMRChange('incheiat_la', 'locatie', text)}
                                style={styles.input}
                                placeholder={getPlaceholder('incheiat_la.locatie', formData.incheiat_la?.locatie)}
                                placeholderTextColor={COLORS.text?.light || "#999"}
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <View style={styles.datePickerContainer}>
                                <Text style={styles.inputLabel}>DATA ÎNCHEIERE</Text>
                                <TouchableOpacity
                                    style={[styles.input, styles.dropdownContainer]}
                                    onPress={() => setShowIncheiereDataPickerVisible(true)}
                                >
                                    <Text style={formData.incheiat_la?.data ? styles.dropdownText : styles.dropdownPlaceholder}>
                                        {formData.incheiat_la?.data ? new Date(formData.incheiat_la.data).toLocaleDateString() : 'Selectează data'}
                                    </Text>
                                    <Ionicons name="calendar" size={20} color="#5C6BC0" />
                                </TouchableOpacity>

                                {showIncheiereDataPickerVisible && (
                                    <View style={styles.calendarContainer}>
                                        {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                                            <DateTimePicker
                                                value={formData.incheiat_la?.data ? new Date(formData.incheiat_la.data) : new Date()}
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
                                                          }                                                
                                                    }));
                                                    setShowIncheiereDataPickerVisible(false);
                                                }}
                                                markedDates={{
                                                    [formData.incheiat_la?.data ? formData.incheiat_la.data : '']: {
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
                            value={formData.numar_cmr?.toString() || ''}
                            onChangeText={(text) => handleCMRChange('numar_cmr', text)}
                            style={styles.input}
                            placeholder="Număr CMR"
                            placeholderTextColor={COLORS.text?.light || "#999"}
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
                                                setShowDataEmiterePickerVisible(false);
                                                if (selectedDate) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        data_emitere: selectedDate.toISOString().split('T')[0]
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
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>TRANSPORTATORI SUCCESIVI</Text>
                        <TextInput
                            value={formData.transportatori_succesivi}
                            onChangeText={(text) => handleCMRChange('transportatori_succesivi', text)}
                            style={styles.input}
                            placeholder="Transportatori succesivi"
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>REZERVE / OBSERVAȚII</Text>
                        <TextInput
                            value={formData.rezerve_observatii}
                            onChangeText={(text) => handleCMRChange('rezerve_observatii', text)}
                            style={[styles.input, { height: 80 }]}
                            placeholder="Rezerve și observații"
                            multiline={true}
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>PRESCRIPȚII FRANCARE</Text>
                        <TextInput
                            value={formData.prescriptii_francare}
                            onChangeText={(text) => handleCMRChange('prescriptii_francare', text)}
                            style={styles.input}
                            placeholder="Prescripții francare"
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>RAMBURSARE</Text>
                        <TextInput
                            value={formData.rambursare}
                            onChangeText={(text) => handleCMRChange('rambursare', text)}
                            style={styles.input}
                            placeholder="Rambursare"
                            placeholderTextColor={COLORS.text?.light || "#999"}
                        />
                    </View>
                </View>
            </View>
        );
    };
    
    // Render loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 16, color: COLORS.text?.dark || "#333" }}>Loading CMR data...</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    // Render error state
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Ionicons name="alert-circle-outline" size={48} color="red" />
                    <Text style={{ marginTop: 16, color: 'red', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={{ 
                            marginTop: 20, 
                            backgroundColor: COLORS.primary,
                            padding: 12,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            if (navigation.canGoBack()) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("Main");
                            }
                        }}
                    >
                        <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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
                    <Text style={styles.headerTitle}>Actualizare CMR #{transportId}</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* CMR Toggle */}
                <View style={styles.cmrToggleContainer}>
                    <Text style={styles.cmrToggleText}>Editare informații CMR</Text>
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
                    style={[styles.submitButton, submitting ? styles.submitButtonDisabled : null]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>Actualizează CMR</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UpdateCMRPage;