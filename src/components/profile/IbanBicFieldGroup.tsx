import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ibanBicSchema = z.object({
  paymentIban: z.string().optional().or(z.literal("")),
  paymentBic: z.string().optional().or(z.literal("")),
});

type IbanBicForm = z.infer<typeof ibanBicSchema>;

interface IbanBicFieldGroupProps {
  initialIban?: string | null;
  initialBic?: string | null;
  onSaveSuccess?: () => void;
}

export const IbanBicFieldGroup = ({
  initialIban = null,
  initialBic = null,
  onSaveSuccess,
}: IbanBicFieldGroupProps) => {
  const t = useTranslations("Profile");
  const c = useTranslations("Common");

  const hasInitialValues = Boolean(initialIban || initialBic);
  const [isEditing, setIsEditing] = useState(!hasInitialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<IbanBicForm>({
    resolver: zodResolver(ibanBicSchema),
    defaultValues: {
      paymentIban: initialIban || "",
      paymentBic: initialBic || "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: IbanBicForm) => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_iban: data.paymentIban?.trim() || null,
          payment_bic: data.paymentBic?.trim() || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: null }));
        throw new Error(json.error || t("error.save", { status: res.status }));
      }

      setSuccess(t("status.updated"));
      setIsEditing(false);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error.unknown"));
    }
  };

  const handleCancel = () => {
    reset({
      paymentIban: initialIban || "",
      paymentBic: initialBic || "",
    });
    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setError(null);
    setSuccess(null);
    setIsEditing(true);
  };

  // Read-only state
  if (!isEditing && hasInitialValues) {
    return (
      <div className="rounded-md border border-muted bg-muted/20 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-sm font-medium">{t("form.paymentSection")}</div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
          >
            {c("edit")}
          </Button>
        </div>

        {initialIban && (
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">IBAN:</span> {initialIban}
          </div>
        )}
        {initialBic && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">BIC:</span> {initialBic}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 mt-2" role="status">
            {success}
          </div>
        )}
      </div>
    );
  }

  // Editable state
  return (
    <div className="rounded-md border p-4">
      <div className="text-sm font-medium mb-4">{t("form.paymentSection")}</div>

      {error && (
        <div className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* IBAN */}
          <Controller
            name="paymentIban"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("form.paymentIban")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={t("form.paymentIbanPlaceholder")}
                  icon="CreditCard"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message || ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* BIC */}
          <Controller
            name="paymentBic"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("form.paymentBic")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={t("form.paymentBicPlaceholder")}
                  icon="Building"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message || ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          <p className="text-xs text-muted-foreground">
            {t("form.paymentHelp")}
          </p>

          <div className="flex gap-2 pt-2">
            {hasInitialValues && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {c("cancel")}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? c("saving") : c("save")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
