import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IbanCard } from "@/components/invoices/iban/IbanCard";
import { IbanFieldGroup } from "@/components/invoices/iban/IbanFieldGroup";
import { IbanBicForm, ibanBicSchema } from "@/components/invoices/iban/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";

interface IbanProps {
  iban?: string;
  bic?: string;
  onChange: (data: IbanBicForm) => void;
  onDelete: () => void;
}

export const Iban = ({
  iban = "",
  bic = "",
  onChange,
  onDelete,
}: IbanProps) => {
  const t = useTranslations("Profile");

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IbanBicForm>({
    resolver: zodResolver(ibanBicSchema),
    defaultValues: {
      paymentIban: iban,
      paymentBic: bic,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: IbanBicForm) => {
    setError(null);

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

      setIsEditing(false);
      onChange({ paymentIban: data.paymentIban, paymentBic: data.paymentBic });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error.unknown"));
    }
  };

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <IbanFieldGroup
              control={control}
              isSubmitting={isSubmitting}
              onCancel={() => setIsEditing(false)}
            />
            {error && <FieldError className="pt-2">{error}</FieldError>}
          </form>
        ) : (
          <IbanCard
            iban={iban}
            onClickEdit={() => setIsEditing(true)}
            onClickDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
};
