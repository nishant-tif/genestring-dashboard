import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalType = "addPolicy" | "addOrganization" | "addModel" | "addTeamMember" | "addTestimonial" | null;

interface UiState {
  activeModal: ModalType;
}

const initialState: UiState = {
  activeModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalType>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;
