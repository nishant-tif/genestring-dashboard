"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchCurrentUser,
} from "@/store/slices/userSlice";
import type { User } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

export default function DashboardUsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users, loading, total, currentUser } = useAppSelector((s) => s.user);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user_email: "",
    user_first_name: "",
    user_last_name: "",
    user_role: "EDITOR" as "EDITOR" | "USER",
    user_phone_number: "",
    user_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    user_password: "",
    user_password_confirm: "",
  });

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((u) => {
        if (u.user_role !== "SUPERADMIN") {
          router.replace("/dashboard");
        }
      })
      .catch(() => router.replace("/"));
  }, [dispatch, router]);

  useEffect(() => {
    if (currentUser?.user_role === "SUPERADMIN") {
      dispatch(searchUsers({ page: 1, size: 50 }));
    }
  }, [dispatch, currentUser?.user_role]);

  const openCreate = () => {
    setForm({
      user_email: "",
      user_first_name: "",
      user_last_name: "",
      user_role: "EDITOR",
      user_phone_number: "",
      user_status: "ACTIVE",
      user_password: "",
      user_password_confirm: "",
    });
    setOpen(true);
  };

  const handleCreate = async () => {
    if (!form.user_email.trim()) {
      toast.error("Email is required");
      return;
    }
    const pw = form.user_password.trim();
    const pw2 = form.user_password_confirm.trim();
    if (pw || pw2) {
      if (pw.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }
      if (pw !== pw2) {
        toast.error("Password and confirmation do not match.");
        return;
      }
    }
    try {
      const payload: Record<string, unknown> = {
        user_email: form.user_email.trim(),
        user_first_name: form.user_first_name || null,
        user_last_name: form.user_last_name || null,
        user_role: form.user_role,
        user_status: form.user_status,
      };
      if (form.user_phone_number.trim()) {
        payload.user_phone_number = form.user_phone_number.trim();
      }
      if (pw) {
        payload.user_password = pw;
      }
      await dispatch(createUser(payload as Partial<User>)).unwrap();
      setOpen(false);
      toast.success(
        pw
          ? "User created with password set."
          : "User created. They should use Forgot password on the login page to receive a setup link.",
      );
      dispatch(searchUsers({ page: 1, size: 50 }));
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to create user");
    }
  };

  const toggleStatus = async (u: User) => {
    const next = u.user_status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await dispatch(
        updateUser({
          id: String(u.user_id),
          user: { user_status: next },
        }),
      ).unwrap();
      toast.success(`User ${next === "ACTIVE" ? "enabled" : "disabled"}`);
      dispatch(searchUsers({ page: 1, size: 50 }));
    } catch {
      toast.error("Update failed");
    }
  };

  const removeUser = async (u: User) => {
    if (!window.confirm(`Remove access for ${u.user_email}?`)) return;
    try {
      await dispatch(deleteUser(String(u.user_id))).unwrap();
      toast.success("User removed");
      dispatch(searchUsers({ page: 1, size: 50 }));
    } catch {
      toast.error("Delete failed");
    }
  };

  if (currentUser?.user_role && currentUser.user_role !== "SUPERADMIN") {
    return null;
  }

  return (
    <Layout title="Users">
      <Box sx={{ maxWidth: 1100, mx: "auto", py: 3, px: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Users
          </Typography>
          <Button variant="contained" onClick={openCreate}>
            Add user
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && !users.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : null}
              {users.map((u: User) => (
                <TableRow key={u.user_id}>
                  <TableCell>
                    {[u.user_first_name, u.user_last_name]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </TableCell>
                  <TableCell>{u.user_email}</TableCell>
                  <TableCell>{u.user_role}</TableCell>
                  <TableCell>{u.user_status || "ACTIVE"}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => toggleStatus(u)}>
                      {u.user_status === "INACTIVE" ? "Enable" : "Disable"}
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="remove user"
                      onClick={() => removeUser(u)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Total: {total}. Super administrator accounts are not listed here.
        </Typography>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add user</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            sx={{ mt: 1 }}
            value={form.user_email}
            onChange={(e) =>
              setForm((f) => ({ ...f, user_email: e.target.value }))
            }
          />
          <TextField
            label="First name"
            fullWidth
            value={form.user_first_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, user_first_name: e.target.value }))
            }
          />
          <TextField
            label="Last name"
            fullWidth
            value={form.user_last_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, user_last_name: e.target.value }))
            }
          />
          <TextField
            label="Phone (optional)"
            fullWidth
            value={form.user_phone_number}
            onChange={(e) =>
              setForm((f) => ({ ...f, user_phone_number: e.target.value }))
            }
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            autoComplete="new-password"
            value={form.user_password}
            onChange={(e) =>
              setForm((f) => ({ ...f, user_password: e.target.value }))
            }
            // helperText="If set, only you set it here (min 8 characters). Leave blank and the user uses Forgot password on login."
          />
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            autoComplete="new-password"
            value={form.user_password_confirm}
            onChange={(e) =>
              setForm((f) => ({ ...f, user_password_confirm: e.target.value }))
            }
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={form.user_role}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  user_role: e.target.value as "EDITOR" | "USER",
                }))
              }
            >
              <MenuItem value="EDITOR">Editor</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Account status</InputLabel>
            <Select
              label="Account status"
              value={form.user_status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  user_status: e.target.value as "ACTIVE" | "INACTIVE",
                }))
              }
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create user
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
