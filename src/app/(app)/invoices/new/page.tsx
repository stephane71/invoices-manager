"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { Client, Product } from "@/types/models";
import { useTranslations } from "next-intl";
import ClientBlock from "@/components/invoices/ClientBlock";
import {
  ClientCreationError,
  useCreateNewClientFromNewInvoice,
} from "@/hooks/useCreateNewClientFromNewInvoice";
import { useMinDelay } from "@/hooks/useMinDelay";
import ArticlesBlock, {
  type InvoiceItem,
} from "@/components/invoices/ArticlesBlock";
import { centsToCurrencyString } from "@/lib/utils";
import { APP_LOCALE } from "@/lib/constants";
import type { FieldErrors } from "@/components/clients/ClientFieldGroup";

// Zod schema for invoice form validation
const invoiceItemSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0),
  total: z.number().min(0),
  quantityInput: z.string().optional(),
});

const invoiceFormSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  clientId: z.string().min(1, "Client is required"),
  issueDate: z.string().min(1),
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one article is required")
    .refine(
      (items) =>
        items.every(
          (item) => item.product_id && item.name && item.quantity > 0,
        ),
      { message: "All articles must be complete" },
    ),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

const ERROR_DEFAULT = "";
const FIELD_ERROR_DEFAULT = undefined;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Replace local Item type with the shared InvoiceItem
type Item = InvoiceItem;

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

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      number: "",
      clientId: "",
      issueDate: todayISO(),
      items: [
        {
          product_id: "",
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
          quantityInput: "1",
        },
      ],
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = form;

  const number = watch("number");
  const clientId = watch("clientId");
  const issueDate = watch("issueDate");
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
    setValue("items", [
      ...items,
      {
        product_id: "",
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
        quantityInput: "1",
      },
    ]);
  }

  function removeItem(index: number) {
    setValue(
      "items",
      items.filter((_, i) => i !== index),
    );
  }

  function onChangeProduct(index: number, productId: string) {
    const next = [...items];
    const prod = products.find((p) => p.id === productId);
    const priceCents = prod?.price || 0;
    const name = prod?.name || "";
    const existing = next[index];
    const qty = existing?.quantity ?? 0;
    const quantityInput = existing?.quantityInput ?? (qty ? String(qty) : "");
    const totalCents = Math.round(priceCents * qty);
    next[index] = {
      ...existing,
      product_id: productId,
      name,
      quantity: qty,
      price: priceCents,
      total: totalCents,
      quantityInput,
    } as Item;
    setValue("items", next);
  }

  function onChangeQty(index: number, rawValue: string) {
    const next = [...items];
    const item = next[index];

    // Allow temporary empty string while typing
    if (rawValue === "") {
      next[index] = {
        ...item,
        quantityInput: "",
        quantity: 0,
        total: 0,
      } as Item;
      setValue("items", next);
      return;
    }

    // Parse positive integer quantity
    const parsed = parseInt(rawValue, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      next[index] = {
        ...item,
        quantityInput: rawValue,
        quantity: 0,
        total: 0,
      } as Item;
      setValue("items", next);
      return;
    }

    const quantity = Math.floor(parsed);
    const priceCents = Number(item.price) || 0;
    const totalCents = Math.round(priceCents * quantity);
    next[index] = {
      ...item,
      quantityInput: String(quantity),
      quantity,
      total: totalCents,
    } as Item;
    setValue("items", next);
  }

  function onBlurQty(index: number) {
    const next = [...items];
    const item = next[index];
    const raw = (item as Item).quantityInput ?? String(item.quantity ?? "");
    if (raw === "" || item.quantity === 0) {
      const quantity = 1;
      const priceCents = Number(item.price) || 0;
      const totalCents = Math.round(priceCents * quantity);
      next[index] = {
        ...item,
        quantityInput: "1",
        quantity,
        total: totalCents,
      } as Item;
      setValue("items", next);
    }
  }

  function onChangePrice(index: number, cents: number) {
    const next = [...items];
    const item = next[index];
    const qty = Number(item.quantity) || 0;
    const totalCents = Math.round(cents * qty);
    next[index] = {
      ...item,
      price: cents,
      total: totalCents,
    } as Item;
    setValue("items", next);
  }

  async function onSubmit(data: InvoiceFormData) {
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

  // Check if form can be submitted (has number, client, and valid articles)
  const canSubmit = isValid && !isSubmitting;

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <>
      <div className="pb-28">
        <h1 className="text-xl font-semibold mb-4">{t("new.title")}</h1>

        <FieldGroup className="mb-8">
          <Field>
            <FieldLabel htmlFor="number">{t("new.number")}</FieldLabel>
            <Input
              id="number"
              type="text"
              icon="FileText"
              value={number}
              onChange={(e) => setValue("number", e.target.value)}
              placeholder={t("new.numberPlaceholder")}
              required
            />
            {errors.number && <FieldError>{errors.number.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="issueDate">{t("new.issueDate")}</FieldLabel>
            <Input
              id="issueDate"
              type="date"
              icon="Calendar"
              value={issueDate}
              onChange={(e) => setValue("issueDate", e.target.value)}
            />
          </Field>
        </FieldGroup>

        <ClientBlock
          clients={clients}
          clientId={clientId}
          onSelectClientAction={(id) => setValue("clientId", id)}
          onRequestCreateNewClientAction={onRequestCreateNewClient}
          isLoading={clientBlockLoading}
          clientFormErrors={clientFieldErrors}
          error={errors.clientId?.message}
        />

        <ArticlesBlock
          products={products}
          items={items}
          onAddAction={addItem}
          onRemoveAction={removeItem}
          onChangeProductAction={onChangeProduct}
          onChangeQtyAction={onChangeQty}
          onBlurQtyAction={onBlurQty}
          onChangePriceAction={onChangePrice}
        />
        {errors.items && (
          <p className="mt-2 text-sm text-red-600">
            {errors.items.message || errors.items.root?.message}
          </p>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background p-3">
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
            <Button onClick={handleSubmit(onSubmit)} disabled={!canSubmit}>
              {isSubmitting ? c("saving") : t("new.create")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
