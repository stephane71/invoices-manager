import { Control, Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import Image from "next/image";
import { ReactNode } from "react";
import { ProductForm } from "@/components/products/products";
import { useTranslations } from "next-intl";

interface ProductFieldGroupProps {
  control: Control<ProductForm>;
  disabled?: boolean;
  children?: ReactNode;
  imageUrl: string | null;
  onSelectImage: (file?: File | null) => void;
}

export const ProductFieldGroup = ({
  control,
  disabled,
  children,
  imageUrl,
  onSelectImage,
}: ProductFieldGroupProps) => {
  const t = useTranslations("Products");
  const c = useTranslations("Common");

  return (
    <FieldGroup>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("new.form.name")}</FieldLabel>
            <Input
              {...field}
              id={field.name}
              icon="Package"
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.form.description")}
            </FieldLabel>
            <textarea
              {...field}
              id={field.name}
              className="min-h-20 rounded-md border px-3 py-2 bg-background"
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("new.form.price")}</FieldLabel>
            <PriceInput
              value={field.value}
              onChange={field.onChange}
              placeholder="0,00"
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>{t("new.form.image")}</FieldLabel>
        <input
          type="file"
          accept="image/*"
          className="h-10 rounded-md border bg-background file:mr-3 file:py-2 file:px-3"
          onChange={(e) => onSelectImage(e.target.files?.[0])}
          disabled={disabled}
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={c("preview")}
            className="h-16 w-16 object-cover rounded"
            width={64}
            height={64}
          />
        )}
      </Field>

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
};
