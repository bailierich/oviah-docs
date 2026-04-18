import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'help');

function requireUpdatedAt(data, filePath) {
  if (!data || !data.updatedAt) {
    const msg = '[content] Missing updatedAt in ' + filePath;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    }
    console.warn(msg);
  }
}

export function getArticleBySlug(category, slug) {
  const filePath = path.join(contentDir, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  requireUpdatedAt(data, filePath);
  return { frontmatter: data, content };
}

export function getArticlesByCategory(category) {
  const categoryDir = path.join(contentDir, category);
  if (!fs.existsSync(categoryDir)) return [];

  return fs.readdirSync(categoryDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(categoryDir, filename), 'utf-8');
      const { data } = matter(raw);
      requireUpdatedAt(data, path.join(categoryDir, filename));
      return { frontmatter: data, slug: filename.replace('.mdx', '') };
    });
}

export function getAllArticles() {
  if (!fs.existsSync(contentDir)) return [];

  const categories = fs.readdirSync(contentDir).filter((f) =>
    fs.statSync(path.join(contentDir, f)).isDirectory()
  );

  return categories.flatMap((category) =>
    getArticlesByCategory(category).map((article) => ({
      ...article,
      category,
    }))
  );
}

/**
 * Convert raw MDX body text to clean plaintext by stripping the JSX wrappers
 * used in content/help/**. Preserves paragraph breaks as \n\n.
 *
 * Scope: the closed set of JSX patterns verified by the planner across all
 * 22 articles. If authoring introduces new JSX wrappers, extend this helper
 * or switch to a remark-based pipeline. The acceptance test asserts that
 * the output contains NO `className=` substrings.
 */
export function mdxBodyToText(raw) {
  let text = raw;

  // Headings: <h2 className="section-heading">TEXT</h2> -> TEXT (with blank lines)
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, '\n\n$1\n\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, '\n\n$1\n\n');

  // Paragraphs: <p className="body-text">TEXT</p> -> TEXT with trailing blank line
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '$1\n\n');

  // Step lists: extract the inner text. step-num/title/desc are divs we collapse.
  text = text.replace(/<div className="step-num">([\s\S]*?)<\/div>/g, '$1. ');
  text = text.replace(/<div className="step-title">([\s\S]*?)<\/div>/g, '$1\n');
  text = text.replace(/<div className="step-desc">([\s\S]*?)<\/div>/g, '$1\n\n');
  text = text.replace(/<div className="tip-icon">([\s\S]*?)<\/div>/g, '$1: ');
  text = text.replace(/<div className="tip-text">([\s\S]*?)<\/div>/g, '$1\n\n');

  // Inline elements: keep the text, drop the tag.
  text = text.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '$1');
  text = text.replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '$1');
  text = text.replace(/<span[^>]*>([\s\S]*?)<\/span>/g, '$1');
  text = text.replace(/<a [^>]*>([\s\S]*?)<\/a>/g, '$1');

  // Remaining wrapper divs (content-section, steps, step, tip-box, plain div):
  // drop the opening tag and the matching closing tag. Any div, any attrs.
  text = text.replace(/<div[^>]*>/g, '');
  text = text.replace(/<\/div>/g, '');

  // Collapse 3+ newlines to 2 (paragraph break). Trim leading/trailing whitespace.
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

export function getAllArticlesWithBody() {
  if (!fs.existsSync(contentDir)) return [];

  const categories = fs.readdirSync(contentDir).filter((f) =>
    fs.statSync(path.join(contentDir, f)).isDirectory()
  );

  return categories.flatMap((category) => {
    const categoryDir = path.join(contentDir, category);
    return fs.readdirSync(categoryDir)
      .filter((f) => f.endsWith('.mdx'))
      .map((filename) => {
        const filePath = path.join(categoryDir, filename);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);
        requireUpdatedAt(data, filePath);
        return {
          frontmatter: data,
          content,
          bodyText: mdxBodyToText(content),
          slug: filename.replace('.mdx', ''),
          category,
        };
      });
  });
}
