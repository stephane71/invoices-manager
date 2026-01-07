"use client";

import { HelpCircle, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
                className="hover:bg-accent/50 has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:border-primary flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{t(option.labelKey)}</div>
                  <div className="text-muted-foreground text-sm">
                    {t(option.descriptionKey)}
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
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
          <Select
            value={config.taxRegime}
            onValueChange={(value) =>
              onConfigChange({ taxRegime: value as TaxRegime })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAX_REGIME_OPTIONS.filter((option) =>
                availableTaxRegimes.includes(option.value),
              ).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Social Regime (Read-only, auto-calculated) */}
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("socialRegime.label")}
            <Badge variant="secondary" className="gap-1 text-xs">
              <Lock className="h-3 w-3" />
              {t("socialRegime.automatic")}
            </Badge>
          </FieldLabel>
          <div className="bg-muted/50 text-muted-foreground flex h-9 items-center rounded-md border px-3">
            {t(
              config.socialRegime === "MICRO_SOCIAL"
                ? "socialRegime.microSocial"
                : "socialRegime.tnsClassique",
            )}
          </div>
          <FieldDescription>{t("socialRegime.description")}</FieldDescription>
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
          <Select
            value={config.vatRegime}
            onValueChange={(value) =>
              onConfigChange({ vatRegime: value as VatRegime })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VAT_REGIME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  );
};
