export interface CompanyInfo {
  companyName: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  website: string;
  officeLocation: string;
}

export interface CampaignObjective {
  goals: string[];
  otherGoal?: string;
  expectedOutcome: string;
}

export interface TargetAudience {
  customerTypes: string[];
  otherCustomerType?: string;
  geographicTargeting: string[];
  specificEmirates?: string;
  internationalMarkets?: string;
  languages: string[];
  otherLanguage?: string;
}

export interface CampaignBudget {
  dailyBudget: string;
  otherBudget?: string;
  budgetIncrease: string;
}

export interface ProductsServices {
  coreProducts: string;
  catalogLink: string;
  focusProducts: string;
}

export interface LeadDefinition {
  leadTypes: string[];
  otherLeadType?: string;
}

export interface KeywordsCompetitors {
  keywords: string;
  competitors: string;
  competitorNotes: string;
}

export interface USPs {
  selectedUSPs: string[];
  otherUSPs: string;
}

export interface BrandMaterials {
  materials: string[];
  notes: string;
}

export interface CampaignTimeline {
  duration: string;
  launchDate: string;
}

export interface AdditionalNotes {
  notes: string;
}

export interface IntakeFormData {
  companyInfo: CompanyInfo;
  campaignObjective: CampaignObjective;
  targetAudience: TargetAudience;
  campaignBudget: CampaignBudget;
  productsServices: ProductsServices;
  leadDefinition: LeadDefinition;
  keywordsCompetitors: KeywordsCompetitors;
  usps: USPs;
  brandMaterials: BrandMaterials;
  campaignTimeline: CampaignTimeline;
  additionalNotes: AdditionalNotes;
}
