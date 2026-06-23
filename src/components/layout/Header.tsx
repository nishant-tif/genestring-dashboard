"use client";

import React from "react";
import {
  Box,
  Breadcrumbs,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  showSearch?: boolean;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  breadcrumbs = [],
  showSearch = true,
  onMenuClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        justifyContent: "space-between",
        gap: { xs: 2, md: 3 },
        px: { xs: 2, md: 4 },
        py: 2,
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          flexWrap: "wrap",
          gap: { xs: 2, md: 4 },
          width: "100%",
        }}
      >
        {/* Menu + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { xs: "block", md: "none" }, color: "#2d2d2d" }}
          >
            <MenuIcon />
          </IconButton>

          <Box>
            {breadcrumbs.length > 0 && (
              <Breadcrumbs
                separator=" / "
                aria-label="breadcrumb"
                sx={{ mb: 0.5 }}
              >
                {breadcrumbs.map((crumb, index) => (
                  <MuiLink
                    key={index}
                    href={crumb.href}
                    color={
                      index === breadcrumbs.length - 1
                        ? "text.primary"
                        : "inherit"
                    }
                    underline="none"
                    sx={{
                      fontSize: { xs: "12px", md: "13px" },
                    }}
                  >
                    {crumb.label}
                  </MuiLink>
                ))}
              </Breadcrumbs>
            )}

            <Typography
              sx={{
                fontWeight: 600,
                color: "#2d2d2d",
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                  md: "20px",
                },
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Search */}
        {showSearch && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <TextField
              placeholder="Search..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "#666" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 180, md: 220 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                },
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2d2d2d",
                color: "white",
                px: { xs: 2, md: 3 },
                fontSize: { xs: "12px", md: "13px" },
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
              }}
            >
              Search
            </Button>
          </Box>
        )}
      </Box>

      {/* Right Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-end", md: "flex-end" },
          gap: { xs: 1, md: 2 },
          flexWrap: "wrap",
        }}
      >
        <Button
        //   variant="outlined"
        //   sx={{
        //     borderColor: "#000",
        //     color: "#000",
        //     fontSize: { xs: "12px", md: "13px" },
        //     px: { xs: 1.5, md: 2 },
        //     "&:hover": { borderColor: "#000", backgroundColor: "#f5f5f5" },
        //   }}
        >
          {/* // India AI Framework */}
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "white",
            fontSize: { xs: "12px", md: "13px" },
            px: { xs: 1.5, md: 2 },
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Export Report
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
