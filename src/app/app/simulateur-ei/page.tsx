"use client";

import { Calculator, RefreshCw, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  ConfigurationForm,
  ConsequencesPanel,
  ResultsDisplay,
  SimulatorForm,
  ThresholdAlerts,
} from "@/components/simulateur-ei";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSimulateurEI } from "@/hooks/useSimulateurEI";

export default function SimulateurEIPage() {
  const t = useTranslations("SimulateurEI");
  const {
    config,
    setConfig,
    turnover,
    setTurnover,
    expenses,
    setExpenses,
    results,
    consequences,
    alerts,
    reset,
  } = useSimulateurEI();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Calming introduction */}
      <div className="mb-8">
        <div className="flex flex-col items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Calculator className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("page.title")}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {t("page.subtitle")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("page.reset")}
          </Button>
        </div>
      </div>

      {/* Reassurance banner */}
      <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-900 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-blue-500" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t("page.reassurance")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Configuration + Consequences */}
        <div className="space-y-8 lg:col-span-5">
          {/* Step 1: Configuration */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                  1
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {t("steps.configure")}
                </span>
              </div>
              <ConfigurationForm config={config} onConfigChange={setConfig} />
            </CardContent>
          </Card>

          {/* Consequences Panel */}
          {consequences.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                    i
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {t("steps.understand")}
                  </span>
                </div>
                <ConsequencesPanel consequences={consequences} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Simulation */}
        <div className="space-y-6 lg:col-span-7">
          {/* Step 2: Simulation Input */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                  2
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {t("steps.simulate")}
                </span>
              </div>
              <SimulatorForm
                turnover={turnover}
                expenses={expenses}
                taxRegime={config.taxRegime}
                onTurnoverChange={setTurnover}
                onExpensesChange={setExpenses}
              />
            </CardContent>
          </Card>

          {/* Threshold Alerts */}
          {alerts.length > 0 && <ThresholdAlerts alerts={alerts} />}

          {/* Results */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                3
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                {t("steps.results")}
              </span>
            </div>
            <ResultsDisplay results={results} turnover={turnover} />
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <Separator className="my-8" />
      <div className="text-muted-foreground mx-auto max-w-2xl text-center text-sm">
        <p>{t("page.disclaimer")}</p>
        <p className="mt-2 text-xs">{t("page.dataYear")}</p>
      </div>
    </div>
  );
}
