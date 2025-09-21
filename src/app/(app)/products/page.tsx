import Link from "next/link";
import { listProducts } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

async function ProductsList() {
  const products = await listProducts();
  const c = await getTranslations("Common");

  return (
    <ul className="divide-y">
      {products.map((p) => (
        <li key={p.id}>
          <Link
            href={`/products/${p.id}`}
            className="py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 rounded-lg px-2 -mx-2"
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
                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  img
                </div>
              )}
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${p.price?.toFixed(2)}
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
  );
}

export default async function ProductsPage() {
  const t = await getTranslations("Products");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <Link href="/products/new">
          <Button>{t("list.newButton")}</Button>
        </Link>
      </div>

      <ProductsList />
    </div>
  );
}
