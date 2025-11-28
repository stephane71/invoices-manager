import { Plus } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { APP_LOCALE } from "@/lib/constants";
import { listInvoices } from "@/lib/db";
import { centsToCurrencyString } from "@/lib/utils";
import type { Invoice } from "@/types/models";

export default async function InvoicesPage() {
  const invoices = await listInvoices();

  const t = await getTranslations("Invoices");
  const c = await getTranslations("Common");

  return (
    <>
      <div className="space-y-3">
        {invoices.map(
          (
            inv: Invoice & {
              clients?: { name: string };
              client_name?: string;
              clientId?: string;
              client_id?: string;
              number?: string;
            },
          ) => {
            const invoiceNumber = inv.number || inv.id;
            const clientName =
              inv?.clients?.name ||
              inv.client_name ||
              inv.clientId ||
              inv.client_id;
            const total = centsToCurrencyString(
              inv.total_amount,
              "EUR",
              APP_LOCALE,
            );

            return (
              <Link href={`/invoices/${inv.id}`} key={inv.id} className="block">
                <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {invoiceNumber}
                        </h3>
                      </div>
                      <p className="mb-1 font-medium text-gray-700">
                        {clientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("list.issued")} {inv.issue_date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {total} {c("vatExcluded")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          },
        )}
      </div>

      <Button
        asChild
        size="lg"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Link href="/invoices/new" aria-label={t("list.newButton")}>
          <Plus className="size-6" />
        </Link>
      </Button>
    </>
  );
}
