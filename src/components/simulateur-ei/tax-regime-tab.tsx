"use client";

import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { RegimeCharacteristics } from "./regime-characteristics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type ConfigState,
  getAvailableTaxRegimes,
  getMicroThreshold,
  getTaxRegimeCharacteristics,
  getVatReelThresholds,
  TAX_REGIME_OPTIONS,
  type TaxRegime,
} from "@/lib/simulateur-ei";

interface TaxRegimeTabProps {
  config: ConfigState;
  onConfigChange: (updates: Partial<ConfigState>) => void;
}

export const TaxRegimeTab = ({ config, onConfigChange }: TaxRegimeTabProps) => {
  const t = useTranslations("SimulateurEI");
  const availableTaxRegimes = getAvailableTaxRegimes(config.benefitType);

  return (
    <Card className="border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("taxRegime.label")}
        </CardTitle>
        <CardDescription>{t("taxRegime.tabDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("taxRegime.selectLabel")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t("taxRegime.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
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

          {/* Display selected tax regime description */}
          {config.taxRegime && (
            <div className="bg-muted/30 mt-3 space-y-2 rounded-lg p-3">
              <p className="text-muted-foreground text-sm">
                {t(
                  TAX_REGIME_OPTIONS.find(
                    (opt) => opt.value === config.taxRegime,
                  )?.descriptionKey || "",
                )}
              </p>
              {/* Dynamic thresholds based on tax regime and benefit type */}
              {config.taxRegime === "MICRO" && (
                <p className="text-muted-foreground text-sm font-medium">
                  {t("taxRegime.thresholds.micro", {
                    threshold: getMicroThreshold(config.benefitType),
                  })}
                </p>
              )}
              {(config.taxRegime === "REEL_SIMPLIFIE" ||
                config.taxRegime === "DECLARATION_CONTROLEE") && (
                <p className="text-muted-foreground text-sm font-medium">
                  {t("taxRegime.thresholds.reelSimplifie", {
                    threshold: getMicroThreshold(config.benefitType),
                  })}
                </p>
              )}
              {config.taxRegime === "REEL_NORMAL" && (
                <p className="text-muted-foreground text-sm font-medium">
                  {t("taxRegime.thresholds.reelNormal", {
                    threshold: getVatReelThresholds(config.benefitType),
                  })}
                </p>
              )}
            </div>
          )}

          {/* Display tax regime characteristics */}
          {config.taxRegime && (
            <RegimeCharacteristics
              sections={getTaxRegimeCharacteristics(
                config.taxRegime,
                config.benefitType,
              )}
            />
          )}
        </Field>
      </CardContent>
    </Card>
  );
};
