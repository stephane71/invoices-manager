import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductForm, productFormSchema } from "@/components/products/products";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";

export type UseProductFormProps = {
  id: string;
};

export const useProductForm = ({ id }: UseProductFormProps) => {
  const t = useTranslations("Products");
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  const [error, setError] = useState("");
  const { reset, setError: setFieldError } = form;

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
    });

    return () => {
      active = false;
    };
  }, [id, reset]);

  const onSubmit = async (data: ProductForm) => {
    setError("");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
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
          setError(responseData.error || t("edit.error.saveFail"));
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("edit.error.saveFail"));
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
