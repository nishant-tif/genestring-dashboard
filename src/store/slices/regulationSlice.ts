import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Regulation } from "@/types/widget";
import apiClient from "@/services/api";

interface RegulationState {
  regulations: Regulation[];
  loading: boolean;
  error: string | null;
}

const initialState: RegulationState = {
  regulations: [],
  loading: false,
  error: null,
};

/* ================= GET REGULATIONS ================= */

export const fetchRegulations = createAsyncThunk<
  Regulation[],
  void,
  { rejectValue: string }
>("regulations/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get("/general/regulations");
    return res.data.data;
  } catch {
    return rejectWithValue("Failed to fetch regulations");
  }
});

/* ================= SAVE REGULATIONS ================= */

export const saveRegulations = createAsyncThunk<
  Regulation[],
  Regulation[],
  { rejectValue: string }
>("regulations/save", async (cards, { rejectWithValue }) => {
  try {
    await apiClient.post("/general/regulations", {
      regulation_cards: cards,
    });
    return cards;
  } catch {
    return rejectWithValue("Failed to fetch regulations");
  }
});

/* ================= DELETE REGULATION ================= */

export const deleteRegulation = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("regulations/delete", async (index, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/general/regulations/${index}`);
    return index;
  } catch {
    return rejectWithValue("Failed to fetch regulations");
  }
});

const regulationSlice = createSlice({
  name: "regulations",
  initialState,

  reducers: {
    addLocalRegulation: (state, action: PayloadAction<Regulation>) => {
      state.regulations.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchRegulations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegulations.fulfilled, (state, action) => {
        state.loading = false;
        state.regulations = action.payload;
      })
      .addCase(
        fetchRegulations.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        },
      )

      /* SAVE */
      .addCase(saveRegulations.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveRegulations.fulfilled, (state, action) => {
        state.loading = false;
        state.regulations = action.payload;
      })
      .addCase(
        saveRegulations.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        },
      )

      /* DELETE */
      .addCase(deleteRegulation.fulfilled, (state, action) => {
        state.regulations.splice(action.payload, 1);
      });
  },
});

export const { addLocalRegulation } = regulationSlice.actions;

export default regulationSlice.reducer;
