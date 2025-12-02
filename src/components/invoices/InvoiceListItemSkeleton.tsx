import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export const InvoiceListItemSkeleton = () => {
  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="image">
        <Skeleton className="size-8 rounded-full" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </ItemContent>
      <ItemContent>
        <Skeleton className="h-4 w-28" />
      </ItemContent>
      <ItemActions>
        <Skeleton className="size-4" />
      </ItemActions>
    </Item>
  );
};
