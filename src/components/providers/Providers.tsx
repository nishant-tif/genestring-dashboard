"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Geist } from "next/font/google";
import {
  AddPolicyModal,
  AddModelModal,
  AddOrganizationModal,
} from "@/components/modals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: geistSans.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <AddPolicyModal />
        <AddModelModal />
        <AddOrganizationModal />
      </ThemeProvider>
    </Provider>
  );
}
