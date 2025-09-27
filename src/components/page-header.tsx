"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/auth-js";

export function PageHeader() {
  const [initial, setInitial] = useState<string>("?");

  useEffect(() => {
    async function loadInitial() {
      try {
        // Prefer the profile's full_name over auth metadata
        const res = await fetch("/api/profile", { cache: "no-store" });
        let source = "";
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          source = json?.data?.full_name || "";
        }
        if (!source) {
          // Fallback to the authenticated user's email if profile/full_name is missing
          const supabase = createSupabaseBrowserClient();
          const { data } = await supabase.auth.getUser();
          const user = data.user as User | null;
          source = user?.email || "?";
        }
        const letter = source?.trim()?.charAt(0)?.toUpperCase() || "?";
        setInitial(letter);
      } catch {
        setInitial("?");
      }
    }
    loadInitial();
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Link
        href="/profil"
        className="ml-auto inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold"
        aria-label="Ouvrir mon profil"
        title="Mon profil"
      >
        {initial}
      </Link>
    </header>
  );
}
