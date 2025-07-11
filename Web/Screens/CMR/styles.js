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

export const COLORS = {
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
    available: "#81C784",
    unavailable: "#E57373",
    white: "#FFFFFF",
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
    printButton: {
      padding: 8,
    },
    // Header styles (keeping the same)
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
    
    // CMR Document styles - Official format with red borders (BIGGER & CLEARER)
    cmrContainer: {
      marginHorizontal: 12,
      backgroundColor: '#FFFFFF',
      borderRadius: 0,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: '#DC143C', // Red border like official CMR
    },
    
    // Header section with red background and CMR logo
    cmrHeaderSection: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 2,
      borderBottomColor: '#DC143C',
    },
    cmrHeaderTop: {
      flexDirection: 'row',
      padding: 12,
      alignItems: 'center',
    },
    cmrCopyInfo: {
      flex: 1,
    },
    cmrCopyNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#DC143C',
    },
    cmrCopyText: {
      fontSize: 14,
      color: '#DC143C',
      fontStyle: 'italic',
    },
    cmrHeaderRight: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#DC143C',
      padding: 12,
    },
    cmrHeaderRightLeft: {
      flex: 1,
      alignItems: 'center',
    },
    cmrHeaderRightCenter: {
      flex: 1,
      alignItems: 'center',
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: '#DC143C',
      paddingHorizontal: 16,
    },
    cmrHeaderRightRight: {
      flex: 1,
      alignItems: 'center',
    },
    cmrInternationalText: {
      fontSize: 11,
      color: '#000000',
      textAlign: 'center',
      lineHeight: 14,
      fontWeight: '600',
    },
    cmrBigText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#DC143C',
    },
    cmrTransportText: {
      fontSize: 11,
      color: '#000000',
      textAlign: 'center',
      lineHeight: 14,
      fontWeight: '600',
    },
    
    // Side text (rotated text simulation)
    cmrSideText: {
      position: 'absolute',
      left: -20,
      top: 50,
      width: 400,
      height: 20,
      backgroundColor: 'transparent',
    },
    cmrSideTextContent: {
      fontSize: 6,
      color: '#DC143C',
      transform: [{ rotate: '-90deg' }],
      textAlign: 'center',
      width: 400,
    },
    
    cmrContent: {
      backgroundColor: '#FFFFFF',
    },
    
    // Main content sections (BIGGER & CLEARER)
    cmrMainRow: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: '#DC143C',
    },
    
    // Left column (sections 1-5, 13-15, 21-22)
    cmrLeftColumn: {
      flex: 3,
      borderRightWidth: 2,
      borderRightColor: '#DC143C',
    },
    
    // Right column (sections 16-20, 23-24)
    cmrRightColumn: {
      flex: 2,
    },
    
    // Standard row (BIGGER)
    cmrRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#DC143C',
      minHeight: 60,
    },
    cmrNumberCell: {
      width: 35,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderRightWidth: 2,
      borderRightColor: '#DC143C',
      backgroundColor: '#FFFFFF',
      paddingTop: 8,
    },
    cmrCellNumber: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#000000',
    },
    cmrCell: {
      flex: 1,
      padding: 8,
      justifyContent: 'flex-start',
    },
    cmrCellLabel: {
      fontSize: 12,
      color: '#000000',
      marginBottom: 4,
      fontWeight: '700',
    },
    cmrCellLabelSmall: {
      fontSize: 10,
      color: '#000000',
      fontStyle: 'italic',
      marginBottom: 2,
    },
    cmrCellValue: {
      fontSize: 14,
      color: '#000000',
      lineHeight: 18,
      fontWeight: '500',
    },
    
    // Country code boxes (BIGGER)
    cmrCountrySection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    cmrCountryLabel: {
      fontSize: 10,
      color: '#000000',
      marginRight: 8,
      fontWeight: '600',
    },
    cmrCountryBox: {
      borderWidth: 1,
      borderColor: '#000000',
      width: 40,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cmrCountryText: {
      fontSize: 12,
      color: '#000000',
      fontWeight: 'bold',
    },
    
    // Table section (6-12) (BIGGER)
    cmrTableSection: {
      borderBottomWidth: 2,
      borderBottomColor: '#DC143C',
    },
    cmrTableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: '#DC143C',
      backgroundColor: '#FFFFFF',
      minHeight: 70,
    },
    cmrTableHeaderCell: {
      flex: 1,
      padding: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderRightWidth: 1,
      borderRightColor: '#DC143C',
    },
    cmrTableHeaderNumber: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 4,
    },
    cmrTableHeaderText: {
      fontSize: 10,
      textAlign: 'center',
      color: '#000000',
      lineHeight: 12,
      fontWeight: '600',
    },
    cmrTableData: {
      flexDirection: 'row',
      minHeight: 120,
    },
    cmrTableDataCell: {
      flex: 1,
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: '#DC143C',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    cmrTableCellText: {
      fontSize: 12,
      color: '#000000',
      textAlign: 'center',
      fontWeight: '500',
    },
    
    // Special sections in table area (BIGGER)
    cmrTableBottomSection: {
      flexDirection: 'row',
      borderTopWidth: 2,
      borderTopColor: '#DC143C',
      minHeight: 40,
    },
    cmrClassSection: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: '#DC143C',
      padding: 6,
    },
    cmrClassRow: {
      flexDirection: 'row',
      marginBottom: 3,
      alignItems: 'center',
    },
    cmrClassLabel: {
      fontSize: 9,
      color: '#000000',
      width: 45,
      fontWeight: '600',
    },
    cmrClassBox: {
      borderWidth: 1,
      borderColor: '#000000',
      width: 25,
      height: 15,
      marginRight: 6,
    },
    
    // Payment section (section 20) (BIGGER)
    cmrPaymentSection: {
      padding: 8,
      borderBottomWidth: 2,
      borderBottomColor: '#DC143C',
    },
    cmrPaymentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    cmrPaymentNumber: {
      width: 25,
      alignItems: 'center',
    },
    cmrPaymentTitle: {
      flex: 1,
      marginLeft: 6,
    },
    cmrPaymentGrid: {
      borderWidth: 2,
      borderColor: '#DC143C',
    },
    cmrPaymentHeaderRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#DC143C',
      backgroundColor: '#F8F8F8',
    },
    cmrPaymentHeaderCell: {
      flex: 1,
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: '#DC143C',
      alignItems: 'center',
    },
    cmrPaymentRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#DC143C',
      minHeight: 25,
    },
    cmrPaymentCell: {
      flex: 1,
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: '#DC143C',
      justifyContent: 'center',
    },
    cmrPaymentLabel: {
      fontSize: 10,
      color: '#000000',
      fontWeight: '600',
    },
    cmrPaymentValue: {
      fontSize: 12,
      color: '#000000',
      textAlign: 'center',
      fontWeight: '500',
    },
    
    
    
    // Signature section (BIGGER)
    cmrSignatureSection: {
      flexDirection: 'row',
      minHeight: 120,
    },
    cmrSignatureBox: {
      flex: 1,
      borderRightWidth: 2,
      borderRightColor: '#DC143C',
    },
    cmrSignatureHeader: {
      backgroundColor: '#FFFFFF',
      padding: 6,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#DC143C',
      minHeight: 30,
    },
    cmrSignatureNumber: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#000000',
    },
    cmrSignatureContent: {
      flex: 1,
      padding: 8,
      justifyContent: 'flex-end',
    },
    cmrSignatureText: {
      fontSize: 10,
      textAlign: 'center',
      color: '#000000',
      lineHeight: 14,
      fontWeight: '500',
    },
    cmrDateLine: {
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      marginTop: 15,
      marginBottom: 4,
      height: 1,
    },
    cmrDateText: {
      fontSize: 10,
      color: '#000000',
      textAlign: 'right',
      fontWeight: '500',
    },
    
    // Loading and error styles (keeping the same)
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
    downloadButtonGradient: {
      borderRadius: 10,
      marginTop: 20,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    downloadButton: {
      paddingVertical: 14,
      alignItems: 'center',
    },
    downloadButtonText: {
      color: COLORS.card,
      fontSize: 16,
      fontWeight: 'bold',
    },
    // Add these new styles to your existing styles object in styles.js

// Company header styles
cmrCompanyHeader: {
  padding: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  alignItems: 'center',
},
cmrCompanyName: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000000',
  marginBottom: 2,
},
cmrCompanyDetails: {
  fontSize: 10,
  color: '#000000',
  textAlign: 'center',
},

// Enhanced disclaimer
cmrDisclaimer: {
  padding: 6,
  borderTopWidth: 1,
  borderTopColor: '#DC143C',
},
cmrDisclaimerText: {
  fontSize: 9,
  color: '#000000',
  textAlign: 'center',
  lineHeight: 12,
},

// Carrier section specific styling
cmrCarrierSection: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 80,
},
cmrCompanyValue: {
  fontSize: 14,
  color: '#000000',
  fontWeight: 'bold',
  marginBottom: 2,
},
cmrVatSection: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},
cmrVehicleSection: {
  marginTop: 6,
},



// Enhanced table header text
cmrTableHeaderTextSmall: {
  fontSize: 9,
  textAlign: 'center',
  color: '#000000',
  lineHeight: 11,
  fontStyle: 'italic',
},

// Danger section styling
cmrDangerSection: {
  flex: 1,
  padding: 6,
  justifyContent: 'center',
  alignItems: 'center',
},

// Enhanced signature styling
cmrElectronicSignature: {
  fontSize: 10,
  textAlign: 'center',
  color: '#0066CC',
  fontWeight: 'bold',
  marginTop: 4,
},
cmrStampArea: {
  borderWidth: 2,
  borderColor: '#000000',
  borderRadius: 20,
  padding: 8,
  alignItems: 'center',
  marginBottom: 8,
  alignSelf: 'center',
},
cmrStampText: {
  fontSize: 8,
  color: '#000000',
  fontWeight: 'bold',
  textAlign: 'center',
},

// Update existing payment section for Romanian/German labels
cmrPaymentLabel: {
  fontSize: 9,
  color: '#000000',
  fontWeight: '600',
  textAlign: 'left',
},

// Enhanced content wrapper
cmrContent: {
  backgroundColor: '#FFFFFF',
},

// Make sure these existing styles are properly sized for mobile and web
cmrContainer: {
  marginHorizontal: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 0,
  overflow: 'hidden',
  borderWidth: 3,
  borderColor: '#DC143C',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

// Ensure proper responsive sizing
cmrRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 50, // Reduced for mobile
},

cmrCell: {
  flex: 1,
  padding: 6, // Reduced padding for mobile
  justifyContent: 'flex-start',
},

cmrCellLabel: {
  fontSize: 11, // Slightly smaller for mobile
  color: '#000000',
  marginBottom: 3,
  fontWeight: '700',
},

cmrCellLabelSmall: {
  fontSize: 9, // Adjusted for readability
  color: '#000000',
  fontStyle: 'italic',
  marginBottom: 2,
  lineHeight: 11,
},

////////
// Add these styles to your existing styles object to match the exact photo layout

// Updated header styles to match photo
cmrHeaderCenter: {
  flex: 2,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 10,
},
cmrHeaderTitle: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#000000',
  textAlign: 'center',
  lineHeight: 14,
},
cmrSmallText: {
  fontSize: 8,
  color: '#000000',
  textAlign: 'center',
  lineHeight: 10,
},

// Large row for section 13
cmrLargeRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 80,
},

// Vehicle details styling
cmrVehicleDetails: {
  marginTop: 8,
  paddingTop: 4,
  borderTopWidth: 1,
  borderTopColor: '#CCCCCC',
},

// Enhanced carrier section
cmrCarrierSection: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 120,
},

// Reimbursement row (the black bar in section 15)
cmrReimbursementRow: {
  flexDirection: 'row',
  backgroundColor: '#000000',
  minHeight: 25,
},
cmrReimbursementNumber: {
  width: 30,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000000',
},
cmrReimbursementContent: {
  flex: 1,
  justifyContent: 'center',
  paddingLeft: 10,
  backgroundColor: '#000000',
},
cmrWhiteText: {
  color: '#FFFFFF',
  fontSize: 10,
  fontWeight: 'bold',
},

// Enhanced signature styling
cmrSignatureRight: {
  position: 'absolute',
  right: 10,
  top: 10,
},

// Updated stamp area to match the circular stamp in photo
cmrStampArea: {
  borderWidth: 2,
  borderColor: '#000000',
  borderRadius: 25,
  width: 50,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
  alignSelf: 'center',
},
cmrStampText: {
  fontSize: 6,
  color: '#000000',
  fontWeight: 'bold',
  textAlign: 'center',
  lineHeight: 8,
},

// Enhanced table styles to match photo exactly
cmrTableData: {
  flexDirection: 'row',
  minHeight: 200, // Increased height like in photo
  borderBottomWidth: 2,
  borderBottomColor: '#DC143C',
},

// Class section exact styling
cmrClassSection: {
  flex: 1,
  borderRightWidth: 1,
  borderRightColor: '#DC143C',
  padding: 4,
},
cmrClassRow: {
  flexDirection: 'row',
  marginBottom: 2,
  alignItems: 'center',
  flexWrap: 'wrap',
},
cmrClassLabel: {
  fontSize: 8,
  color: '#000000',
  width: 30,
  fontWeight: '600',
},
cmrClassBox: {
  borderWidth: 1,
  borderColor: '#000000',
  width: 15,
  height: 12,
  marginRight: 4,
},

// Payment section exact styling to match photo
cmrPaymentGrid: {
  borderWidth: 2,
  borderColor: '#DC143C',
  marginTop: 4,
},
cmrPaymentHeaderRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  backgroundColor: '#F8F8F8',
  minHeight: 25,
},
cmrPaymentHeaderCell: {
  flex: 1,
  padding: 4,
  borderRightWidth: 1,
  borderRightColor: '#DC143C',
  alignItems: 'center',
  justifyContent: 'center',
},
cmrPaymentRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 20,
},
cmrPaymentCell: {
  flex: 1,
  padding: 3,
  borderRightWidth: 1,
  borderRightColor: '#DC143C',
  justifyContent: 'center',
},
cmrPaymentLabel: {
  fontSize: 8,
  color: '#000000',
  fontWeight: '600',
  textAlign: 'left',
},
cmrPaymentValue: {
  fontSize: 9,
  color: '#000000',
  textAlign: 'center',
  fontWeight: '500',
},

// Enhanced table header to match photo
cmrTableHeaderCell: {
  flex: 1,
  padding: 4,
  alignItems: 'center',
  justifyContent: 'center',
  borderRightWidth: 1,
  borderRightColor: '#DC143C',
  borderBottomWidth: 2,
  borderBottomColor: '#DC143C',
  minHeight: 60,
},
cmrTableHeaderNumber: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#000000',
  marginBottom: 2,
},
cmrTableHeaderText: {
  fontSize: 9,
  textAlign: 'center',
  color: '#000000',
  lineHeight: 11,
  fontWeight: '600',
},
cmrTableHeaderTextSmall: {
  fontSize: 8,
  textAlign: 'center',
  color: '#000000',
  lineHeight: 9,
  fontStyle: 'italic',
},

// Table data cells
cmrTableDataCell: {
  flex: 1,
  padding: 4,
  borderRightWidth: 1,
  borderRightColor: '#DC143C',
  alignItems: 'center',
  justifyContent: 'flex-start',
},
cmrTableCellText: {
  fontSize: 10,
  color: '#000000',
  textAlign: 'center',
  fontWeight: '500',
},

// Signature section exact styling
cmrSignatureSection: {
  flexDirection: 'row',
  minHeight: 100,
},
cmrSignatureBox: {
  flex: 1,
  borderRightWidth: 2,
  borderRightColor: '#DC143C',
},
cmrSignatureHeader: {
  backgroundColor: '#F8F8F8',
  padding: 4,
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 25,
},
cmrSignatureNumber: {
  fontWeight: 'bold',
  fontSize: 14,
  color: '#000000',
},
cmrSignatureContent: {
  flex: 1,
  padding: 6,
  justifyContent: 'space-between',
},
cmrSignatureText: {
  fontSize: 8,
  textAlign: 'center',
  color: '#000000',
  lineHeight: 10,
  fontWeight: '500',
  marginBottom: 2,
},
cmrElectronicSignature: {
  fontSize: 8,
  textAlign: 'center',
  color: '#0066CC',
  fontWeight: 'bold',
  marginTop: 4,
},
cmrDateLine: {
  borderBottomWidth: 1,
  borderBottomColor: '#000000',
  marginTop: 10,
  marginBottom: 2,
  height: 1,
},

// Enhanced main container
cmrContainer: {
  marginHorizontal: 8,
  backgroundColor: '#FFFFFF',
  borderRadius: 0,
  overflow: 'hidden',
  borderWidth: 3,
  borderColor: '#DC143C',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

// Responsive adjustments for mobile
cmrCellLabel: {
  fontSize: 10,
  color: '#000000',
  marginBottom: 2,
  fontWeight: '700',
  lineHeight: 12,
},
cmrCellLabelSmall: {
  fontSize: 8,
  color: '#000000',
  fontStyle: 'italic',
  marginBottom: 1,
  lineHeight: 10,
},
cmrCellValue: {
  fontSize: 11,
  color: '#000000',
  lineHeight: 13,
  fontWeight: '500',
  marginBottom: 1,
},

// Company value styling
cmrCompanyValue: {
  fontSize: 12,
  color: '#000000',
  fontWeight: 'bold',
  marginBottom: 2,
},

// Enhanced fare section
cmrFareSection: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#DC143C',
  minHeight: 60,
},
cmrFareLeft: {
  flex: 2,
  flexDirection: 'row',
},
cmrFareRight: {
  flex: 1,
  flexDirection: 'row',
  borderLeftWidth: 1,
  borderLeftColor: '#DC143C',
},

// Checkbox styling
cmrCheckboxSection: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 2,
},
cmrCheckbox: {
  borderWidth: 1,
  borderColor: '#000000',
  width: 12,
  height: 12,
  marginRight: 4,
  justifyContent: 'center',
  alignItems: 'center',
},
cmrCheckboxText: {
  fontSize: 9,
  color: '#000000',
  fontWeight: '500',
},
cmrCheckMark: {
  fontSize: 10,
  color: '#000000',
  fontWeight: 'bold',
},

// Date section styling
cmrDateSection: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 4,
  alignItems: 'center',
},
});