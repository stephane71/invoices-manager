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
  BENEFIT_TYPE_OPTIONS,
  type BenefitType,
  type ConfigState,
  getAvailableTaxRegimes,
  getMicroThreshold,
  getVatFranchiseThresholds,
  getVatReelThresholds,
  SOCIAL_REGIME_OPTIONS,
  type SocialRegime,
  TAX_REGIME_OPTIONS,
  type TaxRegime,
  VAT_REGIME_OPTIONS,
  type VatRegime,
} from "@/lib/simulateur-ei";

interface ConfigurationFormProps {
  config: ConfigState;
  onConfigChange: (updates: Partial<ConfigState>) => void;
}

export const ConfigurationForm = ({
  config,
  onConfigChange,
}: ConfigurationFormProps) => {
  const t = useTranslations("SimulateurEI");

  const availableTaxRegimes = getAvailableTaxRegimes(config.benefitType);

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("configuration.title")}
        </CardTitle>
        <CardDescription>{t("configuration.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Benefit Type */}
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("benefitType.label")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t("benefitType.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
          <RadioGroup
            value={config.benefitType}
            onValueChange={(value) =>
              onConfigChange({ benefitType: value as BenefitType })
            }
            className="grid gap-3 pt-2"
          >
            {BENEFIT_TYPE_OPTIONS.map((option) => (
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

          {/* Display selected benefit type description */}
          {config.benefitType && (
            <div className="bg-muted/30 mt-3 rounded-lg p-3">
              <p className="text-muted-foreground text-sm">
                {t(
                  BENEFIT_TYPE_OPTIONS.find(
                    (opt) => opt.value === config.benefitType,
                  )?.descriptionKey || "",
                )}
              </p>
            </div>
          )}
        </Field>

        {/* Tax Regime */}
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("taxRegime.label")}
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
        </Field>

        {/* Social Regime */}
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("socialRegime.label")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t("socialRegime.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
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

          {/* Display selected social regime description */}
          {config.socialRegime && (
            <div className="bg-muted/30 mt-3 rounded-lg p-3">
              <p className="text-muted-foreground text-sm">
                {t(
                  SOCIAL_REGIME_OPTIONS.find(
                    (opt) => opt.value === config.socialRegime,
                  )?.descriptionKey || "",
                )}
              </p>
            </div>
          )}
        </Field>

        {/* VAT Regime */}
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("vatRegime.label")}
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
