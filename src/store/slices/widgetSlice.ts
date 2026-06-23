import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWidgets, saveWidgets } from "@/services/dataService";
import { WidgetType } from "@/types/widget";

export const getWidgets = createAsyncThunk(
  "widgets/get",
  async (widgetType: string) => {
    const data = await fetchWidgets(widgetType as WidgetType);
    return data;
  },
);

export const updateWidgets = createAsyncThunk(
  "widgets/update",
  async (payload: { widgetType: WidgetType; data: unknown }) => {
    const data = await saveWidgets(payload);
    return data;
  },
);

interface WidgetState {
  data: [];
  loading: boolean;
}

const initialState: WidgetState = {
  data: [],
  loading: false,
};

const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getWidgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWidgets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateWidgets.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default widgetSlice.reducer;
