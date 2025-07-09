import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // 40 = 16 (left padding) + 16 (right padding) + 8 (gap between cards)

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
    backgroundColor: COLORS.background,
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.medium,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.card,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 24,
  },
  truckInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  truckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckDetails: {
    marginLeft: 12,
    flex: 1,
  },
  truckTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  truckSubtitle: {
    fontSize: 14,
    color: COLORS.medium,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.medium,
  },
  documentCard: {
    width: '48%',
    minHeight: 160,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  documentInfo: {
    flex: 1,
    width: '100%',
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 6,
    lineHeight: 20,
  },
  documentDescription: {
    fontSize: 13,
    color: COLORS.medium,
    marginBottom: 12,
    lineHeight: 18,
  },
  documentMeta: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.light,
    marginLeft: 4,
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    borderRadius: 12,
    backgroundColor: COLORS.border,
  },
  separator: {
    width: 10, // No separator needed for grid layout
  },
});