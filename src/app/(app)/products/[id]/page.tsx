"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";
import Image from "next/image";
import { useTranslations } from "next-intl";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().int().nonnegative("Price must be positive"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { uploading, onSelectImage } = useProductImageUpload((url) =>
    setImageUrl(url)
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations("Products");
  const c = useTranslations("Common");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${id}`).then(async (r) => {
      const d = await r.json();
      if (!active) {
        return;
      }

      reset({
        name: d.name || "",
        description: d.description || "",
        price: d.price || 0,
      });
      setImageUrl(d.image_url || null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, reset]);

  async function onSubmit(data: ProductFormData) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...data,
        image_url: imageUrl,
      }),
    });
    if (res.ok) {
      router.push("/products");
    }
  }

  async function remove() {
    if (!confirm(t("confirm.delete"))) {
      return;
    }
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/products");
    }
  }

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("edit.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  disabled={isSubmitting || uploading}
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
                <FieldLabel htmlFor={field.name}>{t("new.form.description")}</FieldLabel>
                <textarea
                  {...field}
                  id={field.name}
                  className="min-h-20 rounded-md border px-3 py-2 bg-background"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting || uploading}
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
                  disabled={isSubmitting || uploading}
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
              disabled={uploading || isSubmitting}
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

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || uploading}>
              {c("save")}
            </Button>
            <Button type="button" variant="destructive" onClick={remove} disabled={isSubmitting}>
              {c("delete")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
