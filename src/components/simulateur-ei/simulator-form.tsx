"use client";

import { Euro, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  isRealRegime,
  type SocialRegime,
  type TaxRegime,
} from "@/lib/simulateur-ei";

interface SimulatorFormProps {
  turnover: number;
  expenses: number;
  taxRegime: TaxRegime;
  socialRegime: SocialRegime;
  onTurnoverChange: (value: number) => void;
  onExpensesChange: (value: number) => void;
}

const MAX_TURNOVER = 500_000;
const SLIDER_STEP = 1000;

/**
 * Format number with French locale thousand separators
 */
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("fr-FR").format(value);
};

/**
 * Parse formatted number string back to number
 */
const parseFormattedNumber = (value: string): number => {
  // Remove all non-digit characters except for the minus sign
  const cleaned = value.replace(/[^\d-]/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

export const SimulatorForm = ({
  turnover,
  expenses,
  taxRegime,
  socialRegime,
  onTurnoverChange,
  onExpensesChange,
}: SimulatorFormProps) => {
  const t = useTranslations("SimulateurEI");
  // Show expenses when EITHER tax regime is real OR social regime is TNS_CLASSIQUE
  const showExpenses =
    isRealRegime(taxRegime) || socialRegime === "TNS_CLASSIQUE";

  const handleTurnoverInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFormattedNumber(e.target.value);
      onTurnoverChange(Math.min(value, MAX_TURNOVER * 2)); // Allow up to 1M in input
    },
    [onTurnoverChange],
  );

  const handleExpensesInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFormattedNumber(e.target.value);
      // Expenses cannot exceed turnover
      onExpensesChange(Math.min(value, turnover));
    },
    [onExpensesChange, turnover],
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      onTurnoverChange(value[0]);
    },
    [onTurnoverChange],
  );

  return (
    <Card className="border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg">{t("simulator.title")}</CardTitle>
        <CardDescription>{t("simulator.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Turnover Input */}
        <Field>
          <FieldLabel className="flex items-center gap-2">
            {t("simulator.turnover")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t("simulator.turnoverTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={turnover === 0 ? "" : formatNumber(turnover)}
                onChange={handleTurnoverInputChange}
                placeholder="50 000"
                className="pr-16 font-mono text-lg"
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Euro className="mr-1 h-4 w-4" />
                <span className="text-sm">HT</span>
              </div>
            </div>
            <Slider
              value={[Math.min(turnover, MAX_TURNOVER)]}
              onValueChange={handleSliderChange}
              max={MAX_TURNOVER}
              step={SLIDER_STEP}
              className="w-full"
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>0 €</span>
              <span>{formatNumber(MAX_TURNOVER)} €</span>
            </div>
          </div>
        </Field>

        {/* Expenses Input (when either tax regime is real or social regime is TNS Classique) */}
        {showExpenses && (
          <Field>
            <FieldLabel className="flex items-center gap-2">
              {t("simulator.expenses")}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t("simulator.expensesTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FieldLabel>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={expenses === 0 ? "" : formatNumber(expenses)}
                onChange={handleExpensesInputChange}
                placeholder="20 000"
                className="pr-16 font-mono text-lg"
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Euro className="mr-1 h-4 w-4" />
                <span className="text-sm">HT</span>
              </div>
            </div>
            <FieldDescription>
              {t("simulator.expensesDescription")}
            </FieldDescription>
          </Field>
        )}
      </CardContent>
    </Card>
  );
};
