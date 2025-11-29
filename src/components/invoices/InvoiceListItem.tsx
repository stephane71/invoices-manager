import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { APP_LOCALE } from "@/lib/constants";
import { centsToCurrencyString } from "@/lib/utils";

export type InvoiceListItemProps = {
  id: string;
  number: string;
  name: string;
  price: number;
};

export const InvoiceListItem = ({
  id,
  number,
  name,
  price,
}: InvoiceListItemProps) => {
  const c = useTranslations("Common");
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      // The transition will complete when the URL updates
    });
  };

  return (
    <Item variant="outline" size="sm" asChild>
      <Link
        href={`/invoices?id=${id}`}
        onClick={handleClick}
        className={isPending ? "opacity-60" : ""}
      >
        <ItemMedia variant="image">
          <Avatar className="size-8">
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{name}</ItemTitle>
          <ItemDescription>{number}</ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle>{`${centsToCurrencyString(price, "EUR", APP_LOCALE)} ${c("vatExcluded")}`}</ItemTitle>
        </ItemContent>
        <ItemActions>
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin text-gray-400" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </ItemActions>
      </Link>
    </Item>
  );
};
