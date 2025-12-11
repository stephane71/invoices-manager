import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ReactNode, useRef } from "react";
import { Control, Controller } from "react-hook-form";
import { ProductForm } from "@/components/products/products";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
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
              className="bg-background min-h-20 rounded-md border px-3 py-2"
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
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
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              placeholder="0,00"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>{t("new.form.image")}</FieldLabel>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onSelectImage(e.target.files?.[0])}
          disabled={disabled}
        />
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={c("preview")}
              className="h-32 w-32 rounded object-cover"
              width={128}
              height={128}
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded bg-gray-200 text-sm text-gray-500">
              img
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t("new.form.updateImage")}
              disabled={disabled}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {imageUrl && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => onSelectImage(null)}
                aria-label={t("new.form.deleteImage")}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Field>

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
};
