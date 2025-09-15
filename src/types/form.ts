export interface CompanyFormData {
  // Base fields (always required)
  service: string;
  companyType: string;
  orgNumber: string;
  companyName: string;
  industry: string;
  revenue: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timeframe: string;
  intentNote: string;
  
  // Service-specific fields
  // Leasing & Hyra
  leasingCategory?: string;
  leasingAmount?: string;
  leasingTerm?: string;
  leasingCondition?: string;
  leasingVendorSelected?: string;
  leasingDescription?: string;
  
  // Fakturabelåning
  invoiceAmount?: string;
  invoiceCreditTerm?: string;
  invoiceCustomerCount?: string;
  invoiceCustomerTypes?: string[];
  invoiceLargestCustomer?: string;
  invoiceOverdue?: string;
  invoiceOverdueDays?: string;
  
  // Företagslån
  loanAmount?: string;
  loanTerm?: string;
  loanPurpose?: string;
  loanSecurity?: string;
  
  // Kundfinansiering
  vendorProductTypes?: string;
  vendorAverageSize?: string;
  vendorMonthlyVolume?: string;
  vendorTargetGroup?: string;
  vendorIntegrationNeeds?: string;
  
  // Files & Consent
  files?: File[];
  filesCount?: number;
  consentShareWithPartners: boolean;
  companyRepresentation: boolean;
  gdprConsent: boolean;
  applicantConfirmAccurate: boolean;
  
  // Meta fields
  applicantConfirmed?: boolean;
  confirmedAt?: string;
  role?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface MailTokens {
  firstName: string;
  companyName: string;
  needLabel: string;
  amountForMail: string;
  termForMail: string;
  creditTermForMail: string;
}

export interface PayloadData extends CompanyFormData {
  mail: {
    template: string;
    tokens: MailTokens;
  };
}