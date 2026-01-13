import {
  ABATTEMENT_MINIMUM,
  FORFAIT_ABATTEMENT,
  TAUX_MICRO_SOCIAL,
  TAUX_TNS_CLASSIQUE,
} from "./constants";
import type { SimulationInput, SimulationResult } from "./types";

/**
 * Calculate the simulation results based on input parameters
 */
export const calculateSimulation = (
  input: SimulationInput,
): SimulationResult => {
  const { benefitType, taxRegime, socialRegime, turnover, expenses } = input;

  let beneficeImposable: number;
  let cotisationsSociales: number;
  let tauxCotisations: number;
  let baseCotisations: "ca" | "benefice";
  let abattementForfaitaire: number | undefined;
  let chargesDeduites: number | undefined;

  // ═══════════════════════════════════════════════════════════
  // CALCULATE TAXABLE PROFIT
  // ═══════════════════════════════════════════════════════════

  if (taxRegime === "MICRO") {
    // Micro regime: flat-rate deduction
    const tauxAbattement = FORFAIT_ABATTEMENT[benefitType];
    abattementForfaitaire = turnover * tauxAbattement;

    // Minimum deduction of 305 euros
    const abattementEffectif = Math.max(
      abattementForfaitaire,
      ABATTEMENT_MINIMUM,
    );
    beneficeImposable = Math.max(turnover - abattementEffectif, 0);
  } else {
    // Real regime: actual expenses deducted
    chargesDeduites = expenses;
    beneficeImposable = Math.max(turnover - expenses, 0);
  }

  // ═══════════════════════════════════════════════════════════
  // CALCULATE SOCIAL CONTRIBUTIONS
  // ═══════════════════════════════════════════════════════════

  if (socialRegime === "MICRO_SOCIAL") {
    // Micro-social: contributions based on turnover
    baseCotisations = "ca";

    // Determine rate based on benefit type
    if (benefitType === "BIC_VENTE") {
      tauxCotisations = TAUX_MICRO_SOCIAL.BIC_VENTE;
    } else if (benefitType === "BIC_SERVICE") {
      tauxCotisations = TAUX_MICRO_SOCIAL.BIC_SERVICE;
    } else {
      // BNC: use SSI rate by default (most common)
      tauxCotisations = TAUX_MICRO_SOCIAL.BNC_SSI;
    }

    cotisationsSociales = turnover * tauxCotisations;
  } else {
    // TNS classic: contributions based on profit after expenses
    baseCotisations = "benefice";
    tauxCotisations = TAUX_TNS_CLASSIQUE;
    const beneficeSocial = Math.max(turnover - expenses, 0);
    cotisationsSociales = beneficeSocial * tauxCotisations;
  }

  // ═══════════════════════════════════════════════════════════
  // CALCULATE INCOME BEFORE INCOME TAX
  // ═══════════════════════════════════════════════════════════

  // Note: contributions are deducted from available income,
  // not from taxable profit (which is the base for income tax)
  // Expenses are only deducted if tax regime is real (not micro)
  const revenuAvantIR =
    turnover - (taxRegime === "MICRO" ? 0 : expenses) - cotisationsSociales;

  return {
    beneficeImposable,
    cotisationsSociales,
    baseCotisations,
    tauxCotisations,
    revenuAvantIR: Math.max(revenuAvantIR, 0),
    details: {
      abattementForfaitaire,
      chargesDeduites,
    },
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (rate: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
};
