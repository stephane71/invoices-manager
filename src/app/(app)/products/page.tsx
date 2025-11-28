"use client";

import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";
import type { Product } from "@/types/models";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get("id");
  const t = useTranslations("Products");
  const c = useTranslations("Common");

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleItemClick = (id: string) => {
    router.push(`/products?id=${id}`);
  };

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
      <ul className="divide-y">
        {products.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => handleItemClick(p.id)}
              className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100 w-full text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    className="h-10 w-10 rounded object-cover flex-shrink-0"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-500 flex-shrink-0">
                    img
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 mb-1 truncate">
                    {p.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {p.price != null
                      ? `${centsToCurrencyString(p.price, "EUR", APP_LOCALE)} ${c("vatExcluded")}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400 flex-shrink-0 ml-2" />
            </button>
          </li>
        ))}
      </ul>

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
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
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
