import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LearningPageNav } from "@/components/learning/LearningPageNav";
import { Button } from "@/components/ui/button";
import { APP_PREFIX } from "@/lib/constants";
import {
  getAllLearningPages,
  getAdjacentPages,
  getLearningPage,
} from "@/lib/learning";

type LearningDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all learning pages
export const generateStaticParams = async () => {
  const pages = await getAllLearningPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
};

export default async function LearningDetailPage({
  params,
}: LearningDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations("Learning");

  let page;
  try {
    page = await getLearningPage(slug);
  } catch {
    notFound();
  }

  const { previous, next } = await getAdjacentPages(slug);

  // Format date
  const formattedDate = new Date(page.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back link */}
      <div className="mb-6">
        <Link href={`/${APP_PREFIX}/learning`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            {t("backToList")}
          </Button>
        </Link>
      </div>

      {/* Article */}
      <article className="space-y-6">
        {/* Header */}
        <header className="space-y-4 border-b pb-6">
          <h1 className="text-4xl font-bold">{page.title}</h1>

          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4" />
            <time dateTime={page.date}>
              {t("publishedOn")} {formattedDate}
            </time>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-slate max-w-none dark:prose-invert
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:font-semibold prose-strong:text-foreground
            prose-ul:my-6 prose-li:my-2
            prose-table:my-6"
          dangerouslySetInnerHTML={{ __html: page.content || "" }}
        />

        {/* Navigation */}
        <LearningPageNav previous={previous} next={next} />
      </article>
    </div>
  );
}
