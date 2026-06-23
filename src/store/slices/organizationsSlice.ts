import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { organizationService } from "@/services/dataService";
import type { Organization } from "@/types";

interface OrganizationsState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  selectedOrganization: Organization | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  loading: false,
  error: null,
  selectedOrganization: null,
};

export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const organizations = await organizationService.getAll();
      return organizations;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const createOrganization = createAsyncThunk(
  "organizations/create",
  async (organization: Omit<Organization, "id">, { rejectWithValue }) => {
    try {
      const newOrganization = await organizationService.create(organization);
      return newOrganization;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateOrganization = createAsyncThunk(
  "organizations/update",
  async (
    { id, organization }: { id: string; organization: Partial<Organization> },
    { rejectWithValue },
  ) => {
    try {
      const updatedOrganization = await organizationService.update(
        id,
        organization,
      );
      return updatedOrganization;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const deleteOrganization = createAsyncThunk(
  "organizations/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await organizationService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setSelectedOrganization: (
      state,
      action: PayloadAction<Organization | null>,
    ) => {
      state.selectedOrganization = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrganizations.fulfilled,
        (state, action: PayloadAction<Organization[]>) => {
          state.loading = false;
          state.organizations = action.payload;
        },
      )
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        createOrganization.fulfilled,
        (state, action: PayloadAction<Organization>) => {
          state.organizations.push(action.payload);
        },
      )
      .addCase(createOrganization.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(
        updateOrganization.fulfilled,
        (state, action: PayloadAction<Organization>) => {
          const index = state.organizations.findIndex(
            (o) => o.id === action.payload.id,
          );
          if (index !== -1) {
            state.organizations[index] = action.payload;
          }
        },
      )
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteOrganization.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.organizations = state.organizations.filter(
            (o) => o.id !== action.payload,
          );
        },
      )
      .addCase(deleteOrganization.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedOrganization, clearError } =
  organizationsSlice.actions;
export default organizationsSlice.reducer;
