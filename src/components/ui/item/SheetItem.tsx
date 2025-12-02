import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";

export type SheetItemProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: ReactNode;
  footer?: ReactNode;
};

export const SheetItem = ({
  open,
  onOpenChange,
  title,
  content,
  footer,
}: SheetItemProps) => {
  const tCommon = useTranslations("Common");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-2xl"
        hideDefaultClose
      >
        {/* HEADER */}
        <header className="bg-background flex h-16 shrink-0 items-center justify-center border-b">
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4"
              aria-label={tCommon("close")}
            >
              <ArrowLeft className="size-5" />
            </Button>
          </SheetClose>
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
        </header>

        {/* CONTENT Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">{content}</div>

        {/* FOOTER with form actions */}
        {footer && (
          <SheetFooter className="bg-background shrink-0 border-t p-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
