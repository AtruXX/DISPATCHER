import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  header: {
    backgroundColor: '#6b7280',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  searchBar: {
    backgroundColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginBottom: 20,
  },
  
  searchPlaceholder: {
    color: '#6b7280',
    fontSize: 14,
  },
  
  selectionContainer: {
    gap: 12,
  },
  
  selectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1f2937',
  },
  
  selectionButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  
  activeButton: {
    backgroundColor: '#7c3aed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e5e7eb',
  },
  
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  mapOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  pointsContainer: {
    gap: 8,
  },
  
  pointText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  
  overlayButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  routeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  routeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  instructionContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Map marker styles (if using custom markers)
  departureMarker: {
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  
  destinationMarker: {
    width: 20,
    height: 20,
    backgroundColor: '#F44336',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});