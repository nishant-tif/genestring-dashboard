import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/api";

export interface Tag {
  tag_id: string;
  tag_name: string;
  tag_slug: string;
  tag_description?: string;
  meta_tag?: string;
  meta_description?: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchTags = createAsyncThunk(
  "tags/search",
  async (params: { search?: string; page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/tag/search", params);
      return response.data.data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  },
);

export const createTag = createAsyncThunk(
  "tags/create",
  async (data: Partial<Tag>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/tag", data);
      return response.data.data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  },
);

export const deleteTag = createAsyncThunk(
  "tags/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/tag/${id}`);
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  },
);

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.error = null;
        if (state.tags.length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.rows;
        state.total = action.payload.count;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        if (action.payload) state.tags.unshift(action.payload);
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => String(tag.tag_id) !== String(action.payload));
      });
  },
});

export default tagSlice.reducer;
