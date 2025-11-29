"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ClientDetailView } from "@/components/clients/ClientDetailView";
import { ClientListItem } from "@/components/clients/ClientListItem";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Client } from "@/types/models";

export default function ClientsPage() {
  const t = useTranslations("Clients");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
      setLoading(false);
    };
    loadClients();
  }, []);

  const handleCloseSheet = () => {
    router.push("/clients");
    // Reload clients after closing sheet to reflect any changes
    const loadClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    };
    void loadClients();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {clients.map((cItem) => (
          <ClientListItem key={cItem.id} id={cItem.id} name={cItem.name} />
        ))}
      </div>

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
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-2xl"
        >
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
