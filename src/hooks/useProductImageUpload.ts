"use client";

import { useCallback, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "";

export function useProductImageUpload(
  onUploaded: (url: string | null) => void,
) {
  const [uploading, setUploading] = useState(false);

  const onSelectImage = useCallback(
    async (file?: File | null) => {
      if (!file) {
        onUploaded(null);
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
        onUploaded(pub.publicUrl);
      } catch (e) {
        console.error(e);
        alert("Erreur lors du téléversement de l'image");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  return { uploading, onSelectImage } as const;
}
