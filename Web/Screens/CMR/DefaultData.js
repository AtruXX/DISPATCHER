// CMR Data Model - can be used as hardcoded default data
// This object contains all the fields needed for a CMR document

const DEFAULT_CMR_DATA = {
    // Expeditor (Sender) information - Section 1
    expeditor_nume: "ABC Manufacturing SRL",
    expeditor_adresa: "Str. Industriei 123, Sector 3",
    expeditor_tara: "Romania",
    
    // Destinatar (Recipient) information - Section 2
    destinatar_nume: "XYZ Distribution GmbH",
    destinatar_adresa: "Hauptstrasse 456",
    destinatar_tara: "Germania",
    
    // Location information - Sections 3-4
    loc_livrare: "Munich Logistics Center, Bayernstrasse 789",
    loc_incarcare: "Bucharest Warehouse Complex",
    data_incarcare: "05.05.2025",
    
    // Cargo details - Sections 6-12
    marci_numere: "ABC-12345-XYZ",
    numar_colete: "48",  
    mod_ambalare: "Paleti",
    natura_marfii: "Piese auto",
    nr_static: "8708.99",
    greutate_bruta: "1250 kg",
    cubaj: "3.6 m³",
    
    // Special instructions - Section 13
    instructiuni_expeditor: "A se manipula cu atentie. Nu expuneti la temperaturi extreme.",
    
    // Special conventions - Section 19
    conventii_speciale: "Transportul necesita documentatie ADR",
    
    // Payment information - Section 20
    de_plata: {
      pret_transport: "1450",
      reduceri: "50",
      sold: "1400",
      suplimente: "120",
      alte_cheltuieli: "80",
      total: "1600"
    },
    
    // Closure information - Section 21
    incheiat_la: {
      locatie: "Bucuresti",
      data: "03.05.2025" 
    },
    
    // Signatures - Sections 22-24
    semnatura_expeditor: "signed-electronically",
    semnatura_transportator: "signed-electronically",
    semnatura_destinatar: "",
    
    // Additional fields that might be useful
    numar_cmr: "CMR-2025-5678",
    data_emitere: "03.05.2025",
    transportator: "C&C Logistic SRL",
    transportatori_succesivi: "",
    rezerve_observatii: "",
    prescriptii_francare: "Franco",
    rambursare: ""
  };
  
  export default DEFAULT_CMR_DATA;