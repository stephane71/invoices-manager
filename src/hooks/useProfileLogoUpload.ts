"use client";

import { useCallback, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import slugify from "slugify";

// Dedicated hook for uploading profile logos to the `profile_logos` bucket.
// Mirrors the behavior used for product image uploads.
const BUCKET = "profile_logos";

export function useProfileLogoUpload(onUploaded: (url: string) => void) {
  const [uploading, setUploading] = useState(false);

  const onSelectImage = useCallback(
    async (file?: File | null) => {
      if (!file) {
        return;
      }

      setUploading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        // Keep behavior consistent with product images: flat key with random uuid + original name
        const path = `${crypto.randomUUID()}-${slugify(file.name, { remove: /[*+~.()'"!:@]/g })}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type || "image/jpeg",
          });
        if (error) {
          throw error;
        }

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        onUploaded(pub.publicUrl);
      } catch (e) {
        console.error(e);
        alert("Erreur lors du téléversement de l'image du logo");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  return { uploading, onSelectImage } as const;
}
