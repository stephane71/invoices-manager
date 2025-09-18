import Link from "next/link";
import { listInvoices } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/models";

async function InvoicesList() {
  const invoices = await listInvoices();
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
          const total = inv.total_amount.toFixed(2);

          return (
            <div
              key={inv.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {invoiceNumber}
                    </h3>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{clientName}</p>
                  <p className="text-gray-500 text-sm">
                    Émise: {inv.issue_date}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Échéance: {inv.due_date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900">
                      €{total}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vos Factures</h1>
        <Link href="/invoices/new">
          <Button size="sm">+ Nouvelle Facture</Button>
        </Link>
      </div>
      <InvoicesList />
    </div>
  );
}
