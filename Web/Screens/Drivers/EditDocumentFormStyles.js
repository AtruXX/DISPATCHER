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
  editContainer: {
    backgroundColor: '#ECF0F7',
    borderRadius: 24,
    padding: 40,
    marginHorizontal: 28,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },

  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },

  editTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#445580',
    letterSpacing: 0.6,
  },

  closeButton: {
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 2,
  },

  fileSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 40,
    marginBottom: 36,
    backgroundColor: '#ECF0F7',
    minHeight: 160,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 0,
    position: 'relative',
  },

  fileSelectText: {
    marginLeft: 18,
    color: '#5A678C',
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },

  textInput: {
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    borderWidth: 0,
    padding: 20,
    marginBottom: 32,
    fontSize: 17,
    minHeight: 64,
    color: '#3D4561',
    shadowColor: '#B8C5D9',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },

  pickerContainer: {
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#B8C5D9',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },

  picker: {
    height: 64,
    color: '#3D4561',
    fontSize: 17,
  },

  datePickerContainer: {
    marginBottom: 32,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#445580',
    marginBottom: 12,
    marginLeft: 6,
    letterSpacing: 0.5,
  },

  inputContainer: {
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    borderWidth: 0,
    minHeight: 64,
    padding: 18,
    shadowColor: '#B8C5D9',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
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
    marginTop: 10,
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 3,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 20,
  },

  cancelButton: {
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
    minHeight: 64,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 3,
  },

  cancelButtonText: {
    color: '#8A94B8',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  updateButton: {
    backgroundColor: '#ECF0F7',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
    minHeight: 64,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
    // Adding the dark shadow for the pressed effect
    borderWidth: 0,
    position: 'relative',
  },

  updateButtonText: {
    color: '#445580',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
});