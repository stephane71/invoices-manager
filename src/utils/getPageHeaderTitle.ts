import { APP_PREFIX } from "@/lib/constants";

export const getPageHeaderTitle = (
  pathname: string,
  t: (key: string) => string,
) => {
  if (pathname === `/${APP_PREFIX}/invoices`) {
    return t("Invoices.title");
  }
  if (pathname === `/${APP_PREFIX}/clients`) {
    return t("Clients.title");
  }
  if (pathname === `/${APP_PREFIX}/products`) {
    return t("Products.title");
  }
  if (pathname === `/${APP_PREFIX}/profil`) {
    return t("Profile.title");
  }
  if (pathname === `/${APP_PREFIX}/contact`) {
    return t("Contact.title");
  }
  if (pathname === `/${APP_PREFIX}/learning`) {
    return t("Learning.title");
  }
  if (pathname.startsWith(`/${APP_PREFIX}/learning/`)) {
    return null; // No breadcrumb on detail pages, title shown in content
  }

  return null;
};
