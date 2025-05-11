import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import styles from './styles';

const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
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
      setUserData(profile);
      
      // 2. Fetch personal documents
      const documentsResponse = await fetch(`${BASE_URL}personal-documents/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!documentsResponse.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const docsData = await documentsResponse.json();
      setDocuments(docsData);
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDocument = (url) => {
    Linking.openURL(url);
  };

  const navigateToUploadDocuments = () => {
    navigation.navigate('UploadDocuments');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nedefinit';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ro });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A5BDE" />
        <Text style={styles.loadingText}>Se încarcă profilul...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-triangle" size={50} color="#FF7285" />
        <Text style={styles.errorText}>Eroare: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Încearcă din nou</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>{userData?.name}</Text>
            <Text style={styles.roleText}>
              {userData?.is_driver
                ? "Șofer"
                : userData?.is_dispatcher
                ? "Dispecer"
                : "Utilizator"}
            </Text>
            <Text style={styles.companyText}>{userData?.company}</Text>
          </View>
        </View>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Informații personale</Text>
        
        <View style={styles.detailRow}>
          <FontAwesome name="envelope" size={20} color="#6B6F8D" style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{userData?.email}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="phone" size={20} color="#6B6F8D" style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Telefon:</Text>
          <Text style={styles.detailValue}>{userData?.phone_number}</Text>
        </View>
        
        {userData?.license_expiration_date && (
          <View style={styles.detailRow}>
            <FontAwesome name="id-card" size={20} color="#6B6F8D" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Expirare licență:</Text>
            <Text style={styles.detailValue}>{formatDate(userData.license_expiration_date)}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={20} color="#6B6F8D" style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Ultima autentificare:</Text>
          <Text style={styles.detailValue}>{formatDate(userData?.last_login)}</Text>
        </View>
      </View>

      {/* Documents Section */}
      <View style={styles.documentsContainer}>
        <View style={styles.documentHeader}>
          <Text style={styles.sectionTitle}>Documente personale</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => navigateToUploadDocuments()}
          >
            <FontAwesome name="upload" size={16} color="#FFF" />
            <Text style={styles.uploadButtonText}>Încarcă documente</Text>
          </TouchableOpacity>
        </View>

        {documents.length === 0 ? (
          <View style={styles.emptyDocuments}>
            <FontAwesome name="file-o" size={40} color="#A0A4C1" />
            <Text style={styles.emptyDocumentsText}>Nu există documente încărcate</Text>
          </View>
        ) : (
          documents.map((doc) => (
            <TouchableOpacity 
              key={doc.id} 
              style={styles.documentItem}
              onPress={() => handleOpenDocument(doc.document)}
            >
              <View style={styles.documentIcon}>
                <FontAwesome name="file-pdf-o" size={24} color="#FF8C66" />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentCategory}>
                  Categorie: {doc.category ? doc.category.charAt(0).toUpperCase() + doc.category.slice(1) : 'Generală'}
                </Text>
                {doc.expiration_date && (
                  <Text style={styles.documentExpiry}>
                    Expiră: {formatDate(doc.expiration_date)}
                  </Text>
                )}
              </View>
              <FontAwesome name="chevron-right" size={16} color="#A0A4C1" />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;