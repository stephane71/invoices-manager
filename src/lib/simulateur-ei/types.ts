/**
 * Types for the Simulateur EI (Entreprise Individuelle Simulator)
 */

// Benefit type determines the nature of the business activity
export type BenefitType = "BIC_VENTE" | "BIC_SERVICE" | "BNC";

// Tax regime determines how profits are calculated and taxed
export type TaxRegime =
  | "MICRO"
  | "REEL_SIMPLIFIE"
  | "REEL_NORMAL"
  | "DECLARATION_CONTROLEE";

// Social regime determines how social contributions are calculated
export type SocialRegime = "MICRO_SOCIAL" | "TNS_CLASSIQUE";

// VAT regime determines VAT obligations
export type VatRegime =
  | "FRANCHISE_BASE"
  | "REEL_SIMPLIFIE_TVA"
  | "REEL_NORMAL_TVA";

// Configuration state for the simulator
export interface ConfigState {
  benefitType: BenefitType;
  taxRegime: TaxRegime;
  socialRegime: SocialRegime;
  vatRegime: VatRegime;
}

// Simulation input parameters
export interface SimulationInput {
  benefitType: BenefitType;
  taxRegime: TaxRegime;
  socialRegime: SocialRegime;
  turnover: number; // Chiffre d'affaires HT
  expenses: number; // Charges (real regime only)
}

// Simulation result
export interface SimulationResult {
  // Taxable profit
  beneficeImposable: number;

  // Social contributions
  cotisationsSociales: number;
  baseCotisations: "ca" | "benefice"; // Base for calculating contributions
  tauxCotisations: number;

  // Income before income tax
  revenuAvantIR: number;

  // Details for educational display
  details: {
    abattementForfaitaire?: number;
    chargesDeduites?: number;
  };
}

// Consequence rule type
export type ConsequenceType = "info" | "warning" | "error" | "success";

// Consequence rule definition
export interface ConsequenceRule {
  id: string;
  condition: (config: ConfigState) => boolean;
  type: ConsequenceType;
  titleKey: string;
  descriptionKey: string;
}

// Threshold alert definition
export interface ThresholdAlert {
  id: string;
  condition: (config: ConfigState, turnover: number) => boolean;
  severity: "info" | "warning" | "error";
  messageKey: string;
}

// Benefit type option for UI
export interface BenefitTypeOption {
  value: BenefitType;
  labelKey: string;
  descriptionKey: string;
}

// Tax regime option for UI
export interface TaxRegimeOption {
  value: TaxRegime;
  labelKey: string;
  descriptionKey: string;
  availableFor: BenefitType[];
}

// Social regime option for UI
export interface SocialRegimeOption {
  value: SocialRegime;
  labelKey: string;
  descriptionKey: string;
}

// VAT regime option for UI
export interface VatRegimeOption {
  value: VatRegime;
  labelKey: string;
  descriptionKey: string;
}
