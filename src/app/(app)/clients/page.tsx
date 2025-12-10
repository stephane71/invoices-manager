"use client";

import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ClientFieldGroup } from "@/components/clients/ClientFieldGroup";
import { ClientListItem } from "@/components/clients/ClientListItem";
import { ClientListItemSkeleton } from "@/components/clients/ClientListItemSkeleton";
import { useClientForm } from "@/components/clients/useClientForm";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SheetItem } from "@/components/ui/item/SheetItem";
import type { Client } from "@/types/models";

export default function ClientsPage() {
  const t = useTranslations("Clients");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const { form, onSubmit, onRemove, error } = useClientForm({
    id: selectedId ?? "",
  });

  useEffect(() => {
    const loadClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
      setLoading(false);
    };
    void loadClients();
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

  return (
    <>
      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ClientListItemSkeleton key={index} />
          ))
        ) : clients.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="size-6" />
              </EmptyMedia>
              <EmptyTitle>{t("empty.title")}</EmptyTitle>
              <EmptyDescription>{t("empty.description")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/clients/new">
                  <Plus className="mr-2 size-4" />
                  {t("empty.action")}
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          clients.map((cItem) => (
            <ClientListItem key={cItem.id} id={cItem.id} name={cItem.name} />
          ))
        )}
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

      <SheetItem
        title={t("edit.title")}
        open={!!selectedId}
        onOpenChange={handleCloseSheet}
        content={
          selectedId && (
            <form
              id={`client-form-${selectedId}`}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <ClientFieldGroup
                control={form.control}
                disabled={form.formState.isSubmitting}
              />
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </form>
          )
        }
        footer={
          <div className="flex w-full justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={onRemove}
              disabled={form.formState.isSubmitting}
            >
              {tCommon("delete")}
            </Button>
            <Button
              type="submit"
              form={`client-form-${selectedId}`}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? tCommon("saving")
                : tCommon("save")}
            </Button>
          </div>
        }
      />
    </>
  );
}
