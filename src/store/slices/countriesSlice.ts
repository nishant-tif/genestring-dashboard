import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/api";

/* ---------------- TYPES ---------------- */

export interface Country {
  country_id: number;
  id: number;
  countryName: string;
}

interface CountryState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}

/* ---------------- THUNK ---------------- */

export const fetchCountries = createAsyncThunk<Country[]>(
  "countries/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/general/countries");
      return res?.data?.data?.data ?? [];
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        return rejectWithValue((error as { message: string }).message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  },
);

/* ---------------- INITIAL STATE ---------------- */

const initialState: CountryState = {
  countries: [],
  loading: false,
  error: null,
};

/* ---------------- SLICE ---------------- */

const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* pending */
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /* success */
      .addCase(
        fetchCountries.fulfilled,
        (state, action: PayloadAction<Country[]>) => {
          state.loading = false;
          state.countries = action.payload;
        },
      )

      /* error */
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default countrySlice.reducer;
