import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductFieldGroup } from "@/components/products/ProductFieldGroup";
import { ProductForm, productFormSchema } from "@/components/products/products";
import { Button } from "@/components/ui/button";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";

export const ProductDetailView = ({
  id,
  onClose,
}: {
  id: string;
  onClose?: () => void;
}) => {
  const c = useTranslations("Common");
  const t = useTranslations("Products");
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
  const {
    control,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { isSubmitting },
  } = form;

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
        if (onClose) {
          onClose();
        } else {
          router.push("/products");
        }
        router.refresh();
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

  const remove = async () => {
    if (!confirm(t("confirm.delete"))) {
      return;
    }
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (onClose) {
        onClose();
      } else {
        router.push("/products");
      }
      router.refresh();
    }
  };

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("edit.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductFieldGroup
          imageUrl={imageUrl}
          onSelectImage={onSelectImage}
          control={control}
          disabled={isSubmitting || uploading}
        >
          <Button type="submit" disabled={isSubmitting || uploading}>
            {c("save")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={remove}
            disabled={isSubmitting}
          >
            {c("delete")}
          </Button>
        </ProductFieldGroup>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
};
