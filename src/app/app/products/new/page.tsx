"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ProductFieldGroup } from "@/components/products/ProductFieldGroup";
import { ProductForm, productFormSchema } from "@/components/products/products";
import { Button } from "@/components/ui/button";
import { useCreateProduct } from "@/hooks/mutations/useCreateProduct";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";
import { ApiError } from "@/lib/api-client";
import { APP_PREFIX } from "@/lib/constants";

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

  const createProduct = useCreateProduct({
    onSuccess: () => {
      router.push(`/${APP_PREFIX}/products`);
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      if (apiError.fields) {
        Object.entries(apiError.fields).forEach(([key, message]) => {
          setFieldError(key as keyof ProductForm, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        setError(apiError.message || t("new.error.createFail"));
      }
    },
  });

  const onSubmit = async (data: ProductForm) => {
    setError("");

    try {
      await createProduct.mutateAsync({
        ...data,
        image_url: imageUrl,
      });
    } catch (e: unknown) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || t("new.error.createFail"));
      }
    }
  };

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
