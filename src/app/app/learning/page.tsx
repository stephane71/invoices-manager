import { getTranslations } from "next-intl/server";
import { LearningPageItem } from "@/components/learning/LearningPageItem";
import { getAllLearningPages } from "@/lib/learning";

export default async function LearningPage() {
  const pages = await getAllLearningPages();
  const t = await getTranslations("Learning");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <LearningPageItem key={page.slug} page={page} />
        ))}
      </div>
    </div>
  );
}
