"use client";

import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  HelpCircle,
  Info,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface CharacteristicItem {
  icon?: React.ReactNode;
  labelKey: string;
  valueKey?: string;
  value?: string | string[];
  tooltipKey?: string;
}

export interface CharacteristicSection {
  titleKey: string;
  icon?: React.ReactNode;
  items: CharacteristicItem[];
  defaultOpen?: boolean;
}

interface RegimeCharacteristicsProps {
  sections: CharacteristicSection[];
  className?: string;
}

const CharacteristicIcon = ({
  type,
}: {
  type:
    | "threshold"
    | "calculation"
    | "accounting"
    | "declaration"
    | "options"
    | "protection"
    | "info";
}) => {
  const iconClasses = "h-4 w-4";
  switch (type) {
    case "threshold":
      return <Calculator className={iconClasses} />;
    case "calculation":
      return <Calculator className={iconClasses} />;
    case "accounting":
      return <BookOpen className={iconClasses} />;
    case "declaration":
      return <FileText className={iconClasses} />;
    case "options":
      return <CheckCircle2 className={iconClasses} />;
    case "protection":
      return <Shield className={iconClasses} />;
    default:
      return <Info className={iconClasses} />;
  }
};

const CharacteristicSectionComponent = ({
  section,
  t,
}: {
  section: CharacteristicSection;
  t: (key: string) => string;
}) => {
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="hover:bg-muted/50 flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors">
        <div className="flex items-center gap-2">
          {section.icon && (
            <span className="text-muted-foreground">{section.icon}</span>
          )}
          <span className="text-sm font-medium">{t(section.titleKey)}</span>
        </div>
        <ChevronDown
          className={cn(
            "text-muted-foreground h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        <div className="space-y-2 pt-2">
          {section.items.map((item, index) => (
            <div
              key={index}
              className="border-muted flex items-start gap-2 border-l-2 py-1 pl-3"
            >
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-xs font-medium">
                    {t(item.labelKey)}
                  </span>
                  {item.tooltipKey && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="text-muted-foreground h-3 w-3 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">{t(item.tooltipKey)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                {item.valueKey && (
                  <p className="text-foreground text-sm">{t(item.valueKey)}</p>
                )}
                {item.value && (
                  <>
                    {Array.isArray(item.value) ? (
                      <ul className="text-foreground list-inside list-disc space-y-0.5 text-sm">
                        {item.value.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-foreground text-sm">{item.value}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const RegimeCharacteristics = ({
  sections,
  className,
}: RegimeCharacteristicsProps) => {
  const t = useTranslations("SimulateurEI");

  if (sections.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-muted/20 mt-4 space-y-1 rounded-lg border p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <Clock className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t("characteristics.title")}
        </span>
      </div>
      {sections.map((section, index) => (
        <CharacteristicSectionComponent key={index} section={section} t={t} />
      ))}
    </div>
  );
};

export { CharacteristicIcon };
