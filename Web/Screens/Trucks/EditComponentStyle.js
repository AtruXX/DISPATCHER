import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const COLORS = {
  background: "#F4F5FB", // Light lavender background
  card: "#FFFFFF",       // White
  primary: "#5A5BDE",    // Purple-blue (primary)
  secondary: "#6F89FF",  // Light blue
  accent: "#FF8C66",     // Soft orange
  accent2: "#81C3F8",    // Sky blue
  dark: "#373A56",       // Dark navy
  medium: "#6B6F8D",     // Medium navy-gray
  light: "#A0A4C1",      // Light gray-purple
  border: "#E2E5F1",     // Light border
  success: "#63C6AE",    // Turquoise
  warning: "#FFBD59",    // Amber
  danger: "#FF7285",     // Soft red
};

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 58, 86, 0.5)', // Dark navy with opacity
  },

  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#A7A9AF',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.card,
  },

  closeButton: {
    padding: 6,
  },

  formContainer: {
    padding: 20,
  },

  formGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: COLORS.medium,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    color: COLORS.dark,
  },

  // Date picker styles
  datePickerButton: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  datePickerText: {
    fontSize: 16,
    color: COLORS.dark,
  },

  placeholder: {
    color: COLORS.light,
  },

  calendarIcon: {
    fontSize: 18,
    color: COLORS.medium,
  },

  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  datePickerContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },

  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },

  datePickerCloseButton: {
    padding: 4,
  },

  datePickerCloseText: {
    fontSize: 24,
    color: COLORS.medium,
    fontWeight: 'bold',
  },

  webDatePickerContent: {
    padding: 20,
  },

  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },

  selectorItem: {
    flex: 1,
  },

  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },

  selectorPicker: {
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },

  button: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  cancelButton: {
    backgroundColor: COLORS.light,
  },

  submitButton: {
    backgroundColor: COLORS.primary,
  },

  buttonText: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Success toast styles
  successToast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.success,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#A7A9AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  successToastText: {
    color: COLORS.card,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // Date input hint text
  dateHint: {
    fontSize: 12,
    color: COLORS.medium,
    marginTop: 2,
    fontStyle: 'italic'
  },

  // Mobile specific styles
  mobileModalContent: {
    width: '95%',
    margin: 20,
  },
});

