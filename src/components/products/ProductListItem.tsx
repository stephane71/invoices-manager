import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
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

export type ProductListItemProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export const ProductListItem = ({
  id,
  name,
  price,
  imageUrl,
}: ProductListItemProps) => {
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
        href={`/app/products?id=${id}`}
        onClick={handleClick}
        className={isPending ? "opacity-60" : ""}
      >
        <ItemMedia>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              className="h-10 w-10 flex-shrink-0 rounded object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
              img
            </div>
          )}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{name}</ItemTitle>
          <ItemDescription>
            {`${centsToCurrencyString(price, "EUR", APP_LOCALE)} ${c("vatExcluded")}`}
          </ItemDescription>
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
