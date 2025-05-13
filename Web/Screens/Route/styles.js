import { StyleSheet } from "react-native";
const COLORS = {
    background: "#F4F5FB", // Light lavender background
    card: "#FFFFFF", // White
    primary: "#5A5BDE", // Purple-blue (primary)
    secondary: "#6F89FF", // Light blue
    accent: "#FF8C66", // Soft orange
    accent2: "#81C3F8", // Sky blue
    dark: "#373A56", // Dark navy
    medium: "#6B6F8D", // Medium navy-gray
    light: "#A0A4C1", // Light gray-purple
    border: "#E2E5F1", // Light border
    success: "#63C6AE", // Turquoise
    warning: "#FFBD59", // Amber
    danger: "#FF7285", // Soft red
  };
  
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      backgroundColor: COLORS.background,
    },
    map: {
      width: '100%',
      height: '100%',
      borderRadius: 24,
      overflow: 'hidden',
      margin: 10,
      height: 'calc(100vh - 20px)',
      width: 'calc(100% - 20px)',
    },
    searchContainer: {
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      maxWidth: 500,
      zIndex: 800,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.card,
      borderRadius: 16,
      paddingHorizontal: 15,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    searchInput: {
      flex: 1,
      padding: 14,
      fontSize: 16,
      color: COLORS.dark,
      backgroundColor: 'transparent',
    },
    searchButton: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButtonText: {
      fontSize: 16,
      color: COLORS.card,
    },
    driverIdPopup: {
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: COLORS.card,
      padding: 20,
      borderRadius: 16,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      width: 280,
      alignItems: 'center',
      zIndex: 900,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(55, 58, 86, 0.5)', // Using dark color with transparency
      backdropFilter: 'blur(5px)',
      zIndex: 999,
    },
    overlayTouchable: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popup: {
      backgroundColor: COLORS.card,
      padding: 25,
      borderRadius: 20,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 10,
      width: 380,
      alignItems: 'center',
      zIndex: 1000,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    popupTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: COLORS.dark,
    },
    input: {
      width: '95%',
      padding: 14,
      marginVertical: 12,
      borderRadius: 12,
      fontSize: 16,
      backgroundColor: COLORS.background,
      border: 'none',
      textAlign: 'center',
      color: COLORS.dark,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    button: {
      width: '100%',
      padding: 14,
      marginTop: 12,
      borderRadius: 12,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      border: 'none',
      cursor: 'pointer',
    },
    buttonText: {
      color: COLORS.card,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: COLORS.medium,
    },
    locationList: {
      marginTop: 20,
      maxHeight: 180,
      width: '100%',
      backgroundColor: COLORS.background,
      padding: 15,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: COLORS.dark,
    },
    scrollView: {
      maxHeight: 130,
      overflow: 'auto',
    },
    locationItem: {
      backgroundColor: COLORS.card,
      padding: 12,
      borderRadius: 10,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    locationItemText: {
      color: COLORS.dark,
      fontSize: 14,
    },
    sendRouteButton: {
      backgroundColor: COLORS.success,
      marginTop: 20,
    },
    successMessage: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: COLORS.success,
      padding: 20,
      borderRadius: 16,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 10,
      width: 320,
      alignItems: 'center',
      zIndex: 1001,
    },
    successText: {
      color: COLORS.card,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    navigationHeader: {
        position: 'absolute',
        top: 40, // Give some space from the top edge
        left: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100, // Enough width for both buttons
        zIndex: 10, // Ensure it's above other elements
      },
      
      // Fix for back button
      backButton: {
        backgroundColor: '#FFFFFF', // Add background for visibility
        padding: 8,
        borderRadius: 20,
        marginRight: 15, // Space between buttons
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Important for Android
      },
      
      // Fix for refresh button
      refreshButton: {
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
  });