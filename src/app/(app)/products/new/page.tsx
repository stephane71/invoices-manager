"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";
import { useTranslations } from "next-intl";
import { ProductForm, productFormSchema } from "@/components/products/products";
import { ProductFieldGroup } from "@/components/products/ProductFieldGroup";

export default function NewProductPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { uploading, onSelectImage } = useProductImageUpload((url) =>
    setImageUrl(url),
  );
  const router = useRouter();
  const t = useTranslations("Products");
  const c = useTranslations("Common");

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    setError: setFieldError,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: ProductForm) {
    setError("");

    try {
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          image_url: imageUrl,
        }),
      });

      if (res.ok) {
        router.push("/products");
      } else {
        const responseData = await res.json();

        if (responseData.fields) {
          Object.entries(responseData.fields).forEach(([key, message]) => {
            setFieldError(key as keyof ProductForm, {
              type: "server",
              message: message as string,
            });
          });
        } else {
          setError(responseData.error || t("new.error.createFail"));
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("new.error.createFail"));
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("new.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductFieldGroup
          imageUrl={imageUrl}
          onSelectImage={onSelectImage}
          control={control}
          disabled={isSubmitting || uploading}
        >
          <Button type="submit" disabled={isSubmitting || uploading}>
            {isSubmitting
              ? c("saving")
              : uploading
                ? c("uploading")
                : t("new.createButton")}
          </Button>
        </ProductFieldGroup>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
