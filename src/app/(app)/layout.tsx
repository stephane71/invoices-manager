import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import { SidebarMenuLinks } from "@/components/sidebar-menu-links";
import { Separator } from "@/components/ui/separator";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <span>Facture Manager</span>
          <Separator />
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenuLinks />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <PageHeader />
        <div className="p-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
