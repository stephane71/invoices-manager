import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductListItemSkeleton = () => {
  return (
    <Item variant="outline" size="sm">
      <ItemMedia>
        <Skeleton className="h-10 w-10 rounded" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </ItemContent>
      <ItemActions>
        <Skeleton className="size-4" />
      </ItemActions>
    </Item>
  );
};
