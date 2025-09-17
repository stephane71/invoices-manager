import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Render a responsive grid of simple block skeletons to represent loading list items
  const items = Array.from({ length: 6 });

  return (
    <div className="p-2" role="status" aria-busy="true" aria-live="polite">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-40 w-full rounded-xl"
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
