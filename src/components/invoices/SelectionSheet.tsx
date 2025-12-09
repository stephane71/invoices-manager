import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export type SelectionSheetProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  searchPlaceholder: string;
  noResultsMessage: string;
  items: T[];
  renderItem: (item: T, onSelect: () => void) => React.ReactNode;
  onSelect: (item: T) => void;
  getItemKey: (item: T) => string;
  filterItem: (item: T, searchQuery: string) => boolean;
};

export const SelectionSheet = <T,>({
  open,
  onOpenChange,
  title,
  searchPlaceholder,
  noResultsMessage,
  items,
  renderItem,
  onSelect,
  getItemKey,
  filterItem,
}: SelectionSheetProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const tCommon = useTranslations("Common");

  const filteredItems = items.filter((item) =>
    filterItem(item, searchQuery.toLowerCase()),
  );

  const handleSelect = (item: T) => {
    onSelect(item);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearchQuery("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
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

        {/* SEARCH INPUT */}
        <div className="shrink-0 p-4">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>

        {/* ITEMS LIST - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-muted-foreground flex items-center justify-center p-8 text-center text-sm">
              {noResultsMessage}
            </div>
          ) : (
            <div className="divide-y">
              {filteredItems.map((item) => (
                <div key={getItemKey(item)}>
                  {renderItem(item, () => handleSelect(item))}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
