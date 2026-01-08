/**
 * Regime characteristics data mapping
 * Maps regime types to their detailed characteristics for display
 */

import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Wallet,
} from "lucide-react";
import { createElement } from "react";

import type { BenefitType, SocialRegime, TaxRegime, VatRegime } from "./types";
import type { CharacteristicSection } from "@/components/simulateur-ei/regime-characteristics";

const iconClasses = "h-4 w-4";

// ============================================================================
// TAX REGIME CHARACTERISTICS
// ============================================================================

export const getTaxRegimeCharacteristics = (
  taxRegime: TaxRegime,
  benefitType: BenefitType,
): CharacteristicSection[] => {
  const sections: CharacteristicSection[] = [];

  if (taxRegime === "MICRO") {
    sections.push(
      {
        titleKey: "characteristics.taxRegime.calculation.title",
        icon: createElement(Calculator, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.taxRegime.calculation.method",
            valueKey: "characteristics.taxRegime.micro.calculationMethod",
          },
          {
            labelKey: "characteristics.taxRegime.calculation.rate",
            valueKey: `characteristics.taxRegime.micro.abattement.${benefitType}`,
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.accounting.title",
        icon: createElement(BookOpen, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.accounting.type",
            valueKey: "characteristics.taxRegime.micro.accountingType",
          },
          {
            labelKey: "characteristics.taxRegime.accounting.documents",
            valueKey: "characteristics.taxRegime.micro.documents",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.declaration.title",
        icon: createElement(FileText, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.declaration.form",
            valueKey: "characteristics.taxRegime.micro.form",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.frequency",
            valueKey: "characteristics.taxRegime.micro.frequency",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.deadline",
            valueKey: "characteristics.taxRegime.micro.deadline",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.options.title",
        icon: createElement(CheckCircle2, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.micro.options.vfl",
            valueKey: "characteristics.taxRegime.micro.options.vflDesc",
            tooltipKey: "characteristics.taxRegime.micro.options.vflTooltip",
          },
          {
            labelKey: "characteristics.taxRegime.micro.options.optionReel",
            valueKey: "characteristics.taxRegime.micro.options.optionReelDesc",
          },
        ],
      },
    );
  }

  if (taxRegime === "REEL_SIMPLIFIE" || taxRegime === "DECLARATION_CONTROLEE") {
    sections.push(
      {
        titleKey: "characteristics.taxRegime.calculation.title",
        icon: createElement(Calculator, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.taxRegime.calculation.method",
            valueKey:
              "characteristics.taxRegime.reelSimplifie.calculationMethod",
          },
          {
            labelKey: "characteristics.taxRegime.calculation.deductions",
            valueKey: "characteristics.taxRegime.reelSimplifie.deductions",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.accounting.title",
        icon: createElement(BookOpen, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.accounting.type",
            valueKey: "characteristics.taxRegime.reelSimplifie.accountingType",
          },
          {
            labelKey: "characteristics.taxRegime.accounting.documents",
            valueKey: "characteristics.taxRegime.reelSimplifie.documents",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.declaration.title",
        icon: createElement(FileText, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.declaration.form",
            valueKey:
              taxRegime === "DECLARATION_CONTROLEE"
                ? "characteristics.taxRegime.declarationControlee.form"
                : "characteristics.taxRegime.reelSimplifie.form",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.frequency",
            valueKey: "characteristics.taxRegime.reelSimplifie.frequency",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.deadline",
            valueKey: "characteristics.taxRegime.reelSimplifie.deadline",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.transmission",
            valueKey: "characteristics.taxRegime.reelSimplifie.transmission",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.options.title",
        icon: createElement(CheckCircle2, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.reelSimplifie.options.is",
            valueKey: "characteristics.taxRegime.reelSimplifie.options.isDesc",
            tooltipKey:
              "characteristics.taxRegime.reelSimplifie.options.isTooltip",
          },
          {
            labelKey: "characteristics.taxRegime.reelSimplifie.options.deficit",
            valueKey:
              "characteristics.taxRegime.reelSimplifie.options.deficitDesc",
          },
        ],
      },
    );
  }

  if (taxRegime === "REEL_NORMAL") {
    sections.push(
      {
        titleKey: "characteristics.taxRegime.calculation.title",
        icon: createElement(Calculator, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.taxRegime.calculation.method",
            valueKey: "characteristics.taxRegime.reelNormal.calculationMethod",
          },
          {
            labelKey: "characteristics.taxRegime.calculation.deductions",
            valueKey: "characteristics.taxRegime.reelNormal.deductions",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.accounting.title",
        icon: createElement(BookOpen, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.accounting.type",
            valueKey: "characteristics.taxRegime.reelNormal.accountingType",
          },
          {
            labelKey: "characteristics.taxRegime.accounting.documents",
            valueKey: "characteristics.taxRegime.reelNormal.documents",
          },
        ],
      },
      {
        titleKey: "characteristics.taxRegime.declaration.title",
        icon: createElement(FileText, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.taxRegime.declaration.form",
            valueKey: "characteristics.taxRegime.reelNormal.form",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.frequency",
            valueKey: "characteristics.taxRegime.reelNormal.frequency",
          },
          {
            labelKey: "characteristics.taxRegime.declaration.transmission",
            valueKey: "characteristics.taxRegime.reelNormal.transmission",
          },
        ],
      },
    );
  }

  return sections;
};

// ============================================================================
// SOCIAL REGIME CHARACTERISTICS
// ============================================================================

export const getSocialRegimeCharacteristics = (
  socialRegime: SocialRegime,
  benefitType: BenefitType,
): CharacteristicSection[] => {
  const sections: CharacteristicSection[] = [];

  if (socialRegime === "MICRO_SOCIAL") {
    sections.push(
      {
        titleKey: "characteristics.socialRegime.calculation.title",
        icon: createElement(Calculator, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.socialRegime.calculation.base",
            valueKey: "characteristics.socialRegime.micro.calculationBase",
          },
          {
            labelKey: "characteristics.socialRegime.calculation.rate",
            valueKey: `characteristics.socialRegime.micro.rate.${benefitType}`,
          },
        ],
      },
      {
        titleKey: "characteristics.socialRegime.declaration.title",
        icon: createElement(FileText, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.socialRegime.declaration.frequency",
            valueKey: "characteristics.socialRegime.micro.frequency",
          },
          {
            labelKey: "characteristics.socialRegime.declaration.organism",
            valueKey: "characteristics.socialRegime.micro.organism",
          },
        ],
      },
      {
        titleKey: "characteristics.socialRegime.exonerations.title",
        icon: createElement(Wallet, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.socialRegime.exonerations.acre",
            valueKey: "characteristics.socialRegime.micro.acre",
            tooltipKey: "characteristics.socialRegime.micro.acreTooltip",
          },
        ],
      },
      {
        titleKey: "characteristics.socialRegime.protection.title",
        icon: createElement(Shield, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.socialRegime.protection.health",
            valueKey: "characteristics.socialRegime.micro.health",
          },
          {
            labelKey: "characteristics.socialRegime.protection.retirement",
            valueKey: "characteristics.socialRegime.micro.retirement",
          },
          {
            labelKey: "characteristics.socialRegime.protection.exclusions",
            valueKey: "characteristics.socialRegime.micro.exclusions",
          },
        ],
      },
    );
  }

  if (socialRegime === "TNS_CLASSIQUE") {
    sections.push(
      {
        titleKey: "characteristics.socialRegime.calculation.title",
        icon: createElement(Calculator, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.socialRegime.calculation.base",
            valueKey: "characteristics.socialRegime.tns.calculationBase",
          },
          {
            labelKey: "characteristics.socialRegime.calculation.rate",
            valueKey: "characteristics.socialRegime.tns.rate",
          },
          {
            labelKey: "characteristics.socialRegime.calculation.reform",
            valueKey: "characteristics.socialRegime.tns.reform2026",
            tooltipKey: "characteristics.socialRegime.tns.reform2026Tooltip",
          },
        ],
      },
      {
        titleKey: "characteristics.socialRegime.declaration.title",
        icon: createElement(FileText, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.socialRegime.declaration.frequency",
            valueKey: "characteristics.socialRegime.tns.frequency",
          },
          {
            labelKey: "characteristics.socialRegime.declaration.mechanism",
            valueKey: "characteristics.socialRegime.tns.mechanism",
          },
          {
            labelKey: "characteristics.socialRegime.declaration.organism",
            valueKey: "characteristics.socialRegime.tns.organism",
          },
        ],
      },
      {
        titleKey: "characteristics.socialRegime.exonerations.title",
        icon: createElement(Wallet, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.socialRegime.exonerations.acre",
            valueKey: "characteristics.socialRegime.tns.acre",
          },
          {
            labelKey: "characteristics.socialRegime.exonerations.other",
            valueKey: "characteristics.socialRegime.tns.otherExonerations",
          },
        ],
      },
      {
        titleKey: "characteristics.socialRegime.protection.title",
        icon: createElement(Shield, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.socialRegime.protection.health",
            valueKey: "characteristics.socialRegime.tns.health",
          },
          {
            labelKey: "characteristics.socialRegime.protection.retirement",
            valueKey: "characteristics.socialRegime.tns.retirement",
          },
          {
            labelKey: "characteristics.socialRegime.protection.recommended",
            valueKey: "characteristics.socialRegime.tns.recommended",
          },
        ],
      },
    );
  }

  return sections;
};

// ============================================================================
// VAT REGIME CHARACTERISTICS
// ============================================================================

export const getVatRegimeCharacteristics = (
  vatRegime: VatRegime,
  benefitType: BenefitType,
): CharacteristicSection[] => {
  const sections: CharacteristicSection[] = [];

  if (vatRegime === "FRANCHISE_BASE") {
    sections.push(
      {
        titleKey: "characteristics.vatRegime.obligations.title",
        icon: createElement(FileText, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.vatRegime.obligations.billing",
            valueKey: "characteristics.vatRegime.franchise.billing",
          },
          {
            labelKey: "characteristics.vatRegime.obligations.mention",
            valueKey: "characteristics.vatRegime.franchise.mention",
          },
          {
            labelKey: "characteristics.vatRegime.obligations.declaration",
            valueKey: "characteristics.vatRegime.franchise.declaration",
          },
        ],
      },
      {
        titleKey: "characteristics.vatRegime.advantages.title",
        icon: createElement(CheckCircle2, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.vatRegime.franchise.advantage1",
            valueKey: "characteristics.vatRegime.franchise.advantage1Desc",
          },
          {
            labelKey: "characteristics.vatRegime.franchise.advantage2",
            valueKey: "characteristics.vatRegime.franchise.advantage2Desc",
          },
        ],
      },
      {
        titleKey: "characteristics.vatRegime.limits.title",
        icon: createElement(Clock, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.vatRegime.limits.noRecovery",
            valueKey: "characteristics.vatRegime.franchise.noRecovery",
          },
          {
            labelKey: "characteristics.vatRegime.limits.threshold",
            valueKey: `characteristics.vatRegime.franchise.threshold.${benefitType}`,
          },
        ],
      },
    );
  }

  if (vatRegime === "REEL_SIMPLIFIE_TVA") {
    sections.push(
      {
        titleKey: "characteristics.vatRegime.obligations.title",
        icon: createElement(FileText, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.vatRegime.obligations.billing",
            valueKey: "characteristics.vatRegime.reelSimplifie.billing",
          },
          {
            labelKey: "characteristics.vatRegime.obligations.declaration",
            valueKey: "characteristics.vatRegime.reelSimplifie.declaration",
          },
          {
            labelKey: "characteristics.vatRegime.obligations.payment",
            valueKey: "characteristics.vatRegime.reelSimplifie.payment",
          },
        ],
      },
      {
        titleKey: "characteristics.vatRegime.advantages.title",
        icon: createElement(CheckCircle2, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.vatRegime.reelSimplifie.advantage1",
            valueKey: "characteristics.vatRegime.reelSimplifie.advantage1Desc",
          },
          {
            labelKey: "characteristics.vatRegime.reelSimplifie.advantage2",
            valueKey: "characteristics.vatRegime.reelSimplifie.advantage2Desc",
          },
        ],
      },
    );
  }

  if (vatRegime === "REEL_NORMAL_TVA") {
    sections.push(
      {
        titleKey: "characteristics.vatRegime.obligations.title",
        icon: createElement(FileText, { className: iconClasses }),
        defaultOpen: true,
        items: [
          {
            labelKey: "characteristics.vatRegime.obligations.billing",
            valueKey: "characteristics.vatRegime.reelNormal.billing",
          },
          {
            labelKey: "characteristics.vatRegime.obligations.declaration",
            valueKey: "characteristics.vatRegime.reelNormal.declaration",
          },
          {
            labelKey: "characteristics.vatRegime.obligations.frequency",
            valueKey: "characteristics.vatRegime.reelNormal.frequency",
          },
        ],
      },
      {
        titleKey: "characteristics.vatRegime.advantages.title",
        icon: createElement(CheckCircle2, { className: iconClasses }),
        items: [
          {
            labelKey: "characteristics.vatRegime.reelNormal.advantage1",
            valueKey: "characteristics.vatRegime.reelNormal.advantage1Desc",
          },
        ],
      },
    );
  }

  return sections;
};

// ============================================================================
// BENEFIT TYPE CHARACTERISTICS
// ============================================================================

export const getBenefitTypeCharacteristics = (
  benefitType: BenefitType,
): CharacteristicSection[] => {
  const sections: CharacteristicSection[] = [];

  sections.push(
    {
      titleKey: "characteristics.benefitType.category.title",
      icon: createElement(BookOpen, { className: iconClasses }),
      defaultOpen: true,
      items: [
        {
          labelKey: "characteristics.benefitType.category.type",
          valueKey: `characteristics.benefitType.${benefitType}.category`,
        },
        {
          labelKey: "characteristics.benefitType.category.examples",
          valueKey: `characteristics.benefitType.${benefitType}.examples`,
        },
      ],
    },
    {
      titleKey: "characteristics.benefitType.thresholds.title",
      icon: createElement(Calculator, { className: iconClasses }),
      items: [
        {
          labelKey: "characteristics.benefitType.thresholds.micro",
          valueKey: `characteristics.benefitType.${benefitType}.microThreshold`,
        },
        {
          labelKey: "characteristics.benefitType.thresholds.abattement",
          valueKey: `characteristics.benefitType.${benefitType}.abattement`,
        },
      ],
    },
    {
      titleKey: "characteristics.benefitType.social.title",
      icon: createElement(Shield, { className: iconClasses }),
      items: [
        {
          labelKey: "characteristics.benefitType.social.rate",
          valueKey: `characteristics.benefitType.${benefitType}.socialRate`,
        },
      ],
    },
  );

  return sections;
};
