"use client";

import { User } from "@supabase/auth-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_PREFIX } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPageHeaderTitle } from "@/utils/getPageHeaderTitle";

export function PageHeader() {
  const pathname = usePathname();
  const t = useTranslations();

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

  const headerTitle = getPageHeaderTitle(pathname, t);

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      {headerTitle && <h1 className="text-xl font-semibold">{headerTitle}</h1>}
      <Link
        href={`/${APP_PREFIX}/profil`}
        className="bg-primary text-primary-foreground inline-flex size-9 items-center justify-center rounded-full font-semibold"
        aria-label="Ouvrir mon profil"
        title="Mon profil"
      >
        {initial}
      </Link>
    </header>
  );
}
