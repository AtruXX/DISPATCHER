import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Easing, Animated, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { styles } from "./styles";
// Modern color palette inspired by the Axiom design

const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";
const DispatcherDashboard = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [shipments, setShipments] = useState([]);
    const [currentDate] = useState(new Date());
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const phoneNumber = "0745 346 397";
    // Add state for expanded actions section
    const [expandedActions, setExpandedActions] = useState(false);
    const [stats, setStats] = useState({
        activeShipments: 0,
        delayedShipments: 0,
        activeDrivers: 0,
        final_no: 0,
    });
    const COLORS = {
        background: "#F4F5FB",     // Light lavender background
        card: "#FFFFFF",           // White
        primary: "#5A5BDE",        // Purple-blue (primary)
        secondary: "#6F89FF",      // Light blue
        accent: "#FF8C66",         // Soft orange
        accent2: "#81C3F8",        // Sky blue
        dark: "#373A56",           // Dark navy
        medium: "#6B6F8D",         // Medium navy-gray
        light: "#A0A4C1",          // Light gray-purple
        border: "#E2E5F1",         // Light border
        success: "#63C6AE",        // Turquoise
        warning: "#FFBD59",        // Amber
        danger: "#FF7285",         // Soft red
    };

    // Rest of your useEffect hooks and functions remain unchanged...
    useEffect(() => {
        const getAuthToken = () => {
            try {
                console.log("Attempting to get auth token from localStorage");
                const token = localStorage.getItem('authToken'); // FIXED: Changed from setting to getting
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

    // Define loadData outside both useEffects
    const loadData = async () => {
        try {
            const token = localStorage.getItem('authToken');

            // 1. Fetch profile data
            const profileResponse = await fetch(`${BASE_URL}profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!profileResponse.ok) {
                throw new Error('Failed to fetch profile');
            }

            const profile = await profileResponse.json();

            // Set user data
            setUserData({
                name: profile.name,
                company: profile.company,
                role: profile.is_driver
                    ? "Șofer"
                    : profile.is_dispatcher
                        ? "Dispecer"
                        : "Utilizator"
            });

            // 2. Fetch transports data
            const transportResponse = await fetch(`${BASE_URL}transports`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!transportResponse.ok) throw new Error('Failed to fetch transports');
            const transportsData = await transportResponse.json();
            console.log("Transports data:", transportsData);
            const transports = Array.isArray(transportsData)
                ? transportsData
                : (transportsData.results || transportsData.transports || []);

            console.log("Transports data structure:", typeof transports, Array.isArray(transports), transports.length);

            const lastThree = Array.isArray(transports) && transports.length > 0
                ? transports.slice(-Math.min(3, transports.length)).reverse()
                : [];

            // Remove the unused 'idx' parameter
            const formatted = lastThree.map(t => ({
                id: `TR-${t.id}`,
                origin_city: t.origin_city||"Necunoscut",
                destination_city: t.destination_city||"Necunoscut",
                eta: new Date(),
                status: t.status_transport || "necunoscut",
                cargo: t.truck_combination || "Nespecificat",
                pallets: 0,
                distance: "N/A",
                completion: 0,
                driver: `ID: ${t.driver}`
            }));

            setShipments(formatted);

            setShipments(formatted);

            // 3. Fetch drivers data
            const driversRes = await fetch(`${BASE_URL}drivers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!driversRes.ok) throw new Error('Failed to fetch drivers');
            const driversData = await driversRes.json();
            console.log("Drivers data:", driversData);

            // Make sure we have the right property, add fallback
            const final_no = driversData.number_of_drivers;

            const totalDrivers = await fetch(`${BASE_URL}drivers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const final_active_Data = await totalDrivers.json();
            const final_no_a = final_active_Data.number_of_drivers;
            console.log("Active drivers data:", final_no_a);
            const activeShipment = await fetch(`${BASE_URL}active-transports`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const activeShipmentData = await activeShipment.json();
            const number_of_active_transports = activeShipmentData.number_of_active_transports;
            const delayedShipment = await fetch(`${BASE_URL}inactive-transports`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const delayedShipmentData = await delayedShipment.json();
            const number_of_inactive_transports = delayedShipmentData.number_of_inactive_transports;
            console.log("Delayed shipment data:", delayedShipment.json());
            // Set stats with safe values
            setStats({
                activeShipments: number_of_active_transports||0,
                delayedShipments: number_of_inactive_transports||0,
                activeDrivers: final_no||0, 
                final_no: final_no || 12,
            });

            setIsLoading(false);

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
            setError('Failed to load data. Please try again later.');
        }
    };

    useEffect(() => {
        if (authToken) {
            loadData();
        }
    }, [authToken]); 

    const formatDateTime = (date) => {
        if (!date) return "Neprogramat";
        return date.toLocaleDateString() + ", " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMonth = () => {
        const options = { month: 'long' };
        return currentDate.toLocaleDateString('ro-RO', options);
    };

    const formatDay = () => {
        return currentDate.getDate();
    };

    const formatYear = () => {
        return currentDate.getFullYear();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return COLORS.success;
            case 'in_transit': return COLORS.secondary;
            case 'assigned': return COLORS.warning;
            case 'pending': return COLORS.danger;
            default: return COLORS.light;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'delivered': return 'Livrat';
            case 'in_transit': return 'În tranzit';
            case 'assigned': return 'Atribuit';
            case 'pending': return 'În așteptare';
            default: return 'Necunoscut';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return 'check-circle';
            case 'in_transit': return 'truck';
            case 'assigned': return 'user-check';
            case 'pending': return 'clock';
            default: return 'help-circle';
        }
    };

    // Function to toggle the expanded actions
    const toggleExpandedActions = () => {
        setExpandedActions(!expandedActions);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Se încarcă...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with greeting and profile */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.welcomeText}>Bun venit,</Text>
                        <Text style={styles.nameText}>{userData.name}</Text>
                        <Text style={styles.roleText}>{userData.role}</Text>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Feather name="bell" size={22} color={COLORS.medium} />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}>3</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.profileContainer}>
                            <Text style={styles.profileInitials}>
                                {userData.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.dateContainer}>
                    <View style={styles.dateContent}>
                        <Text style={styles.dayText}>{formatDay()}</Text>
                        <View>
                            <Text style={styles.monthText}>{formatMonth()}</Text>
                            <Text style={styles.yearText}>{formatYear()}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.calendarButton}
                        onPress={async () => {
                            try {
                                const token = localStorage.getItem('authToken');

                                if (!token) {
                                    alert('No token found.');
                                    return;
                                }

                                const response = await fetch(`${BASE_URL}logout/`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Token ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (response.ok) {
                                    // Clear token and route
                                    localStorage.removeItem('authToken');
                                    localStorage.removeItem('lastRoute');

                                    // Navigate to Login
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                } else {
                                    const err = await response.json();
                                    console.error('Logout failed:', err);
                                    alert('Logout failed.');
                                }
                            } catch (error) {
                                console.error('Logout error:', error);
                                alert('Something went wrong during logout.');
                            }
                        }}
                    >
                        <Feather name="log-out" size={16} color={COLORS.primary} />
                        <Text style={styles.calendarText}>Deconectare</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dashboard summary */}
            <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Statistici generale</Text>
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconContainer}>
                            <Feather name="truck" size={18} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.summaryLabel}>Transporturi active</Text>
                        <Text style={styles.summaryNumber}>{stats.activeShipments}</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconContainer}>
                            <Feather name="alert-triangle" size={18} color={COLORS.warning} />
                        </View>
                        <Text style={styles.summaryLabel}>Transporturi finalizate</Text>
                        <Text style={styles.summaryNumber}>{stats.delayedShipments}</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconContainer}>
                            <Feather name="users" size={18} color={COLORS.success} />
                        </View>
                        <Text style={styles.summaryLabel}>Șoferi activi</Text>
                        <Text style={styles.summaryNumber}>{stats.activeDrivers}</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconContainer}>
                            <Feather name="pie-chart" size={18} color={COLORS.primary} />
                        </View>
                        <Text style={styles.summaryLabel}>Soferi angajati</Text>
                        <Text style={styles.summaryNumber}>{stats.final_no}</Text>
                    </View>
                </View>
            </View>

            {/* Quick actions */}
            <View style={styles.actionsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Acțiuni rapide</Text>
                    <TouchableOpacity onPress={toggleExpandedActions}>
                        <Text style={styles.seeAllText}>{expandedActions ? 'Ascunde' : 'Vezi toate'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.gridContainer}>
                    <TouchableOpacity
                        style={styles.gridItem}
                        onPress={() => navigation.navigate('Transports')}
                    >
                        <View style={[styles.gridIconContainer, { backgroundColor: COLORS.secondary + '20' }]}>
                            <Feather name="clipboard" size={22} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.gridText}>Transporturi in curs de desfasurare</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.gridItem}
                        onPress={() => navigation.navigate('Drivers')}
                    >
                        <View style={[styles.gridIconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                            <Feather name="users" size={22} color={COLORS.primary} />
                        </View>
                        <Text style={styles.gridText}>Șoferi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.gridItem}
                        onPress={() => navigation.navigate('Trucks')}
                    >
                        <View style={[styles.gridIconContainer, { backgroundColor: COLORS.accent + '20' }]}>
                            <Feather name="truck" size={22} color={COLORS.accent} />
                        </View>
                        <Text style={styles.gridText}>Camioane</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.gridItem}
                        onPress={() => navigation.navigate('CreateTransport')}
                    >
                        <View style={[styles.gridIconContainer, { backgroundColor: COLORS.success + '20' }]}>
                            <Feather name="plus" size={22} color={COLORS.success} />
                        </View>
                        <Text style={styles.gridText}>Creare transport</Text>
                    </TouchableOpacity>

                    {/* Additional buttons that show when expanded */}
                    {expandedActions && (
                        <>
                            <TouchableOpacity
                                style={styles.gridItem}
                                onPress={() => navigation.navigate('AddTruck')}
                            >
                                <View style={[styles.gridIconContainer, { backgroundColor: COLORS.warning + '20' }]}>
                                    <Feather name="plus-circle" size={22} color={COLORS.warning} />
                                </View>
                                <Text style={styles.gridText}>Adaugă camion</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.gridItem}
                                onPress={() => navigation.navigate('AddDriver')}
                            >
                                <View style={[styles.gridIconContainer, { backgroundColor: COLORS.accent2 + '20' }]}>
                                    <Feather name="user-plus" size={22} color={COLORS.accent2} />
                                </View>
                                <Text style={styles.gridText}>Adaugă șofer</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.gridItem}
                                onPress={() => navigation.navigate('AddTrailer')}
                            >
                                <View style={[styles.gridIconContainer, { backgroundColor: COLORS.danger + '20' }]}>
                                    <Feather name="upload" size={22} color={COLORS.danger} />
                                </View>
                                <Text style={styles.gridText}>Adaugă trailer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.gridItem}
                                onPress={() => navigation.navigate('AddTrailer')}
                            >
                                <View style={[styles.gridIconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                                    <Feather name="plus" size={22} color={COLORS.primary} />
                                </View>
                                <Text style={styles.gridText}>Adaugă remorca</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.gridItem}
                                onPress={() => navigation.navigate('AllTrailers')}
                            >
                                <View style={[styles.gridIconContainer, { backgroundColor: COLORS.accent2 + '20' }]}>
                                    <Feather name="eye" size={22} color={COLORS.accent2} />


                                </View>
                                <Text style={styles.gridText}>Vezi remorcile</Text>
                            </TouchableOpacity>


                        </>
                    )}
                </View>
            </View>

            {/* Recent Shipments */}
            <View style={styles.shipmentsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Transporturi recente</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Vezi toate</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.shipmentsContainer}>
                    {shipments.map((shipment) => (
                        <TouchableOpacity
                            key={shipment.id}
                            style={styles.shipmentCard}
                            onPress={() => navigation.navigate('ShipmentDetails', { id: shipment.id })}
                        >
                            <View style={styles.shipmentHeader}>
                                <View style={styles.shipmentTitleContainer}>
                                    <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(shipment.status) + '20' }]}>
                                        <Feather name={getStatusIcon(shipment.status)} size={16} color={getStatusColor(shipment.status)} />
                                    </View>
                                    <View>
                                        <Text style={styles.shipmentRoute}>{shipment.origin_city} → {shipment.destination_city}</Text>
                                        <Text style={styles.shipmentId}>ID: {shipment.id}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
                                    <Text style={styles.statusText}>{getStatusLabel(shipment.status)}</Text>
                                </View>
                            </View>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBar, { width: `${shipment.completion}%`, backgroundColor: getStatusColor(shipment.status) }]} />
                                </View>
                                <Text style={styles.progressText}>{shipment.completion}%</Text>
                            </View>

                            <View style={styles.shipmentDetails}>
                                <View style={styles.detailColumn}>
                                    <Text style={styles.detailLabel}>Data estimată sosire:</Text>
                                    <Text style={styles.detailValue}>{formatDateTime(shipment.eta)}</Text>
                                </View>

                                <View style={styles.detailSeparator} />

                                <View style={styles.detailColumn}>
                                    <Text style={styles.detailLabel}>Încărcătură:</Text>
                                    <Text style={styles.detailValue}>{shipment.pallets} paleți • {shipment.cargo}</Text>
                                </View>

                                <View style={styles.detailSeparator} />

                                <View style={styles.detailColumn}>
                                    <Text style={styles.detailLabel}>Șofer atribuit:</Text>
                                    <Text style={styles.detailValue}>{shipment.driver}</Text>
                                </View>

                                <View style={styles.detailSeparator} />

                                <View style={styles.detailColumn}>
                                    <Text style={styles.detailLabel}>Distanță:</Text>
                                    <Text style={styles.detailValue}>{shipment.distance}</Text>
                                </View>
                            </View>

                            <View style={styles.shipmentActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Feather name="phone" size={16} color={COLORS.primary} />
                                    <Text style={styles.actionText}>Contact</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton}>
                                    <Feather name="map-pin" size={16} color={COLORS.primary} />
                                    <Text style={styles.actionText}>Locație</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.viewDetailsButton}>
                                    <Text style={styles.viewDetailsText}>Vezi detalii</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Help section */}
            <View style={styles.helpContainer}>
                <View style={styles.helpContent}>
                    <View style={styles.helpTextContainer}>
                        <Text style={styles.helpTitle}>Aveți nevoie de ajutor?</Text>
                        <Text style={styles.helpText}>Contactați echipa de suport pentru orice întrebări legate de aplicație sau transporturi.</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.helpButton}
                        onPress={() => setShowPhoneNumber(!showPhoneNumber)}
                    >
                        <Text style={styles.helpButtonText}>Support</Text>
                    </TouchableOpacity>
                    {showPhoneNumber && (
                        <View style={styles.phoneContainer}>
                            <Text style={styles.phoneText}>{phoneNumber}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default DispatcherDashboard;