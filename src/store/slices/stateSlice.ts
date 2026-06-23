import apiClient from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchStates = createAsyncThunk(
  "states/fetchByCountry",
  async (countryId: string) => {
    const res = await apiClient.post(`/general/states/${countryId}`);
    return res?.data?.data?.data ?? [];
  },
);

const stateSlice = createSlice({
  name: "states",
  initialState: {
    states: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      });
  },
});

export default stateSlice.reducer;
