"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState({ name: "", description: "", price: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${id}`).then(async (r) => {
      const d = await r.json();
      if (!active) {
        return;
      }

      setForm({
        name: d.name || "",
        description: d.description || "",
        price: d.price || 0,
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function save() {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/products");
    }
  }

  async function remove() {
    if (!confirm("Delete this product?")) {
      return;
    }
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/products");
    }
  }

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Edit product</h1>
      <div className="grid gap-2">
        <label className="text-sm">Name</label>
        <input
          className="h-10 rounded-md border px-3 bg-background"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Description</label>
        <textarea
          className="min-h-20 rounded-md border px-3 py-2 bg-background"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Price</label>
        <input
          type="number"
          step="0.01"
          className="h-10 rounded-md border px-3 bg-background"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) || 0 })
          }
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={save}>Save</Button>
        <Button variant="destructive" onClick={remove}>
          Delete
        </Button>
      </div>
    </div>
  );
}
