"use client";

import { useTranslations } from "next-intl";
import { RegimeCharacteristics } from "./regime-characteristics";
import {
  type TaxBaseHighlight,
  TaxBaseVisualizationBar,
} from "./tax-base-visualization-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  type ConfigState,
  getAvailableTaxRegimes,
  getTaxRegimeCharacteristics,
  TAX_REGIME_OPTIONS,
  type TaxRegime,
} from "@/lib/simulateur-ei";

interface TaxRegimeTabProps {
  config: ConfigState;
  onConfigChange: (updates: Partial<ConfigState>) => void;
}

/**
 * Get highlight mode based on tax regime
 * - MICRO: entire bar is highlighted (full turnover is tax base)
 * - RÉEL regimes: only benefits portion is highlighted
 */
const getHighlightMode = (taxRegime: TaxRegime): TaxBaseHighlight => {
  if (taxRegime === "MICRO") {
    return "full";
  }
  return "benefits-only";
};

export const TaxRegimeTab = ({ config, onConfigChange }: TaxRegimeTabProps) => {
  const t = useTranslations("SimulateurEI");
  const availableTaxRegimes = getAvailableTaxRegimes(config.benefitType);

  return (
    <Card className="border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("taxRegime.label")}
        </CardTitle>
        <CardDescription>{t("taxRegime.tabDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Field>
          <RadioGroup
            value={config.taxRegime}
            onValueChange={(value) =>
              onConfigChange({ taxRegime: value as TaxRegime })
            }
            className="grid gap-3 pt-2"
          >
            {TAX_REGIME_OPTIONS.filter((option) =>
              availableTaxRegimes.includes(option.value),
            ).map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className="hover:bg-accent/50 has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:border-primary flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="font-medium">{t(option.labelKey)}</div>
              </Label>
            ))}
          </RadioGroup>

          {/* Tax base visualization bar */}
          {config.taxRegime && (
            <TaxBaseVisualizationBar
              highlightMode={getHighlightMode(config.taxRegime)}
              className="mt-4"
            />
          )}

          {/* Display tax regime characteristics */}
          {config.taxRegime && (
            <RegimeCharacteristics
              sections={getTaxRegimeCharacteristics(
                config.taxRegime,
                config.benefitType,
              )}
              description={t(
                TAX_REGIME_OPTIONS.find((opt) => opt.value === config.taxRegime)
                  ?.descriptionKey || "",
              )}
            />
          )}
        </Field>
      </CardContent>
    </Card>
  );
};
