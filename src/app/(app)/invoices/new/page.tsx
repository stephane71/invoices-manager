"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "@/components/clients/ClientFieldGroup";
import { ArticleFieldGroup } from "@/components/invoices/ArticleFieldGroup";
import ClientBlock from "@/components/invoices/ClientBlock";
import { InvoiceFieldGroup } from "@/components/invoices/InvoiceFieldGroup";
import {
  INVOICE_ITEM_EMPTY,
  InvoiceForm,
  invoiceFormSchema,
  InvoiceItem,
} from "@/components/invoices/invoices";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import {
  ClientCreationError,
  useCreateNewClientFromNewInvoice,
} from "@/hooks/useCreateNewClientFromNewInvoice";
import { useMinDelay } from "@/hooks/useMinDelay";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";
import type { Client, Product } from "@/types/models";

const ERROR_DEFAULT = "";
const FIELD_ERROR_DEFAULT = undefined;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(ERROR_DEFAULT);
  const [clientFieldErrors, setClientFieldErrors] = useState<
    FieldErrors | typeof FIELD_ERROR_DEFAULT
  >();
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      number: "",
      clientId: "",
      issueDate: todayISO(),
      items: [INVOICE_ITEM_EMPTY],
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const clientId = watch("clientId");
  const items = watch("items");

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/clients"), fetch("/api/products")])
      .then(async ([c, p]) => {
        const clientsData = await c.json();
        const productsData = await p.json();
        if (!active) {
          return;
        }
        setClients(clientsData || []);
        setProducts(productsData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.total) || 0), 0),
    [items],
  );

  // Hook to create or resolve client selection from inline new client form
  const createClientFromSelection = useCreateNewClientFromNewInvoice({});
  // Loading controller to keep the client block overlay visible for at least 2 seconds
  const { pending: clientBlockLoading, wrap } = useMinDelay(2000);

  // Called by ClientBlock when user completes the new client name
  const onRequestCreateNewClient = async (clientData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      // Clear previous errors
      setClientFieldErrors(FIELD_ERROR_DEFAULT);
      setError(ERROR_DEFAULT);

      const newId = await wrap(() => createClientFromSelection(clientData));
      setValue("clientId", newId);
      // Optimistic update without triggering a new request
      // Ensure the new client appears in the select immediately
      setClients((prev) => {
        if (prev.some((c) => c.id === newId)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: newId,
            name: clientData.name,
            email: clientData.email ?? null,
            phone: clientData.phone ?? null,
            address: clientData.address ?? null,
          } as Client,
        ];
      });
    } catch (e: unknown) {
      if (e instanceof ClientCreationError) {
        if (e.fieldErrors) {
          setClientFieldErrors(e.fieldErrors);
        } else {
          setError(e.message);
        }
      } else {
        setError(
          e instanceof Error ? e.message : t("new.error.clientCreateFail"),
        );
      }
    }
  };

  function addItem() {
    setValue("items", [...items, INVOICE_ITEM_EMPTY]);
  }

  function removeItem(index: number) {
    setValue(
      "items",
      items.filter((_, i) => i !== index),
    );
  }

  function updateItem(index: number, updatedItem: InvoiceItem) {
    const next = [...items];
    next[index] = updatedItem;
    setValue("items", next);
  }

  async function onSubmit(data: InvoiceForm) {
    setError(ERROR_DEFAULT);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: data.number.trim(),
          client_id: data.clientId,
          items: data.items,
          total_amount: +totalAmount.toFixed(2),
          issue_date: data.issueDate,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}) as never);
        const serverMessage: string | undefined = err?.error || err?.message;
        if (
          res.status === 409 ||
          /duplicate|exists|unique/i.test(String(serverMessage))
        ) {
          throw new Error(t("new.error.duplicateNumber"));
        }
        throw new Error(serverMessage || t("new.error.createFail"));
      }
      router.push("/invoices");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : t("new.error.createFail");
      setError(message);
    }
  }

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <>
      <div className="pb-28">
        <h1 className="text-xl font-semibold mb-4">{t("new.title")}</h1>

        <InvoiceFieldGroup control={control} />

        <div>
          <div className="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("new.client")}
          </div>

          <ClientBlock
            clients={clients}
            clientId={clientId}
            onSelectClientAction={(id) => setValue("clientId", id)}
            onRequestCreateNewClientAction={onRequestCreateNewClient}
            isLoading={clientBlockLoading}
            clientFormErrors={clientFieldErrors}
          />
          {errors.clientId && (
            <FieldError>
              {errors.clientId?.message ? t(errors.clientId.message) : ""}
            </FieldError>
          )}
        </div>

        <div>
          <div className="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("new.items")}
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              {items.map((item, idx) => (
                <ArticleFieldGroup
                  key={idx}
                  item={item}
                  products={products}
                  onChange={(updatedItem) => updateItem(idx, updatedItem)}
                  onRemove={() => removeItem(idx)}
                />
              ))}
            </div>

            <div className="flex items-center justify-end">
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={addItem}
              >
                {t("new.addItem")}
              </Button>
            </div>
          </div>

          {errors.items && (
            <FieldError>
              {errors.items?.message ? t(errors.items.message) : ""}
            </FieldError>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background p-3">
        {error && <div className="text-sm text-red-600">{"Message error"}</div>}
        <div className="flex items-center justify-between px-2">
          <div className="text-lg font-medium">
            {t("new.total")}{" "}
            {centsToCurrencyString(totalAmount, "EUR", APP_LOCALE)}{" "}
            {c("vatExcluded")}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/invoices")}
              disabled={isSubmitting}
            >
              {c("cancel")}
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {isSubmitting ? c("saving") : t("new.create")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
