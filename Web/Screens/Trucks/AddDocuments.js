import React, { useState, useEffect } from 'react';

const COLORS = {
  background: "#F4F5FB",
  card: "#FFFFFF",
  primary: "#5A5BDE",
  secondary: "#6F89FF",
  accent: "#FF8C66",
  accent2: "#81C3F8",
  dark: "#373A56",
  medium: "#6B6F8D",
  light: "#A0A4C1",
  border: "#E2E5F1",
  success: "#63C6AE",
  warning: "#FFBD59",
  danger: "#FF7285",
  selected: "#E8F5E8",
};

const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";

const DOCUMENT_TYPES = [
  { label: 'Certificat de conformitate', value: 'certificat_conformitate' },
  { label: 'Contract de asigurare', value: 'contract_asigurare' },
  { label: 'Inspectii tehnice periodice', value: 'inspectii_tehnice' },
  { label: 'Carte de identitate a vehiculului', value: 'carte_identitate_vehicul' },
  { label: 'EC Certificat de conformitate', value: 'ec_certificat_conformitate' },
  { label: 'Copie conforma', value: 'copie_conforma' },
  { label: 'Procedura de instalare', value: 'procedura_instalare' },
];

const AddDocumentForm = ({ isVisible, onClose, onDocumentAdded, truckId, authTokenForm }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    expiration_date: '',
    issuing_date: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isVisible) {
      setFormData({
        title: '',
        description: '',
        category: '',
        expiration_date: '',
        issuing_date: '',
      });
      setSelectedFile(null);
      setShowDropdown(false);
    }
  }, [isVisible]);

  // Success toast timer
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        setSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Web file upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const selectCategory = (category) => {
    handleChange('category', category.value);
    setShowDropdown(false);
  };

  const getSelectedCategoryLabel = () => {
    const selected = DOCUMENT_TYPES.find(type => type.value === formData.category);
    return selected ? selected.label : 'Selectează categoria documentului';
  };

  // Date validation helper
  const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert('Numele documentului este obligatoriu');
      return false;
    }
    if (!formData.category.trim()) {
      alert('Categoria documentului este obligatorie');
      return false;
    }
    if (!selectedFile) {
      alert('Vă rugăm să atașați un fișier');
      return false;
    }
    
    // Validate dates if they're not empty
    if (formData.issuing_date && !isValidDateFormat(formData.issuing_date)) {
      alert('Data emiterii trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    if (formData.expiration_date && !isValidDateFormat(formData.expiration_date)) {
      alert('Data de sfârșit a valabilității trebuie să fie în formatul AAAA-LL-ZZ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Create FormData for web
      const formDataToSubmit = new FormData();
      
      // Add form fields
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('category', formData.category);
      
      // Only append dates if they have values
      if (formData.expiration_date) {
        formDataToSubmit.append('expiration_date', formData.expiration_date);
      }
      if (formData.issuing_date) {
        formDataToSubmit.append('issuing_date', formData.issuing_date);
      }
      
      // Add file for web - much simpler than React Native
      if (selectedFile) {
        console.log('Adding file to FormData:', selectedFile);
        formDataToSubmit.append('document', selectedFile, selectedFile.name);
      }

      // For web, don't set Content-Type header - browser will set it automatically with boundary
      const response = await fetch(`${BASE_URL}truck-documents/${truckId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authTokenForm}`,
        },
        body: formDataToSubmit,
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        setSuccessToast(true);
        
        alert('Documentul a fost adăugat cu succes!');
        if (onDocumentAdded) {
          onDocumentAdded({ ...formData, file: selectedFile });
        }
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        console.error('Response status:', response.status);
        
        // Try to parse error response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.document && Array.isArray(errorJson.document)) {
            errorMessage = errorJson.document.join(', ');
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert(`Failed to add document: ${error.message}`);
      console.error('Error adding document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const renderDateInput = (dateType, label) => {
    return (
      <div className="input-group">
        <label className="label">{label}</label>
        <input
          type="text"
          className="input"
          value={formData[dateType]}
          onChange={(e) => handleChange(dateType, e.target.value)}
          placeholder="YYYY-MM-DD"
        />
        <span className="date-hint">Format: YYYY-MM-DD</span>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {successToast && (
          <div className="success-toast">
            <span>✓</span>
            <span>Documentul a fost adăugat!</span>
          </div>
        )}
        
        <div className="modal-header" style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
        }}>
          <h2 className="modal-title">Adaugă document</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        <div className="form-container">
          {/* File Upload Section */}
          <div className="file-section">
            <h3 className="section-title">Fișier document</h3>
            {!selectedFile ? (
              <div className="file-upload-area">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="file-upload-button">
                  <div className="upload-icon">📁</div>
                  <div className="file-upload-text">Atașează fișier</div>
                  <div className="file-upload-subtext">PDF, DOC, JPG, PNG</div>
                </label>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                  </div>
                </div>
                <button onClick={removeFile} className="remove-file-button">
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="form-fields-container">
            <div className="input-group">
              <label className="label">Numele documentului *</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Introduceți numele documentului"
              />
            </div>

            <div className="input-group">
              <label className="label">Categoria documentului *</label>
              <div className="dropdown-container">
                <button
                  type="button"
                  className={`dropdown-button ${showDropdown ? 'active' : ''}`}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className={!formData.category ? 'placeholder' : ''}>
                    {getSelectedCategoryLabel()}
                  </span>
                  <span className="dropdown-arrow">
                    {showDropdown ? '▲' : '▼'}
                  </span>
                </button>
                
                {showDropdown && (
                  <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}>
                    <div className="dropdown-list" onClick={(e) => e.stopPropagation()}>
                      {DOCUMENT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          className={`dropdown-item ${formData.category === type.value ? 'selected' : ''}`}
                          onClick={() => selectCategory(type)}
                        >
                          <span>{type.label}</span>
                          {formData.category === type.value && <span className="checkmark">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label className="label">Descriere</label>
              <textarea
                className="input textarea"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Introduceți descrierea documentului"
                rows={3}
              />
            </div>

            <div className="date-row">
              {renderDateInput('issuing_date', 'Data emiterii')}
            </div>

            <div className="date-row">
              {renderDateInput('expiration_date', 'Sfârșit valabilitate')}
            </div>
          </div>

          <div className="button-container">
            <button
              type="button"
              className="button cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Anulează
            </button>
            <button
              type="button"
              className="button submit-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span>Se încarcă...</span>
              ) : (
                <>
                  <span>➕</span>
                  <span>Adaugă document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(55, 58, 86, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          width: 92%;
          max-width: 600px;
          max-height: 88vh;
          background-color: ${COLORS.card};
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(167, 169, 175, 0.3);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          color: white;
        }

        .modal-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
        }

        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .form-container {
          flex: 1;
          overflow-y: auto;
        }

        .file-section {
          padding: 20px;
          border-bottom: 1px solid ${COLORS.border};
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: ${COLORS.dark};
          margin: 0 0 12px 0;
        }

        .file-upload-area {
          border: 2px dashed ${COLORS.border};
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          background-color: ${COLORS.background};
        }

        .file-upload-button {
          display: block;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .file-upload-text {
          font-size: 16px;
          font-weight: 600;
          color: ${COLORS.primary};
          margin-bottom: 4px;
        }

        .file-upload-subtext {
          font-size: 12px;
          color: ${COLORS.medium};
        }

        .file-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background-color: ${COLORS.background};
          border-radius: 12px;
          border: 1px solid ${COLORS.border};
        }

        .file-info {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .file-icon {
          font-size: 24px;
          margin-right: 12px;
        }

        .file-details {
          flex: 1;
        }

        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: ${COLORS.dark};
          margin-bottom: 2px;
        }

        .file-size {
          font-size: 12px;
          color: ${COLORS.medium};
        }

        .remove-file-button {
          background: none;
          border: none;
          color: ${COLORS.danger};
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .remove-file-button:hover {
          background-color: rgba(255, 114, 133, 0.1);
        }

        .form-fields-container {
          padding: 20px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: ${COLORS.dark};
        }

        .input {
          width: 100%;
          height: 48px;
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 0 16px;
          background-color: ${COLORS.background};
          color: ${COLORS.dark};
          font-size: 16px;
          box-sizing: border-box;
        }

        .input:focus {
          outline: none;
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px rgba(90, 91, 222, 0.1);
        }

        .textarea {
          height: 88px;
          padding: 16px;
          resize: vertical;
          font-family: inherit;
        }

        .dropdown-container {
          position: relative;
        }

        .dropdown-button {
          width: 100%;
          height: 48px;
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 0 16px;
          background-color: ${COLORS.background};
          color: ${COLORS.dark};
          font-size: 16px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-button:hover, .dropdown-button.active {
          border-color: ${COLORS.primary};
        }

        .dropdown-button .placeholder {
          color: ${COLORS.light};
        }

        .dropdown-arrow {
          font-size: 12px;
          color: ${COLORS.medium};
        }

        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .dropdown-list {
          background-color: ${COLORS.card};
          border-radius: 12px;
          border: 1px solid ${COLORS.border};
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          max-height: 280px;
          width: 80%;
          max-width: 400px;
          overflow-y: auto;
        }

        .dropdown-item {
          width: 100%;
          padding: 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid ${COLORS.border};
          font-size: 15px;
          color: ${COLORS.dark};
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background-color: ${COLORS.background};
        }

        .dropdown-item.selected {
          background-color: ${COLORS.selected};
          font-weight: 600;
          color: ${COLORS.success};
        }

        .checkmark {
          color: ${COLORS.success};
          font-weight: bold;
        }

        .date-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .date-row .input-group {
          flex: 1;
          margin-bottom: 0;
        }

        .date-hint {
          font-size: 11px;
          color: ${COLORS.medium};
          margin-top: 4px;
          font-style: italic;
        }

        .button-container {
          display: flex;
          gap: 12px;
          padding: 20px;
          padding-top: 10px;
        }

        .button {
          flex: 1;
          height: 52px;
          border-radius: 12px;
          border: none;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 3px 12px rgba(167, 169, 175, 0.2);
          transition: all 0.2s;
        }

        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(167, 169, 175, 0.3);
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .cancel-button {
          background-color: ${COLORS.light};
          color: ${COLORS.dark};
        }

        .submit-button {
          background-color: ${COLORS.primary};
          color: white;
        }

        .success-toast {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background-color: ${COLORS.success};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: bold;
          z-index: 1001;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 20px;
          }
          
          .date-row {
            flex-direction: column;
            gap: 0;
          }
          
          .date-row .input-group {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddDocumentForm;