import Link from "next/link";
import { listInvoices } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/models";
import { getTranslations } from "next-intl/server";
import { FileText, Plus } from "lucide-react";
import { numberToCurrency } from "@/lib/utils";

async function InvoicesList() {
  const invoices = await listInvoices();
  const t = await getTranslations("Invoices");
  return (
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
          const total = numberToCurrency(inv.total_amount, { currency: "EUR" });

          return (
            <Link href={`/invoices/${inv.id}`} key={inv.id} className="block">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {invoiceNumber}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      {clientName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {t("list.issued")} {inv.issue_date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-lg text-gray-900">
                        {total}
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
  );
}

export default async function InvoicesPage() {
  const t = await getTranslations("Invoices");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" aria-hidden="true" />
          <span>{t("title")}</span>
        </h1>
        <Link href="/invoices/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{t("list.newButton")}</span>
          </Button>
        </Link>
      </div>
      <InvoicesList />
    </div>
  );
}
