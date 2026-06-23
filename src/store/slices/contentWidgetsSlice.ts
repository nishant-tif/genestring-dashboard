import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/api";

export interface MediaCard {
  title: string;
  image: string;
  subtitle?: string;
  link?: string;
}

export interface AngelCard extends MediaCard {
  alt_text: string;
}

export interface FooterAddress {
  city: string;
  address: string;
}

interface ContentWidgetsState {
  loading: boolean;
  podcastCards: MediaCard[];
  successCaseCards: MediaCard[];
  angelHeading: string;
  angelCards: AngelCard[];
  newsCards: MediaCard[];
  blogCards: MediaCard[];
  footerAddresses: FooterAddress[];
}

const initialState: ContentWidgetsState = {
  loading: false,
  podcastCards: [],
  successCaseCards: [],
  angelHeading: "",
  angelCards: [],
  newsCards: [],
  blogCards: [],
  footerAddresses: [],
};

const safeArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const fetchContentWidgets = createAsyncThunk(
  "contentWidgets/fetchAll",
  async () => {
    const [podcast, success, angel, news, blog, footer] = await Promise.all([
      apiClient
        .get("/general/podcast-widget")
        .then((res) => safeArray<MediaCard>(res.data?.data))
        .catch(() => []),
      apiClient
        .get("/general/successful-cases-widget")
        .then((res) => safeArray<MediaCard>(res.data?.data))
        .catch(() => []),
      apiClient
        .get("/general/angel-slider-widget")
        .then((res) => res.data?.data || { heading: "", cards: [] })
        .catch(() => ({ heading: "", cards: [] })),
      apiClient
        .get("/general/news-widget")
        .then((res) => safeArray<MediaCard>(res.data?.data))
        .catch(() => []),
      apiClient
        .get("/general/blogs-widget")
        .then((res) => safeArray<MediaCard>(res.data?.data))
        .catch(() => []),
      apiClient
        .get("/general/footer-widget")
        .then((res) => safeArray<FooterAddress>(res.data?.data))
        .catch(() => []),
    ]);

    return {
      podcastCards: podcast,
      successCaseCards: success,
      angelHeading: angel?.heading || "",
      angelCards: safeArray<AngelCard>(angel?.cards),
      newsCards: news,
      blogCards: blog,
      footerAddresses: footer,
    };
  },
);

export const savePodcastCards = createAsyncThunk(
  "contentWidgets/savePodcast",
  async (cards: MediaCard[]) => {
    await apiClient.post("/general/podcast-widget", { cards });
    return cards;
  },
);

export const saveSuccessCaseCards = createAsyncThunk(
  "contentWidgets/saveSuccessCase",
  async (cards: MediaCard[]) => {
    await apiClient.post("/general/successful-cases-widget", { cards });
    return cards;
  },
);

export const saveAngelWidget = createAsyncThunk(
  "contentWidgets/saveAngel",
  async (payload: { heading: string; cards: AngelCard[] }) => {
    await apiClient.post("/general/angel-slider-widget", payload);
    return payload;
  },
);

export const saveNewsCards = createAsyncThunk(
  "contentWidgets/saveNews",
  async (cards: MediaCard[]) => {
    await apiClient.post("/general/news-widget", { cards });
    return cards;
  },
);

export const saveBlogCards = createAsyncThunk(
  "contentWidgets/saveBlogs",
  async (cards: MediaCard[]) => {
    await apiClient.post("/general/blogs-widget", { cards });
    return cards;
  },
);

export const saveFooterAddresses = createAsyncThunk(
  "contentWidgets/saveFooter",
  async (addresses: FooterAddress[]) => {
    await apiClient.post("/general/footer-widget", { addresses });
    return addresses;
  },
);

const contentWidgetsSlice = createSlice({
  name: "contentWidgets",
  initialState,
  reducers: {
    setPodcastCards(state, action: PayloadAction<MediaCard[]>) {
      state.podcastCards = action.payload;
    },
    setSuccessCaseCards(state, action: PayloadAction<MediaCard[]>) {
      state.successCaseCards = action.payload;
    },
    setAngelHeading(state, action: PayloadAction<string>) {
      state.angelHeading = action.payload;
    },
    setAngelCards(state, action: PayloadAction<AngelCard[]>) {
      state.angelCards = action.payload;
    },
    setNewsCards(state, action: PayloadAction<MediaCard[]>) {
      state.newsCards = action.payload;
    },
    setBlogCards(state, action: PayloadAction<MediaCard[]>) {
      state.blogCards = action.payload;
    },
    setFooterAddresses(state, action: PayloadAction<FooterAddress[]>) {
      state.footerAddresses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentWidgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContentWidgets.fulfilled, (state, action) => {
        state.loading = false;
        state.podcastCards = action.payload.podcastCards;
        state.successCaseCards = action.payload.successCaseCards;
        state.angelHeading = action.payload.angelHeading;
        state.angelCards = action.payload.angelCards;
        state.newsCards = action.payload.newsCards;
        state.blogCards = action.payload.blogCards;
        state.footerAddresses = action.payload.footerAddresses;
      })
      .addCase(fetchContentWidgets.rejected, (state) => {
        state.loading = false;
      })
      .addCase(savePodcastCards.fulfilled, (state, action) => {
        state.podcastCards = action.payload;
      })
      .addCase(saveSuccessCaseCards.fulfilled, (state, action) => {
        state.successCaseCards = action.payload;
      })
      .addCase(saveAngelWidget.fulfilled, (state, action) => {
        state.angelHeading = action.payload.heading;
        state.angelCards = action.payload.cards;
      })
      .addCase(saveNewsCards.fulfilled, (state, action) => {
        state.newsCards = action.payload;
      })
      .addCase(saveBlogCards.fulfilled, (state, action) => {
        state.blogCards = action.payload;
      })
      .addCase(saveFooterAddresses.fulfilled, (state, action) => {
        state.footerAddresses = action.payload;
      });
  },
});

export const {
  setPodcastCards,
  setSuccessCaseCards,
  setAngelHeading,
  setAngelCards,
  setNewsCards,
  setBlogCards,
  setFooterAddresses,
} = contentWidgetsSlice.actions;

export default contentWidgetsSlice.reducer;
