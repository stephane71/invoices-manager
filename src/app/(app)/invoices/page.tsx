"use client";

import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InvoiceDetailView } from "@/components/invoices/InvoiceDetailView";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";
import type { Invoice } from "@/types/models";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get("id");
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  useEffect(() => {
    const loadInvoices = async () => {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
      setLoading(false);
    };
    loadInvoices();
  }, []);

  const handleItemClick = (id: string) => {
    router.push(`/invoices?id=${id}`);
  };

  const handleCloseSheet = () => {
    router.push("/invoices");
    // Reload invoices after closing sheet to reflect any changes
    const loadInvoices = async () => {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    };
    loadInvoices();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <ul className="divide-y">
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
              <li key={inv.id}>
                <button
                  onClick={() => handleItemClick(inv.id)}
                  className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100 w-full text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {invoiceNumber}
                      </p>
                      <span className="text-gray-400">·</span>
                      <p className="font-medium text-gray-700 truncate">
                        {clientName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <p>{inv.issue_date}</p>
                      <p className="font-semibold">
                        {total} {c("vatExcluded")}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 flex-shrink-0 ml-2" />
                </button>
              </li>
            );
          },
        )}
      </ul>

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
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
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
