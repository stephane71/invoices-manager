import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { APP_LOCALE } from "@/lib/constants";
import { listProducts } from "@/lib/db";
import { centsToCurrencyString } from "@/lib/utils";

export default async function ProductsPage() {
  const products = await listProducts();

  const t = await getTranslations("Products");
  const c = await getTranslations("Common");

  return (
    <>
      <ul className="divide-y">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/products/${p.id}`}
              className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    className="h-10 w-10 rounded object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                    img
                  </div>
                )}
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {p.price != null
                      ? `${centsToCurrencyString(p.price, "EUR", APP_LOCALE)} ${c("vatExcluded")}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <span className="text-sm text-blue-600 hover:text-blue-800">
                {c("view")}
              </span>
            </Link>
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
    </>
  );
}
