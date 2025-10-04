import { getRequestConfig } from "next-intl/server";
import { APP_LOCALE } from "@/lib/constants";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = APP_LOCALE.split("-")[0];

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
