import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductForm, productFormSchema } from "@/components/products/products";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";
import { useProduct } from "@/hooks/queries/useProduct";
import { useUpdateProduct } from "@/hooks/mutations/useUpdateProduct";
import { ApiError } from "@/lib/api-client";
import { APP_PREFIX } from "@/lib/constants";

export type UseProductFormProps = {
  id: string;
};

export const useProductForm = ({ id }: UseProductFormProps) => {
  const t = useTranslations("Products");
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { uploading, onSelectImage } = useProductImageUpload((url) =>
    setImageUrl(url),
  );

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const { reset, setError: setFieldError } = form;

  // Fetch product data using React Query
  const { data: product } = useProduct(id, {
    enabled: !!id, // Only fetch if id exists
  });

  // Update mutation with automatic cache invalidation
  const updateProduct = useUpdateProduct(id, {
    onSuccess: () => {
      // Navigate back to products list after successful update
      router.push(`/${APP_PREFIX}/products`);
    },
    onError: (error: Error) => {
      // Handle API errors - check if it's an ApiError with fields
      const apiError = error as ApiError;
      if (apiError.fields) {
        Object.entries(apiError.fields).forEach(([key, message]) => {
          setFieldError(key as keyof ProductForm, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        setError(error.message || t("edit.error.saveFail"));
      }
    },
  });

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
      });
      setImageUrl(product.image_url || null);
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductForm) => {
    setError("");

    try {
      await updateProduct.mutateAsync({
        ...data,
        image_url: imageUrl,
      });
    } catch (e: unknown) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || t("edit.error.saveFail"));
      }
    }
  };

  return {
    form,
    onSubmit,
    error,
    uploading,
    imageUrl,
    onSelectImage,
  };
};
