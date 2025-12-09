import { ChevronRight, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SelectionSheet } from "@/components/invoices/SelectionSheet";
import { InvoiceItem } from "@/components/invoices/invoices";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";
import type { Product } from "@/types/models";

export type ArticleFieldGroupProps = {
  item: InvoiceItem;
  products: Product[];
  onChange: (item: InvoiceItem) => void;
  onRemove: () => void;
};

export const ArticleFieldGroup = ({
  item,
  products,
  onChange,
  onRemove,
}: ArticleFieldGroupProps) => {
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    const priceCents = product.price || 0;
    const name = product.name || "";
    const qty = item.quantity ?? 0;
    const totalCents = Math.round(priceCents * qty);

    onChange({
      ...item,
      product_id: product.id,
      name,
      price: priceCents,
      total: totalCents,
    });
  };

  const handleQuantityChange = (rawValue: string) => {
    // Allow temporary empty string while typing
    if (rawValue === "") {
      onChange({
        ...item,
        quantityInput: "",
        quantity: 0,
        total: 0,
      });
      return;
    }

    // Parse positive integer quantity
    const parsed = parseInt(rawValue, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      onChange({
        ...item,
        quantityInput: rawValue,
        quantity: 0,
        total: 0,
      });
      return;
    }

    const quantity = Math.floor(parsed);
    const priceCents = Number(item.price) || 0;
    const totalCents = Math.round(priceCents * quantity);

    onChange({
      ...item,
      quantityInput: String(quantity),
      quantity,
      total: totalCents,
    });
  };

  const handleQuantityBlur = () => {
    const raw = item.quantityInput ?? String(item.quantity ?? "");
    if (raw === "" || item.quantity === 0) {
      const quantity = 1;
      const priceCents = Number(item.price) || 0;
      const totalCents = Math.round(priceCents * quantity);

      onChange({
        ...item,
        quantityInput: "1",
        quantity,
        total: totalCents,
      });
    }
  };

  const handlePriceChange = (cents: number) => {
    const qty = Number(item.quantity) || 0;
    const totalCents = Math.round(cents * qty);

    onChange({
      ...item,
      price: cents,
      total: totalCents,
    });
  };

  // Get selected product display text
  const selectedProduct = products.find((p) => p.id === item.product_id);
  const displayText = selectedProduct
    ? selectedProduct.name
    : t("new.selectProductPlaceholder");

  return (
    <FieldGroup className="rounded-lg border p-2">
      {/* Product Selection CTA - styled as input */}
      <Field>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={selectedProduct ? "" : "text-muted-foreground"}>
            {displayText}
          </span>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </button>
      </Field>

      {/* Product Selection Sheet */}
      <SelectionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={t("new.items")}
        searchPlaceholder={t("new.searchProductsPlaceholder")}
        noResultsMessage={t("new.noProductsFound")}
        items={products}
        getItemKey={(product) => product.id}
        filterItem={(product, query) =>
          product.name.toLowerCase().includes(query)
        }
        onSelect={handleProductSelect}
        renderItem={(product, onSelect) => (
          <button
            type="button"
            onClick={onSelect}
            className="hover:bg-accent flex w-full flex-col items-start gap-1 px-4 py-3 text-left"
          >
            <div className="font-medium">{product.name}</div>
            <div className="text-muted-foreground text-sm">
              {centsToCurrencyString(product.price, "EUR", APP_LOCALE)}{" "}
              {c("vatExcluded")}
            </div>
          </button>
        )}
      />

      {/* Quantity Input */}
      <Field>
        <FieldLabel htmlFor={`quantity-${item.product_id}`}>
          {t("new.quantity")}
        </FieldLabel>
        <Input
          id={`quantity-${item.product_id}`}
          type="number"
          min={1}
          className="bg-background h-10 rounded-md border px-2"
          value={item.quantityInput ?? String(item.quantity)}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={handleQuantityBlur}
        />
      </Field>

      {/* Unit Price Input */}
      <Field>
        <FieldLabel htmlFor={`price-${item.product_id}`}>
          {t("new.unitPrice")}
        </FieldLabel>
        <PriceInput
          id={`price-${item.product_id}`}
          value={item.price}
          onChange={handlePriceChange}
          placeholder="0,00"
        />
      </Field>

      {/* Total and Delete Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm font-medium">
          Total: {centsToCurrencyString(item.total, "EUR", APP_LOCALE)}{" "}
          {c("vatExcluded")}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onRemove}
          aria-label={t("new.remove")}
          title={t("new.remove")}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </FieldGroup>
  );
};
