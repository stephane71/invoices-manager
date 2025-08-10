import Link from "next/link";
import { listProducts } from "@/lib/db";
import { Button } from "@/components/ui/button";

async function ProductsList() {
  const products = await listProducts();
  return (
    <ul className="divide-y">
      {products.map((p) => (
        <li key={p.id} className="py-3 flex items-center justify-between">
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-muted-foreground">
              ${p.price?.toFixed(2)}
            </p>
          </div>
          <Link className="text-sm underline" href={`/products/${p.id}`}>
            View
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
