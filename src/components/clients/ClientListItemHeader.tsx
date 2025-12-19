import { Building2, User } from "lucide-react";
import { ClientForm } from "@/components/clients/clients";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type ClientListItemHeaderProps = {
  name: string;
  type: ClientForm["client_type"];
};

export const ClientListItemHeader = ({
  name,
  type,
}: ClientListItemHeaderProps) => {
  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="image">
        <Avatar className="size-8">
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        {type === "person" ? (
          <User className="size-4" />
        ) : (
          <Building2 className="size-4" />
        )}
      </ItemActions>
    </Item>
  );
};
