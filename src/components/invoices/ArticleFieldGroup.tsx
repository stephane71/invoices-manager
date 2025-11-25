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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PriceInput } from "@/components/ui/price-input";
import { centsToCurrencyString } from "@/lib/utils";
import { APP_LOCALE } from "@/lib/constants";
import { InvoiceItem } from "@/components/invoices/invoices";

export type ArticleFieldGroupProps = {
  item: InvoiceItem;
  products: Product[];
  onChange: (item: InvoiceItem) => void;
  onRemove: () => void;
};

export function ArticleFieldGroup({
  item,
  products,
  onChange,
  onRemove,
}: ArticleFieldGroupProps) {
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  const handleProductChange = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const priceCents = prod?.price || 0;
    const name = prod?.name || "";
    const qty = item.quantity ?? 0;
    const totalCents = Math.round(priceCents * qty);

    onChange({
      ...item,
      product_id: productId,
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

  return (
    <FieldGroup className="p-2 border rounded-lg">
      {/* Product Select */}
      <Field>
        <Select
          value={item.product_id || ""}
          onValueChange={handleProductChange}
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
      </Field>

      {/* Quantity Input */}
      <Field>
        <FieldLabel htmlFor={`quantity-${item.product_id}`}>
          {t("new.quantity")}
        </FieldLabel>
        <Input
          id={`quantity-${item.product_id}`}
          type="number"
          min={1}
          className="h-10 rounded-md border px-2 bg-background"
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
}
