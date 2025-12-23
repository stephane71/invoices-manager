import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IbanCard } from "@/components/invoices/iban/IbanCard";
import { IbanFieldGroup } from "@/components/invoices/iban/IbanFieldGroup";
import { IbanBicForm, ibanBicSchema } from "@/components/invoices/iban/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { useUpdateProfile } from "@/hooks/mutations/useUpdateProfile";
import { ApiError } from "@/lib/api-client";

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

  const updateProfile = useUpdateProfile({
    onSuccess: () => {
      setIsEditing(false);
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      setError(apiError.message || t("error.unknown"));
    },
  });

  const onSubmit = async (data: IbanBicForm) => {
    setError(null);

    try {
      await updateProfile.mutateAsync({
        payment_iban: data.paymentIban?.trim() || null,
        payment_bic: data.paymentBic?.trim() || null,
      });

      onChange({ paymentIban: data.paymentIban, paymentBic: data.paymentBic });
    } catch (e) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || t("error.unknown"));
      }
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
