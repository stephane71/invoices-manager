import { Building2, User } from "lucide-react";
import { useTranslations } from "next-intl";

export type ClientTypeSelectorProps = {
  value: "person" | "company";
  onChange: (value: "person" | "company") => void;
};

export const ClientTypeSelector = ({
  value,
  onChange,
}: ClientTypeSelectorProps) => {
  const t = useTranslations("Clients");

  return (
    <div className="bg-muted relative inline-flex rounded-full p-1">
      {/* Sliding background indicator */}
      <div
        className={`bg-background absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full shadow-xs transition-transform duration-200 ease-in-out ${
          value === "company" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Person button */}
      <button
        type="button"
        onClick={() => onChange("person")}
        className={`relative z-10 flex grow items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
          value === "person"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className="size-4" />
        <span>{t("new.form.clientTypePerson")}</span>
      </button>

      {/* Company button */}
      <button
        type="button"
        onClick={() => onChange("company")}
        className={`relative z-10 flex grow items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
          value === "company"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Building2 className="size-4" />
        <span>{t("new.form.clientTypeCompany")}</span>
      </button>
    </div>
  );
};
