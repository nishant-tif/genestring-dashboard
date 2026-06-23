import type { Article, CategoryTaxonomy, TagTaxonomy } from "@/types/article";

/** Resolve selected category ids for the article form (supports API + legacy shapes). */
export function categoryIdsFromArticle(article: Article | null | undefined): string[] {
  if (!article) return [];
  if (Array.isArray(article.categories) && article.categories.length) {
    return article.categories
      .map((c) => {
        const id =
          (c as CategoryTaxonomy & { category_id?: unknown }).id ??
          (c as CategoryTaxonomy & { category_id?: unknown }).category_id;
        return id != null && String(id) !== "" ? String(id) : "";
      })
      .filter(Boolean);
  }
  if (article.categoryIds?.length) {
    return article.categoryIds.map(String);
  }
  if (article.category_ids?.length) {
    return article.category_ids.map(String);
  }
  if (article.category_id) return [String(article.category_id)];
  const raw = article.category;
  if (Array.isArray(raw) && raw.length) {
    if (typeof raw[0] === "object" && raw[0] !== null) {
      return (raw as { id?: unknown; category_id?: unknown }[])
        .map((c) => {
          const id = c.id ?? c.category_id;
          return id != null && String(id) !== "" ? String(id) : "";
        })
        .filter(Boolean);
    }
    return raw.map(String);
  }
  return [];
}

/** Resolve selected tag ids for the article form (supports API + legacy shapes). */
export function tagIdsFromArticle(article: Article | null | undefined): string[] {
  if (!article) return [];
  if (Array.isArray(article.tags) && article.tags.length) {
    return article.tags
      .map((t) => {
        const id =
          (t as TagTaxonomy & { tag_id?: unknown }).id ??
          (t as TagTaxonomy & { tag_id?: unknown }).tag_id;
        return id != null && String(id) !== "" ? String(id) : "";
      })
      .filter(Boolean);
  }
  if (article.tagIds?.length) {
    return article.tagIds.map(String);
  }
  if (article.tag_ids?.length) {
    return article.tag_ids.map(String);
  }
  if (article.tag_id) return [String(article.tag_id)];
  const raw = article.tag;
  if (Array.isArray(raw) && raw.length) {
    if (typeof raw[0] === "object" && raw[0] !== null) {
      return (raw as { id?: unknown; tag_id?: unknown }[])
        .map((t) => {
          const id = t.id ?? t.tag_id;
          return id != null && String(id) !== "" ? String(id) : "";
        })
        .filter(Boolean);
    }
    return raw.map(String);
  }
  return [];
}
