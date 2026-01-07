import type {
  BenefitType,
  BenefitTypeOption,
  ConfigState,
  SocialRegimeOption,
  TaxRegime,
  TaxRegimeOption,
  VatRegimeOption,
} from "./types";

/**
 * Thresholds for 2025
 */
export const THRESHOLDS_2025 = {
  // Micro-fiscal turnover thresholds
  MICRO_CA: {
    BIC_VENTE: 188_700,
    BIC_SERVICE: 77_700,
    BNC: 77_700,
  },

  // VAT franchise thresholds
  FRANCHISE_TVA: {
    VENTE: 91_900,
    VENTE_MAJORE: 101_000, // Immediate loss threshold
    SERVICE: 36_800,
    SERVICE_MAJORE: 39_100, // Immediate loss threshold
  },

  // VAT real simplified → normal thresholds
  TVA_REEL: {
    VENTE_NORMAL: 840_000,
    SERVICE_NORMAL: 254_000,
  },
} as const;

/**
 * Micro-fiscal flat-rate deductions
 */
export const FORFAIT_ABATTEMENT = {
  BIC_VENTE: 0.71, // 71%
  BIC_SERVICE: 0.5, // 50%
  BNC: 0.34, // 34%
} as const;

/**
 * Minimum deduction for micro-fiscal regime
 */
export const ABATTEMENT_MINIMUM = 305;

/**
 * Micro-social contribution rates for 2025
 */
export const TAUX_MICRO_SOCIAL = {
  BIC_VENTE: 0.123, // 12.3%
  BIC_SERVICE: 0.212, // 21.2%
  BNC_CIPAV: 0.211, // 21.1% (regulated professions)
  BNC_SSI: 0.231, // 23.1% (other liberal professions)
} as const;

/**
 * Approximate TNS classic contribution rate
 */
export const TAUX_TNS_CLASSIQUE = 0.45; // ~45% of profit

/**
 * Default configuration state
 */
export const DEFAULT_CONFIG: ConfigState = {
  benefitType: "BIC_SERVICE",
  taxRegime: "MICRO",
  socialRegime: "MICRO_SOCIAL",
  vatRegime: "FRANCHISE_BASE",
};

/**
 * Benefit type options for UI
 */
export const BENEFIT_TYPE_OPTIONS: BenefitTypeOption[] = [
  {
    value: "BIC_VENTE",
    labelKey: "benefitType.bicVente",
    descriptionKey: "benefitType.bicVenteDesc",
  },
  {
    value: "BIC_SERVICE",
    labelKey: "benefitType.bicService",
    descriptionKey: "benefitType.bicServiceDesc",
  },
  {
    value: "BNC",
    labelKey: "benefitType.bnc",
    descriptionKey: "benefitType.bncDesc",
  },
];

/**
 * Tax regime options for UI
 */
export const TAX_REGIME_OPTIONS: TaxRegimeOption[] = [
  {
    value: "MICRO",
    labelKey: "taxRegime.micro",
    descriptionKey: "taxRegime.microDesc",
    availableFor: ["BIC_VENTE", "BIC_SERVICE", "BNC"],
  },
  {
    value: "REEL_SIMPLIFIE",
    labelKey: "taxRegime.reelSimplifie",
    descriptionKey: "taxRegime.reelSimplifieDesc",
    availableFor: ["BIC_VENTE", "BIC_SERVICE"],
  },
  {
    value: "REEL_NORMAL",
    labelKey: "taxRegime.reelNormal",
    descriptionKey: "taxRegime.reelNormalDesc",
    availableFor: ["BIC_VENTE", "BIC_SERVICE"],
  },
  {
    value: "DECLARATION_CONTROLEE",
    labelKey: "taxRegime.declarationControlee",
    descriptionKey: "taxRegime.declarationControleeDesc",
    availableFor: ["BNC"],
  },
];

/**
 * Social regime options for UI
 */
export const SOCIAL_REGIME_OPTIONS: SocialRegimeOption[] = [
  {
    value: "MICRO_SOCIAL",
    labelKey: "socialRegime.microSocial",
    descriptionKey: "socialRegime.microSocialDesc",
  },
  {
    value: "TNS_CLASSIQUE",
    labelKey: "socialRegime.tnsClassique",
    descriptionKey: "socialRegime.tnsClassiqueDesc",
  },
];

/**
 * VAT regime options for UI
 */
export const VAT_REGIME_OPTIONS: VatRegimeOption[] = [
  {
    value: "FRANCHISE_BASE",
    labelKey: "vatRegime.franchiseBase",
  },
  {
    value: "REEL_SIMPLIFIE_TVA",
    labelKey: "vatRegime.reelSimplifie",
  },
  {
    value: "REEL_NORMAL_TVA",
    labelKey: "vatRegime.reelNormal",
  },
];

/**
 * Get available tax regimes based on benefit type
 */
export const getAvailableTaxRegimes = (
  benefitType: BenefitType,
): TaxRegime[] => {
  return TAX_REGIME_OPTIONS.filter((option) =>
    option.availableFor.includes(benefitType),
  ).map((option) => option.value);
};

/**
 * Get social regime based on tax regime (automatic coupling)
 */
export const getSocialRegime = (taxRegime: TaxRegime) => {
  return taxRegime === "MICRO" ? "MICRO_SOCIAL" : "TNS_CLASSIQUE";
};

/**
 * Check if the tax regime is a real regime (not micro)
 */
export const isRealRegime = (taxRegime: TaxRegime): boolean => {
  return ["REEL_SIMPLIFIE", "REEL_NORMAL", "DECLARATION_CONTROLEE"].includes(
    taxRegime,
  );
};
