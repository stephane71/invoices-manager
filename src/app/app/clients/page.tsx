"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ClientFieldGroup } from "@/components/clients/ClientFieldGroup";
import { ClientListItem } from "@/components/clients/ClientListItem";
import { ClientListItemHeader } from "@/components/clients/ClientListItemHeader";
import { ClientListItemSkeleton } from "@/components/clients/ClientListItemSkeleton";
import { ClientsEmptyState } from "@/components/clients/ClientsEmptyState";
import { useClientForm } from "@/components/clients/useClientForm";
import { Button } from "@/components/ui/button";
import { SheetItem } from "@/components/ui/item/SheetItem";
import { useClients } from "@/hooks/queries/useClients";
import { getClientDisplayName } from "@/lib/utils";

export default function ClientsPage() {
  const t = useTranslations("Clients");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");

  // Use React Query to fetch clients
  const { data: clients = [], isLoading } = useClients({
    enabled: !selectedId, // Only fetch when no client is selected
  });

  const { form, onSubmit, error } = useClientForm({ id: selectedId ?? "" });

  const handleCloseSheet = () => {
    router.push("/app/clients");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ClientListItemSkeleton key={index} />
          ))
        ) : clients.length === 0 ? (
          <ClientsEmptyState />
        ) : (
          clients.map((cItem) => (
            <ClientListItem
              key={cItem.id}
              id={cItem.id}
              name={getClientDisplayName(cItem)}
            />
          ))
        )}
      </div>

      <Button
        asChild
        size="lg"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Link href="/app/clients/new" aria-label={t("list.newButton")}>
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
              className="space-y-4"
            >
              <ClientListItemHeader
                name={getClientDisplayName(form.getValues())}
                type={form.getValues("client_type")}
              />
              <ClientFieldGroup
                control={form.control}
                disabled={form.formState.isSubmitting}
                showTypeSelector={false}
              />
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </form>
          )
        }
        footer={
          <Button
            type="submit"
            form={`client-form-${selectedId}`}
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? tCommon("saving") : tCommon("save")}
          </Button>
        }
      />
    </>
  );
}
