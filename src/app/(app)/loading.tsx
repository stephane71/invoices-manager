import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const items = Array.from({ length: 6 });

  return (
    <div className="p-2" role="status" aria-busy="true" aria-live="polite">
      <div className="grid gap-4">
        {items.map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-20 w-full rounded-xl"
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
