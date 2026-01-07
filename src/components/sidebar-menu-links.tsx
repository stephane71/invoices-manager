"use client";

import { Calculator, FileText, Mail, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { APP_PREFIX } from "@/lib/constants";

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
            isActive={isActive(`/${APP_PREFIX}/invoices`)}
            onClick={handleItemClick}
          >
            <Link href={`/${APP_PREFIX}/invoices`}>
              <FileText />
              <span>{t("invoices")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive(`/${APP_PREFIX}/clients`)}
            onClick={handleItemClick}
          >
            <Link href={`/${APP_PREFIX}/clients`}>
              <Users />
              <span>{t("clients")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive(`/${APP_PREFIX}/products`)}
            onClick={handleItemClick}
          >
            <Link href={`/${APP_PREFIX}/products`}>
              <Package />
              <span>{t("products")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive(`/${APP_PREFIX}/simulateur-ei`)}
            onClick={handleItemClick}
          >
            <Link href={`/${APP_PREFIX}/simulateur-ei`}>
              <Calculator />
              <span>{t("simulateur")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <div className="mt-auto mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(`/${APP_PREFIX}/contact`)}
              onClick={handleItemClick}
            >
              <Link href={`/${APP_PREFIX}/contact`}>
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
