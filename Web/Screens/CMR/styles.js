import { StyleSheet } from 'react-native';
const getRandomColor = (id) => {
    const colors = [
      ['#FF9966', '#FF5E62'],
      ['#36D1DC', '#5B86E5'],
      ['#CB356B', '#BD3F32'],
      ['#3A1C71', '#D76D77'],
      ['#00B4DB', '#0083B0'],
      ['#FEAC5E', '#C779D0'],
      ['#43C6AC', '#191654'],
      ['#834D9B', '#D04ED6']
    ];
    return colors[id % colors.length];
  };
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ECEFF1',
    },
    scrollContent: {
      paddingBottom: 40,
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
    // Header styles
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
    // CMR Document styles
    cmrContainer: {
      marginHorizontal: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#CFD8DC',
    },
    cmrHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#CFD8DC',
      padding: 10,
    },
    cmrLogo: {
      flex: 1,
      justifyContent: 'center',
    },
    cmrLogoText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#303F9F',
    },
    cmrTitle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cmrTitleText: {
      fontWeight: 'bold',
      fontSize: 24,
      color: '#303F9F',
    },
    cmrSubtitleText: {
      fontSize: 12,
      color: '#455A64',
    },
    cmrContent: {
      padding: 8,
    },
    cmrRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#CFD8DC',
      minHeight: 60,
    },
    cmrNumberCell: {
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: '#CFD8DC',
      backgroundColor: '#F5F5F5',
    },
    cmrCellNumber: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#455A64',
    },
    cmrCell: {
      flex: 1,
      padding: 8,
    },
    cmrCellLabel: {
      fontSize: 12,
      color: '#78909C',
      marginBottom: 4,
    },
    cmrCellValue: {
      fontSize: 14,
      color: '#37474F',
    },
    cmrTableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#CFD8DC',
      backgroundColor: '#F5F5F5',
    },
    cmrTableHeaderCell: {
      flex: 1,
      padding: 6,
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: '#CFD8DC',
    },
    cmrTableHeaderText: {
      fontSize: 10,
      textAlign: 'center',
      color: '#455A64',
    },
    cmrTableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#CFD8DC',
      minHeight: 40,
    },
    cmrTableCell: {
      flex: 1,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: '#CFD8DC',
    },
    cmrTableCellText: {
      fontSize: 12,
      color: '#37474F',
    },
    // Payment table styles
    paymentTable: {
      marginTop: 4,
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    paymentRowTotal: {
      borderTopWidth: 2,
      borderTopColor: '#BDBDBD',
      paddingTop: 8,
      marginTop: 4,
    },
    paymentLabel: {
      fontSize: 12,
      color: '#616161',
    },
    paymentValue: {
      fontSize: 12,
      color: '#212121',
      fontWeight: '500',
    },
    paymentLabelTotal: {
      fontSize: 14,
      color: '#303F9F',
      fontWeight: 'bold',
    },
    paymentValueTotal: {
      fontSize: 14,
      color: '#303F9F',
      fontWeight: 'bold',
    },
    cmrSignatures: {
      flexDirection: 'row',
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#CFD8DC',
    },
    cmrSignatureBox: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: '#CFD8DC',
    },
    cmrSignatureHeader: {
      backgroundColor: '#F5F5F5',
      padding: 4,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#CFD8DC',
    },
    cmrSignatureNumber: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#455A64',
    },
    cmrSignatureContent: {
      minHeight: 80,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cmrSignatureText: {
      fontSize: 10,
      textAlign: 'center',
      color: '#78909C',
    },
    cmrStamp: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#303F9F',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    cmrStampText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#303F9F',
    },
    // Loading and error styles
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
    listContainer: {
      paddingBottom: 20,
    },
    transportCardContainer: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    transportCard: {
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
  });
  
