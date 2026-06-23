// Article-related type definitions

export interface Author {
  id?: string;
  author_id?: string;
  author_name: string;
  author_email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryTaxonomy {
  id?: string | number | null;
  name?: string | null;
  slug?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface TagTaxonomy {
  id?: string | number | null;
  name?: string | null;
  slug?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface Category {
  id?: string;
  category_id?: string;
  category_name: string;
  category_slug?: string;
  status_flag?: number;
  createdAt?: string;
  updatedAt?: string;
  meta_tag?: string;
  meta_description?: string;
}

export interface Tag {
  tag_id?: string;
  tag_name: string;
  tag_slug?: string;
  meta_tag?: string;
  meta_description?: string;
}

export interface City {
  id?: string;
  city_id?: string;
  cityName: string;
  state_id?: string;
  status_flag?: number;
}

export interface State {
  id?: string;
  state_id?: string;
  stateName: string;
  country_id?: string;
  status_flag?: number;
}

export interface Country {
  id?: number;
  country_id?: number;
  countryName: string;
  status_flag?: number;
}

export interface Article {
  id: string;
  article_id?: string;
  /** Short API alias; prefer `article_title` when present after normalization. */
  title?: string;
  /** Short API alias; prefer `article_slug` when present after normalization. */
  slug?: string;
  article_title?: string;
  article_slug?: string;
  article_content?: string;
  article_visibility?: "DRAFT" | "PUBLISHED" | undefined;
  visibility?: "DRAFT" | "PUBLISHED";
  /** Legacy API typo still returned by some routes */
  visiblity?: "DRAFT" | "PUBLISHED";
  article_excerpt?: string;
  author_id?: string;
  article_thumbnail_image?: string;
  article_thumbnail_caption?: string;
  article_thumbnail_image_alt_text?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_tag?: string;
  meta?: {
    subheading?: string;
    imgcaption?: string;
    alt?: string;
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
  };
  featured?: boolean;
  show_gif?: boolean;
  gif?: string;
  featureImg?: string;
  categoryIds?: (string | number)[];
  tagIds?: (string | number)[];
  category_ids?: (string | number)[];
  tag_ids?: (string | number)[];
  category_id?: string;
  category?: (string | number)[] | CategoryTaxonomy | CategoryTaxonomy[] | null;
  tag_id?: string;
  tag?: TagTaxonomy | null | (string | number)[] | TagTaxonomy[];
  categories?: CategoryTaxonomy[];
  tags?: TagTaxonomy[];
  owner?: string;
  owner_details?: Author;
  /** API author shorthand */
  byLiner?: { id?: string | number | null; name?: string | null };
  city_id?: string;
  state_id?: string;
  country_id?: string;
  city?: City;
  state?: State;
  country?: Country;
  published_at?: string;
  status_flag?: number;
  createdAt?: string;
  updatedAt?: string;
  edit_by?: string;
  row?: unknown;
  owner_id?: string;
  Owner?: Author;
}

export interface ArticleSearchResponse {
  limit?: number;
  page: number;
  total: number;
  data: Article[];
  /** Some API versions return the list under `rows` instead of `data`. */
  rows?: Article[];
  /** Same as `data`; kept for clients expecting `allData`. */
  allData?: Article[];
  /** Category taxonomy matching `category_slug` / `category_slugs` in the search body (when provided). */
  category?: CategoryTaxonomy | CategoryTaxonomy[] | null;
  /** Tag taxonomy matching `tag_slug` / `tag_slugs` in the search body (when provided). */
  tag?: TagTaxonomy | TagTaxonomy[] | null;
  count?: number;
  pageSize?: number;
  size?: number;
}
// export interface ArticleListItem {
//   id: string;
//   article_title: string;
//   author_id: string;
// }

export interface CreateArticleRequest {
  post_title: string;
  post_slug: string;
  post_content: string;
  post_visibility: "DRAFT" | "PUBLISHED";
  post_excerpt?: string;
  article_thumbnail_image?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  category_ids: string[];
  city_id?: string;
  state_id?: string;
  country_id?: string;
}

// export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

export interface PaginationParams {
  page?: number;
  size?: number;
  pageSize?: number;
  search?: string;
  category_id?: string;
  category_ids?: string[];
  category_slug?: string;
  category_slugs?: string[];
  tag_slug?: string;
  tag_slugs?: string[];
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  size: number;
  totalPages: number;
}
