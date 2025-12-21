import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { APP_PREFIX } from "@/lib/constants";

export const ClientsEmptyState = () => {
  const t = useTranslations("Clients");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users className="size-6" />
        </EmptyMedia>
        <EmptyTitle>{t("empty.title")}</EmptyTitle>
        <EmptyDescription>{t("empty.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={`/${APP_PREFIX}/clients/new`}>
            <Plus className="mr-2 size-4" />
            {t("empty.action")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};
