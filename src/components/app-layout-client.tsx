"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { SidebarMenuLinks } from "@/components/sidebar-menu-links";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const AppLayoutClient = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider
      defaultOpen={true}
      open={isMobile ? undefined : true}
      onOpenChange={isMobile ? undefined : () => {}}
    >
      <Sidebar>
        <SidebarHeader className="flex h-16 justify-center border-b p-0 px-2">
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
};
