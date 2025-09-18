import Link from "next/link";
import { listInvoices } from "@/lib/db";
import { Button } from "@/components/ui/button";

async function InvoicesList() {
  const invoices = await listInvoices();
  return (
    <ul className="divide-y">
      {invoices.map((inv: any) => {
        const invoiceNumber = inv.number || inv.id;
        const clientName =
          inv?.clients?.name ||
          inv.client_name ||
          inv.clientId ||
          inv.client_id;
        const total =
          typeof inv.total_amount === "number"
            ? inv.total_amount.toFixed(2)
            : "0.00";
        return (
          <li key={inv.id} className="py-3 flex items-center justify-between">
            <div>
              {/* Title: <invoice number> <client name> */}
              <p className="font-medium">
                {invoiceNumber} • {clientName}
              </p>
              {/* Description: "due date" - total */}
              <p className="text-sm text-muted-foreground">
                {inv.due_date} - ${total}
              </p>
            </div>
            {/* Placeholder for future detail page */}
            {/* <Link className="text-sm underline" href={`/invoices/${inv.id}`}>View</Link> */}
          </li>
        );
      })}
    </ul>
  );
}

export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Link href="/invoices/new">
          <Button size="sm">Add</Button>
        </Link>
      </div>
      <InvoicesList />
    </div>
  );
}
