"use client";

import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

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
  getVatFranchiseThresholds,
  getVatReelThresholds,
  VAT_REGIME_OPTIONS,
  type VatRegime,
} from "@/lib/simulateur-ei";

interface VatRegimeTabProps {
  config: ConfigState;
  onConfigChange: (updates: Partial<ConfigState>) => void;
}

export const VatRegimeTab = ({ config, onConfigChange }: VatRegimeTabProps) => {
  const t = useTranslations("SimulateurEI");

  return (
    <Card className="border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("vatRegime.label")}
        </CardTitle>
        <CardDescription>{t("vatRegime.tabDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("vatRegime.selectLabel")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t("vatRegime.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
          <RadioGroup
            value={config.vatRegime}
            onValueChange={(value) =>
              onConfigChange({ vatRegime: value as VatRegime })
            }
            className="grid gap-3 pt-2"
          >
            {VAT_REGIME_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={`vat-${option.value}`}
                className="hover:bg-accent/50 has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:border-primary flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`vat-${option.value}`}
                />
                <div className="font-medium">{t(option.labelKey)}</div>
              </Label>
            ))}
          </RadioGroup>

          {/* Display selected VAT regime description */}
          {config.vatRegime && (
            <div className="bg-muted/30 mt-3 space-y-2 rounded-lg p-3">
              <p className="text-muted-foreground text-sm">
                {t(
                  VAT_REGIME_OPTIONS.find(
                    (opt) => opt.value === config.vatRegime,
                  )?.descriptionKey || "",
                )}
              </p>
              {/* Dynamic thresholds based on VAT regime and benefit type */}
              {config.vatRegime === "FRANCHISE_BASE" &&
                (() => {
                  const franchiseThresholds = getVatFranchiseThresholds(
                    config.benefitType,
                  );
                  return (
                    <p className="text-muted-foreground text-sm font-medium">
                      {t("vatRegime.thresholds.franchiseBase", {
                        base: franchiseThresholds.base,
                        majore: franchiseThresholds.majore,
                      })}
                    </p>
                  );
                })()}
              {config.vatRegime === "REEL_SIMPLIFIE_TVA" && (
                <p className="text-muted-foreground text-sm font-medium">
                  {t("vatRegime.thresholds.reelSimplifie", {
                    threshold: getVatReelThresholds(config.benefitType),
                  })}
                </p>
              )}
              {config.vatRegime === "REEL_NORMAL_TVA" && (
                <p className="text-muted-foreground text-sm font-medium">
                  {t("vatRegime.thresholds.reelNormal", {
                    threshold: getVatReelThresholds(config.benefitType),
                  })}
                </p>
              )}
            </div>
          )}
        </Field>
      </CardContent>
    </Card>
  );
};
