"use client";

import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InfoBoxVariant = "info" | "warning" | "tip" | "danger";

type InfoBoxProps = {
  children: ReactNode;
  variant?: InfoBoxVariant;
  title?: string;
};

const variantConfig: Record<
  InfoBoxVariant,
  {
    containerClass: string;
    iconClass: string;
    icon: typeof Info;
  }
> = {
  info: {
    containerClass:
      "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20",
    iconClass: "text-blue-600 dark:text-blue-400",
    icon: Info,
  },
  warning: {
    containerClass:
      "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20",
    iconClass: "text-yellow-600 dark:text-yellow-400",
    icon: AlertCircle,
  },
  tip: {
    containerClass:
      "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20",
    iconClass: "text-green-600 dark:text-green-400",
    icon: CheckCircle,
  },
  danger: {
    containerClass:
      "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
    iconClass: "text-red-600 dark:text-red-400",
    icon: XCircle,
  },
};

export const InfoBox = ({
  children,
  variant = "info",
  title,
}: InfoBoxProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn("my-6 rounded-lg border p-4", config.containerClass)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 size-5 shrink-0", config.iconClass)} />
        <div className="flex-1 space-y-2">
          {title && <p className="text-foreground font-semibold">{title}</p>}
          <div className="text-muted-foreground text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};
