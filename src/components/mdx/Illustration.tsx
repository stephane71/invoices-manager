"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IllustrationProps = {
  src: string;
  alt: string;
  caption?: ReactNode;
  width?: number;
  height?: number;
  className?: string;
};

export const Illustration = ({
  src,
  alt,
  caption,
  width = 800,
  height = 600,
  className,
}: IllustrationProps) => {
  return (
    <figure className={cn("my-8 space-y-3", className)}>
      <div className="bg-muted/50 overflow-hidden rounded-lg border">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-contain"
          priority={false}
        />
      </div>
      {caption && (
        <figcaption className="text-muted-foreground text-center text-sm italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
