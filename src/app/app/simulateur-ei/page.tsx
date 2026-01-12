"use client";

import { Building2, ChartColumn, RefreshCw, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulateurEI } from "@/hooks/useSimulateurEI";

const SHOW_FOOTER = false;

type SimulationStep = "configuration" | "simulation" | "results";

export default function SimulateurEIPage() {
  const t = useTranslations("SimulateurEI");
  const [currentStep, setCurrentStep] =
    useState<SimulationStep>("configuration");
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

  const handleReset = () => {
    reset();
    setCurrentStep("configuration");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Step 1: Configuration */}
      {currentStep === "configuration" && (
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

          <div>
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
        </Tabs>
      )}

      {/* Step 2: Simulation */}
      {currentStep === "simulation" && (
        <div>
          <SimulatorForm
            turnover={turnover}
            expenses={expenses}
            taxRegime={config.taxRegime}
            socialRegime={config.socialRegime}
            onTurnoverChange={setTurnover}
            onExpensesChange={setExpenses}
          />

          {/* Threshold Alerts */}
          {alerts.length > 0 && (
            <div className="mt-6">
              <ThresholdAlerts alerts={alerts} />
            </div>
          )}
        </div>
      )}

      {/* Step 3: Results */}
      {currentStep === "results" && (
        <ResultsDisplay results={results} turnover={turnover} />
      )}

      {/* Fixed Navigation Footer */}
      {SHOW_FOOTER && (
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur md:left-[var(--sidebar-width)]">
          <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3">
            {/* Reset button on the left */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="h-9 w-9 p-0"
              aria-label={t("page.reset")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Navigation buttons centered on the right */}
            <div className="flex flex-grow items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setCurrentStep("configuration")}
                className={`flex flex-col gap-1 ${currentStep === "configuration" ? "bg-accent" : ""}`}
              >
                <Building2 className="h-5 w-5" />
                <span className="text-xs">{t("navigation.company")}</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setCurrentStep("simulation")}
                className={`flex flex-col gap-1 ${currentStep === "simulation" ? "bg-accent" : ""}`}
              >
                <Wallet className="h-5 w-5" />
                <span className="text-xs">{t("navigation.turnover")}</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setCurrentStep("results")}
                className={`flex flex-col gap-1 ${currentStep === "results" ? "bg-accent" : ""}`}
              >
                <ChartColumn className="h-5 w-5" />
                <span className="text-xs">{t("navigation.results")}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
