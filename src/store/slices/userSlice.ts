import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/api";
import { AxiosError } from "axios";

/* ================= TYPES ================= */

export interface User {
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_role: string;
  user_status?: string;
  user_phone_number?: string | null;
  organization_id?: string;
}

interface UserSearchResponse {
  rows: User[];
  count: number;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  total: 0,
};

/* ================= FETCH CURRENT USER ================= */

export const fetchCurrentUser = createAsyncThunk<User>(
  "users/fetchCurrentUser",
  async () => {
    const res = await apiClient.get("/user/me");
    console.log("res.data.data", res.data.data.user);
    return res.data.data.user;
  },
);

/* ================= SEARCH USERS ================= */

export const searchUsers = createAsyncThunk<
  UserSearchResponse,
  { search?: string; page?: number; size?: number }
>("users/searchUsers", async (payload) => {
  const res = await apiClient.post("/user/search", payload);
  return res.data.data.data as UserSearchResponse;
});

/* ================= CREATE USER ================= */

export const createUser = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  "users/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/user", data);
      return res.data.data.user as User;
    } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return rejectWithValue(
        err.response?.data?.data?.message ?? "Request failed",
      );
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue("An unknown error occurred");
  }
});

/* ================= GET USER BY ID ================= */

export const getUserById = createAsyncThunk<User, string>(
  "users/getUserById",
  async (id) => {
    const res = await apiClient.get(`/user/${id}`);
    return res.data.data.user as User;
  },
);

/* ================= UPDATE USER ================= */

export const updateUser = createAsyncThunk<
  User,
  { id: string; user: Partial<User> },
  { rejectValue: string }
>("users/updateUser", async ({ id, user }, { rejectWithValue }) => {
  try {
    const res = await apiClient.put(`/user/${id}`, user);
    return res.data.data.user as User;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return rejectWithValue(
        err.response?.data?.data?.message ?? "Request failed",
      );
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue("An unknown error occurred");
  }
});

/* ================= DELETE USER ================= */

export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id) => {
    await apiClient.delete(`/user/${id}`);
    return id;
  },
);

/* ================= SLICE ================= */

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH CURRENT USER */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.currentUser = action.payload;
        },
      )
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
      })

      /* SEARCH USERS */
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        searchUsers.fulfilled,
        (state, action: PayloadAction<UserSearchResponse>) => {
          state.loading = false;
          state.users = action.payload.rows;
          state.total = action.payload.count;
        },
      )
      .addCase(searchUsers.rejected, (state) => {
        state.loading = false;
      })

      /* CREATE USER */
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.unshift(action.payload);
      })

      /* GET USER BY ID */
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
      })

      /* UPDATE USER */
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (u) => u.user_id === action.payload.user_id,
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        if (state.currentUser?.user_id === action.payload.user_id) {
          state.currentUser = action.payload;
        }
      })

      /* DELETE USER */
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u.user_id !== action.payload);
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
