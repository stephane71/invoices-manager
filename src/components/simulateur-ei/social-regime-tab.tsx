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
  getSocialRegimeCharacteristics,
  SOCIAL_REGIME_OPTIONS,
  type SocialRegime,
} from "@/lib/simulateur-ei";

interface SocialRegimeTabProps {
  config: ConfigState;
  onConfigChange: (updates: Partial<ConfigState>) => void;
}

/**
 * Get highlight mode based on social regime
 * - MICRO_SOCIAL: entire bar is highlighted (contributions on turnover)
 * - TNS_CLASSIQUE: only benefits portion is highlighted (contributions on profit)
 */
const getHighlightMode = (socialRegime: SocialRegime): TaxBaseHighlight => {
  if (socialRegime === "MICRO_SOCIAL") {
    return "full";
  }
  return "benefits-only";
};

export const SocialRegimeTab = ({
  config,
  onConfigChange,
}: SocialRegimeTabProps) => {
  const t = useTranslations("SimulateurEI");

  return (
    <Card className="border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("socialRegime.label")}
        </CardTitle>
        <CardDescription>{t("socialRegime.tabDescription")}</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <Field>
          <RadioGroup
            value={config.socialRegime}
            onValueChange={(value) =>
              onConfigChange({ socialRegime: value as SocialRegime })
            }
            className="grid gap-3 pt-2"
          >
            {SOCIAL_REGIME_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={`social-${option.value}`}
                className="hover:bg-accent/50 has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:border-primary flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`social-${option.value}`}
                />
                <div className="font-medium">{t(option.labelKey)}</div>
              </Label>
            ))}
          </RadioGroup>

          {/* Social contribution base visualization bar */}
          {config.socialRegime && (
            <TaxBaseVisualizationBar
              highlightMode={getHighlightMode(config.socialRegime)}
              translationKey="socialBaseVisualization"
              className="mt-4"
            />
          )}

          {/* Display social regime characteristics */}
          {config.socialRegime && (
            <RegimeCharacteristics
              sections={getSocialRegimeCharacteristics(
                config.socialRegime,
                config.benefitType,
              )}
              description={t(
                SOCIAL_REGIME_OPTIONS.find(
                  (opt) => opt.value === config.socialRegime,
                )?.descriptionKey || "",
              )}
            />
          )}
        </Field>
      </CardContent>
    </Card>
  );
};
