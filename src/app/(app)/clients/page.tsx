import Link from "next/link";
import { listClients } from "@/lib/db";
import { Button } from "@/components/ui/button";

async function ClientsList() {
  const clients = await listClients();
  return (
    <ul className="divide-y">
      {clients.map((c) => (
        <li key={c.id} className="py-3 flex items-center justify-between">
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.email || ""}</p>
          </div>
          <Link className="text-sm underline" href={`/clients/${c.id}`}>
            View
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
