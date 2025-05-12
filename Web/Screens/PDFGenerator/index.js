import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { useNavigation } from '@react-navigation/native';

function PdfGenerator() {
  const contentRef = useRef();
  const navigation = useNavigation();
  const [cmrData, setCmrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";
  const [authToken, setAuthToken] = useState(null);
  // Function to fetch CMR data from API
 // Function to fetch CMR data from API
 useEffect(() => {
  const getAuthToken = () => {
      try {
          console.log("Attempting to get auth token from localStorage");
          const token = localStorage.getItem('authToken'); // FIXED: Changed from setting to getting
          console.log("Token from localStorage:", token ? "Token exists" : "No token found");

          if (token) {
              setAuthToken(token);
              console.log("Auth token set in state");
          } else {
              console.log("No token found, setting error");
              setError('Authentication required. Please log in first.');
          }
      } catch (err) {
          console.error("Error getting auth token:", err);
          setError('Failed to load authentication token.');
      } finally {
          console.log("Setting loading to false");
          setLoading(false);
      }
  };

  getAuthToken();
}, []);
useEffect(() => {
  const fetchCmrData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}transport-cmr/1`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const dataArray = await response.json();
      console.log("Fetched CMR data:", dataArray);
      
      // Check if we have data and it's an array
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error('No CMR data available');
      }
      
      // Get the last element from the array
      const data = dataArray[dataArray.length - 1];
      console.log("Selected last CMR record:", data);
      
      // Transform and normalize data to match the required format
      const transformedData = {
        expeditor_nume: data.expeditor_nume || "",
        expeditor_adresa: data.expeditor_adresa || "",
        expeditor_tara: data.expeditor_tara || "",
        destinatar_nume: data.destinatar_nume || "",
        destinatar_adresa: data.destinatar_adresa || "",
        destinatar_tara: data.destinatar_tara || "",
        loc_livrare: data.loc_livrare || "",
        loc_incarcare: data.loc_incarcare || "",
        data_incarcare: formatDate(data.data_incarcare) || "",
        marci_numere: data.marci_numere || "",
        numar_colete: data.numar_colete?.toString() || "",
        mod_ambalare: data.mod_ambalare || "",
        natura_marfii: data.natura_marfii || "",
        nr_statistic: data.nr_static || "",
        greutate_bruta: `${data.greutate_bruta || ""}`,
        cubaj: data.cubaj || "",
        instructiuni_expeditor: data.instructiuni_expeditor || "",
        prescriptii_francare: data.prescriptii_francare || "---------",
        rambursare: data.rambursare || "---------",
        transportator: data.transportator || "C&C Logistic SRL", // Default if null
        transportatori_succesivi: data.transportatori_succesivi || "-----------",
        rezerve_observatii: data.rezerve_observatii || "---------",
        conventii_speciale: data.conventii_speciale || "",
        de_plata: {
          pret_transport: (data.de_plata && data.de_plata.pret_transport) || "0",
          reduceri: (data.de_plata && data.de_plata.reduceri) || "0",
          sold: (data.de_plata && data.de_plata.sold) || "0",
          suplimente: (data.de_plata && data.de_plata.suplimente) || "0",
          alte_cheltuieli: (data.de_plata && data.de_plata.alte_cheltuieli) || "0",
          total: (data.de_plata && data.de_plata.total) || "0"
        },
        incheiat_la: {
          locatie: (data.incheiat_la && data.incheiat_la.locatie) || "Bucuresti",
          data: (data.incheiat_la && data.incheiat_la.data) 
            ? formatDate(data.incheiat_la.data) 
            : formatDate(data.data_incarcare) || formatDate(new Date())
        },
        semnatura_expeditor: data.semnatura_expeditor || "Semnat electronic",
        semnatura_transportator: data.semnatura_transportator || "Semnat electronic",
        semnatura_destinatar: data.semnatura_destinatar || "Semnat electronic"
      };
      
      setCmrData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching CMR data:", err);
      setError(err.message);
      setLoading(false);
    }
  };
  fetchCmrData();
}, []);

  // Helper function to format date from API (YYYY-MM-DD) to DD.MM.YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if parsing fails
    }
  };

  // Function to handle PDF download with A4 optimization
  const handleDownload = () => {
    const opt = {
      margin: [5, 5], // Reduced margins [top&bottom, left&right] in mm
      filename: 'cmr_document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 }, // Higher scale for better quality
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(contentRef.current).set(opt).save();
  };

  // Function to handle navigation back to main screen
  const handleGoBack = () => {
    navigation.navigate('Main');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading-message">
          <h2>Loading CMR data...</h2>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !cmrData) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Error loading CMR data</h2>
          <p>{error}</p>
          <button onClick={handleGoBack} className="back-btn">Înapoi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      
      <div className="controls">
        <h1>CMR Document Generator</h1>
        {error && (
          <div className="error-banner">
            Warning: Using fallback data due to API error: {error}
          </div>
        )}
        <div className="buttons-container">
          <button onClick={handleGoBack} className="back-btn">Înapoi</button>
          <button onClick={handleDownload} className="download-btn">Descarcă</button>
        </div>
      </div>
      
      <div id="cmrContent" ref={contentRef}>
        <div className="cmrContainer">
          <div className="cmrHeader">
            <div className="cmrLogo">
              <div className="cmrLogoText">C&C LOGISTIC SRL</div>
            </div>
            <div className="cmrTitle">
              <h1 className="cmrTitleText">CMR</h1>
              <p className="cmrSubtitleText">SCRISOARE DE TRANSPORT INTERNATIONAL</p>
            </div>
          </div>
          
          {/* CMR Main Content */}
          <div className="cmrContent">
            {/* Row 1 & 2 - Expeditor & Destinatar side by side */}
            <div className="cmrFlexRow">
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">1</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Expeditor (nume, adresa, tara)</div>
                  <div className="cmrCellValue">{cmrData.expeditor_nume}</div>
                  <div className="cmrCellValue">{cmrData.expeditor_adresa}</div>
                  <div className="cmrCellValue">{cmrData.expeditor_tara}</div>
                </div>
              </div>
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">2</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Destinatar (nume, adresa, tara)</div>
                  <div className="cmrCellValue">{cmrData.destinatar_nume}</div>
                  <div className="cmrCellValue">{cmrData.destinatar_adresa}</div>
                  <div className="cmrCellValue">{cmrData.destinatar_tara}</div>
                </div>
              </div>
            </div>
            
            {/* Row 3 & 4 - Loc de livrare & Loc de incarcare side by side */}
            <div className="cmrFlexRow">
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">3</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Locul prevazut pentru livrarea marfii</div>
                  <div className="cmrCellValue">{cmrData.loc_livrare}</div>
                </div>
              </div>
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">4</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Locul si data de incarcare a marfii</div>
                  <div className="cmrCellValue">{`${cmrData.loc_incarcare}, ${cmrData.data_incarcare}`}</div>
                </div>
              </div>
            </div>
            
            {/* Row 5 - Documente anexate */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">5</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Documente anexate</div>
                <div className="cmrCellValue">---------</div>
              </div>
            </div>
            
            {/* Table for Items - Headers */}
            <div className="cmrTableHeader">
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">6</p>
                <p className="cmrTableHeaderText">Marci si numere</p>
              </div>
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">7</p>
                <p className="cmrTableHeaderText">Nr. de colete</p>
              </div>
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">8</p>
                <p className="cmrTableHeaderText">Mod de ambalare</p>
              </div>
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">9</p>
                <p className="cmrTableHeaderText">Natura marfii</p>
              </div>
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">10</p>
                <p className="cmrTableHeaderText">Nr. statistic</p>
              </div>
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">11</p>
                <p className="cmrTableHeaderText">Greutate bruta</p>
              </div>
              <div className="cmrTableHeaderCell">
                <p className="cmrTableHeaderText">12</p>
                <p className="cmrTableHeaderText">Cubaj</p>
              </div>
            </div>
            
            {/* Table Row */}
            <div className="cmrTableRow">
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.marci_numere}</div>
              </div>
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.numar_colete}</div>
              </div>
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.mod_ambalare}</div>
              </div>
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.natura_marfii}</div>
              </div>
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.nr_statistic}</div>
              </div>
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.greutate_bruta}</div>
              </div>
              <div className="cmrTableCell">
                <div className="cmrTableCellText">{cmrData.cubaj}</div>
              </div>
            </div>
            
            {/* Row 13-15 in a flex row */}
            <div className="cmrFlexRow">
              <div className="cmrThirdRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">13</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Instructiunile expeditorului</div>
                  <div className="cmrCellValue">{cmrData.instructiuni_expeditor}</div>
                </div>
              </div>
              <div className="cmrThirdRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">14</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Prescriptii de francare</div>
                  <div className="cmrCellValue">{cmrData.prescriptii_francare}</div>
                </div>
              </div>
              <div className="cmrThirdRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">15</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Rambursare</div>
                  <div className="cmrCellValue">{cmrData.rambursare}</div>
                </div>
              </div>
            </div>
            
            {/* Row 16-17 in a flex row */}
            <div className="cmrFlexRow">
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">16</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Transportator</div>
                  <div className="cmrCellValue">{cmrData.transportator}</div>
                </div>
              </div>
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">17</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Transportatori succesivi</div>
                  <div className="cmrCellValue">{cmrData.transportatori_succesivi}</div>
                </div>
              </div>
            </div>
            
            {/* Row 18-19 in a flex row */}
            <div className="cmrFlexRow">
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">18</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Rezerve si observatii ale transportatorilor</div>
                  <div className="cmrCellValue">{cmrData.rezerve_observatii}</div>
                </div>
              </div>
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">19</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Conventii speciale</div>
                  <div className="cmrCellValue">{cmrData.conventii_speciale}</div>
                </div>
              </div>
            </div>
            
            {/* Row 20-21 in a flex row */}
            <div className="cmrFlexRow">
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">20</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">De plata</div>
                  <div className="paymentTable">
                    <div className="paymentRow">
                      <div className="paymentLabel">Pret transport</div>
                      <div className="paymentValue">{`${cmrData.de_plata.pret_transport} EUR`}</div>
                    </div>
                    <div className="paymentRow">
                      <div className="paymentLabel">Reduceri</div>
                      <div className="paymentValue">{`${cmrData.de_plata.reduceri} EUR`}</div>
                    </div>
                    <div className="paymentRow">
                      <div className="paymentLabel">Sold</div>
                      <div className="paymentValue">{`${cmrData.de_plata.sold} EUR`}</div>
                    </div>
                    <div className="paymentRow">
                      <div className="paymentLabel">Suplimente</div>
                      <div className="paymentValue">{`${cmrData.de_plata.suplimente} EUR`}</div>
                    </div>
                    <div className="paymentRow">
                      <div className="paymentLabel">Alte cheltuieli</div>
                      <div className="paymentValue">{`${cmrData.de_plata.alte_cheltuieli} EUR`}</div>
                    </div>
                    <div className="paymentRow paymentRowTotal">
                      <div className="paymentLabelTotal">Total</div>
                      <div className="paymentValueTotal">{`${cmrData.de_plata.total} EUR`}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cmrHalfRow">
                <div className="cmrNumberCell">
                  <div className="cmrCellNumber">21</div>
                </div>
                <div className="cmrCell">
                  <div className="cmrCellLabel">Incheiat la</div>
                  <div className="cmrCellValue">{`${cmrData.incheiat_la.locatie}, ${cmrData.incheiat_la.data}`}</div>
                </div>
              </div>
            </div>
            
            {/* Signatures */}
            <div className="cmrSignatures">
              <div className="cmrSignatureBox">
                <div className="cmrSignatureHeader">
                  <p className="cmrSignatureNumber">22</p>
                </div>
                <div className="cmrSignatureContent">
                  <div className="cmrSignatureText">Semnatura si stampila expeditorului</div>
                  <div className="electronicSignature">{cmrData.semnatura_expeditor}</div>
                </div>
              </div>
              
              <div className="cmrSignatureBox">
                <div className="cmrSignatureHeader">
                  <p className="cmrSignatureNumber">23</p>
                </div>
                <div className="cmrSignatureContent">
                  <div className="cmrStamp">
                    <div className="cmrStampText">C&C Logistic</div>
                  </div>
                  <div className="cmrSignatureText">Semnatura si stampila transportatorului</div>
                  <div className="electronicSignature">{cmrData.semnatura_transportator}</div>
                </div>
              </div>
              
              <div className="cmrSignatureBox">
                <div className="cmrSignatureHeader">
                  <p className="cmrSignatureNumber">24</p>
                </div>
                <div className="cmrSignatureContent">
                  <div className="cmrSignatureText">Semnatura si stampila destinatarului</div>
                  <div className="electronicSignature">{cmrData.semnatura_destinatar}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS styles
const styles = `
/* General Page Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f7fa;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.controls {
    text-align: center;
    margin-bottom: 20px;
}

.buttons-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
}

.download-btn {
    background-color: #303F9F;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.download-btn:hover {
    background-color: #1A237E;
}

.back-btn {
    background-color: #757575;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.back-btn:hover {
    background-color: #616161;
}

/* CMR Document Styles - Optimized for A4 */
.cmrContainer {
    margin: 20px auto;
    background-color: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #CFD8DC;
    max-width: 800px;
    width: 210mm; /* A4 width */
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.cmrHeader {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    padding: 5px;
}

.cmrLogo {
    flex: 1;
    display: flex;
    align-items: center;
}

.cmrLogoText {
    font-weight: bold;
    font-size: 16px;
    color: #303F9F;
}

.cmrTitle {
    flex: 1;
    text-align: center;
}

.cmrTitleText {
    font-weight: bold;
    font-size: 20px;
    color: #303F9F;
    margin: 0;
}

.cmrSubtitleText {
    font-size: 10px;
    color: #455A64;
    margin: 0;
}

.cmrContent {
    padding: 4px;
}

/* Flex rows for side-by-side display */
.cmrFlexRow {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
}

.cmrHalfRow {
    display: flex;
    width: 50%;
    border-right: 1px solid #CFD8DC;
    min-height: 45px;
}

.cmrHalfRow:last-child {
    border-right: none;
}

.cmrThirdRow {
    display: flex;
    width: 33.33%;
    border-right: 1px solid #CFD8DC;
    min-height: 45px;
}

.cmrThirdRow:last-child {
    border-right: none;
}

.cmrRow {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    min-height: 45px;
}

.cmrNumberCell {
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #CFD8DC;
    background-color: #F5F5F5;
}

.cmrCellNumber {
    font-weight: bold;
    font-size: 12px;
    color: #455A64;
}

.cmrCell {
    flex: 1;
    padding: 4px;
}

.cmrCellLabel {
    font-size: 10px;
    color: #78909C;
    margin-bottom: 2px;
}

.cmrCellValue {
    font-size: 11px;
    color: #37474F;
}

.cmrTableHeader {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    background-color: #F5F5F5;
}

.cmrTableHeaderCell {
    flex: 1;
    padding: 4px;
    text-align: center;
    border-right: 1px solid #CFD8DC;
}

.cmrTableHeaderCell:last-child {
    border-right: none;
}

.cmrTableHeaderText {
    font-size: 9px;
    text-align: center;
    color: #455A64;
    margin: 0;
}

.cmrTableRow {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    min-height: 30px;
}

.cmrTableCell {
    flex: 1;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #CFD8DC;
}

.cmrTableCell:last-child {
    border-right: none;
}

.cmrTableCellText {
    font-size: 10px;
    color: #37474F;
}

.paymentTable {
    margin-top: 2px;
}

.paymentRow {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    border-bottom: 1px solid #E0E0E0;
}

.paymentRowTotal {
    border-top: 1px solid #BDBDBD;
    padding-top: 3px;
    margin-top: 2px;
}

.paymentLabel {
    font-size: 9px;
    color: #616161;
}

.paymentValue {
    font-size: 9px;
    color: #212121;
    font-weight: 500;
}

.paymentLabelTotal {
    font-size: 10px;
    color: #303F9F;
    font-weight: bold;
}

.paymentValueTotal {
    font-size: 10px;
    color: #303F9F;
    font-weight: bold;
}

.cmrSignatures {
    display: flex;
    border-top: 1px solid #CFD8DC;
}

.cmrSignatureBox {
    flex: 1;
    border-right: 1px solid #CFD8DC;
}

.cmrSignatureBox:last-child {
    border-right: none;
}

.cmrSignatureHeader {
    background-color: #F5F5F5;
    padding: 2px;
    text-align: center;
    border-bottom: 1px solid #CFD8DC;
}

.cmrSignatureNumber {
    font-weight: bold;
    font-size: 12px;
    color: #455A64;
    margin: 0;
}

.cmrSignatureContent {
    min-height: 60px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cmrSignatureText {
    font-size: 9px;
    text-align: center;
    color: #78909C;
}

.cmrStamp {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: 1px solid #303F9F;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
}

.cmrStampText {
    font-size: 9px;
    font-weight: bold;
    color: #303F9F;
}

.electronicSignature {
    margin-top: 5px;
    font-style: italic;
    font-size: 10px;
    color: #303F9F;
}

@media print {
    .controls {
        display: none;
    }
    
    body {
        background-color: white;
        padding: 0;
        margin: 0;
    }
    
    .container {
        padding: 0;
        margin: 0;
    }
    
    .cmrContainer {
        box-shadow: none;
        margin: 0;
        border: 1px solid #000;
        width: 100%;
        max-width: 100%;
        height: 297mm; /* A4 height */
    }
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PdfGenerator;