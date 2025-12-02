import { useTranslations } from "next-intl";
import { Fragment } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";
import { Client, Invoice, InvoiceItem } from "@/types/models";

export type InvoiceViewProps = {
  invoice: Invoice & { clients: Pick<Client, "name"> };
  total: number;
};

export const InvoiceView = ({ invoice, total }: InvoiceViewProps) => {
  const tCommon = useTranslations("Common");
  const tInvoices = useTranslations("Invoices");

  return (
    <div className="space-y-4">
      <ItemGroup>
        <Item size="sm" variant="muted">
          <ItemContent>
            <ItemTitle>
              <h1 className="text-xl font-semibold">
                {centsToCurrencyString(total, "EUR", APP_LOCALE)}{" "}
                {tCommon("vatExcluded")}
              </h1>
            </ItemTitle>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>{tInvoices("detail.clientLabel")}</ItemTitle>
          </ItemContent>
          <ItemContent>
            <ItemTitle>{invoice.clients?.name}</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemContent>
            <ItemTitle>{tInvoices("detail.issued")}</ItemTitle>
          </ItemContent>
          <ItemContent>
            <ItemTitle>{invoice.issue_date}</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>

      <ItemGroup className="rounded-lg border bg-white">
        {invoice.items.map((it: InvoiceItem, idx: number) => (
          <Fragment key={idx}>
            <Item>
              <ItemContent>
                <ItemTitle>{it.name}</ItemTitle>
                <ItemDescription>
                  {tInvoices("detail.qty")} {it.quantity} ×{" "}
                  {centsToCurrencyString(it.price, "EUR", APP_LOCALE)}{" "}
                  {tCommon("vatExcluded")}
                </ItemDescription>
              </ItemContent>
              <ItemContent>
                <ItemTitle>
                  {centsToCurrencyString(it.total, "EUR", APP_LOCALE)}{" "}
                  {tCommon("vatExcluded")}
                </ItemTitle>
              </ItemContent>
            </Item>
            {idx < invoice.items.length - 1 && <ItemSeparator />}
          </Fragment>
        ))}
      </ItemGroup>
    </div>
  );
};
