"use client";

import { useTranslations } from "next-intl";
import {
  type BenefitType,
  getMicroThreshold,
  type TaxRegime,
} from "@/lib/simulateur-ei";
import { cn } from "@/lib/utils";

interface TaxRegimeThresholdProps {
  taxRegime: TaxRegime;
  benefitType: BenefitType;
  className?: string;
}

/**
 * Displays the applicable turnover threshold for the selected tax regime.
 * - MICRO: Shows the micro-fiscal threshold based on benefit type
 * - RÉEL regimes: Shows that there's no turnover limit
 */
export const TaxRegimeThreshold = ({
  taxRegime,
  benefitType,
  className,
}: TaxRegimeThresholdProps) => {
  const t = useTranslations("SimulateurEI.taxRegime.thresholds");

  const threshold = getMicroThreshold(benefitType);
  const isMicro = taxRegime === "MICRO";

  return (
    <div className={cn("bg-muted/50 rounded-lg border p-4", className)}>
      <p className="text-sm">
        {isMicro ? t("micro", { threshold }) : t("reel")}
      </p>
    </div>
  );
};
