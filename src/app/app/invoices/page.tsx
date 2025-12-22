"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { InvoiceListItem } from "@/components/invoices/InvoiceListItem";
import { InvoiceListItemSkeleton } from "@/components/invoices/InvoiceListItemSkeleton";
import { InvoiceView } from "@/components/invoices/InvoiceView";
import { InvoicesEmptyState } from "@/components/invoices/InvoicesEmptyState";
import { useInvoiceForm } from "@/components/invoices/useInvoiceForm";
import { ProfileCompletenessAlert } from "@/components/profil/ProfileCompletenessAlert";
import { Button } from "@/components/ui/button";
import { SheetItem } from "@/components/ui/item/SheetItem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInvoices } from "@/hooks/queries/useInvoices";
import { getClientDisplayName } from "@/lib/utils";

export default function InvoicesPage() {
  const tInvoices = useTranslations("Invoices");
  const tProfile = useTranslations("Profile");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  // Use React Query to fetch invoices
  const { data: invoices = [], isLoading } = useInvoices();

  const {
    invoice,
    onDownloadInvoice,
    downloadingInvoice,
    total,
    profileValidation,
  } = useInvoiceForm({ id: selectedId ?? "" });

  const handleCloseSheet = () => {
    router.push("/app/invoices");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <InvoiceListItemSkeleton key={index} />
          ))
        ) : invoices.length === 0 ? (
          <InvoicesEmptyState />
        ) : (
          invoices.map((inv) => {
            return (
              <InvoiceListItem
                key={inv.id}
                id={inv.id}
                name={getClientDisplayName(inv.clients)}
                price={inv.total_amount}
                number={inv.number}
              />
            );
          })
        )}
      </div>

      <Button
        asChild
        size="lg"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Link href="/app/invoices/new" aria-label={tInvoices("list.newButton")}>
          <Plus className="size-6" />
        </Link>
      </Button>

      <SheetItem
        title={tInvoices("detail.title", { number: invoice?.number ?? "" })}
        open={!!selectedId}
        onOpenChange={handleCloseSheet}
        content={
          <>
            {profileValidation && !profileValidation.isComplete && (
              <ProfileCompletenessAlert
                validation={profileValidation}
                className="mb-4"
              />
            )}
            {invoice && <InvoiceView invoice={invoice} total={total} />}
          </>
        }
        footer={
          profileValidation !== null && !profileValidation.isComplete ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={onDownloadInvoice}
                    disabled={true}
                    className="w-full"
                  >
                    {tInvoices("detail.download")}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {tProfile("completeness.missingFields")}:{" "}
                  {profileValidation.missingFields
                    .map((field) => tProfile(`fields.${field}`))
                    .join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button onClick={onDownloadInvoice} disabled={downloadingInvoice}>
              {downloadingInvoice
                ? tInvoices("detail.downloading")
                : tInvoices("detail.download")}
            </Button>
          )
        }
      />
    </>
  );
}
