"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Defines which portion of the bar is highlighted as the tax base
 */
export type TaxBaseHighlight = "full" | "benefits-only";

/**
 * Props for the TaxBaseVisualizationBar component
 */
export interface TaxBaseVisualizationBarProps {
  /**
   * Which portion to highlight as the tax base
   * - "full": Entire bar (charges + benefits) - used for MICRO regime
   * - "benefits-only": Only the benefits portion - used for RÉEL regime
   */
  highlightMode: TaxBaseHighlight;

  /**
   * Percentage of charges (0-100)
   * Default: 70 (placeholder for visual demonstration)
   */
  chargesPercentage?: number;

  /**
   * Translation key prefix for context-specific text
   * - "taxBaseVisualization": Tax regime context (default)
   * - "socialBaseVisualization": Social regime context
   */
  translationKey?: "taxBaseVisualization" | "socialBaseVisualization";

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * A horizontal stacked bar visualization showing the relationship
 * between charges and benefits, with highlighting to indicate the tax base.
 *
 * @example
 * // MICRO regime - entire bar is tax base
 * <TaxBaseVisualizationBar highlightMode="full" />
 *
 * @example
 * // RÉEL regime - only benefits are tax base
 * <TaxBaseVisualizationBar highlightMode="benefits-only" />
 */
export const TaxBaseVisualizationBar = ({
  highlightMode,
  chargesPercentage = 50,
  translationKey = "taxBaseVisualization",
  className,
}: TaxBaseVisualizationBarProps) => {
  const t = useTranslations(`SimulateurEI.${translationKey}`);

  // Validate and clamp chargesPercentage to [0, 100]
  const validChargesPercentage = Math.max(0, Math.min(100, chargesPercentage));
  const benefitsPercentage = 100 - validChargesPercentage;

  // Determine highlighting
  const isFullBarHighlighted = highlightMode === "full";
  const isBenefitsOnlyHighlighted = highlightMode === "benefits-only";

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with title and tooltip */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t("title")}</span>
      </div>

      {/* Stacked horizontal bar with annotation */}
      <div className="relative">
        {/* The bar */}
        <div className="bg-muted/30 flex h-12 w-full overflow-hidden rounded-lg border">
          {/* Charges section */}
          <div
            className={cn(
              "flex items-center justify-center border-r transition-colors",
              isFullBarHighlighted ? "bg-primary/15" : "bg-muted/50",
            )}
            style={{ width: `${validChargesPercentage}%` }}
            aria-label={t("chargesLabel")}
          >
            <span
              className={cn(
                "text-xs font-medium",
                isFullBarHighlighted
                  ? "text-primary"
                  : "text-muted-foreground opacity-70",
              )}
            >
              {t("charges")}
            </span>
          </div>

          {/* Benefits section */}
          <div
            className={cn(
              "flex items-center justify-center transition-colors",
              isFullBarHighlighted || isBenefitsOnlyHighlighted
                ? "bg-primary/20"
                : "bg-muted/50",
            )}
            style={{ width: `${benefitsPercentage}%` }}
            aria-label={t("benefitsLabel")}
          >
            <span
              className={cn(
                "text-xs font-medium",
                isFullBarHighlighted || isBenefitsOnlyHighlighted
                  ? "text-primary"
                  : "text-muted-foreground opacity-70",
              )}
            >
              {t("benefits")}
            </span>
          </div>
        </div>

        {/* Tax base annotation bracket */}
        <div
          className="absolute -bottom-8 flex flex-col items-center"
          style={{
            left: isFullBarHighlighted ? "0%" : `${validChargesPercentage}%`,
            right: "0%",
          }}
        >
          {/* Bracket line */}
          <div className="border-primary flex w-full items-center">
            <div className="border-primary h-2 w-px border-l-2" />
            <div className="border-primary h-px flex-1 border-t-2" />
            <div className="border-primary h-2 w-px border-r-2" />
          </div>
          {/* Arrow and label */}
          <div className="text-primary flex items-center gap-1 pt-0.5">
            <ArrowUp className="h-3 w-3" />
            <span className="text-xs font-semibold">{t("taxBase")}</span>
          </div>
        </div>
      </div>

      {/* Explanation text */}
      <p className="text-muted-foreground mt-10 text-xs leading-relaxed">
        {isFullBarHighlighted
          ? t("explanation.full")
          : t("explanation.benefitsOnly")}
      </p>
    </div>
  );
};
