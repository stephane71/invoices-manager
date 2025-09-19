"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "" as string | null,
  });
  const [uploading, setUploading] = useState(false);
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
        image_url: d.image_url || null,
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function onSelectImage(file?: File | null) {
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from(BUCKET_URL)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "image/jpeg",
        });
      if (error) {
        throw error;
      }
      const { data: pub } = supabase.storage
        .from(BUCKET_URL)
        .getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: pub.publicUrl }));
    } catch (e) {
      console.error(e);
      alert("Erreur lors du téléversement de l'image");
    } finally {
      setUploading(false);
    }
  }

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
      <h1 className="text-xl font-semibold">Éditer un produit</h1>
      <div className="grid gap-2">
        <label className="text-sm">Nom</label>
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
        <label className="text-sm">Prix</label>
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
      <div className="grid gap-2">
        <label className="text-sm">Image</label>
        <input
          type="file"
          accept="image/*"
          className="h-10 rounded-md border bg-background file:mr-3 file:py-2 file:px-3"
          onChange={(e) => onSelectImage(e.target.files?.[0])}
          disabled={uploading}
        />
        {form.image_url ? (
          <img
            src={form.image_url}
            alt="Preview"
            className="h-16 w-16 object-cover rounded"
          />
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={uploading}>
          Enregistrer
        </Button>
        <Button variant="destructive" onClick={remove}>
          Supprimer
        </Button>
      </div>
    </div>
  );
}
