// CMRPDFGenerator.js - Expo Web Compatible Version
import { Platform } from 'react-native';

// For web, we'll use jsPDF with html2canvas
let jsPDF, html2canvas;

if (Platform.OS === 'web') {
  // Dynamic imports for web only
  import('jspdf').then(module => {
    jsPDF = module.jsPDF;
  });
  import('html2canvas').then(module => {
    html2canvas = module.default;
  });
}

// Generate HTML content for CMR document
const generateCMRHTML = (data) => {
  return `
    <div id="cmr-document" style="
      width: 210mm;
      min-height: 297mm;
      padding: 15mm;
      margin: 0 auto;
      background: white;
      font-family: Arial, sans-serif;
      font-size: 8pt;
      line-height: 1.2;
      border: 2px solid #DC143C;
      box-sizing: border-box;
    ">
      <!-- Header Section -->
      <div style="border-bottom: 2px solid #DC143C; margin-bottom: 8px;">
        <div style="
          display: flex;
          padding: 8px;
          align-items: center;
          border: 2px solid #DC143C;
        ">
          <div style="flex: 1; text-align: center;">
            <div style="font-size: 24pt; font-weight: bold; color: #DC143C;">1</div>
            <div style="font-size: 7pt; color: #DC143C; font-style: italic;">Copy for sender</div>
            <div style="font-size: 7pt; color: #DC143C; font-style: italic;">Exemplaire de l'expéditeur</div>
          </div>
          <div style="
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #DC143C;
            padding: 8px;
            margin-left: 10px;
          ">
            <div style="flex: 1; text-align: center;">
              <div style="font-size: 8pt; font-weight: bold; line-height: 1.2;">INTERNATIONAL</div>
              <div style="font-size: 8pt; font-weight: bold; line-height: 1.2;">CONSIGNMENT NOTE</div>
            </div>
            <div style="
              flex: 1;
              text-align: center;
              border-left: 1px solid #DC143C;
              border-right: 1px solid #DC143C;
              padding: 0 8px;
            ">
              <div style="font-size: 28pt; font-weight: bold; color: #DC143C;">CMR</div>
            </div>
            <div style="flex: 1; text-align: center;">
              <div style="font-size: 8pt; font-weight: bold; line-height: 1.2;">LETTRE DE VOITURE</div>
              <div style="font-size: 8pt; font-weight: bold; line-height: 1.2;">INTERNATIONALE</div>
            </div>
          </div>
        </div>
        
        <div style="
          font-size: 6pt;
          text-align: center;
          padding: 4px;
          border-top: 1px solid #DC143C;
          line-height: 1.1;
        ">
          This transport is subject, notwithstanding any clause to the contrary: • La Convention relative au contrat de transport international de marchandises par route (CMR).
        </div>
      </div>

      <!-- Main Content -->
      <div style="display: flex;">
        <!-- Left Column -->
        <div style="width: 60%; border-right: 2px solid #DC143C;">
          <!-- Section 1 - Sender -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">1</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Sender (name, address, country)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Expéditeur (nom, adresse, pays)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.expeditor_nume || ''}</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.expeditor_adresa || ''}</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.expeditor_tara || ''}</div>
              <div style="display: flex; align-items: center; margin-top: 3px;">
                <span style="font-size: 6pt; margin-right: 4px;">1 a) Country</span>
                <div style="width: 25px; height: 12px; border: 1px solid #000;"></div>
              </div>
            </div>
          </div>

          <!-- Section 2 - Consignee -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">2</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Consignee (name, address, country)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Destinataire (nom, adresse, pays)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.destinatar_nume || ''}</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.destinatar_adresa || ''}</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.destinatar_tara || ''}</div>
              <div style="display: flex; align-items: center; margin-top: 3px;">
                <span style="font-size: 6pt; margin-right: 4px;">2 a) Country</span>
                <div style="width: 25px; height: 12px; border: 1px solid #000;"></div>
              </div>
            </div>
          </div>

          <!-- Section 3 - Place of delivery -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">3</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Place of delivery of the goods (city, country)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Lieu prévu pour la livraison de la marchandise (lieu, pays)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.loc_livrare || ''}</div>
              <div style="display: flex; align-items: center; margin-top: 3px;">
                <span style="font-size: 6pt; margin-right: 4px;">3 a) km to border</span>
                <div style="width: 25px; height: 12px; border: 1px solid #000;"></div>
              </div>
            </div>
          </div>

          <!-- Section 4 - Place and date of taking over -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">4</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Place and date of taking over of the goods (city, country, date)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Lieu et date de la prise en charge de la marchandise (lieu, pays, date)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.loc_incarcare || ''}, ${data?.data_incarcare || ''}</div>
              <div style="display: flex; align-items: center; margin-top: 3px;">
                <span style="font-size: 6pt; margin-right: 4px;">4 a) km to border</span>
                <div style="width: 25px; height: 12px; border: 1px solid #000;"></div>
              </div>
            </div>
          </div>

          <!-- Section 5 - Documents attached -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">5</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Documents attached</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Documents annexés</div>
            </div>
          </div>

          <!-- Section 13 - Instructions -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">13</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Sender's instructions (for customs and other procedures)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Instructions de l'expéditeur</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.instructiuni_expeditor || ''}</div>
            </div>
          </div>

          <!-- Section 14 & 15 - Fare -->
          <div style="display: flex;">
            <div style="flex: 2; display: flex;">
              <div style="
                width: 25px;
                border-right: 2px solid #DC143C;
                text-align: center;
                padding-top: 4px;
                background: #FFFFFF;
                font-weight: bold;
                font-size: 12pt;
              ">14</div>
              <div style="flex: 1; padding: 6px;">
                <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Fare is payed by</div>
                <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Prescriptions d'affranchissement</div>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                  <div style="width: 8px; height: 8px; border: 1px solid #000; margin-right: 3px;"></div>
                  <span style="font-size: 6pt;">sender / franco</span>
                </div>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                  <div style="width: 8px; height: 8px; border: 1px solid #000; margin-right: 3px; text-align: center; font-size: 6pt; font-weight: bold;">X</div>
                  <span style="font-size: 6pt;">consignee / non franco</span>
                </div>
              </div>
            </div>
            <div style="flex: 1; display: flex;">
              <div style="
                width: 25px;
                border-right: 2px solid #DC143C;
                text-align: center;
                padding-top: 4px;
                background: #FFFFFF;
                font-weight: bold;
                font-size: 12pt;
              ">15</div>
              <div style="flex: 1; padding: 6px;">
                <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Reimbursement</div>
                <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Remboursement</div>
                <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.rambursare || ''}</div>
              </div>
            </div>
          </div>

          <!-- Section 21 - Established in -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">21</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Established in (city)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Etabli à (lieu)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.incheiat_la && typeof data.incheiat_la === 'object' ? 
                  `${data.incheiat_la?.locatie || ''}` : ''}</div>
              <div style="display: flex; align-items: center; margin-top: 3px;">
                <span style="font-size: 6pt; margin-right: 4px;">Day</span>
                <span style="font-size: 8pt;">${data?.incheiat_la && typeof data.incheiat_la === 'object' ? 
                    `${data.incheiat_la?.data || ''}` : ''}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div style="width: 40%;">
          <!-- Section 16 - Carrier -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">16</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Carrier (name, address, country)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Transporteur (nom, adresse, pays)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.transportator || 'C&C Logistic SRL'}</div>
              <div style="display: flex; align-items: center; margin-top: 3px;">
                <span style="font-size: 6pt; margin-right: 4px;">16 a) Vat Id</span>
                <div style="width: 25px; height: 12px; border: 1px solid #000;"></div>
              </div>
            </div>
          </div>

          <!-- Section 17 - Successive carrier -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">17</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Successive carrier (name, address, country)</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Transporteur successifs (nom, adresse, pays)</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.transportatori_succesivi || ''}</div>
            </div>
          </div>

          <!-- Section 18 - Carrier's reservation -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">18</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Carrier's reservation and observations</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Réserves et observations du transporteur</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.rezerve_observatii || ''}</div>
            </div>
          </div>

          <!-- Section 19 - Special agreements -->
          <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 45px;">
            <div style="
              width: 25px;
              border-right: 2px solid #DC143C;
              text-align: center;
              padding-top: 4px;
              background: #FFFFFF;
              font-weight: bold;
              font-size: 12pt;
            ">19</div>
            <div style="flex: 1; padding: 6px;">
              <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">Special agreements</div>
              <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">Conventions particulières</div>
              <div style="font-size: 8pt; margin-bottom: 1px; line-height: 1.2;">${data?.conventii_speciale || ''}</div>
            </div>
          </div>

          <!-- Section 20 - Payment -->
          <div style="border-top: 1px solid #DC143C; margin-top: 5px;">
            <div style="display: flex; align-items: center; padding: 4px; background: #FFFFFF;">
              <div style="
                width: 25px;
                border-right: 2px solid #DC143C;
                text-align: center;
                padding-top: 4px;
                background: #FFFFFF;
                font-weight: bold;
                font-size: 12pt;
              ">20</div>
              <div style="flex: 1; padding: 6px;">
                <div style="font-size: 7pt; font-weight: bold; margin-bottom: 2px;">To be paid by</div>
                <div style="font-size: 6pt; font-style: italic; margin-bottom: 1px;">A payer par</div>
              </div>
            </div>
            
            <div style="border: 1px solid #DC143C;">
              <div style="display: flex; background: #F8F8F8; border-bottom: 1px solid #DC143C;">
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 6pt; font-style: italic;">Sender</div>
                </div>
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 6pt; font-style: italic;">Currency</div>
                </div>
                <div style="flex: 1; padding: 3px; text-align: center;">
                  <div style="font-size: 6pt; font-style: italic;">Consignee</div>
                </div>
              </div>
              
              <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 18px;">
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C;">
                  <div style="font-size: 6pt; font-weight: bold;">Transport price</div>
                </div>
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 7pt;">EUR</div>
                </div>
                <div style="flex: 1; padding: 3px; text-align: center;">
                  <div style="font-size: 7pt;">${data?.de_plata?.pret_transport || ''}</div>
                </div>
              </div>
              
              <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 18px;">
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C;">
                  <div style="font-size: 6pt; font-weight: bold;">Discount</div>
                </div>
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 7pt;"></div>
                </div>
                <div style="flex: 1; padding: 3px; text-align: center;">
                  <div style="font-size: 7pt;">${data?.de_plata?.reduceri || ''}</div>
                </div>
              </div>
              
              <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 18px;">
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C;">
                  <div style="font-size: 6pt; font-weight: bold;">Supplements</div>
                </div>
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 7pt;"></div>
                </div>
                <div style="flex: 1; padding: 3px; text-align: center;">
                  <div style="font-size: 7pt;">${data?.de_plata?.suplimente || ''}</div>
                </div>
              </div>
              
              <div style="display: flex; border-bottom: 1px solid #DC143C; min-height: 18px;">
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C;">
                  <div style="font-size: 6pt; font-weight: bold;">Additional costs</div>
                </div>
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 7pt;"></div>
                </div>
                <div style="flex: 1; padding: 3px; text-align: center;">
                  <div style="font-size: 7pt;">${data?.de_plata?.alte_cheltuieli || ''}</div>
                </div>
              </div>
              
              <div style="display: flex; min-height: 18px;">
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C;">
                  <div style="font-size: 6pt; font-weight: bold;">TOTAL</div>
                </div>
                <div style="flex: 1; padding: 3px; border-right: 1px solid #DC143C; text-align: center;">
                  <div style="font-size: 7pt;"></div>
                </div>
                <div style="flex: 1; padding: 3px; text-align: center;">
                  <div style="font-size: 7pt;">${data?.de_plata?.total || ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div style="border-top: 2px solid #DC143C; margin-top: 5px;">
        <div style="
          display: flex;
          border-bottom: 2px solid #DC143C;
          background: #FFFFFF;
          min-height: 50px;
        ">
          <div style="flex: 1; padding: 3px; text-align: center; border-right: 1px solid #DC143C;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">6</div>
            <div style="font-size: 6pt; line-height: 1.1;">Marks and No's</div>
          </div>
          <div style="flex: 1; padding: 3px; text-align: center; border-right: 1px solid #DC143C;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">7</div>
            <div style="font-size: 6pt; line-height: 1.1;">Number of packages</div>
          </div>
          <div style="flex: 1; padding: 3px; text-align: center; border-right: 1px solid #DC143C;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">8</div>
            <div style="font-size: 6pt; line-height: 1.1;">Method of packing</div>
          </div>
          <div style="flex: 1; padding: 3px; text-align: center; border-right: 1px solid #DC143C;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">9</div>
            <div style="font-size: 6pt; line-height: 1.1;">Nature of the goods</div>
          </div>
          <div style="flex: 1; padding: 3px; text-align: center; border-right: 1px solid #DC143C;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">10</div>
            <div style="font-size: 6pt; line-height: 1.1;">Numero de tarif</div>
          </div>
          <div style="flex: 1; padding: 3px; text-align: center; border-right: 1px solid #DC143C;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">11</div>
            <div style="font-size: 6pt; line-height: 1.1;">Gross weight (kg)</div>
          </div>
          <div style="flex: 1; padding: 3px; text-align: center;">
            <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2px;">12</div>
            <div style="font-size: 6pt; line-height: 1.1;">Volume m³</div>
          </div>
        </div>
        
        <div style="
          display: flex;
          min-height: 80px;
          border-bottom: 1px solid #DC143C;
        ">
          <div style="flex: 1; padding: 4px; border-right: 1px solid #DC143C; text-align: center;">
            <div style="font-size: 7pt;">${data?.marci_numere || ''}</div>
          </div>
          <div style="flex: 1; padding: 4px; border-right: 1px solid #DC143C; text-align: center;">
            <div style="font-size: 7pt;">${data?.numar_colete || ''}</div>
          </div>
          <div style="flex: 1; padding: 4px; border-right: 1px solid #DC143C; text-align: center;">
            <div style="font-size: 7pt;">${data?.mod_ambalare || ''}</div>
          </div>
          <div style="flex: 1; padding: 4px; border-right: 1px solid #DC143C; text-align: center;">
            <div style="font-size: 7pt;">${data?.natura_marfii || ''}</div>
          </div>
          <div style="flex: 1; padding: 4px; border-right: 1px solid #DC143C; text-align: center;">
            <div style="font-size: 7pt;">${data?.nr_static || ''}</div>
          </div>
          <div style="flex: 1; padding: 4px; border-right: 1px solid #DC143C; text-align: center;">
            <div style="font-size: 7pt;">${data?.greutate_bruta || ''}</div>
          </div>
          <div style="flex: 1; padding: 4px; text-align: center;">
            <div style="font-size: 7pt;">${data?.cubaj || ''}</div>
          </div>
        </div>
      </div>

      <!-- Signature Section -->
      <div style="display: flex; margin-top: 5px; border-top: 1px solid #DC143C;">
        <div style="flex: 1; border-right: 1px solid #DC143C; min-height: 60px;">
          <div style="
            background: #F8F8F8;
            padding: 3px;
            text-align: center;
            border-bottom: 1px solid #DC143C;
            font-weight: bold;
            font-size: 12pt;
          ">22</div>
          <div style="padding: 4px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end;">
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Signature and stamp of the sender</div>
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Signature et timbre de l'expéditeur</div>
            ${data?.semnatura_expeditor === "signed-electronically" ? 
                '<div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Semnat electronic</div>' : ''}
          </div>
        </div>
        
        <div style="flex: 1; border-right: 1px solid #DC143C; min-height: 60px;">
          <div style="
            background: #F8F8F8;
            padding: 3px;
            text-align: center;
            border-bottom: 1px solid #DC143C;
            font-weight: bold;
            font-size: 12pt;
          ">23</div>
          <div style="padding: 4px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end;">
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Signature and stamp of the carrier</div>
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Signature et timbre du transporteur</div>
            ${data?.semnatura_transportator === "signed-electronically" ? 
                '<div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Semnat electronic</div>' : ''}
          </div>
        </div>
        
        <div style="flex: 1; min-height: 60px;">
          <div style="
            background: #F8F8F8;
            padding: 3px;
            text-align: center;
            border-bottom: 1px solid #DC143C;
            font-weight: bold;
            font-size: 12pt;
          ">24</div>
          <div style="padding: 4px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end;">
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Goods received (location)</div>
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Marchandises reçues à (location)</div>
            <div style="border-bottom: 1px solid #000; margin-top: 8px; margin-bottom: 2px;"></div>
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">date</div>
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Signature and stamp of the consignee</div>
            <div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Signature et timbre du destinataire</div>
            ${data?.semnatura_destinatar === "signed-electronically" ? 
                '<div style="font-size: 6pt; text-align: center; margin-bottom: 1px;">Semnat electronic</div>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
};

// Function to generate and download PDF for Expo Web
export const generateCMRPDF = async (cmrData) => {
  try {
    if (Platform.OS !== 'web') {
      throw new Error('This function is only available on web platform');
    }

    // Ensure libraries are loaded
    if (!jsPDF) {
      const { jsPDF: PDFLib } = await import('jspdf');
      jsPDF = PDFLib;
    }
    
    if (!html2canvas) {
      const html2canvasLib = await import('html2canvas');
      html2canvas = html2canvasLib.default;
    }

    // Create a temporary container for the HTML
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '210mm';
    tempContainer.style.height = 'auto';
    tempContainer.innerHTML = generateCMRHTML(cmrData);
    
    document.body.appendChild(tempContainer);

    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    // Convert HTML to canvas
    const canvas = await html2canvas(tempContainer, {
      width: 794, // A4 width in pixels at 96 DPI (210mm)
      height: 1123, // A4 height in pixels at 96 DPI (297mm)
      scale: 2, // Higher quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    // Create filename
    const cmrNumber = cmrData?.numar_cmr || 'CMR-Document';
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${cmrNumber}_${currentDate}.pdf`;

    // Download the PDF
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generateCMRHTML;