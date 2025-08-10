import Link from "next/link";
import { listInvoices } from "@/lib/db";
import { Button } from "@/components/ui/button";

async function InvoicesList() {
  const invoices = await listInvoices();
  return (
    <ul className="divide-y">
      {invoices.map((inv) => (
        <li key={inv.id} className="py-3 flex items-center justify-between">
          <div>
            <p className="font-medium">Invoice {inv.id}</p>
            <p className="text-sm text-muted-foreground">
              {inv.issue_date} → {inv.due_date} • {inv.status} • Total $
              {inv.total_amount?.toFixed(2)}
            </p>
          </div>
          {/* Placeholder for future detail page */}
          {/* <Link className="text-sm underline" href={`/invoices/${inv.id}`}>View</Link> */}
        </li>
      ))}
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
