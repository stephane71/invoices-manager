import { CreditCard, Pencil, Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface IbanCardProps {
  iban: string;
  onClickEdit: () => void;
  onClickDelete: () => void;
}

export const IbanCard = ({
  iban,
  onClickEdit,
  onClickDelete,
}: IbanCardProps) => {
  const t = useTranslations("Invoices");

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <CreditCard />
        <span>{iban}</span>
      </div>

      {iban ? (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClickEdit}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClickDelete}
          >
            <Trash />
          </Button>
        </div>
      ) : (
        <div>
          <Button type="button" variant="ghost" size="lg" onClick={onClickEdit}>
            <Plus />
            <span>{t("new.payment.addRib")}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
