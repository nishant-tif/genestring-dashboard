import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { modelService } from "@/services/dataService";
import type { Model } from "@/types";

interface ModelsState {
  models: Model[];
  loading: boolean;
  error: string | null;
  selectedModel: Model | null;
}

const initialState: ModelsState = {
  models: [],
  loading: false,
  error: null,
  selectedModel: null,
};

export const fetchModels = createAsyncThunk(
  "models/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const models = await modelService.getAll();
      return models;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const createModel = createAsyncThunk(
  "models/create",
  async (model: Omit<Model, "id">, { rejectWithValue }) => {
    try {
      const newModel = await modelService.create(model);
      return newModel;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateModel = createAsyncThunk(
  "models/update",
  async (
    { id, model }: { id: string; model: Partial<Model> },
    { rejectWithValue },
  ) => {
    try {
      const updatedModel = await modelService.update(id, model);
      return updatedModel;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const deleteModel = createAsyncThunk(
  "models/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await modelService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    setSelectedModel: (state, action: PayloadAction<Model | null>) => {
      state.selectedModel = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchModels.fulfilled,
        (state, action: PayloadAction<Model[]>) => {
          state.loading = false;
          state.models = action.payload;
        },
      )
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.models.push(action.payload);
      })
      .addCase(createModel.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateModel.fulfilled, (state, action: PayloadAction<Model>) => {
        const index = state.models.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
      })
      .addCase(
        deleteModel.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.models = state.models.filter((m) => m.id !== action.payload);
        },
      );
  },
});

export const { setSelectedModel, clearError } = modelsSlice.actions;
export default modelsSlice.reducer;
