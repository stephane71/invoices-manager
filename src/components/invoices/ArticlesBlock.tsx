"use client";
import type { Product } from "@/types/models";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type InvoiceItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  quantityInput?: string;
};

export type ArticlesBlockProps = {
  products: Product[];
  items: InvoiceItem[];
  onAddAction: () => void;
  onRemoveAction: (index: number) => void;
  onChangeProductAction: (index: number, productId: string) => void;
  onChangeQtyAction: (index: number, rawValue: string) => void;
  onBlurQtyAction: (index: number) => void;
  onChangePriceAction: (index: number, price: number) => void;
};

export default function ArticlesBlock({
  products,
  items,
  onAddAction,
  onRemoveAction,
  onChangeProductAction,
  onChangeQtyAction,
  onBlurQtyAction,
  onChangePriceAction,
}: ArticlesBlockProps) {
  const t = useTranslations("Invoices");

  return (
    <div>
      <div className="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("new.items")}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("new.empty")}</p>
        ) : (
          <div className="space-y-3">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[1fr_90px_110px_110px] items-start gap-2"
              >
                <Select
                  value={it.product_id || ""}
                  onValueChange={(v) => onChangeProductAction(idx, v)}
                >
                  <SelectTrigger className="h-10 w-full px-2">
                    <SelectValue placeholder={t("new.selectProduct")} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min={1}
                  className="h-10 rounded-md border px-2 bg-background"
                  value={it.quantityInput ?? String(it.quantity)}
                  onChange={(e) => onChangeQtyAction(idx, e.target.value)}
                  onBlur={() => onBlurQtyAction(idx)}
                />

                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  className="h-10 rounded-md border px-2 bg-background"
                  value={it.price}
                  onChange={(e) =>
                    onChangePriceAction(idx, parseFloat(e.target.value || "0"))
                  }
                />

                {/* Sub block: per-item total and delete */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">${it.total.toFixed(2)}</div>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onRemoveAction(idx)}
                    aria-label={t("new.remove")}
                    title={t("new.remove")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end">
          <Button size="lg" variant="secondary" onClick={onAddAction}>
            {t("new.addItem")}
          </Button>
        </div>
      </div>
    </div>
  );
}
