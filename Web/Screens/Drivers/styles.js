import { StyleSheet } from 'react-native';

const COLORS = {
  background: "#ECEFF1", // Light background from your TransportScreen
  card: "#FFFFFF", // White card background
  primary: "#303F9F", // Primary blue color
  secondary: "#3F51B5", // Secondary blue
  accent: "#5C6BC0", // Light blue accent
  lightAccent: "#7986CB", // Very light blue text
  text: {
    dark: "#424242", // Dark text
    medium: "#757575", // Medium text
    light: "#9E9E9E", // Light text
  },
  border: "#E0E0E0", // Light border
  success: "#66BB6A", // Green for success messages
  error: "#EF5350", // Red for errors
  warning: "#FFA726", // Orange for warnings
  available: "#81C784", // Green for available drivers
  unavailable: "#E57373", // Red for unavailable drivers
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
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
  listContainer: {
    paddingBottom: 20,
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

  detailItem: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  ratingMax: {
    fontSize: 12,
    color: '#BDBDBD',
    marginLeft: 2,
  },
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

  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  avatarSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },




  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  editButtonActive: {
    backgroundColor: '#5C6BC0',
  },
  editButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 4,
  },

  // New styles for documents section
  documentsContainer: {
    backgroundColor: '#F8F9FD',
    padding: 16,
    borderRadius: 12,
    marginTop: -8,
    marginHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  documentCategory: {
    fontSize: 12,
    color: COLORS.text.medium,
    marginBottom: 2,
  },
  documentExpiration: {
    fontSize: 12,
    color: COLORS.text.light,
  },
  documentSeparator: {
    height: 8,
  },
  loadingDocsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingDocsText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.medium,
  },
  noDocumentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noDocumentsText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text.light,
    textAlign: 'center',
  },

  // Modified styles for the driver card layout
  driverCardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'flex-start', // Align items at the top
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16, // Add margin to separate from avatar
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 4, // Adjust vertical alignment
  },
  avatarGradient: {
    width: 56, // Slightly smaller
    height: 56, // Slightly smaller
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18, // Slightly smaller
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    width: 10, // Slightly smaller
    height: 10, // Slightly smaller
    borderRadius: 5,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#303F9F',
    marginBottom: 4, // Increase spacing
  },
  driverEmail: {
    fontSize: 14,
    color: '#7986CB',
    marginBottom: 12, // Increase spacing
  },
  editButton: {
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    paddingVertical: 6, // Slightly larger
    paddingHorizontal: 12,
    marginBottom: 12, // Increase spacing
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Increase spacing
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12, // Increase spacing
  },
  detailLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4, // Increase spacing
  },
  detailValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  // Button styles - improved spacing and size
// Button styles - more subtle and airy
buttonsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  marginBottom: 16,
},
actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#7986CB',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 18,
  flex: 1,
  marginHorizontal: 8,
  minHeight: 52,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
addButton: {
  backgroundColor: '#81C784',
},
activeButton: {
  backgroundColor: '#5C6BC0',
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '500',
  marginRight: 8,
},
buttonIcon: {
  marginLeft: 6,
},

// Document upload styles - more spacious and airy
uploadContainer: {
  backgroundColor: '#FAFBFD',
  borderRadius: 20,
  padding: 32,
  marginHorizontal: 20,
  marginTop: 12,
  marginBottom: 32,
  elevation: 3,
  borderColor: '#E8EAF6',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
},
uploadTitle: {
  fontSize: 22,
  fontWeight: '600',
  color: '#3949AB',
  marginBottom: 28,
  textAlign: 'center',
},
fileSelectButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: '#D1D9FF',
  borderStyle: 'dashed',
  borderRadius: 16,
  padding: 36,
  marginBottom: 28,
  backgroundColor: '#FFFFFF',
  minHeight: 150,
  transition: 'all 0.2s ease',
},
fileSelectText: {
  marginLeft: 16,
  color: '#5C6BC0',
  flex: 1,
  fontSize: 18,
  textAlign: 'center',
  lineHeight: 24,
},
textInput: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#E8EAF6',
  padding: 18,
  marginBottom: 24,
  fontSize: 17,
  minHeight: 60,
  color: '#424242',
},

// Completely redesigned picker (document type selector)
// Button styles - more subtle and airy
buttonsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  marginBottom: 16,
},
actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#7986CB',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 18,
  flex: 1,
  marginHorizontal: 8,
  minHeight: 52,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
addButton: {
  backgroundColor: '#81C784',
},
activeButton: {
  backgroundColor: '#5C6BC0',
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '500',
  marginRight: 8,
},
buttonIcon: {
  marginLeft: 6,
},

// Document upload styles - more spacious and airy
uploadContainer: {
  backgroundColor: '#FAFBFD',
  borderRadius: 20,
  padding: 32,
  marginHorizontal: 20,
  marginTop: 12,
  marginBottom: 32,
  elevation: 3,
  borderColor: '#E8EAF6',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
},
uploadTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#3949AB',
  marginBottom: 20,
  textAlign: 'center',
},
fileSelectButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: '#D1D9FF',
  borderStyle: 'dashed',
  borderRadius: 16,
  padding: 36,
  marginBottom: 28,
  backgroundColor: '#FFFFFF',
  minHeight: 150,
  transition: 'all 0.2s ease',
},
fileSelectText: {
  marginLeft: 16,
  color: '#5C6BC0',
  flex: 1,
  fontSize: 18,
  textAlign: 'center',
  lineHeight: 24,
},
textInput: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#E8EAF6',
  padding: 18,
  marginBottom: 24,
  fontSize: 17,
  minHeight: 60,
  color: '#424242',
},

// Compact document type selector
pickerContainer: {
  marginBottom: 20,
},
picker: {
  height: 44,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E8EAF6',
  paddingHorizontal: 12,
  fontSize: 15,
  color: '#424242',
  appearance: 'none',
  paddingRight: 32, // Space for the dropdown icon
},
pickerIcon: {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#7986CB',
  fontSize: 16,
},

// Compact date picker with smaller dimensions
datePickerContainer: {
  marginBottom: 20,
  position: 'relative',
},
datePickerWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E8EAF6',
  height: 44,
  paddingHorizontal: 12,
},
datePickerIcon: {
  color: '#7986CB',
  marginRight: 8,
  fontSize: 16,
},
dateInput: {
  flex: 1,
  fontSize: 15,
  color: '#424242',
  height: '100%',
  paddingVertical: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
},
datePickerPlaceholder: {
  color: '#9E9E9E',
  fontSize: 15,
},

uploadButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#5C6BC0',
  borderRadius: 14,
  padding: 18,
  minHeight: 60,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  marginTop: 8,
},
uploadButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: '600',
  marginLeft: 14,
},
dataInput: {
  flex: 1,
  paddingHorizontal: 18,
  paddingVertical: 16,
  height: 60,
  fontSize: 17,
  color: '#424242',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
}
});