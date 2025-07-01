import { StyleSheet } from 'react-native';

const COLORS = {
  background: "#ECEFF1", // Light background from your TransportScreen
  card: "#F5F5F5", // White card background
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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.light,
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  submitButtonGradient: {
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
  },
  submitButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.dark,
  },
});