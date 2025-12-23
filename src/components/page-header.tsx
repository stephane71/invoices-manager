"use client";

import { User } from "@supabase/auth-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/queries/useProfile";
import { APP_PREFIX } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPageHeaderTitle } from "@/utils/getPageHeaderTitle";

export function PageHeader() {
  const pathname = usePathname();
  const t = useTranslations();

  const [initial, setInitial] = useState<string>("?");

  const { data: profile } = useProfile();

  useEffect(() => {
    const loadInitial = async () => {
      try {
        let source = "";

        // Prefer the profile's full_name
        if (profile?.full_name) {
          source = profile.full_name;
        } else {
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
    };

    loadInitial();
  }, [profile]);

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
