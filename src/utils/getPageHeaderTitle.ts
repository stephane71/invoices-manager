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

  return null;
};
