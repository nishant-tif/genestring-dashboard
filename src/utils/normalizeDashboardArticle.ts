import type { Article, Author } from "@/types/article";

type RawArticle = Article &
  Record<string, unknown> & {
    byLiner?: { id?: string | number | null; name?: string | null };
    title?: string;
    slug?: string;
    /** API GET with showContent returns `content`, not `article_content`. */
    content?: string;
    featureImg?: string;
    visibility?: Article["article_visibility"];
    visiblity?: Article["article_visibility"];
  };

function idsFromTaxonomyRows(
  rows: unknown,
  idKeys: readonly ("id" | "category_id" | "tag_id")[],
): string[] {
  if (!Array.isArray(rows)) return [];
  const out: string[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    for (const k of idKeys) {
      const v = o[k];
      if (v != null && String(v) !== "") {
        out.push(String(v));
        break;
      }
    }
  }
  return out;
}

/** Merge API / legacy article shapes so dashboard UI always has stable keys. */
export function normalizeDashboardArticle(raw: Article): Article {
  const r = raw as RawArticle;
  const id = String(r.id ?? r.article_id ?? "");
  const owner = (r.owner_details ?? r.Owner) as Author | undefined;

  const explicitCat = r.categoryIds ?? r.category_ids;
  const uniqueCategoryIds = explicitCat?.length
    ? [...new Set(explicitCat.map(String))]
    : [...new Set(idsFromTaxonomyRows(r.categories, ["id", "category_id"]))];

  const explicitTag = r.tagIds ?? r.tag_ids;
  const uniqueTagIds = explicitTag?.length
    ? [...new Set(explicitTag.map(String))]
    : [...new Set(idsFromTaxonomyRows(r.tags, ["id", "tag_id"]))];

  const authorFromByLiner = r.byLiner?.id;

  return {
    ...r,
    id,
    article_id: r.article_id ?? r.id,
    article_title: r.article_title ?? r.title,
    article_slug: r.article_slug ?? r.slug,
    article_content: r.article_content ?? r.content ?? "",
    article_excerpt: r.article_excerpt ?? r.meta?.subheading,
    article_thumbnail_image:
      r.article_thumbnail_image ?? r.featureImg ?? undefined,
    article_thumbnail_caption:
      r.article_thumbnail_caption ?? r.meta?.imgcaption,
    article_thumbnail_image_alt_text:
      r.article_thumbnail_image_alt_text ?? r.meta?.alt,
    meta_title: r.meta_title ?? r.meta?.meta_title,
    meta_description: r.meta_description ?? r.meta?.meta_description,
    meta_keywords: r.meta_keywords ?? r.meta?.keywords,
    article_visibility:
      r.article_visibility ?? r.visibility ?? r.visiblity,
    author_id:
      r.author_id != null && String(r.author_id) !== ""
        ? String(r.author_id)
        : authorFromByLiner != null && String(authorFromByLiner) !== ""
          ? String(authorFromByLiner)
          : undefined,
    owner_details: owner,
    Owner: (r.Owner ?? owner) as Article["Owner"],
    categoryIds: uniqueCategoryIds,
    tagIds: uniqueTagIds,
    category_ids: uniqueCategoryIds as Article["category_ids"],
    tag_ids: uniqueTagIds as Article["tag_ids"],
  };
}

export function getArticleAuthorDisplayName(article: Article): string {
  const a = article as RawArticle;
  return (
    a.owner_details?.author_name ||
    a.Owner?.author_name ||
    a.byLiner?.name ||
    "Unknown"
  );
}
