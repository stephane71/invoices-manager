import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const learningDirectory = path.join(process.cwd(), "content/learning");

export type LearningPage = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
};

/**
 * Get all learning pages sorted alphabetically by title
 */
export const getAllLearningPages = async (): Promise<LearningPage[]> => {
  // Ensure directory exists
  if (!fs.existsSync(learningDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(learningDirectory);
  const allPagesData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(learningDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Parse frontmatter
        const matterResult = matter(fileContents);

        return {
          slug,
          title: matterResult.data.title as string,
          date: matterResult.data.date as string,
          excerpt: matterResult.data.excerpt as string,
        };
      }),
  );

  // Sort alphabetically by title
  return allPagesData.sort((a, b) => a.title.localeCompare(b.title));
};

/**
 * Get a single learning page by slug with rendered HTML content
 */
export const getLearningPage = async (
  slug: string,
): Promise<LearningPage> => {
  const fullPath = path.join(learningDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Learning page not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Parse frontmatter
  const matterResult = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false }) // We trust our own markdown content
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    excerpt: matterResult.data.excerpt as string,
    content: contentHtml,
  };
};

/**
 * Get adjacent pages (previous and next) in alphabetical order
 */
export const getAdjacentPages = async (
  slug: string,
): Promise<{
  previous: LearningPage | null;
  next: LearningPage | null;
}> => {
  const allPages = await getAllLearningPages();
  const currentIndex = allPages.findIndex((page) => page.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
  };
};
