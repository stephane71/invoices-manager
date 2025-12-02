import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export type ClientListItemProps = {
  id: string;
  name: string;
};

export const ClientListItem = ({ id, name }: ClientListItemProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      // The transition will complete when the URL updates
    });
  };

  return (
    <Item variant="outline" size="sm" asChild>
      <Link
        href={`/clients?id=${id}`}
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
