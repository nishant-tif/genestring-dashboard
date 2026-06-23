import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { policyService } from "@/services/dataService";
import type { Policy } from "@/types";

interface PoliciesState {
  policies: Policy[];
  loading: boolean;
  error: string | null;
  selectedPolicy: Policy | null;
}

const initialState: PoliciesState = {
  policies: [],
  loading: false,
  error: null,
  selectedPolicy: null,
};

export const fetchPolicies = createAsyncThunk(
  "policies/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const policies = await policyService.getAll();
      return policies;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const createPolicy = createAsyncThunk(
  "policies/create",
  async (policy: Omit<Policy, "id">, { rejectWithValue }) => {
    try {
      const newPolicy = await policyService.create(policy);
      return newPolicy;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updatePolicy = createAsyncThunk(
  "policies/update",
  async (
    { id, policy }: { id: string; policy: Partial<Policy> },
    { rejectWithValue },
  ) => {
    try {
      const updatedPolicy = await policyService.update(id, policy);
      return updatedPolicy;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const deletePolicy = createAsyncThunk(
  "policies/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await policyService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const policiesSlice = createSlice({
  name: "policies",
  initialState,
  reducers: {
    setSelectedPolicy: (state, action: PayloadAction<Policy | null>) => {
      state.selectedPolicy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPolicies.fulfilled,
        (state, action: PayloadAction<Policy[]>) => {
          state.loading = false;
          state.policies = action.payload;
        },
      )
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        createPolicy.fulfilled,
        (state, action: PayloadAction<Policy>) => {
          state.policies.push(action.payload);
        },
      )
      .addCase(createPolicy.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(
        updatePolicy.fulfilled,
        (state, action: PayloadAction<Policy>) => {
          const index = state.policies.findIndex(
            (p) => p.id === action.payload.id,
          );
          if (index !== -1) {
            state.policies[index] = action.payload;
          }
        },
      )
      .addCase(
        deletePolicy.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.policies = state.policies.filter(
            (p) => p.id !== action.payload,
          );
        },
      );
  },
});

export const { setSelectedPolicy, clearError } = policiesSlice.actions;
export default policiesSlice.reducer;
