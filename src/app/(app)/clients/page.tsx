import Link from "next/link";
import { listClients } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Plus, Users } from "lucide-react";

async function ClientsList() {
  const clients = await listClients();
  const c = await getTranslations("Common");
  return (
    <ul className="divide-y">
      {clients.map((cItem) => (
        <li key={cItem.id}>
          <Link
            href={`/clients/${cItem.id}`}
            className="py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 rounded-lg px-2 -mx-2"
          >
            <div>
              <p className="font-medium">{cItem.name}</p>
              <p className="text-sm text-muted-foreground">
                {cItem.email || ""}
              </p>
            </div>
            <span className="text-sm text-blue-600 hover:text-blue-800">
              {c("view")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function ClientsPage() {
  const t = await getTranslations("Clients");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" aria-hidden="true" />
          <span>{t("title")}</span>
        </h1>
        <Link href="/clients/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{t("list.newButton")}</span>
          </Button>
        </Link>
      </div>

      <ClientsList />
    </div>
  );
}
