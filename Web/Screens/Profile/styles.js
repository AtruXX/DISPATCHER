import { StyleSheet } from 'react-native';

// Using the provided color scheme
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Loading and Error States
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
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
  },
  retryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
  },

  // Profile Header
  profileHeader: {
    backgroundColor: COLORS.card,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: COLORS.card,
    fontSize: 28,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
    marginBottom: 4,
  },
  companyText: {
    fontSize: 14,
    color: COLORS.medium,
  },

  // Profile Details
  detailsContainer: {
    backgroundColor: COLORS.card,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIcon: {
    marginRight: 12,
    width: 24,
    textAlign: "center",
    color: COLORS.medium,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: COLORS.medium,
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: COLORS.dark,
  },

  // Documents Section
  documentsContainer: {
    backgroundColor: COLORS.card,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: COLORS.card,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyDocuments: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  emptyDocumentsText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.medium,
    textAlign: "center",
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 3,
  },
  documentCategory: {
    fontSize: 14,
    color: COLORS.medium,
    marginBottom: 3,
  },
  documentExpiry: {
    fontSize: 14,
    color: COLORS.medium,
  },
});

export default styles;