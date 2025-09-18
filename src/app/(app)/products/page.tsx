import Link from "next/link";
import { listProducts } from "@/lib/db";
import { Button } from "@/components/ui/button";

async function ProductsList() {
  const products = await listProducts();
  return (
    <ul className="divide-y">
      {products.map((p) => (
        <li key={p.id}>
          <Link
            href={`/products/${p.id}`}
            className="py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 rounded-lg px-2 -mx-2"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                ${p.price?.toFixed(2)}
              </p>
            </div>
            <span className="text-sm text-blue-600 hover:text-blue-800">
              View →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link href="/products/new">
          <Button size="sm">Add</Button>
        </Link>
      </div>

      <ProductsList />
    </div>
  );
}
