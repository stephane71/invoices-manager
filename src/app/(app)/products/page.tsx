"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ProductFieldGroup } from "@/components/products/ProductFieldGroup";
import { ProductListItem } from "@/components/products/ProductListItem";
import { ProductListItemSkeleton } from "@/components/products/ProductListItemSkeleton";
import { ProductsEmptyState } from "@/components/products/ProductsEmptyState";
import { useProductForm } from "@/components/products/useProductForm";
import { Button } from "@/components/ui/button";
import { SheetItem } from "@/components/ui/item/SheetItem";
import type { Product } from "@/types/models";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const { form, onSubmit, onRemove, error, imageUrl, onSelectImage } =
    useProductForm({
      id: selectedId ?? "",
      onDeleteSuccess: () => {
        router.push("/products");
      },
    });

  const handleCloseSheet = () => {
    router.push("/products");
  };

  useEffect(() => {
    if (selectedId) {
      return;
    }

    void loadProducts();
  }, [selectedId]);

  return (
    <>
      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ProductListItemSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <ProductsEmptyState />
        ) : (
          products.map((p) => (
            <ProductListItem
              key={p.id}
              name={p.name}
              price={p.price}
              id={p.id}
              imageUrl={p.image_url || ""}
            />
          ))
        )}
      </div>

      <Button
        asChild
        size="lg"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Link href="/products/new" aria-label={t("list.newButton")}>
          <Plus className="size-6" />
        </Link>
      </Button>

      <SheetItem
        title={t("edit.title")}
        open={!!selectedId}
        onOpenChange={handleCloseSheet}
        content={
          selectedId && (
            <form
              id={`product-form-${selectedId}`}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <ProductFieldGroup
                imageUrl={imageUrl}
                onSelectImage={onSelectImage}
                control={form.control}
                disabled={form.formState.isSubmitting}
              />
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </form>
          )
        }
        footer={
          <div className="flex w-full justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={onRemove}
              disabled={form.formState.isSubmitting}
            >
              {tCommon("delete")}
            </Button>
            <Button
              type="submit"
              form={`product-form-${selectedId}`}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? tCommon("saving")
                : tCommon("save")}
            </Button>
          </div>
        }
      />
    </>
  );
}
