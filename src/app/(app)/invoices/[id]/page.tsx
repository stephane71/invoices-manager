"use client";
import { use, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Client, Invoice, InvoiceItem } from "@/types/models";
import { useTranslations } from "next-intl";
import { centsToCurrencyString } from "@/lib/utils";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<
    (Invoice & { clients: Pick<Client, "name"> }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/invoices/${id}`);
        const data = await res.json();
        if (!active) {
          return;
        }
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load invoice");
        }
        setInvoice(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        setError(msg);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const total = useMemo(() => {
    if (!invoice) {
      return 0;
    }
    return invoice.total_amount;
  }, [invoice]);

  async function handleDownload() {
    if (!invoice) {
      return;
    }
    try {
      setDownloading(true);
      // If a PDF already exists, open it directly
      if (invoice.pdf_url) {
        window.open(invoice.pdf_url, "_blank");
        return;
      }
      // Otherwise, generate it then open
      const res = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate PDF");
      }
      const url = data?.pdf_url as string | undefined;
      if (url) {
        // update local state
        setInvoice({ ...invoice, pdf_url: url });
        window.open(url, "_blank");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Download failed";
      alert(msg);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }
  if (error || !invoice) {
    return <div className="p-4 text-red-600">{error || t("detail.none")}</div>;
  }

  return (
    <div className="pb-24">
      {/* padding bottom so content not hidden by fixed bar */}
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">
          {t("detail.title", { number: invoice.number })}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              {t("detail.info")}
            </h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="text-gray-500">{t("detail.clientLabel")}</span>{" "}
                {invoice.clients?.name}
              </p>
              <p>
                <span className="text-gray-500">{t("detail.issued")}</span>{" "}
                {invoice.issue_date}
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              {t("detail.total")}
            </h2>
            <p className="text-2xl font-semibold">
              {centsToCurrencyString(total, "EUR")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            {t("detail.lines")}
          </h2>
          {invoice.items && invoice.items.length > 0 ? (
            <div className="divide-y">
              {invoice.items.map((it: InvoiceItem, idx: number) => (
                <div
                  key={idx}
                  className="py-2 flex items-center justify-between text-sm"
                >
                  <div>
                    <div className="font-medium text-gray-900">{it.name}</div>
                    <div className="text-gray-500">
                      {t("detail.qty")} {it.quantity} ×{" "}
                      {centsToCurrencyString(it.price, "EUR")}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {centsToCurrencyString(it.total, "EUR")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t("detail.none")}</p>
          )}
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-white p-4">
        <div className="mx-auto max-w-5xl flex justify-end">
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? t("detail.downloading") : t("detail.download")}
          </Button>
        </div>
      </div>
    </div>
  );
}
