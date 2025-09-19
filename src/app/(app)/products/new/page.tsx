"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "";

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "" as string | null,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    setLoading(true);
    const res = await fetch(`/api/products`, {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/products");
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Nouveau Produit</h1>
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
          min={0}
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
        <Button onClick={save} disabled={loading || uploading}>
          {loading
            ? "Enregistrement…"
            : uploading
              ? "Téléversement…"
              : "Créer le produit"}
        </Button>
      </div>
    </div>
  );
}
