import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppLayoutClient } from "@/components/app-layout-client";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <AppLayoutClient>{children}</AppLayoutClient>;
}
