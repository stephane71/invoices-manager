import { FORFAIT_ABATTEMENT, isRealRegime, THRESHOLDS_2025 } from "./constants";
import type { ConsequenceRule, ThresholdAlert } from "./types";

/**
 * Consequence rules based on configuration
 * These rules display informational cards about the selected configuration
 */
export const consequenceRules: ConsequenceRule[] = [
  // ═══════════════════════════════════════════════════════════
  // MICRO-FISCAL REGIME
  // ═══════════════════════════════════════════════════════════
  {
    id: "micro-seuil-vente",
    condition: (c) => c.taxRegime === "MICRO" && c.benefitType === "BIC_VENTE",
    type: "info",
    titleKey: "consequences.microSeuilVente.title",
    descriptionKey: "consequences.microSeuilVente.description",
  },
  {
    id: "micro-seuil-service",
    condition: (c) =>
      c.taxRegime === "MICRO" && c.benefitType === "BIC_SERVICE",
    type: "info",
    titleKey: "consequences.microSeuilService.title",
    descriptionKey: "consequences.microSeuilService.description",
  },
  {
    id: "micro-seuil-bnc",
    condition: (c) => c.taxRegime === "MICRO" && c.benefitType === "BNC",
    type: "info",
    titleKey: "consequences.microSeuilBnc.title",
    descriptionKey: "consequences.microSeuilBnc.description",
  },
  {
    id: "micro-abattement-vente",
    condition: (c) => c.taxRegime === "MICRO" && c.benefitType === "BIC_VENTE",
    type: "info",
    titleKey: "consequences.microAbattementVente.title",
    descriptionKey: "consequences.microAbattementVente.description",
  },
  {
    id: "micro-abattement-service",
    condition: (c) =>
      c.taxRegime === "MICRO" && c.benefitType === "BIC_SERVICE",
    type: "info",
    titleKey: "consequences.microAbattementService.title",
    descriptionKey: "consequences.microAbattementService.description",
  },
  {
    id: "micro-abattement-bnc",
    condition: (c) => c.taxRegime === "MICRO" && c.benefitType === "BNC",
    type: "info",
    titleKey: "consequences.microAbattementBnc.title",
    descriptionKey: "consequences.microAbattementBnc.description",
  },
  {
    id: "micro-comptabilite",
    condition: (c) => c.taxRegime === "MICRO",
    type: "success",
    titleKey: "consequences.microComptabilite.title",
    descriptionKey: "consequences.microComptabilite.description",
  },

  // ═══════════════════════════════════════════════════════════
  // REAL REGIME
  // ═══════════════════════════════════════════════════════════
  {
    id: "reel-comptabilite",
    condition: (c) => isRealRegime(c.taxRegime),
    type: "warning",
    titleKey: "consequences.reelComptabilite.title",
    descriptionKey: "consequences.reelComptabilite.description",
  },
  {
    id: "reel-deficit",
    condition: (c) => isRealRegime(c.taxRegime),
    type: "success",
    titleKey: "consequences.reelDeficit.title",
    descriptionKey: "consequences.reelDeficit.description",
  },
  {
    id: "reel-charges",
    condition: (c) => isRealRegime(c.taxRegime),
    type: "success",
    titleKey: "consequences.reelCharges.title",
    descriptionKey: "consequences.reelCharges.description",
  },

  // ═══════════════════════════════════════════════════════════
  // SOCIAL REGIME
  // ═══════════════════════════════════════════════════════════
  {
    id: "social-micro",
    condition: (c) => c.socialRegime === "MICRO_SOCIAL",
    type: "info",
    titleKey: "consequences.socialMicro.title",
    descriptionKey: "consequences.socialMicro.description",
  },
  {
    id: "social-tns",
    condition: (c) => c.socialRegime === "TNS_CLASSIQUE",
    type: "warning",
    titleKey: "consequences.socialTns.title",
    descriptionKey: "consequences.socialTns.description",
  },

  // ═══════════════════════════════════════════════════════════
  // VAT
  // ═══════════════════════════════════════════════════════════
  {
    id: "tva-franchise-vente",
    condition: (c) =>
      c.vatRegime === "FRANCHISE_BASE" && c.benefitType === "BIC_VENTE",
    type: "info",
    titleKey: "consequences.tvaFranchiseVente.title",
    descriptionKey: "consequences.tvaFranchiseVente.description",
  },
  {
    id: "tva-franchise-service",
    condition: (c) =>
      c.vatRegime === "FRANCHISE_BASE" &&
      ["BIC_SERVICE", "BNC"].includes(c.benefitType),
    type: "info",
    titleKey: "consequences.tvaFranchiseService.title",
    descriptionKey: "consequences.tvaFranchiseService.description",
  },
  {
    id: "tva-franchise-mention",
    condition: (c) => c.vatRegime === "FRANCHISE_BASE",
    type: "warning",
    titleKey: "consequences.tvaFranchiseMention.title",
    descriptionKey: "consequences.tvaFranchiseMention.description",
  },
  {
    id: "tva-franchise-no-deduction",
    condition: (c) => c.vatRegime === "FRANCHISE_BASE",
    type: "info",
    titleKey: "consequences.tvaFranchiseNoDeduction.title",
    descriptionKey: "consequences.tvaFranchiseNoDeduction.description",
  },
  {
    id: "tva-reel-simplifie",
    condition: (c) => c.vatRegime === "REEL_SIMPLIFIE_TVA",
    type: "info",
    titleKey: "consequences.tvaReelSimplifie.title",
    descriptionKey: "consequences.tvaReelSimplifie.description",
  },
  {
    id: "tva-reel-normal",
    condition: (c) => c.vatRegime === "REEL_NORMAL_TVA",
    type: "info",
    titleKey: "consequences.tvaReelNormal.title",
    descriptionKey: "consequences.tvaReelNormal.description",
  },

  // ═══════════════════════════════════════════════════════════
  // ALERTS AND INCONSISTENCIES
  // ═══════════════════════════════════════════════════════════
  {
    id: "alert-micro-tva-reel",
    condition: (c) =>
      c.taxRegime === "MICRO" && c.vatRegime !== "FRANCHISE_BASE",
    type: "warning",
    titleKey: "consequences.alertMicroTvaReel.title",
    descriptionKey: "consequences.alertMicroTvaReel.description",
  },
];

/**
 * Threshold alerts based on turnover
 * These alerts warn about threshold violations
 */
export const thresholdAlerts: ThresholdAlert[] = [
  // Micro-fiscal threshold exceeded
  {
    id: "exceed-micro-bic-vente",
    condition: (c, ca) =>
      c.taxRegime === "MICRO" &&
      c.benefitType === "BIC_VENTE" &&
      ca > THRESHOLDS_2025.MICRO_CA.BIC_VENTE,
    severity: "error",
    messageKey: "alerts.exceedMicroBicVente",
  },
  {
    id: "exceed-micro-service",
    condition: (c, ca) =>
      c.taxRegime === "MICRO" &&
      ["BIC_SERVICE", "BNC"].includes(c.benefitType) &&
      ca > THRESHOLDS_2025.MICRO_CA.BIC_SERVICE,
    severity: "error",
    messageKey: "alerts.exceedMicroService",
  },

  // VAT franchise threshold exceeded
  {
    id: "exceed-franchise-vente",
    condition: (c, ca) =>
      c.vatRegime === "FRANCHISE_BASE" &&
      c.benefitType === "BIC_VENTE" &&
      ca > THRESHOLDS_2025.FRANCHISE_TVA.VENTE &&
      ca <= THRESHOLDS_2025.FRANCHISE_TVA.VENTE_MAJORE,
    severity: "warning",
    messageKey: "alerts.exceedFranchiseVente",
  },
  {
    id: "exceed-franchise-vente-majore",
    condition: (c, ca) =>
      c.vatRegime === "FRANCHISE_BASE" &&
      c.benefitType === "BIC_VENTE" &&
      ca > THRESHOLDS_2025.FRANCHISE_TVA.VENTE_MAJORE,
    severity: "error",
    messageKey: "alerts.exceedFranchiseVenteMajore",
  },
  {
    id: "exceed-franchise-service",
    condition: (c, ca) =>
      c.vatRegime === "FRANCHISE_BASE" &&
      ["BIC_SERVICE", "BNC"].includes(c.benefitType) &&
      ca > THRESHOLDS_2025.FRANCHISE_TVA.SERVICE &&
      ca <= THRESHOLDS_2025.FRANCHISE_TVA.SERVICE_MAJORE,
    severity: "warning",
    messageKey: "alerts.exceedFranchiseService",
  },
  {
    id: "exceed-franchise-service-majore",
    condition: (c, ca) =>
      c.vatRegime === "FRANCHISE_BASE" &&
      ["BIC_SERVICE", "BNC"].includes(c.benefitType) &&
      ca > THRESHOLDS_2025.FRANCHISE_TVA.SERVICE_MAJORE,
    severity: "error",
    messageKey: "alerts.exceedFranchiseServiceMajore",
  },

  // Suggestion to switch to real regime
  {
    id: "suggest-reel",
    condition: (c, ca) => {
      if (c.taxRegime !== "MICRO" || ca <= 0) {
        return false;
      }
      const abattement = FORFAIT_ABATTEMENT[c.benefitType];
      // Suggest real regime if estimated real expenses > flat-rate deduction
      // This is a simplified heuristic - suggest if turnover is high enough
      // that the user should consider their actual expenses
      const estimatedCharges = ca * 0.6; // Assume 60% of turnover as expenses
      return estimatedCharges > ca * abattement;
    },
    severity: "info",
    messageKey: "alerts.suggestReel",
  },
];

/**
 * Get applicable consequences for a configuration
 */
export const getApplicableConsequences = (
  config: Parameters<ConsequenceRule["condition"]>[0],
): ConsequenceRule[] => {
  return consequenceRules.filter((rule) => rule.condition(config));
};

/**
 * Get applicable alerts for a configuration and turnover
 */
export const getApplicableAlerts = (
  config: Parameters<ThresholdAlert["condition"]>[0],
  turnover: number,
): ThresholdAlert[] => {
  return thresholdAlerts.filter((alert) => alert.condition(config, turnover));
};
