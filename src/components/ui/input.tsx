import * as React from "react";
import { icons, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  icon?: keyof typeof icons;
}

function Input({ className, type, icon, ...props }: InputProps) {
  const IconComponent: LucideIcon | undefined = icon ? icons[icon] : undefined;

  const inputElement = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        IconComponent && "pl-9",
        className,
      )}
      {...props}
    />
  );

  if (IconComponent) {
    return (
      <div className="relative">
        <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        {inputElement}
      </div>
    );
  }

  return inputElement;
}

export { Input };
