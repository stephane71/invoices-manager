"use client";

import { Info, Minus, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  formatPercentage,
  type SimulationResult,
} from "@/lib/simulateur-ei";

interface ResultsDisplayProps {
  results: SimulationResult | null;
  turnover: number;
}

export const ResultsDisplay = ({ results, turnover }: ResultsDisplayProps) => {
  const t = useTranslations("SimulateurEI");

  if (!results || turnover <= 0) {
    return (
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-12">
          <div className="text-muted-foreground text-center">
            <TrendingDown className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg">{t("results.enterTurnover")}</p>
            <p className="mt-2 text-sm">{t("results.enterTurnoverHint")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="from-primary/5 to-primary/10 border-b bg-gradient-to-br pt-4">
        <CardTitle className="text-lg">{t("results.title")}</CardTitle>
        <CardDescription>{t("results.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Turnover */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="font-medium">{t("results.turnover")}</span>
          <span className="font-mono text-xl font-bold">
            {formatCurrency(turnover)}
          </span>
        </div>

        <Separator />

        {/* Deduction line */}
        <div className="bg-muted/30 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-2 text-sm">
                <Minus className="h-4 w-4" />
                {results.details.abattementForfaitaire !== undefined
                  ? t("results.flatRateDeduction")
                  : t("results.deductibleExpenses")}
              </span>
              {results.details.abattementForfaitaire !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {formatPercentage(
                    results.details.abattementForfaitaire / turnover,
                  )}
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground font-mono">
              -{" "}
              {formatCurrency(
                results.details.abattementForfaitaire ??
                  results.details.chargesDeduites ??
                  0,
              )}
            </span>
          </div>
        </div>

        <Separator />

        {/* Taxable profit */}
        <div className="bg-primary/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium">{t("results.taxableProfit")}</span>
              <p className="text-muted-foreground text-xs">
                {t("results.taxableProfitHint")}
              </p>
            </div>
            <span className="font-mono text-lg font-bold">
              {formatCurrency(results.beneficeImposable)}
            </span>
          </div>
        </div>

        <Separator className="bg-muted/50 h-2" />

        {/* Social contributions */}
        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {t("results.socialContributions")}
              </span>
              <Badge variant="secondary" className="text-xs">
                {formatPercentage(results.tauxCotisations)}{" "}
                {results.baseCotisations === "ca"
                  ? t("results.ofTurnover")
                  : t("results.ofProfit")}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2 text-sm">
                <Minus className="h-4 w-4" />
                {t("results.estimatedAmount")}
              </span>
              <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
                - {formatCurrency(results.cotisationsSociales)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-muted/50 h-2" />

        {/* Final result */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-6 dark:from-green-950/30 dark:to-emerald-950/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-lg font-semibold">
                {t("results.availableIncome")}
              </span>
              <p className="text-muted-foreground text-xs">
                {t("results.beforeIncomeTax")}
              </p>
            </div>
            <span className="font-mono text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(results.revenuAvantIR)}
            </span>
          </div>
        </div>

        {/* Info alert */}
        <div className="border-t px-6 py-4">
          <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              {t("results.incomeTaxNote", {
                amount: formatCurrency(results.beneficeImposable),
              })}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
