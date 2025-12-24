"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TaxCalculatorProps = {
  title?: string;
  description?: string;
};

export const TaxCalculator = ({
  title = "Calculateur de Régime Fiscal",
  description = "Comparez le micro-BNC et le régime réel pour votre situation",
}: TaxCalculatorProps) => {
  const [revenue, setRevenue] = useState<number>(60000);
  const [realExpenses, setRealExpenses] = useState<number>(15000);

  const microBNCAbattement = 0.34;
  const microBNCTaxableIncome = revenue * (1 - microBNCAbattement);
  const realRegimeTaxableIncome = revenue - realExpenses;
  const difference = microBNCTaxableIncome - realRegimeTaxableIncome;
  const bestRegime = difference < 0 ? "Micro-BNC" : "Régime Réel";

  return (
    <Card className="my-6 space-y-6 p-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="revenue">Recettes annuelles (€)</FieldLabel>
          <Input
            id="revenue"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            min={0}
            step={1000}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="expenses">Frais réels (€)</FieldLabel>
          <Input
            id="expenses"
            type="number"
            value={realExpenses}
            onChange={(e) => setRealExpenses(Number(e.target.value))}
            min={0}
            step={1000}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Micro-BNC (abattement 34%)
          </div>
          <div className="text-2xl font-bold">
            {microBNCTaxableIncome.toLocaleString("fr-FR")} €
          </div>
          <div className="text-muted-foreground text-xs">Base imposable</div>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Régime Réel (frais réels)
          </div>
          <div className="text-2xl font-bold">
            {realRegimeTaxableIncome.toLocaleString("fr-FR")} €
          </div>
          <div className="text-muted-foreground text-xs">Base imposable</div>
        </div>
      </div>

      <div className="bg-primary/10 rounded-lg p-4 text-center">
        <p className="mb-2 text-sm font-medium">Meilleur régime pour vous :</p>
        <p className="text-primary text-xl font-bold">{bestRegime}</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Économie potentielle : {Math.abs(difference).toLocaleString("fr-FR")}{" "}
          €
        </p>
      </div>
    </Card>
  );
};
