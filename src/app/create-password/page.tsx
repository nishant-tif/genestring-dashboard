"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import apiClient from "@/services/api";
import { useRouter } from "next/navigation";

function CreatePasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Missing token. Open the link from your invitation email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/auth/setup-password", { token, user_password: password });
      setDone(true);
      setTimeout(() => router.push("/"), 2500);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { data?: { message?: string } } } }).response?.data
              ?.data?.message
          : null;
      setError(msg || "Could not set password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 440, width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Set or reset password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a new password for your account (from an invitation or Forgot password email).
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      {done ? (
        <Alert severity="success">Password saved. Redirecting to sign in…</Alert>
      ) : (
        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              label="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />
            <TextField
              type="password"
              label="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />
            <Button type="submit" variant="contained" disabled={loading} fullWidth>
              {loading ? "Saving…" : "Save password"}
            </Button>
          </Stack>
        </form>
      )}
    </Paper>
  );
}

export default function CreatePasswordPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Suspense fallback={<Typography>Loading…</Typography>}>
        <CreatePasswordForm />
      </Suspense>
    </Box>
  );
}
