import { StyleSheet } from 'react-native';

export const COLORS = {
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
  white: "#FFFFFF", // White color for modal backgrounds
};

// Define all styles in one place
export const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  
  // Form section styling
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  
  // Input container and fields
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text.dark,
  },
  
  // Input row arrangement
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  
  // Dropdown styles
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  
  // Submit button
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  
  // Driver selector styles
  driverItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  driverCompany: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginTop: 2,
  },
  driverStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    borderRadius: 4,
  },
  driverStatusActive: {
    backgroundColor: 'rgba(129, 199, 132, 0.2)',
    color: COLORS.available,
  },
  driverStatusInactive: {
    backgroundColor: 'rgba(229, 115, 115, 0.2)',
    color: COLORS.unavailable,
  },
  driverStatusAvailable: {
    backgroundColor: 'rgba(129, 199, 132, 0.2)',
    color: COLORS.available,
  },
  driverStatusOnRoad: {
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    color: COLORS.warning,
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    color: COLORS.text.light,
    fontSize: 16,
  },
  
  // CMR Toggle styles
  cmrToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  cmrToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.dark,
  },
  cmrToggleButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 4,
  },
  cmrToggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  
  // CMR Form styles
  cmrFormContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cmrSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
  },
  cmrSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  
  // Form data display
  formDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  formDataLabel: {
    fontSize: 14,
    color: COLORS.text.medium,
    flex: 1,
  },
  formDataValue: {
    fontSize: 14,
    color: COLORS.text.dark,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  
  // Loading indicator
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  
  // Section divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  
  // Card for form sections
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Disabled input
  disabledInput: {
    backgroundColor: COLORS.background,
    color: COLORS.text.light,
  },
  
  // Required field indicator
  requiredField: {
    color: COLORS.error,
    marginLeft: 4,
  },
  
  // Info icon
  infoIcon: {
    marginLeft: 8,
  },
  
  // Text area input for multiline content
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  // Error message
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});