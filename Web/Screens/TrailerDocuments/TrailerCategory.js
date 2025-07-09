import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../TruckDocuments/DocumentCatgorystyle';

const { width, height } = Dimensions.get('window');

const DocumentCategoryModal = ({ 
  visible, 
  onClose, 
  category, 
  truckId, 
  authToken 
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = ""; // Your API base URL

  const COLORS = {
    background: "#F4F5FB",
    card: "#FFFFFF",
    primary: "#5A5BDE",
    secondary: "#6F89FF",
    accent: "#FF8C66",
    accent2: "#81C3F8",
    dark: "#373A56",
    medium: "#6B6F8D",
    light: "#A0A4C1",
    border: "#E2E5F1",
    success: "#63C6AE",
    warning: "#FFBD59",
    danger: "#FF7285",
    overlay: "rgba(0, 0, 0, 0.5)",
  };

  useEffect(() => {
    if (visible && category && truckId && authToken) {
      fetchDocuments();
    }
  }, [visible, category, truckId, authToken]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be your actual API endpoint for specific category documents
      const response = await fetch(
        `${BASE_URL}trucks/${truckId}/documents/${category.id}/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching documents:', err);
      // For demo purposes, we'll set mock data
      const mockDocuments = generateMockDocuments(category);
      setDocuments(mockDocuments);
      setLoading(false);
    }
  };

  const generateMockDocuments = (category) => {
    const documentCount = Math.floor(Math.random() * 5) + 1;
    const mockDocs = [];
    
    for (let i = 1; i <= documentCount; i++) {
      mockDocs.push({
        id: i,
        name: `${category.name} ${i}`,
        fileName: `document_${i}.pdf`,
        fileSize: `${Math.floor(Math.random() * 5000) + 100} KB`,
        uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        expiryDate: new Date(Date.now() + Math.random() * 31536000000).toISOString(),
        status: Math.random() > 0.3 ? 'valid' : 'expired',
        type: 'pdf',
        url: `https://example.com/documents/${i}.pdf`
      });
    }
    
    return mockDocs;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nu este specificat';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('ro-RO', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return COLORS.success;
      case 'expired':
        return COLORS.danger;
      case 'expiring':
        return COLORS.warning;
      default:
        return COLORS.medium;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'valid':
        return 'Valabil';
      case 'expired':
        return 'Expirat';
      case 'expiring':
        return 'Expiră curând';
      default:
        return 'Necunoscut';
    }
  };

  const handleDocumentPress = (document) => {
    Alert.alert(
      'Deschide Document',
      `Vrei să deschizi documentul "${document.name}"?`,
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Deschide', onPress: () => openDocument(document) }
      ]
    );
  };

  const openDocument = (document) => {
    // Here you would implement document opening logic
    console.log('Opening document:', document);
    // You could use Linking.openURL(document.url) or implement in-app document viewer
  };

  const handleDownload = (document) => {
    Alert.alert(
      'Descarcă Document',
      `Vrei să descarci documentul "${document.name}"?`,
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Descarcă', onPress: () => downloadDocument(document) }
      ]
    );
  };

  const downloadDocument = (document) => {
    // Here you would implement download logic
    console.log('Downloading document:', document);
    Alert.alert('Info', 'Funcționalitatea de descărcare va fi implementată în curând.');
  };

  const renderDocument = ({ item }) => {
    const isExpired = item.status === 'expired';
    
    return (
      <TouchableOpacity
        style={[styles.documentItem, isExpired && styles.documentItemExpired]}
        onPress={() => handleDocumentPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.documentContent}>
          <View style={styles.documentIcon}>
            <MaterialCommunityIcons 
              name="file-pdf-box" 
              size={32} 
              color={category?.color || COLORS.primary} 
            />
          </View>
          
          <View style={styles.documentDetails}>
            <Text style={styles.documentName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.documentFileName} numberOfLines={1}>
              {item.fileName}
            </Text>
            
            <View style={styles.documentMeta}>
              <View style={styles.metaRow}>
                <Ionicons name="calendar" size={12} color={COLORS.light} />
                <Text style={styles.metaText}>
                  Încărcat: {formatDate(item.uploadDate)}
                </Text>
              </View>
              
              {item.expiryDate && (
                <View style={styles.metaRow}>
                  <Ionicons name="time" size={12} color={COLORS.light} />
                  <Text style={styles.metaText}>
                    Expiră: {formatDate(item.expiryDate)}
                  </Text>
                </View>
              )}
              
              <View style={styles.metaRow}>
                <Ionicons name="document" size={12} color={COLORS.light} />
                <Text style={styles.metaText}>{item.fileSize}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.documentActions}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(item)}
            >
              <Ionicons name="download" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: category?.color || COLORS.primary }]}>
          <MaterialCommunityIcons 
            name={category?.icon || 'file-document'} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
        <View style={styles.categoryDetails}>
          <Text style={styles.categoryTitle}>{category?.name || 'Documente'}</Text>
          <Text style={styles.categorySubtitle}>{category?.description || 'Lista documentelor'}</Text>
        </View>
      </View>
      
      <View style={styles.documentsCount}>
        <Text style={styles.countText}>
          {documents.length} {documents.length === 1 ? 'document' : 'documente'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="file-document-outline" size={64} color={COLORS.light} />
      <Text style={styles.emptyStateTitle}>Nu există documente</Text>
      <Text style={styles.emptyStateText}>
        Nu au fost găsite documente pentru această categorie.
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Documente</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchDocuments}
            >
              <Ionicons name="refresh" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Se încarcă documentele...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Eroare</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={fetchDocuments}
              >
                <Text style={styles.retryButtonText}>Încearcă din nou</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={documents}
              renderItem={renderDocument}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DocumentCategoryModal;