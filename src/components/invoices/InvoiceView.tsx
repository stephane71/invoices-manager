import { useTranslations } from "next-intl";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";
import { Client, Invoice, InvoiceItem } from "@/types/models";

export type InvoiceViewProps = {
  invoice: Invoice & { clients: Pick<Client, "name"> };
  total: number;
};

export const InvoiceView = ({ invoice, total }: InvoiceViewProps) => {
  const tCommon = useTranslations("Common");
  const tInvoices = useTranslations("Invoices");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        {tInvoices("detail.title", { number: invoice.number })}
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            {tInvoices("detail.info")}
          </h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="text-gray-500">
                {tInvoices("detail.clientLabel")}
              </span>{" "}
              {invoice.clients?.name}
            </p>
            <p>
              <span className="text-gray-500">
                {tInvoices("detail.issued")}
              </span>{" "}
              {invoice.issue_date}
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            {tInvoices("detail.total")}
          </h2>
          <p className="text-2xl font-semibold">
            {centsToCurrencyString(total, "EUR", APP_LOCALE)}{" "}
            {tCommon("vatExcluded")}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          {tInvoices("detail.lines")}
        </h2>
        {invoice.items && invoice.items.length > 0 ? (
          <div className="divide-y">
            {invoice.items.map((it: InvoiceItem, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div>
                  <div className="font-medium text-gray-900">{it.name}</div>
                  <div className="text-gray-500">
                    {tInvoices("detail.qty")} {it.quantity} ×{" "}
                    {centsToCurrencyString(it.price, "EUR", APP_LOCALE)}{" "}
                    {tCommon("vatExcluded")}
                  </div>
                </div>
                <div className="font-semibold">
                  {centsToCurrencyString(it.total, "EUR", APP_LOCALE)}{" "}
                  {tCommon("vatExcluded")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{tInvoices("detail.none")}</p>
        )}
      </div>
    </div>
  );
};
