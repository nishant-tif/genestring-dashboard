"use client";

import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { authService } from "@/services/dataService";
import Image from "next/image";
import { toast } from "react-toastify";
import logo from "@/../public/assets/logo.svg";

export default function Home() {
  const router = useRouter();
  const [user_email, setUser_email] = useState("");
  const [user_password, setUser_password] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Detect autofill after component mounts
  useEffect(() => {
    const checkAutofill = () => {
      // Check email field
      if (emailRef.current) {
        const emailValue = emailRef.current.value;
        if (emailValue && emailValue !== user_email) {
          setUser_email(emailValue);
        }
      }
      // Check password field
      if (passwordRef.current) {
        const passwordValue = passwordRef.current.value;
        if (passwordValue && passwordValue !== user_password) {
          setUser_password(passwordValue);
        }
      }
    };

    // Check after component mounts (autofill happens asynchronously)
    const timeouts = [
      setTimeout(checkAutofill, 100),
      setTimeout(checkAutofill, 300),
      setTimeout(checkAutofill, 500),
    ];

    const handleInput = () => {
      checkAutofill();
    };

    if (emailRef.current) {
      emailRef.current.addEventListener("input", handleInput);
    }
    if (passwordRef.current) {
      passwordRef.current.addEventListener("input", handleInput);
    }

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      if (emailRef.current) {
        emailRef.current.removeEventListener("input", handleInput);
      }
      if (passwordRef.current) {
        passwordRef.current.removeEventListener("input", handleInput);
      }
    };
  }, [user_email, user_password]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await authService.login({ user_email, user_password });

      // if (typeof window !== "undefined") {
      //   localStorage.setItem("auth_token", response.token);
      // }
      document.cookie = `access_token=${response.token}; path=/`;
      toast.success(response.message || "Login successful!");
      router.replace("/dashboard/appointments");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error && "response" in error
          ? (error as { response: { data: { data: { message: string } } } })
              .response.data.data.message
          : "Login failed. Please try again.",
      );
    }
  };

  const openForgot = () => {
    setForgotEmail(user_email.trim());
    setForgotOpen(true);
  };

  const submitForgot = async () => {
    setForgotBusy(true);
    try {
      await authService.forgotPassword(forgotEmail.trim());
      toast.success(
        "If an account exists for that email, a reset link has been sent.",
      );
      setForgotOpen(false);
    } catch {
      toast.success(
        "If an account exists for that email, a reset link has been sent.",
      );
      setForgotOpen(false);
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Top white section with logo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 4,
            height: "300px",
          }}
        >
          <Image src={logo} alt="Genestring" width={190} height={190} />
        </Box>

        {/* Watermark logo */}
        {/* <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 40,

            fontSize: "200px",
            fontWeight: "bold",
            color: "#000",
          }}
        >
          <Image
            style={{ opacity: 0.7 }}
            src="/assets/Mask-group.png"
            alt="Mask-group"
            width={400}
            height={400}
          />
        </Box> */}
      </Box>

      {/* Bottom black section with pattern */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          // zIndex: 1,
          height: "50%",
          opacity: 2,
          backgroundColor: "#fff",
          backgroundImage: `
            url('/assets/login/Vector-1.png')
          `,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          // zIndex: 2,
          height: "50%",
          opacity: 1,

          backgroundImage: `
            url('/assets/login/Vector.png')
          `,
        }}
      />

      {/* Login card */}
      <Paper
        elevation={8}
        sx={{
          position: "relative",
          zIndex: 10,
          maxWidth: 500,
          width: "90%",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ p: 5, pb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: 4,
            }}
          >
            Enter Your Email and Password to Sign In
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="john1doe@gmail.com"
              required
              value={user_email}
              onChange={(e) => setUser_email(e.target.value)}
              onAnimationStart={(e) => {
                // Chrome autofill triggers animation
                if (e.animationName === "onAutoFillStart") {
                  const target = e.target as HTMLInputElement;
                  if (target && target.value) {
                    setUser_email(target.value);
                  }
                }
              }}
              inputRef={emailRef}
              InputLabelProps={{
                shrink: !!user_email || undefined,
              }}
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="password"
              required
              value={user_password}
              onChange={(e) => setUser_password(e.target.value)}
              onAnimationStart={(e) => {
                // Chrome autofill triggers animation
                if (e.animationName === "onAutoFillStart") {
                  const target = e.target as HTMLInputElement;
                  if (target && target.value) {
                    setUser_password(target.value);
                  }
                }
              }}
              inputRef={passwordRef}
              InputLabelProps={{
                shrink: !!user_password || undefined,
              }}
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <Box sx={{ pt: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "white",
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                SIGN IN
              </Button>
              {/* <Button
                type="button"
                fullWidth
                variant="text"
                onClick={openForgot}
                sx={{ mt: 1, textTransform: "none", color: "#333" }}
              >
                Forgot password?
              </Button> */}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your account email. If it exists, you will receive a link to
            set a new password.
          </Typography>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            autoComplete="email"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={submitForgot}
            disabled={forgotBusy}
          >
            {forgotBusy ? "Sending…" : "Send link"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
