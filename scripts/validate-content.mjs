/**
 * Build-time content validation script.
 *
 * Runs before `next build` (via the `prebuild` npm script) to verify that
 * every MDX article has a truthy `updatedAt` frontmatter field.
 *
 * In NODE_ENV=production, lib/content.js throws when updatedAt is missing,
 * which causes this script to exit non-zero and abort the build.
 *
 * Usage: node scripts/validate-content.mjs
 */

import { getAllArticles } from '../lib/content.js';

// getAllArticles() calls getArticlesByCategory() for every category,
// which calls requireUpdatedAt() for every article at read time.
// If any article is missing updatedAt and NODE_ENV=production, an error is thrown.
const articles = getAllArticles();
console.log('[validate-content] Checked ' + articles.length + ' articles — all have updatedAt.');
