"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ConsequenceRule, ConsequenceType } from "@/lib/simulateur-ei";
import { cn } from "@/lib/utils";

interface ConsequencesPanelProps {
  consequences: ConsequenceRule[];
}

const typeConfig: Record<
  ConsequenceType,
  {
    icon: LucideIcon;
    borderColor: string;
    iconColor: string;
    bgColor: string;
  }
> = {
  info: {
    icon: Info,
    borderColor: "border-l-blue-500",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  success: {
    icon: CheckCircle2,
    borderColor: "border-l-green-500",
    iconColor: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  error: {
    icon: AlertCircle,
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
};

export const ConsequencesPanel = ({ consequences }: ConsequencesPanelProps) => {
  const t = useTranslations("SimulateurEI");

  if (consequences.length === 0) {
    return null;
  }

  // Group consequences by type for better organization
  const groupedConsequences = consequences.reduce(
    (acc, consequence) => {
      const type = consequence.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(consequence);
      return acc;
    },
    {} as Record<ConsequenceType, ConsequenceRule[]>,
  );

  // Order: success, info, warning, error
  const orderedTypes: ConsequenceType[] = [
    "success",
    "info",
    "warning",
    "error",
  ];

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg">{t("consequences.title")}</CardTitle>
        <CardDescription>{t("consequences.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        {orderedTypes.map((type) => {
          const typeConsequences = groupedConsequences[type];
          if (!typeConsequences || typeConsequences.length === 0) {
            return null;
          }

          return typeConsequences.map((consequence) => {
            const config = typeConfig[consequence.type];
            const Icon = config.icon;

            return (
              <div
                key={consequence.id}
                className={cn(
                  "rounded-lg border-l-4 p-4",
                  config.borderColor,
                  config.bgColor,
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)}
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">
                      {t(consequence.titleKey)}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(consequence.descriptionKey)}
                    </p>
                  </div>
                </div>
              </div>
            );
          });
        })}
      </CardContent>
    </Card>
  );
};
