"use client";

import { useTranslations } from "next-intl";

import { RegimeCharacteristics } from "./regime-characteristics";
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
  getVatRegimeCharacteristics,
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
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("vatRegime.label")}
        </CardTitle>
        <CardDescription>{t("vatRegime.tabDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Field>
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

          {/* Display VAT regime characteristics */}
          {config.vatRegime && (
            <RegimeCharacteristics
              sections={getVatRegimeCharacteristics(
                config.vatRegime,
                config.benefitType,
              )}
              description={t(
                VAT_REGIME_OPTIONS.find((opt) => opt.value === config.vatRegime)
                  ?.descriptionKey || "",
              )}
            />
          )}
        </Field>
      </CardContent>
    </Card>
  );
};
