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
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  
  // Navigation header
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
  
  // Header card
  headerCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: COLORS.card,
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
    color: COLORS.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightAccent,
  },
  
  // Form card
  formCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Form section styling
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text.medium,
    marginBottom: 10,
    paddingLeft: 4,
  },
  
  // Input row and fields
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.text.light,
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text.dark,
  },
  
  // Submit button
  submitButtonGradient: {
    borderRadius: 10,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loadingCard: {
    backgroundColor: COLORS.card,
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
    color: COLORS.accent,
    fontWeight: '500',
  },
  
  // Driver selector styles
  driverSection: {
    marginBottom: 20,
  },
  driverSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  driverPlaceholder: {
    color: COLORS.text.light,
    fontSize: 14,
  },
  selectedDriverContainer: {
    flex: 1,
  },
  selectedDriverName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  selectedDriverCompany: {
    fontSize: 12,
    color: COLORS.text.medium,
    marginTop: 2,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.card,
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
  
  // Status badges
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeSuccess: {
    backgroundColor: 'rgba(102, 187, 106, 0.2)',
  },
  badgeSuccessText: {
    color: COLORS.success,
  },
  badgeWarning: {
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
  },
  badgeWarningText: {
    color: COLORS.warning,
  },
  badgeError: {
    backgroundColor: 'rgba(239, 83, 80, 0.2)',
  },
  badgeErrorText: {
    color: COLORS.error,
  },
});

// Export colors for use in other components
export { COLORS };