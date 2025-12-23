"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProductFieldGroup } from "@/components/products/ProductFieldGroup";
import { ProductListItem } from "@/components/products/ProductListItem";
import { ProductListItemSkeleton } from "@/components/products/ProductListItemSkeleton";
import { ProductsEmptyState } from "@/components/products/ProductsEmptyState";
import { useProductForm } from "@/components/products/useProductForm";
import { Button } from "@/components/ui/button";
import { SheetItem } from "@/components/ui/item/SheetItem";
import { useProducts } from "@/hooks/queries/useProducts";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const { data: products = [], isLoading } = useProducts({
    enabled: !selectedId,
  });

  const { form, onSubmit, error, imageUrl, onSelectImage } = useProductForm({
    id: selectedId ?? "",
  });

  const handleCloseSheet = () => {
    router.push("/app/products");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {isLoading ? (
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
        <Link href="/app/products/new" aria-label={t("list.newButton")}>
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
          <Button
            type="submit"
            form={`product-form-${selectedId}`}
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? tCommon("saving") : tCommon("save")}
          </Button>
        }
      />
    </>
  );
}
