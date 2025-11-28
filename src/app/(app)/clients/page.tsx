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
import { ClientDetailView } from "@/components/clients/ClientDetailView";
import type { Client } from "@/types/models";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get("id");
  const t = useTranslations("Clients");

  useEffect(() => {
    const loadClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
      setLoading(false);
    };
    loadClients();
  }, []);

  const handleItemClick = (id: string) => {
    router.push(`/clients?id=${id}`);
  };

  const handleCloseSheet = () => {
    router.push("/clients");
    // Reload clients after closing sheet to reflect any changes
    const loadClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    };
    loadClients();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <ul className="divide-y">
        {clients.map((cItem) => (
          <li key={cItem.id}>
            <button
              onClick={() => handleItemClick(cItem.id)}
              className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100 w-full text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 mb-1">{cItem.name}</p>
                <p className="text-sm text-gray-600 truncate">
                  {cItem.email || ""}
                </p>
              </div>
              <ChevronRight className="size-5 text-gray-400 flex-shrink-0 ml-2" />
            </button>
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

      <Sheet open={!!selectedId} onOpenChange={handleCloseSheet}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("edit.title")}</SheetTitle>
          </SheetHeader>
          {selectedId && (
            <div className="mt-4">
              <ClientDetailView id={selectedId} onClose={handleCloseSheet} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
