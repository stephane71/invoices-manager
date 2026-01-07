import { formatCurrency } from "./calculations";
import { THRESHOLDS_2025 } from "./constants";
import type { BenefitType } from "./types";

/**
 * Get formatted micro-fiscal threshold based on benefit type
 */
export const getMicroThreshold = (benefitType: BenefitType): string => {
  const thresholds = THRESHOLDS_2025.MICRO_CA;
  const value = thresholds[benefitType];
  return formatCurrency(value);
};

/**
 * Get formatted VAT franchise thresholds based on benefit type
 */
export const getVatFranchiseThresholds = (
  benefitType: BenefitType,
): { base: string; majore: string } => {
  const thresholds = THRESHOLDS_2025.FRANCHISE_TVA;
  if (benefitType === "BIC_VENTE") {
    return {
      base: formatCurrency(thresholds.VENTE),
      majore: formatCurrency(thresholds.VENTE_MAJORE),
    };
  } else {
    // BIC_SERVICE or BNC
    return {
      base: formatCurrency(thresholds.SERVICE),
      majore: formatCurrency(thresholds.SERVICE_MAJORE),
    };
  }
};

/**
 * Get formatted VAT real regime threshold based on benefit type
 */
export const getVatReelThresholds = (benefitType: BenefitType): string => {
  const thresholds = THRESHOLDS_2025.TVA_REEL;
  if (benefitType === "BIC_VENTE") {
    return formatCurrency(thresholds.VENTE_NORMAL);
  } else {
    // BIC_SERVICE or BNC
    return formatCurrency(thresholds.SERVICE_NORMAL);
  }
};
