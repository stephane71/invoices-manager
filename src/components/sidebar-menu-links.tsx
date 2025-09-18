"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function SidebarMenuLinks() {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();

  const isActive = (href: string) => {
    if (!pathname) {
      return false;
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleItemClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/invoices")}
          onClick={handleItemClick}
        >
          <Link href="/invoices">Invoices</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/clients")}
          onClick={handleItemClick}
        >
          <Link href="/clients">Clients</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/products")}
          onClick={handleItemClick}
        >
          <Link href="/products">Products</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
