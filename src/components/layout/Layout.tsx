"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  showSearch?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  breadcrumbs,
  showSearch = true,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: "240px" },
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "calc(100% - 240px)" },
        }}
      >
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          showSearch={showSearch}
          onMenuClick={handleDrawerToggle}
        />
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
