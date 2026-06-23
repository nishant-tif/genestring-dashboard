import apiClient from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface NumberCard {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  color?: string;
}

interface NumbersWidgetState {
  cards: NumberCard[];
  loading: boolean;
}

const initialState: NumbersWidgetState = {
  cards: [],
  loading: false,
};

export const fetchNumbersWidget = createAsyncThunk(
  "numbersWidget/fetch",
  async () => {
    const res = await apiClient.get("/general/numbers-widget");
    return res.data.data;
  },
);

export const saveNumbersWidget = createAsyncThunk(
  "numbersWidget/save",
  async (cards: NumberCard[]) => {
    const res = await apiClient.post("/general/numbers-widget", {
      number_cards: cards,
    });

    return res.data;
  },
);

export const deleteNumberCard = createAsyncThunk(
  "numbersWidget/delete",
  async (index: number) => {
    await apiClient.delete(`/general/numbers-widget/${index}`);
    return index;
  },
);

const numbersWidgetSlice = createSlice({
  name: "numbersWidget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNumbersWidget.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchNumbersWidget.fulfilled, (state, action) => {
      state.cards = action.payload;
      state.loading = false;
    });

    builder.addCase(deleteNumberCard.fulfilled, (state, action) => {
      state.cards.splice(action.payload, 1);
    });
  },
});

export default numbersWidgetSlice.reducer;
