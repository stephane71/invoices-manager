import { Plus } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { listClients } from "@/lib/db";

export default async function ClientsPage() {
  const clients = await listClients();

  const t = await getTranslations("Clients");
  const c = await getTranslations("Common");

  return (
    <>
      <ul className="divide-y">
        {clients.map((cItem) => (
          <li key={cItem.id}>
            <Link
              href={`/clients/${cItem.id}`}
              className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100"
            >
              <div>
                <p className="font-medium">{cItem.name}</p>
                <p className="text-muted-foreground text-sm">
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

      <Button
        asChild
        size="lg"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Link href="/clients/new" aria-label={t("list.newButton")}>
          <Plus className="size-6" />
        </Link>
      </Button>
    </>
  );
}
