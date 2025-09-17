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
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = String(user.user_metadata.email);
  const [local, ...rest] = email.split("@");
  const domain = rest.join("@");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <span>
            {local}@<wbr />
            <span className="whitespace-nowrap">{domain}</span>
          </span>
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
