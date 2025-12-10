"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileValidationResult } from "@/lib/validation";

export type ProfileCompletenessAlertProps = {
  validation: ProfileValidationResult;
  className?: string;
};

/**
 * Alert component that displays profile completeness status.
 * Shows missing required fields and warnings for recommended fields.
 * Provides a link to the profile page for quick completion.
 */
export const ProfileCompletenessAlert = ({
  validation,
  className,
}: ProfileCompletenessAlertProps) => {
  const t = useTranslations("Profile");

  if (validation.isComplete) {
    return null;
  }

  const missingFieldsText = validation.missingFields
    .map((field) => t(`fields.${field}`))
    .join(", ");

  const warningsText =
    validation.warnings.length > 0
      ? validation.warnings.map((field) => t(`fields.${field}`)).join(", ")
      : null;

  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          {t("completeness.incompleteTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-red-700">
          {t("completeness.incompleteDescription")}
        </p>
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-red-800">
            {t("completeness.missingFields")}:{" "}
            <span className="font-normal text-red-700">{missingFieldsText}</span>
          </p>
          {warningsText && (
            <p className="text-red-600">
              {t("completeness.recommendedFields")}:{" "}
              <span className="font-normal">{warningsText}</span>
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/profil">{t("completeness.completeProfile")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
