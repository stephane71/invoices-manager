"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { FileText, Mail, Package, Users } from "lucide-react";

export function SidebarMenuLinks() {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();
  const t = useTranslations("Nav");

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
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/app/invoices")}
            onClick={handleItemClick}
          >
            <Link href="/app/invoices">
              <FileText />
              <span>{t("invoices")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/app/clients")}
            onClick={handleItemClick}
          >
            <Link href="/app/clients">
              <Users />
              <span>{t("clients")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/app/products")}
            onClick={handleItemClick}
          >
            <Link href="/app/products">
              <Package />
              <span>{t("products")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <div className="mt-auto mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/app/contact")}
              onClick={handleItemClick}
            >
              <Link href="/app/contact">
                <Mail />
                <span>{t("contact")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </>
  );
}
