import { View, Text, TextInput, ActivityIndicator,TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
const COLORS = {
    background: "#F4F5FB",     // Light lavender background
    card: "#FFFFFF",           // White
    primary: "#5A5BDE",        // Purple-blue (primary)
    secondary: "#6F89FF",      // Light blue
    accent: "#FF8C66",         // Soft orange
    accent2: "#81C3F8",        // Sky blue
    dark: "#373A56",           // Dark navy
    medium: "#6B6F8D",         // Medium navy-gray
    light: "#A0A4C1",          // Light gray-purple
    border: "#E2E5F1",         // Light border
    success: "#63C6AE",        // Turquoise
    warning: "#FFBD59",        // Amber
    danger: "#FF7285",         // Soft red
};
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: COLORS.background,
    },
    loadingText: {
      fontSize: 16,
      color: COLORS.medium,
    },
    header: {
      backgroundColor: COLORS.card,
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 10,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 14,
      color: COLORS.medium,
    },
    nameText: {
      fontSize: 22,
      fontWeight: "bold",
      color: COLORS.dark,
      marginTop: 4,
    },
    roleText: {
      fontSize: 14,
      color: COLORS.medium,
      marginTop: 2,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    notificationButton: {
      marginRight: 16,
      padding: 8,
      borderRadius: 12,
      backgroundColor: COLORS.card,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    notificationBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: COLORS.danger,
      justifyContent: "center",
      alignItems: "center",
    },
    notificationCount: {
      color: COLORS.card,
      fontSize: 10,
      fontWeight: "bold",
    },
    profileContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    profileInitials: {
      color: COLORS.card,
      fontSize: 18,
      fontWeight: "bold",
    },
    dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    dateContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    dayText: {
      fontSize: 32,
      fontWeight: "bold",
      color: COLORS.primary,
      marginRight: 8,
    },
    monthText: {
      fontSize: 16,
      color: COLORS.dark,
      fontWeight: "500",
    },
    yearText: {
      fontSize: 14,
      color: COLORS.medium,
    },
    calendarButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      paddingHorizontal: 12,
      backgroundColor: COLORS.primary + '10',
      borderRadius: 20,
    },
    calendarText: {
      color: COLORS.primary,
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 6,
    },
    summarySection: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.dark,
      marginBottom: 16,
    },
    summaryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    summaryCard: {
      width: "48%",
      backgroundColor: COLORS.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 14,
      color: COLORS.medium,
      marginBottom: 6,
    },
    summaryNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: COLORS.dark,
    },
    actionsSection: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    seeAllText: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: "500",
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    gridItem: {
      width: "48%",
      backgroundColor: COLORS.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    gridIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    gridText: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.dark,
    },
    shipmentsSection: {
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 24,
    },
    shipmentsContainer: {
      marginBottom: 16,
    },
    shipmentCard: {
      backgroundColor: COLORS.card,
      borderRadius: 16,
      marginBottom: 16,
      padding: 20,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    shipmentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    shipmentTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    shipmentRoute: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.dark,
    },
    shipmentId: {
      fontSize: 14,
      color: COLORS.medium,
      marginTop: 2,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusText: {
      color: COLORS.card,
      fontWeight: "bold",
      fontSize: 12,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    progressBarContainer: {
      flex: 1,
      height: 8,
      backgroundColor: COLORS.border,
      borderRadius: 4,
      marginRight: 12,
      overflow: "hidden",
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.dark,
    },
    shipmentDetails: {
      backgroundColor: COLORS.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    detailColumn: {
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 13,
      color: COLORS.medium,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 15,
      color: COLORS.dark,
      fontWeight: "500",
    },
    detailSeparator: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: 8,
    },
    shipmentActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    actionText: {
      color: COLORS.primary,
      marginLeft: 6,
      fontWeight: "500",
    },
    viewDetailsButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    viewDetailsText: {
      color: COLORS.card,
      fontWeight: "bold",
      fontSize: 14,
    },
    helpContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    helpContent: {
      backgroundColor: COLORS.primary + '10',
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    helpTextContainer: {
      flex: 1,
      marginRight: 16,
    },
    helpTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.dark,
      marginBottom: 8,
    },
    helpText: {
      fontSize: 14,
      color: COLORS.medium,
      lineHeight: 20,
    },
    helpButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    helpButtonText: {
      color: COLORS.card,
      fontWeight: "bold",
      fontSize: 14,
    },
    phoneContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
      },
      phoneText: {
        fontSize: 16,
      }
  });