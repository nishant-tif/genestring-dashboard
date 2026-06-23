/* ===============================
   AUTHOR INTERFACE
=============================== */

export interface Author {
  author_id: string;
  author_name: string;
  author_email: string;
  owner?: Record<string, unknown>;
  edit_by?: Record<string, unknown>;
  status_flag?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ===============================
   AUTHOR CREATE PAYLOAD
=============================== */

export interface CreateAuthorRequest {
  author_name: string;
  author_email: string;
}

/* ===============================
   AUTHOR UPDATE PAYLOAD
=============================== */

export interface UpdateAuthorRequest {
  author_name?: string;
  author_email?: string;
}

/* ===============================
   AUTHOR SEARCH RESPONSE
=============================== */

export interface AuthorSearchResponse {
  data: Author[];
  total: number;
  page: number;
  limit: number;
}
