export const getPageHeaderTitle = (
  pathname: string,
  t: (key: string) => string,
) => {
  if (pathname === "/invoices") {
    return t("Invoices.title");
  }
  if (pathname === "/clients") {
    return t("Clients.title");
  }
  if (pathname === "/products") {
    return t("Products.title");
  }
  if (pathname === "/profil") {
    return t("Profile.title");
  }
  if (pathname === "/contact") {
    return t("Contact.title");
  }

  return null;
};
