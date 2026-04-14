import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'help');

export function getArticleBySlug(category, slug) {
  const filePath = path.join(contentDir, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
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
