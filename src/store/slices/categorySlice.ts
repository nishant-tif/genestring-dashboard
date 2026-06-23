import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";

export interface Category {
  id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  meta_tag?: string;
  meta_description?: string;
  status_flag: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategorySearchResponse {
  rows: Category[];
  count: number;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: Category | null;
  total: number;
  page: number;
  size: number;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,
  total: 0,
  page: 1,
  size: 10,
};

/* ===============================
   SEARCH CATEGORIES
=============================== */
export const fetchCategories = createAsyncThunk<
  CategorySearchResponse,
  { search?: string; page?: number; size?: number }
>("categories/search", async (params, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.CATEGORY_SEARCH,
      params,
    );

    return response.data.data.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const errorMessage =
      (error as { response?: { data?: { data?: { message: string } } } })
        ?.response?.data?.data?.message || message;
    return rejectWithValue(errorMessage);
  }
});

/* ===============================
   CREATE CATEGORY
=============================== */
export const createCategory = createAsyncThunk<Category, Partial<Category>>(
  "categories/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, data);
      return response.data.data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const errorMessage =
        (error as { response?: { data?: { data?: { message: string } } } })
          ?.response?.data?.data?.message || message;
      return rejectWithValue(errorMessage);
    }
  },
);

/* ===============================
   UPDATE CATEGORY
=============================== */
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: Partial<Category> }
>("categories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.CATEGORY_BY_ID(id),
      data,
    );
    return response.data.data.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const errorMessage =
      (error as { response?: { data?: { data?: { message: string } } } })
        ?.response?.data?.data?.message || message;
    return rejectWithValue(errorMessage);
  }
});

/* ===============================
   DELETE CATEGORY (SOFT)
=============================== */
export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const errorMessage =
        (error as { response?: { data?: { data?: { message: string } } } })
          ?.response?.data?.data?.message || message;
      return rejectWithValue(errorMessage);
    }
  },
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* SEARCH */
      .addCase(fetchCategories.pending, (state) => {
        state.error = null;
        if (state.categories.length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.rows;
        state.total = action.payload.count;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* CREATE */
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.categories.unshift(action.payload);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      /* UPDATE */
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.category_id === action.payload.category_id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat.category_id.toString() !== action.payload,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory, clearCategoryError } =
  categorySlice.actions;

export default categorySlice.reducer;
