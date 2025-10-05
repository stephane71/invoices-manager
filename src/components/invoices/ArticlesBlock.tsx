"use client";
import type { Product } from "@/types/models";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type InvoiceItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  quantityInput?: string;
  priceInput?: string;
};

export type ArticlesBlockProps = {
  products: Product[];
  items: InvoiceItem[];
  onAddAction: () => void;
  onRemoveAction: (index: number) => void;
  onChangeProductAction: (index: number, productId: string) => void;
  onCreateNewProductAction: (index: number, productName: string) => void;
  onChangeQtyAction: (index: number, rawValue: string) => void;
  onBlurQtyAction: (index: number) => void;
  onChangePriceAction: (index: number, rawValue: string) => void;
  onBlurPriceAction: (index: number) => void;
};

export default function ArticlesBlock({
  products,
  items,
  onAddAction,
  onRemoveAction,
  onChangeProductAction,
  onCreateNewProductAction,
  onChangeQtyAction,
  onBlurQtyAction,
  onChangePriceAction,
  onBlurPriceAction,
}: ArticlesBlockProps) {
  const t = useTranslations("Invoices");

  // Convertir les produits au format requis par le Combobox
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

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
                {/* Product Combobox */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    {t("new.product")}
                  </Label>
                  <Combobox
                    options={productOptions}
                    value={it.product_id || ""}
                    onSelect={(productId) =>
                      onChangeProductAction(idx, productId)
                    }
                    onCustomCreate={(productName) =>
                      onCreateNewProductAction(idx, productName)
                    }
                    placeholder={t("new.selectProduct")}
                    searchPlaceholder="Rechercher un produit..."
                    emptyText="Aucun produit trouvé."
                    allowCustom={true}
                    className="h-10"
                  />
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
                    {t("new.unitPrice")} (€)
                  </Label>
                  <Input
                    id={`price-${idx}`}
                    type="text"
                    inputMode="decimal"
                    className="h-10 rounded-md border px-2 bg-background"
                    value={it.priceInput ?? String(it.price)}
                    onChange={(e) => onChangePriceAction(idx, e.target.value)}
                    onBlur={() => onBlurPriceAction(idx)}
                    placeholder="0,00 €"
                  />
                </div>

                {/* Total and Delete Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm font-medium">
                    Total: {it.total.toFixed(2)} €
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
