"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { ProductListItem } from "@/components/products/ProductListItem";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Product } from "@/types/models";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleCloseSheet = () => {
    router.push("/products");
    // Reload products after closing sheet to reflect any changes
    const loadProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    loadProducts();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <ProductListItem
            key={p.id}
            name={p.name}
            price={p.price}
            id={p.id}
            imageUrl={p.image_url || ""}
          />
        ))}
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

      <Sheet open={!!selectedId} onOpenChange={handleCloseSheet}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-2xl"
        >
          <SheetHeader>
            <SheetTitle>{t("edit.title")}</SheetTitle>
          </SheetHeader>
          {selectedId && (
            <div className="mt-4">
              <ProductDetailView id={selectedId} onClose={handleCloseSheet} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
