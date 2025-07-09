import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  selected: "#E8F5E8",
};

export const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(55, 58, 86, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modalContent: {
    width: '92%',
    maxWidth: 600,
    maxHeight: screenHeight * 0.88,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(167, 169, 175, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
    flexDirection: 'column',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 0,
    color: 'white',
  },

  closeButton: {
    backgroundColor: 'transparent',
    padding: 6,
    borderRadius: 4,
  },

  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  closeButtonHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  formContainer: {
    flex: 1,
  },

  fileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },

  fileUploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  fileUploadButton: {
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },

  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  fileUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },

  fileUploadSubtext: {
    fontSize: 12,
    color: COLORS.medium,
  },

  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  fileDetails: {
    flex: 1,
  },

  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 2,
  },

  fileSize: {
    fontSize: 12,
    color: COLORS.medium,
  },

  removeFileButton: {
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 4,
  },

  removeFileButtonText: {
    color: COLORS.danger,
    fontSize: 24,
    fontWeight: 'bold',
  },

  removeFileButtonHover: {
    backgroundColor: 'rgba(255, 114, 133, 0.1)',
  },

  formFieldsContainer: {
    padding: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.dark,
  },

  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    color: COLORS.dark,
    fontSize: 16,
  },

  inputFocus: {
    borderColor: COLORS.primary,
    shadowColor: 'rgba(90, 91, 222, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
  },

  textarea: {
    height: 88,
    paddingVertical: 16,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
  },

  dropdownContainer: {
    position: 'relative',
  },

  dropdownButton: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownButtonHover: {
    borderColor: COLORS.primary,
  },

  dropdownButtonActive: {
    borderColor: COLORS.primary,
  },

  dropdownButtonText: {
    color: COLORS.dark,
    fontSize: 16,
  },

  placeholder: {
    color: COLORS.light,
  },

  dropdownArrow: {
    fontSize: 12,
    color: COLORS.medium,
  },

  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdownList: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    maxHeight: 280,
    width: '80%',
    maxWidth: 400,
  },

  dropdownItem: {
    width: '100%',
    padding: 16,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  dropdownItemText: {
    fontSize: 15,
    color: COLORS.dark,
  },

  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  dropdownItemHover: {
    backgroundColor: COLORS.background,
  },

  dropdownItemSelected: {
    backgroundColor: COLORS.selected,
  },

  dropdownItemSelectedText: {
    fontWeight: '600',
    color: COLORS.success,
  },

  checkmark: {
    color: COLORS.success,
    fontWeight: 'bold',
  },

  dateRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },

  dateRowInputGroup: {
    flex: 1,
    marginBottom: 0,
  },

  dateHint: {
    fontSize: 11,
    color: COLORS.medium,
    marginTop: 4,
    fontStyle: 'italic',
  },

  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },

  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'rgba(167, 169, 175, 0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  buttonHover: {
    transform: [{ translateY: -1 }],
    shadowColor: 'rgba(167, 169, 175, 0.3)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  cancelButton: {
    backgroundColor: COLORS.light,
  },

  cancelButtonText: {
    color: COLORS.dark,
  },

  submitButton: {
    backgroundColor: COLORS.primary,
  },

  submitButtonText: {
    color: 'white',
  },

  buttonIcon: {
    marginRight: 8,
  },

  successToast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.success,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  successToastText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // Date picker styles
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  datePickerText: {
    fontSize: 16,
    color: COLORS.dark,
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

  // Mobile specific styles
  mobileModalContent: {
    width: '95%',
    margin: 20,
  },

  mobileDateRow: {
    flexDirection: 'column',
    gap: 0,
  },

  mobileDateRowInputGroup: {
    marginBottom: 20,
  },
});

// Export colors separately if needed
