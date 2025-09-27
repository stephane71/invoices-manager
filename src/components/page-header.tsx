"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PageHeader() {
  const [initial, setInitial] = useState<string>("?");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const fullName = (user?.user_metadata as any)?.full_name as
        | string
        | undefined;
      const source = fullName || user?.email || "?";
      const letter = source?.trim()?.charAt(0)?.toUpperCase() || "?";
      setInitial(letter);
    });
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
