"use client";

import { use } from "react";
import { InvoiceDetailView } from "@/components/invoices/InvoiceDetailView";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="pb-24">
      <InvoiceDetailView id={id} />
    </div>
  );
}
