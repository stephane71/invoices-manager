"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { InvoiceDetailView } from "@/components/invoices/InvoiceDetailView";
import { InvoiceListItem } from "@/components/invoices/InvoiceListItem";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Invoice } from "@/types/models";

export default function InvoicesPage() {
  const t = useTranslations("Invoices");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const [invoices, setInvoices] = useState<
    (Invoice & { clients: { name: string } })[]
  >([]);
  const [loading, setLoading] = useState(true);

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
        <Link href="/invoices/new" aria-label={t("list.newButton")}>
          <Plus className="size-6" />
        </Link>
      </Button>

      <Sheet open={!!selectedId} onOpenChange={handleCloseSheet}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-2xl"
        >
          <SheetHeader>
            <SheetTitle>
              {t("detail.title", { number: selectedId || "" })}
            </SheetTitle>
          </SheetHeader>
          {selectedId && (
            <div className="mt-4">
              <InvoiceDetailView id={selectedId} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
