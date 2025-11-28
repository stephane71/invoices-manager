import Image from "next/image";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { SidebarMenuLinks } from "@/components/sidebar-menu-links";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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
          <div className="flex items-center gap-3">
            <Image
              src="/Lemonora.svg"
              alt="Lemonora"
              width={40}
              height={40}
              className="shrink-0"
              priority
            />
            <span className="text-primary text-xl font-bold">Lemonora</span>
          </div>
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
