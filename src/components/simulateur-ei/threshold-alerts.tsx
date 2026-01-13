"use client";

import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ThresholdAlert } from "@/lib/simulateur-ei";
import { cn } from "@/lib/utils";

interface ThresholdAlertsProps {
  alerts: ThresholdAlert[];
}

const severityConfig = {
  info: {
    icon: Info,
    variant: "default" as const,
    className:
      "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    iconClassName: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    variant: "default" as const,
    className:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
    iconClassName: "text-amber-500",
  },
  error: {
    icon: AlertCircle,
    variant: "destructive" as const,
    className: "",
    iconClassName: "",
  },
};

export const ThresholdAlerts = ({ alerts }: ThresholdAlertsProps) => {
  const t = useTranslations("SimulateurEI");

  if (alerts.length === 0) {
    return null;
  }

  // Sort by severity: error first, then warning, then info
  const sortedAlerts = [...alerts].sort((a, b) => {
    const order = { error: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-3">
      {sortedAlerts.map((alert) => {
        const config = severityConfig[alert.severity];
        const Icon = config.icon;

        return (
          <Alert
            key={alert.id}
            variant={config.variant}
            className={cn(config.className)}
          >
            <Icon className={cn("h-4 w-4", config.iconClassName)} />
            <AlertTitle className="font-medium">
              {t(`alertTitles.${alert.severity}`)}
            </AlertTitle>
            <AlertDescription className="mt-1">
              {t(alert.messageKey)}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};
