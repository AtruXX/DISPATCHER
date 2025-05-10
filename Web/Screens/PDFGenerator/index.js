import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { useNavigation } from '@react-navigation/native';

function PdfGenerator() {
  const contentRef = useRef();
  const navigation = useNavigation();

  // Define initial CMR data
  const [cmrData, setCmrData] = useState({
    expeditor_nume: "Example Company SRL",
    expeditor_adresa: "Strada Exemplu 123, Bucuresti",
    expeditor_tara: "Romania",
    destinatar_nume: "Receiver Company GmbH",
    destinatar_adresa: "Example Street 456, Berlin",
    destinatar_tara: "Germany",
    loc_livrare: "Berlin, Germania",
    loc_incarcare: "Bucuresti",
    data_incarcare: "09.05.2025",
    marci_numere: "12345",
    numar_colete: "10",
    mod_ambalare: "Cutii",
    natura_marfii: "Electronice",
    nr_statistic: "85423",
    greutate_bruta: "250 kg",
    cubaj: "2 m³",
    instructiuni_expeditor: "A se livra in intervalul orar 9-17",
    prescriptii_francare: "------",
    rambursare: "---------",
    transportator: "C&C Logistic SRL",
    transportatori_succesivi: "-----------",
    rezerve_observatii: "---------",
    conventii_speciale: "Transport express",
    de_plata: {
      pret_transport: "1000",
      reduceri: "0",
      sold: "1000", 
      suplimente: "100",
      alte_cheltuieli: "50",
      total: "1150"
    },
    incheiat_la: {
      locatie: "Bucuresti",
      data: "09.05.2025"
    },
    semnatura_expeditor: "Semnat electronic",
    semnatura_transportator: "Semnat electronic",
    semnatura_destinatar: "Semnat electronic"
  });

  // Function to handle PDF download
  const handleDownload = () => {
    const opt = {
      margin: 10,
      filename: 'cmr_document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(contentRef.current).set(opt).save();
  };

  // Function to handle navigation back to main screen
  const handleGoBack = () => {
    navigation.navigate('Main');
  };

  return (
    <div className="container">
      
      <div className="controls">
        <h1>CMR Document Generator</h1>
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
            {/* Row 1 - Expeditor */}
            <div className="cmrRow">
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
            
            {/* Row 2 - Destinatar */}
            <div className="cmrRow">
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
            
            {/* Row 3 - Loc de livrare */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">3</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Locul prevazut pentru livrarea marfii</div>
                <div className="cmrCellValue">{cmrData.loc_livrare}</div>
              </div>
            </div>
            
            {/* Row 4 - Loc de incarcare */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">4</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Locul si data de incarcare a marfii</div>
                <div className="cmrCellValue">{`${cmrData.loc_incarcare}, ${cmrData.data_incarcare}`}</div>
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
            
            {/* Instructiuni expeditor */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">13</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Instructiunile expeditorului</div>
                <div className="cmrCellValue">{cmrData.instructiuni_expeditor}</div>
              </div>
            </div>
            
            {/* Prescriptii francare */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">14</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Prescriptii de francare</div>
                <div className="cmrCellValue">{cmrData.prescriptii_francare}</div>
              </div>
            </div>
            
            {/* Rambursare */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">15</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Rambursare</div>
                <div className="cmrCellValue">{cmrData.rambursare}</div>
              </div>
            </div>
            
            {/* Transportator */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">16</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Transportator</div>
                <div className="cmrCellValue">{cmrData.transportator}</div>
              </div>
            </div>
            
            {/* Transportatori succesivi */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">17</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Transportatori succesivi</div>
                <div className="cmrCellValue">{cmrData.transportatori_succesivi}</div>
              </div>
            </div>
            
            {/* Rezerve si observatii */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">18</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Rezerve si observatii ale transportatorilor</div>
                <div className="cmrCellValue">{cmrData.rezerve_observatii}</div>
              </div>
            </div>
            
            {/* Conventii speciale */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">19</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Conventii speciale</div>
                <div className="cmrCellValue">{cmrData.conventii_speciale}</div>
              </div>
            </div>
            
            {/* De plata */}
            <div className="cmrRow">
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
            
            {/* Incheiat la */}
            <div className="cmrRow">
              <div className="cmrNumberCell">
                <div className="cmrCellNumber">21</div>
              </div>
              <div className="cmrCell">
                <div className="cmrCellLabel">Incheiat la</div>
                <div className="cmrCellValue">{`${cmrData.incheiat_la.locatie}, ${cmrData.incheiat_la.data}`}</div>
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

/* CMR Document Styles */
.cmrContainer {
    margin: 20px auto;
    background-color: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #CFD8DC;
    max-width: 800px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    overflow: auto
}

.cmrHeader {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    padding: 10px;
}

.cmrLogo {
    flex: 1;
    display: flex;
    align-items: center;
}

.cmrLogoText {
    font-weight: bold;
    font-size: 18px;
    color: #303F9F;
}

.cmrTitle {
    flex: 1;
    text-align: center;
}

.cmrTitleText {
    font-weight: bold;
    font-size: 24px;
    color: #303F9F;
    margin: 0;
}

.cmrSubtitleText {
    font-size: 12px;
    color: #455A64;
    margin: 0;
}

.cmrContent {
    padding: 8px;
    overflow: auto
}

.cmrRow {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    min-height: 60px;
}

.cmrNumberCell {
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #CFD8DC;
    background-color: #F5F5F5;
}

.cmrCellNumber {
    font-weight: bold;
    font-size: 16px;
    color: #455A64;
}

.cmrCell {
    flex: 1;
    padding: 8px;
}

.cmrCellLabel {
    font-size: 12px;
    color: #78909C;
    margin-bottom: 4px;
}

.cmrCellValue {
    font-size: 14px;
    color: #37474F;
}

.cmrTableHeader {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    background-color: #F5F5F5;
}

.cmrTableHeaderCell {
    flex: 1;
    padding: 6px;
    text-align: center;
    border-right: 1px solid #CFD8DC;
}

.cmrTableHeaderText {
    font-size: 10px;
    text-align: center;
    color: #455A64;
    margin: 0;
}

.cmrTableRow {
    display: flex;
    border-bottom: 1px solid #CFD8DC;
    min-height: 40px;
}

.cmrTableCell {
    flex: 1;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #CFD8DC;
}

.cmrTableCellText {
    font-size: 12px;
    color: #37474F;
}

.paymentTable {
    margin-top: 4px;
}

.paymentRow {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid #E0E0E0;
}

.paymentRowTotal {
    border-top: 2px solid #BDBDBD;
    padding-top: 8px;
    margin-top: 4px;
}

.paymentLabel {
    font-size: 12px;
    color: #616161;
}

.paymentValue {
    font-size: 12px;
    color: #212121;
    font-weight: 500;
}

.paymentLabelTotal {
    font-size: 14px;
    color: #303F9F;
    font-weight: bold;
}

.paymentValueTotal {
    font-size: 14px;
    color: #303F9F;
    font-weight: bold;
}

.cmrSignatures {
    display: flex;
    margin-top: 16px;
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
    padding: 4px;
    text-align: center;
    border-bottom: 1px solid #CFD8DC;
}

.cmrSignatureNumber {
    font-weight: bold;
    font-size: 14px;
    color: #455A64;
    margin: 0;
}

.cmrSignatureContent {
    min-height: 80px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cmrSignatureText {
    font-size: 10px;
    text-align: center;
    color: #78909C;
}

.cmrStamp {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    border: 1px solid #303F9F;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
}

.cmrStampText {
    font-size: 10px;
    font-weight: bold;
    color: #303F9F;
}

.electronicSignature {
    margin-top: 10px;
    font-style: italic;
    font-size: 12px;
    color: #303F9F;
}

@media print {
    .controls {
        display: none;
    }
    
    body {
        background-color: white;
        padding: 0;
    }
    
    .cmrContainer {
        box-shadow: none;
        margin: 0;
        border: 1px solid #000;
    }
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PdfGenerator;