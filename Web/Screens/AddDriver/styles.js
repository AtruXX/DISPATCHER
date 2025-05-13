import { StyleSheet } from "react-native";

// Enhanced color palette with more vibrant and friendly colors
const COLORS = {
  background: "#F6F7FF",    // Lighter lavender for a fresh feel
  card: "#FFFFFF",          // White
  primary: "#6366F1",       // More vibrant purple-blue (primary)
  primaryLight: "#EEF0FF",  // Light primary for subtle highlights
  secondary: "#7C8FFF",     // Enhanced light blue
  accent: "#FF9F7A",        // Warmer soft orange
  accent2: "#78C6FF",       // Brighter sky blue
  dark: "#2D3154",          // Softer dark navy
  medium: "#6E75A4",        // Warmer medium navy-gray
  light: "#A8ADCE",         // Slightly warmer light gray-purple
  border: "#E6E9F9",        // Subtle border
  success: "#4DD4B9",       // Brighter turquoise
  warning: "#FFCA6E",       // Brighter amber
  danger: "#FF8A94",        // Warmer soft red
  shadow: "#6366F1",        // Shadow color based on primary
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Enhanced header with more modern styling
  header: {
    backgroundColor: COLORS.card,
    paddingTop: 60,
    paddingBottom: 22,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  backButton: {
    padding: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: 0.2,
  },
  
  // Improved form container with better spacing
  formContainer: {
    flex: 1,
    padding: 24,
  },
  
  formSection: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  
  // More appealing input elements
  inputGroup: {
    marginBottom: 22,
  },
  
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.medium,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  
  inputContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    height: 54,
    justifyContent: 'center',
    // Add a transition effect when focused
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  inputContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  
  input: {
    paddingHorizontal: 18,
    fontSize: 16,
    color: COLORS.dark,
    height: '100%',
  },
  
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    height: 54,
    paddingHorizontal: 18,
  },
  
  dateText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  
  // More attractive and interactive button
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  
  createButtonPressed: {
    backgroundColor: "#5659D9", // Slightly darker when pressed
    transform: [{ scale: 0.98 }],
  },
  
  createButtonText: {
    color: COLORS.card,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  buttonIcon: {
    marginRight: 10,
  },
  
  // New styles for enhanced UX
  iconButton: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
  },
  
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    marginRight: 8,
    marginBottom: 8,
  },
  
  chipText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  
  helpText: {
    fontSize: 14,
    color: COLORS.light,
    marginTop: 4,
    marginLeft: 2,
  },
  
  // Placeholder styles
  placeholderText: {
    color: COLORS.light,
  },
  
  // Error state styling
  inputError: {
    borderColor: COLORS.danger,
  },
  
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
  
  // Success indication
  successIndicator: {
    position: 'absolute',
    right: 16,
    color: COLORS.success,
  },
});