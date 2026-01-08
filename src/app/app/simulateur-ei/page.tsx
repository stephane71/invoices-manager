"use client";

import { Calculator, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  BenefitTypeTab,
  ResultsDisplay,
  SimulatorForm,
  SocialRegimeTab,
  TaxRegimeTab,
  ThresholdAlerts,
  VatRegimeTab,
} from "@/components/simulateur-ei";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    alerts,
    reset,
  } = useSimulateurEI();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="mb-6">
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

      {/* Configuration Tabs - Sticky Header */}
      <Tabs defaultValue="benefitType" className="w-full">
        <div className="sticky top-16 z-10 w-full bg-white py-2">
          <TabsList className="w-full">
            <TabsTrigger value="benefitType">
              {t("tabs.benefitType")}
            </TabsTrigger>
            <TabsTrigger value="taxRegime">{t("tabs.taxRegime")}</TabsTrigger>
            <TabsTrigger value="socialRegime">
              {t("tabs.socialRegime")}
            </TabsTrigger>
            <TabsTrigger value="vatRegime">{t("tabs.vatRegime")}</TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Configuration Tabs */}
          <div className="lg:col-span-5">
            <TabsContent value="benefitType" className="mt-0">
              <BenefitTypeTab config={config} onConfigChange={setConfig} />
            </TabsContent>

            <TabsContent value="taxRegime" className="mt-0">
              <TaxRegimeTab config={config} onConfigChange={setConfig} />
            </TabsContent>

            <TabsContent value="socialRegime" className="mt-0">
              <SocialRegimeTab config={config} onConfigChange={setConfig} />
            </TabsContent>

            <TabsContent value="vatRegime" className="mt-0">
              <VatRegimeTab config={config} onConfigChange={setConfig} />
            </TabsContent>
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
                  socialRegime={config.socialRegime}
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
      </Tabs>

      {/* Footer disclaimer */}
      <Separator className="my-8" />
      <div className="text-muted-foreground mx-auto max-w-2xl text-center text-sm">
        <p>{t("page.disclaimer")}</p>
        <p className="mt-2 text-xs">{t("page.dataYear")}</p>
      </div>
    </div>
  );
}
