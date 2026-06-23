import apiClient from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCities = createAsyncThunk(
  "cities/fetchByState",
  async (stateId: string) => {
    const res = await apiClient.post(`/general/cities/${stateId}`);
    return res?.data?.data?.data ?? [];
  },
);
const citySlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      });
  },
});

export default citySlice.reducer;

// export default citySlice.reducer;
