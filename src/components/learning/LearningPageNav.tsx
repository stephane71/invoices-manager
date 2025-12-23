import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { APP_PREFIX } from "@/lib/constants";
import type { LearningPage } from "@/lib/learning";

type LearningPageNavProps = {
  previous: LearningPage | null;
  next: LearningPage | null;
};

export const LearningPageNav = ({
  previous,
  next,
}: LearningPageNavProps) => {
  const t = useTranslations("Learning");

  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="mt-12 flex items-center justify-between gap-4 border-t pt-8">
      <div className="flex-1">
        {previous && (
          <Link href={`/${APP_PREFIX}/learning/${previous.slug}`}>
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">{t("previous")}:</span>
              <span className="truncate">{previous.title}</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {next && (
          <Link href={`/${APP_PREFIX}/learning/${next.slug}`}>
            <Button variant="outline" className="gap-2">
              <span className="truncate">{next.title}</span>
              <span className="hidden sm:inline">:{t("next")}</span>
              <ChevronRight className="size-4" />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
