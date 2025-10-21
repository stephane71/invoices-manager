"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Client, Product } from "@/types/models";
import { useTranslations } from "next-intl";
import ClientBlock from "@/components/invoices/ClientBlock";
import { useCreateNewClientFromNewInvoice } from "@/hooks/useCreateNewClientFromNewInvoice";
import { useMinDelay } from "@/hooks/useMinDelay";
import ArticlesBlock, {
  type InvoiceItem,
} from "@/components/invoices/ArticlesBlock";
import { centsToCurrencyString } from "@/lib/utils";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  const [number, setNumber] = useState("");
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(todayISO());
  const [items, setItems] = useState<Item[]>([
    {
      product_id: "",
      name: "",
      quantity: 1,
      price: 0, // in cents
      total: 0, // in cents
      quantityInput: "1",
    },
  ]);

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
      const newId = await wrap(() => createClientFromSelection(clientData));
      setClientId(newId);
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
      setError(
        e instanceof Error ? e.message : t("new.error.clientCreateFail"),
      );
    }
  };

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        product_id: "",
        name: "",
        quantity: 1,
        price: 0, // in cents
        total: 0, // in cents
        quantityInput: "1",
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function onChangeProduct(index: number, productId: string) {
    setItems((prev) => {
      const next = [...prev];
      const prod = products.find((p) => p.id === productId);
      const priceCents = prod?.price || 0; // price is already in cents from DB
      const name = prod?.name || "";
      const existing = next[index];
      const qty = existing?.quantity ?? 0;
      const quantityInput = existing?.quantityInput ?? (qty ? String(qty) : "");
      const totalCents = Math.round(priceCents * qty); // total in cents
      next[index] = {
        ...existing,
        product_id: productId,
        name,
        quantity: qty,
        price: priceCents,
        total: totalCents,
        quantityInput,
      } as Item;
      return next;
    });
  }

  function onChangeQty(index: number, rawValue: string) {
    setItems((prev) => {
      const next = [...prev];
      const item = next[index];

      // Allow temporary empty string while typing
      if (rawValue === "") {
        next[index] = {
          ...item,
          quantityInput: "",
          quantity: 0,
          total: 0,
        } as Item;
        return next;
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
        return next;
      }

      const quantity = Math.floor(parsed);
      const priceCents = Number(item.price) || 0; // price in cents
      const totalCents = Math.round(priceCents * quantity); // total in cents
      next[index] = {
        ...item,
        quantityInput: String(quantity),
        quantity,
        total: totalCents,
      } as Item;
      return next;
    });
  }

  function onBlurQty(index: number) {
    setItems((prev) => {
      const next = [...prev];
      const item = next[index];
      const raw = (item as Item).quantityInput ?? String(item.quantity ?? "");
      if (raw === "" || item.quantity === 0) {
        const quantity = 1;
        const priceCents = Number(item.price) || 0; // price in cents
        const totalCents = Math.round(priceCents * quantity); // total in cents
        next[index] = {
          ...item,
          quantityInput: "1",
          quantity,
          total: totalCents,
        } as Item;
      }
      return next;
    });
  }

  function onChangePrice(index: number, cents: number) {
    setItems((prev) => {
      const next = [...prev];
      const item = next[index];
      const qty = Number(item.quantity) || 0;
      const totalCents = Math.round(cents * qty); // total in cents
      next[index] = {
        ...item,
        price: cents,
        total: totalCents,
      } as Item;
      return next;
    });
  }

  async function save() {
    setError(null);
    if (!number.trim()) {
      setError(t("new.error.numberRequired"));
      return;
    }
    if (!clientId) {
      setError(t("new.error.clientRequired"));
      return;
    }
    if (items.length === 0) {
      setError(t("new.error.itemsRequired"));
      return;
    }
    // validate all items
    const valid = items.every(
      (it) => it.product_id && it.name && it.quantity > 0,
    );
    if (!valid) {
      setError(t("new.error.itemsIncomplete"));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: number.trim(),
          client_id: clientId,
          items,
          total_amount: +totalAmount.toFixed(2),
          issue_date: issueDate,
          // status omitted to use default "draft"
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}) as never);
        const serverMessage: string | undefined = err?.error || err?.message;
        // If the backend signals a duplicate number (409), or the message suggests it
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
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <>
      <div className="pb-28">
        <h1 className="text-xl font-semibold mb-4">{t("new.title")}</h1>

        <div className="space-y-4 mb-8">
          <div className="grid gap-2">
            <label className="text-sm">{t("new.number")}</label>
            <input
              type="text"
              className="h-10 rounded-md border px-3 bg-background"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t("new.numberPlaceholder")}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">{t("new.issueDate")}</label>
            <input
              type="date"
              className="h-10 rounded-md border px-3 bg-background"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
        </div>

        <ClientBlock
          clients={clients}
          clientId={clientId}
          onSelectClientAction={setClientId}
          onRequestCreateNewClientAction={onRequestCreateNewClient}
          isLoading={clientBlockLoading}
        />

        {/* Articles block extracted to component */}
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

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background p-3">
        <div className="flex items-center justify-between px-2">
          <div className="text-lg font-medium">
            {t("new.total")} {centsToCurrencyString(totalAmount)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/invoices")}
              disabled={saving}
            >
              {c("cancel")}
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? c("saving") : t("new.create")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
