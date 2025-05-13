import { StyleSheet } from 'react-native';

// Colors used throughout the app
export const COLORS = {
    primary: '#3F51B5',
    secondary: '#5C6BC0',
    accent: '#FF4081',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    background: '#F5F7FA',
    white: '#FFFFFF',
    text: {
        dark: '#212121',
        medium: '#757575',
        light: '#BDBDBD'
    },
    border: '#E0E0E0',
    divider: '#EEEEEE',
    shadow: 'rgba(0, 0, 0, 0.1)',
};

// Styles used for the CMR pages
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    navigationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.dark,
    },
    
    // CMR Toggle
    cmrToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginTop: 8,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        marginHorizontal: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cmrToggleText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.dark,
    },
    cmrToggleButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 20,
        padding: 8,
    },
    cmrToggleButtonActive: {
        backgroundColor: COLORS.primary,
    },
    
    // CMR Form
    cmrFormContainer: {
        marginTop: 16,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 16,
    },
    cmrSection: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
        paddingBottom: 16,
    },
    cmrSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.dark,
        marginBottom: 12,
    },
    inputContainer: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text.medium,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: COLORS.text.dark,
        backgroundColor: COLORS.white,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    inputWrapper: {
        flex: 1,
    },
    
    // Date Picker
    datePickerContainer: {
        position: 'relative',
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: COLORS.text.dark,
        fontSize: 14,
    },
    dropdownPlaceholder: {
        color: COLORS.text.light,
        fontSize: 14,
    },
    calendarContainer: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 8,
        zIndex: 1000,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    
    // Submit Button
    submitButton: {
        backgroundColor: COLORS.primary,
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.text.light,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    // Error/Loading States
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});