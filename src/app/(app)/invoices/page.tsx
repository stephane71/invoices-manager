"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { InvoiceListItem } from "@/components/invoices/InvoiceListItem";
import { InvoiceView } from "@/components/invoices/InvoiceView";
import { useInvoiceForm } from "@/components/invoices/useInvoiceForm";
import { Button } from "@/components/ui/button";
import { SheetItem } from "@/components/ui/item/SheetItem";
import type { Invoice } from "@/types/models";

export default function InvoicesPage() {
  const tInvoices = useTranslations("Invoices");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const [invoices, setInvoices] = useState<
    (Invoice & { clients: { name: string } })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const { invoice, onDownloadInvoice, downloadingInvoice, total } =
    useInvoiceForm({ id: selectedId ?? "" });

  useEffect(() => {
    const loadInvoices = async () => {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
      setLoading(false);
    };
    void loadInvoices();
  }, []);

  const handleCloseSheet = () => {
    router.push("/invoices");
    // Reload invoices after closing sheet to reflect any changes
    const loadInvoices = async () => {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    };
    void loadInvoices();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {invoices.map((inv) => {
          return (
            <InvoiceListItem
              key={inv.id}
              id={inv.id}
              name={inv.clients.name}
              price={inv.total_amount}
              number={inv.number}
            />
          );
        })}
      </div>

      <Button
        asChild
        size="lg"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Link href="/invoices/new" aria-label={tInvoices("list.newButton")}>
          <Plus className="size-6" />
        </Link>
      </Button>

      <SheetItem
        title={tInvoices("detail.title", { number: invoice?.number ?? "" })}
        open={!!selectedId}
        onOpenChange={handleCloseSheet}
        content={invoice && <InvoiceView invoice={invoice} total={total} />}
        footer={
          <Button onClick={onDownloadInvoice} disabled={downloadingInvoice}>
            {downloadingInvoice
              ? tInvoices("detail.downloading")
              : tInvoices("detail.download")}
          </Button>
        }
      />
    </>
  );
}
