import { StyleSheet } from 'react-native';

const COLORS = {
  background: "#ECEFF1",
  card: "#FFFFFF",
  primary: "#303F9F",
  secondary: "#3F51B5",
  accent: "#5C6BC0",
  lightAccent: "#7986CB",
  text: {
    dark: "#424242",
    medium: "#757575",
    light: "#9E9E9E",
  },
  border: "#E0E0E0",
  success: "#66BB6A",
  error: "#EF5350",
  warning: "#FFA726",
};

export const styles = StyleSheet.create({
  // Edit container
  editContainer: {
    backgroundColor: '#ECF0F7',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
  },

  // Edit header
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  uploadTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#445580',
    letterSpacing: 0.3,
  },

  closeButton: {
    backgroundColor: '#ECF0F7',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 2,
  },

  // File select button
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
  },

  fileSelectText: {
    marginLeft: 18,
    color: '#5A678C',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },

  // Text input
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EAF6',
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    minHeight: 50,
    color: '#424242',
  },

  // Picker container
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EAF6',
    marginBottom: 24,
    overflow: 'hidden',
    minHeight: 50,
  },

  picker: {
    height: 50,
    color: '#424242',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    paddingHorizontal: 12,
  },

  // Date picker
  datePickerContainer: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#445580',
    marginBottom: 8,
    marginLeft: 4,
  },

  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EAF6',
    minHeight: 50,
  },

  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
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
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EAF6',
    overflow: 'hidden',
  },

  // Year and Month selector styles
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  selectorItem: {
    flex: 1,
  },

  selectorItemWithMargin: {
    flex: 1,
    marginRight: 8,
  },

  selectorItemWithMarginLeft: {
    flex: 1,
    marginLeft: 8,
  },

  selectorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },

  selectorPicker: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  // Button container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },

  // Cancel button - simple neomorphic inset
  cancelButton: {
    backgroundColor: '#ECF0F7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    flex: 1,
    minHeight: 50,
    // Inset shadow for pressed look
    shadowColor: '#B8C5D9',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 1,
  },

  cancelButtonText: {
    color: '#8A94B8',
    fontSize: 16,
    fontWeight: '600',
  },

  // Update button - simple neomorphic raised
  updateButton: {
    backgroundColor: '#ECF0F7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    flex: 1,
    minHeight: 50,
    // Raised shadow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 3,
  },

  updateButtonText: {
    color: '#445580',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});