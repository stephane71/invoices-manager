import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { Illustration } from "@/components/mdx/Illustration";
import { InfoBox } from "@/components/mdx/InfoBox";
import { TaxCalculator } from "@/components/mdx/TaxCalculator";

const learningDirectory = path.join(process.cwd(), "content/learning");

// MDX components available in all learning pages
const mdxComponents = {
  InfoBox,
  TaxCalculator,
  Illustration,
};

export type LearningPage = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: React.ReactElement;
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
      .filter(
        (fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"),
      )
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx?$/, "");
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
 * Get a single learning page by slug with rendered MDX content
 */
export const getLearningPage = async (slug: string): Promise<LearningPage> => {
  // Try .mdx first, then .md for backward compatibility
  let fullPath = path.join(learningDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(learningDirectory, `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Learning page not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Compile MDX with custom components
  const { content, frontmatter } = await compileMDX<{
    title: string;
    date: string;
    excerpt: string;
  }>({
    source: fileContents,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    content,
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
    next:
      currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
  };
};
