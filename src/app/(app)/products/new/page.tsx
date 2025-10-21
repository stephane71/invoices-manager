"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PriceInput } from "@/components/ui/price-input";
import { useProductImageUpload } from "@/hooks/useProductImageUpload";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "" as string | null,
  });
  const { uploading, onSelectImage } = useProductImageUpload((url) =>
    setForm((f) => ({ ...f, image_url: url })),
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Products");
  const c = useTranslations("Common");

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
      <h1 className="text-xl font-semibold">{t("new.title")}</h1>
      <div className="grid gap-2">
        <label className="text-sm">{t("new.form.name")}</label>
        <input
          className="h-10 rounded-md border px-3 bg-background"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">{t("new.form.description")}</label>
        <textarea
          className="min-h-20 rounded-md border px-3 py-2 bg-background"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">{t("new.form.price")}</label>
        <PriceInput
          value={form.price}
          onChange={(cents) => setForm({ ...form, price: cents })}
          placeholder="0,00"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">{t("new.form.image")}</label>
        <input
          type="file"
          accept="image/*"
          className="h-10 rounded-md border bg-background file:mr-3 file:py-2 file:px-3"
          onChange={(e) => onSelectImage(e.target.files?.[0])}
          disabled={uploading}
        />
        {form.image_url ? (
          <Image
            src={form.image_url}
            alt={c("preview")}
            className="h-16 w-16 object-cover rounded"
            width={64}
            height={64}
          />
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={loading || uploading}>
          {loading
            ? c("saving")
            : uploading
              ? c("uploading")
              : t("new.createButton")}
        </Button>
      </div>
    </div>
  );
}
