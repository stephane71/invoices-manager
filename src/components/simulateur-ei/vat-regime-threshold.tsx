"use client";

import { useTranslations } from "next-intl";
import {
  type BenefitType,
  getVatFranchiseThresholds,
  getVatReelThresholds,
  type VatRegime,
} from "@/lib/simulateur-ei";
import { cn } from "@/lib/utils";

interface VatRegimeThresholdProps {
  vatRegime: VatRegime;
  benefitType: BenefitType;
  className?: string;
}

/**
 * Displays the applicable turnover threshold for the selected VAT regime.
 * - FRANCHISE_BASE: Shows base and majore thresholds
 * - REEL_SIMPLIFIE_TVA: Shows the threshold below which it applies
 * - REEL_NORMAL_TVA: Shows the threshold above which it's mandatory
 */
export const VatRegimeThreshold = ({
  vatRegime,
  benefitType,
  className,
}: VatRegimeThresholdProps) => {
  const t = useTranslations("SimulateurEI.vatRegime.thresholds");

  const getThresholdText = () => {
    switch (vatRegime) {
      case "FRANCHISE_BASE": {
        const { base, majore } = getVatFranchiseThresholds(benefitType);
        return t("franchiseBase", { base, majore });
      }
      case "REEL_SIMPLIFIE_TVA": {
        const threshold = getVatReelThresholds(benefitType);
        return t("reelSimplifie", { threshold });
      }
      case "REEL_NORMAL_TVA": {
        const threshold = getVatReelThresholds(benefitType);
        return t("reelNormal", { threshold });
      }
      default:
        return null;
    }
  };

  const thresholdText = getThresholdText();
  if (!thresholdText) {
    return null;
  }

  return (
    <div className={cn("bg-muted/50 rounded-lg border p-4", className)}>
      <p className="text-sm">{thresholdText}</p>
    </div>
  );
};
