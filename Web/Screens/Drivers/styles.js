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
    },
    avatarSection: {
      marginRight: 16,
      position: 'relative',
    },
    avatarGradient: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    statusIndicator: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 2,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#303F9F',
      marginBottom: 2,
    },
    driverEmail: {
      fontSize: 14,
      color: '#7986CB',
      marginBottom: 8,
    },
    divider: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: 8,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    detailItem: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: '#9E9E9E',
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      color: '#424242',
      fontWeight: '500',
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
    refreshButton: {
      backgroundColor: '#3F51B5',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
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
    backButton: {
      padding: 8,
    },
    refreshButton: {
      padding: 8,
    },
  });
  