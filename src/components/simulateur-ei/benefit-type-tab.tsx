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
} from "@/lib/simulateur-ei";

interface BenefitTypeTabProps {
  config: ConfigState;
  onConfigChange: (updates: Partial<ConfigState>) => void;
}

export const BenefitTypeTab = ({
  config,
  onConfigChange,
}: BenefitTypeTabProps) => {
  const t = useTranslations("SimulateurEI");

  return (
    <Card className="border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {t("benefitType.label")}
        </CardTitle>
        <CardDescription>{t("benefitType.tabDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("benefitType.selectLabel")}
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
      </CardContent>
    </Card>
  );
};
