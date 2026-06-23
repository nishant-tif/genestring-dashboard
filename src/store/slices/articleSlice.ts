import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { articleService } from "@/services/dataService";
import type {
  PaginationParams,
  ArticleSearchResponse,
  Article,
  // ArticleListItem,
} from "@/types/article";

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  selectedArticle: Article | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: ArticleState = {
  articles: [],
  loading: false,
  error: null,
  selectedArticle: null,
  total: 0,
  page: 1,
  limit: 10,
};

//
// FETCH (SEARCH)
//
export const fetchArticles = createAsyncThunk<
  ArticleSearchResponse,
  PaginationParams
>("articles/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await articleService.search(params);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

//
// CREATE
//
export const createArticle = createAsyncThunk<Article, Omit<Article, "id">>(
  "articles/create",
  async (article, { rejectWithValue }) => {
    try {
      return await articleService.create(article);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

//
// UPDATE
//
export const updateArticle = createAsyncThunk<
  Article,
  { id: string; article: Partial<Article> }
>("articles/update", async ({ id, article }, { rejectWithValue }) => {
  try {
    return await articleService.update(id, article);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

//
// DELETE
//
export const deleteArticle = createAsyncThunk<string, string>(
  "articles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await articleService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setSelectedArticle: (state, action: PayloadAction<Article | null>) => {
      state.selectedArticle = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchArticles.fulfilled,
        (state, action: PayloadAction<ArticleSearchResponse>) => {
          state.loading = false;
          state.articles = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit =
            action.payload.pageSize ??
            action.payload.size ??
            action.payload.limit ??
            10;
        },
      )
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateArticle.fulfilled, (state, action) => {
        const pid = String(
          action.payload.id ?? action.payload.article_id ?? "",
        );
        const index = state.articles.findIndex(
          (a) =>
            String(a.id) === pid || String(a.article_id ?? a.id ?? "") === pid,
        );
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        const pid = String(action.payload);
        state.articles = state.articles.filter(
          (a) => String(a.id) !== pid && String(a.article_id ?? "") !== pid,
        );
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedArticle, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
