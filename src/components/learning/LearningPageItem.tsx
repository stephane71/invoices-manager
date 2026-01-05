import { Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { APP_PREFIX } from "@/lib/constants";
import type { LearningPage } from "@/lib/learning";

type LearningPageItemProps = {
  page: LearningPage;
};

export const LearningPageItem = ({ page }: LearningPageItemProps) => {
  const t = useTranslations("Learning");

  // Format date
  const formattedDate = new Date(page.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/${APP_PREFIX}/learning/${page.slug}`}
      className="block rounded-lg border p-6 transition-colors hover:border-primary hover:bg-accent"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{page.title}</h2>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="size-4" />
          <time dateTime={page.date}>
            {t("publishedOn")} {formattedDate}
          </time>
        </div>

        <p className="text-muted-foreground line-clamp-3">{page.excerpt}</p>

        <div className="text-primary pt-2 text-sm font-medium">
          {t("readMore")} →
        </div>
      </div>
    </Link>
  );
};
