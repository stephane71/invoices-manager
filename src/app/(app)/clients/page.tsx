import Link from "next/link";
import { listClients } from "@/lib/db";
import { Button } from "@/components/ui/button";

async function ClientsList() {
  const clients = await listClients();
  return (
    <ul className="divide-y">
      {clients.map((c) => (
        <li key={c.id}>
          <Link
            href={`/clients/${c.id}`}
            className="py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 rounded-lg px-2 -mx-2"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.email || ""}</p>
            </div>
            <span className="text-sm text-blue-600 hover:text-blue-800">
              View →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ClientsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Link href="/clients/new">
          <Button size="sm">Add</Button>
        </Link>
      </div>

      <ClientsList />
    </div>
  );
}
