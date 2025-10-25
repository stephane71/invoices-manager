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
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/ui/price-input";
import { centsToCurrencyString } from "@/lib/utils";
import { APP_LOCALE } from "@/lib/constants";

export type InvoiceItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number; // in cents (integer)
  total: number; // in cents (integer)
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
  onChangePriceAction: (index: number, cents: number) => void;
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
  const c = useTranslations("Common");

  return (
    <div>
      <div className="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("new.items")}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("new.empty")}</p>
        ) : (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="space-y-3 p-4 border rounded-lg">
                {/* Product Select */}
                <div className="space-y-1">
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
                </div>

                {/* Quantity Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`quantity-${idx}`}
                    className="text-sm font-medium"
                  >
                    {t("new.quantity")}
                  </Label>
                  <Input
                    id={`quantity-${idx}`}
                    type="number"
                    min={1}
                    className="h-10 rounded-md border px-2 bg-background"
                    value={it.quantityInput ?? String(it.quantity)}
                    onChange={(e) => onChangeQtyAction(idx, e.target.value)}
                    onBlur={() => onBlurQtyAction(idx)}
                  />
                </div>

                {/* Unit Price Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`price-${idx}`}
                    className="text-sm font-medium"
                  >
                    {t("new.unitPrice")}
                  </Label>
                  <PriceInput
                    id={`price-${idx}`}
                    value={it.price}
                    onChange={(cents) => onChangePriceAction(idx, cents)}
                    placeholder="0,00"
                  />
                </div>

                {/* Total and Delete Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm font-medium">
                    Total: {centsToCurrencyString(it.total, "EUR", APP_LOCALE)} {c("vatExcluded")}
                  </div>
                  <Button
                    size="sm"
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
