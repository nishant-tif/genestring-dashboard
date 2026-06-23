import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/api";
import type { TeamMember } from "@/types/team";

interface TeamState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  selectedMember: TeamMember | null;
}

const initialState: TeamState = {
  members: [],
  loading: false,
  error: null,
  selectedMember: null,
};

export const fetchTeamMembers = createAsyncThunk(
  "team/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/team");
      return response.data.data as TeamMember[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const createTeamMember = createAsyncThunk(
  "team/create",
  async (member: Omit<TeamMember, "id">, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/team", member);
      return response.data.data.data as TeamMember;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateTeamMember = createAsyncThunk(
  "team/update",
  async (
    { id, member }: { id: number; member: Partial<TeamMember> },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.put(`/team/${id}`, member);
      return response.data.data.data as TeamMember;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const deleteTeamMember = createAsyncThunk(
  "team/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/team/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setSelectedMember: (state, action: PayloadAction<TeamMember | null>) => {
      state.selectedMember = action.payload;
    },
    clearTeamError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.members.unshift(action.payload);
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.members.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.id !== action.payload);
      });
  },
});

export const { setSelectedMember, clearTeamError } = teamSlice.actions;
export default teamSlice.reducer;
