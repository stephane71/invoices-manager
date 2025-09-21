"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Client, Product } from "@/types/models";
import { useTranslations } from "next-intl";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

type Item = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  // Transient UI state to allow clearing the quantity input before typing
  quantityInput?: string;
};

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
  const [dueDate, setDueDate] = useState(addDaysISO(30));
  const [items, setItems] = useState<Item[]>([]);

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

  function addItem() {
    setItems((prev) => [
      ...prev,
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
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function onChangeProduct(index: number, productId: string) {
    setItems((prev) => {
      const next = [...prev];
      const prod = products.find((p) => p.id === productId);
      const price = prod?.price || 0;
      const name = prod?.name || "";
      const existing = next[index];
      const qty = existing?.quantity ?? 0;
      const quantityInput = existing?.quantityInput ?? (qty ? String(qty) : "");
      next[index] = {
        ...existing,
        product_id: productId,
        name,
        quantity: qty,
        price,
        total: +(price * qty).toFixed(2),
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
        };
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
        };
        return next;
      }

      const quantity = Math.floor(parsed);
      const price = Number(item.price) || 0;
      next[index] = {
        ...item,
        quantityInput: String(quantity),
        quantity,
        total: +(price * quantity).toFixed(2),
      };
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
        const price = Number(item.price) || 0;
        next[index] = {
          ...item,
          quantityInput: "1",
          quantity,
          total: +(price * quantity).toFixed(2),
        };
      }
      return next;
    });
  }

  function onChangePrice(index: number, priceInput: number) {
    setItems((prev) => {
      const next = [...prev];
      const item = next[index];
      const price = priceInput >= 0 ? priceInput : 0;
      const qty = Number(item.quantity) || 0; // while typing empty quantity, treat as 0
      next[index] = { ...item, price, total: +(price * qty).toFixed(2) };
      return next;
    });
  }

  async function save() {
    setError(null);
    if (!number.trim()) {
      setError("Please enter an invoice number");
      return;
    }
    if (!clientId) {
      setError("Please select a client");
      return;
    }
    if (items.length === 0) {
      setError("Please add at least one item");
      return;
    }
    // validate all items
    const valid = items.every(
      (it) => it.product_id && it.name && it.quantity > 0,
    );
    if (!valid) {
      setError("Please complete all item fields");
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
          due_date: dueDate,
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
          throw new Error(
            "The invoice number already exists. Please choose a different number.",
          );
        }
        throw new Error(serverMessage || "Failed to create invoice");
      }
      router.push("/invoices");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to create invoice";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("new.title")}</h1>

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
        <label className="text-sm">{t("new.client")}</label>
        <select
          className="h-10 rounded-md border px-3 bg-background"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">{t("new.selectClient")}</option>
          {clients.map((cItem) => (
            <option key={cItem.id} value={cItem.id}>
              {cItem.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="grid gap-2">
          <label className="text-sm">{t("new.issueDate")}</label>
          <input
            type="date"
            className="h-10 rounded-md border px-3 bg-background"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">{t("new.dueDate")}</label>
          <input
            type="date"
            className="h-10 rounded-md border px-3 bg-background"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{t("new.items")}</h2>
          <Button size="sm" onClick={addItem}>
            {t("new.addItem")}
          </Button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("new.empty")}</p>
        ) : (
          <div className="space-y-3">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[1fr_90px_110px_110px_80px] items-center gap-2"
              >
                <select
                  className="h-10 rounded-md border px-2 bg-background"
                  value={it.product_id || ""}
                  onChange={(e) => onChangeProduct(idx, e.target.value)}
                >
                  <option value="" />
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="h-10 rounded-md border px-2 bg-background"
                  value={it.quantityInput ?? String(it.quantity)}
                  onChange={(e) => onChangeQty(idx, e.target.value)}
                  onBlur={() => onBlurQty(idx)}
                />
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className="h-10 rounded-md border px-2 bg-background"
                  value={it.price}
                  onChange={(e) =>
                    onChangePrice(idx, parseFloat(e.target.value || "0"))
                  }
                />
                <div className="text-sm">${it.total.toFixed(2)}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem(idx)}
                >
                  {t("new.remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {t("new.total")} ${totalAmount.toFixed(2)}
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

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
