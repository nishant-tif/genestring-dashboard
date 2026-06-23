import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/api";
import type { Testimonial, TestimonialsWidgetSettings } from "@/types/team";

interface TestimonialsState {
  loading: boolean;
  heading: string;
  description: string;
  testimonials: Testimonial[];
  selectedTestimonial: Testimonial | null;
}

const initialState: TestimonialsState = {
  loading: false,
  heading: "",
  description: "",
  testimonials: [],
  selectedTestimonial: null,
};

export const fetchTestimonialsWidget = createAsyncThunk(
  "testimonials/fetchWidget",
  async () => {
    const response = await apiClient.get("/general/testimonials-widget");
    return response.data.data as TestimonialsWidgetSettings;
  },
);

export const saveTestimonialsWidgetSettings = createAsyncThunk(
  "testimonials/saveSettings",
  async (payload: { heading: string; description: string }) => {
    await apiClient.post("/general/testimonials-widget", payload);
    return payload;
  },
);

export const createTestimonial = createAsyncThunk(
  "testimonials/create",
  async (testimonial: Omit<Testimonial, "id">) => {
    const response = await apiClient.post("/testimonials", testimonial);
    return response.data.data.data as Testimonial;
  },
);

export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({
    id,
    testimonial,
  }: {
    id: number;
    testimonial: Partial<Testimonial>;
  }) => {
    const response = await apiClient.put(`/testimonials/${id}`, testimonial);
    return response.data.data.data as Testimonial;
  },
);

export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id: number) => {
    await apiClient.delete(`/testimonials/${id}`);
    return id;
  },
);

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    setSelectedTestimonial: (
      state,
      action: PayloadAction<Testimonial | null>,
    ) => {
      state.selectedTestimonial = action.payload;
    },
    setHeading: (state, action: PayloadAction<string>) => {
      state.heading = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonialsWidget.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonialsWidget.fulfilled, (state, action) => {
        state.loading = false;
        state.heading = action.payload.heading;
        state.description = action.payload.description;
        state.testimonials = action.payload.testimonials;
      })
      .addCase(fetchTestimonialsWidget.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveTestimonialsWidgetSettings.fulfilled, (state, action) => {
        state.heading = action.payload.heading;
        state.description = action.payload.description;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.testimonials.unshift(action.payload);
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        const index = state.testimonials.findIndex(
          (t) => t.id === action.payload.id,
        );
        if (index !== -1) {
          state.testimonials[index] = action.payload;
        }
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter(
          (t) => t.id !== action.payload,
        );
      });
  },
});

export const { setSelectedTestimonial, setHeading, setDescription } =
  testimonialsSlice.actions;
export default testimonialsSlice.reducer;
