"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
} from "@mui/material";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

import WidgetsIcon from "@mui/icons-material/Widgets";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HistoryIcon from "@mui/icons-material/History";

import { fetchCurrentUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store";

const Sidebar: React.FC<{
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}> = ({ mobileOpen, onMobileClose }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [user, setUser] = useState<null | Record<string, unknown>>(null);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(fetchCurrentUser())
        .unwrap()
        .then((userData: unknown) => {
          setUser(userData as Record<string, unknown>);
        });
    };

    fetchUser();
  }, [dispatch]);

  /* ------------------ NORMAL MENU ------------------ */

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
    },
  ];

  /* ------------------ ARTICLES ------------------ */

  const [openArticles, setOpenArticles] = useState(
    pathname?.startsWith("/dashboard/articles"),
  );

  const [openAdmin, setOpenAdmin] = useState(
    pathname?.startsWith("/dashboard/users") ||
      pathname?.startsWith("/dashboard/activity-logs"),
  );

  const handleAdminToggle = () => {
    setOpenAdmin(!openAdmin);
  };

  const handleArticlesToggle = () => {
    setOpenArticles(!openArticles);
  };

  /* ------------------ WIDGETS ------------------ */

  const [openWidgets, setOpenWidgets] = useState(
    pathname?.startsWith("/dashboard/widgets"),
  );

  const handleWidgetsToggle = () => {
    setOpenWidgets(!openWidgets);
  };

  const isWidgetSubActive = (path: string) =>
    pathname === path || pathname?.startsWith(path);

  /* ------------------ SETTINGS ------------------ */

  const [openSettings, setOpenSettings] = useState(
    pathname?.startsWith("/dashboard/settings"),
  );

  const handleSettingsToggle = () => {
    setOpenSettings(!openSettings);
  };

  const isSettingsSubActive = (path: string) =>
    pathname === path || pathname?.startsWith(path);

  const baseItemSx = {
    borderRadius: 2,
    minHeight: 44,
    px: 1.5,
    py: 1,
    "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
  } as const;

  const activeItemSx = {
    backgroundColor: "#000",
    color: "#fff",
    "&:hover": { backgroundColor: "#000" },
  } as const;

  const iconBoxSx = {
    minWidth: 34,
    mr: 1,
    color: "inherit",
    "& svg": { fontSize: 20 },
  } as const;

  const mainTextProps = {
    fontSize: 14,
    fontWeight: 600,
  } as const;

  const subItemSx = {
    borderRadius: 2,
    minHeight: 40,
    px: 1.25,
    py: 0.75,
    gap: 1,
    "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
  } as const;

  const subActiveSx = {
    backgroundColor: "rgba(0,0,0,0.08)",
  } as const;

  /* ------------------ SIDEBAR CONTENT ------------------ */

  const sidebarContent = (
    <>
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Link href="/dashboard">
          <Image
            src="/assets/logo.svg"
            alt="Gauri"
            width={150}
            height={150}
          />
        </Link>
      </Box>

      <List sx={{ flex: 1, px: 2 }}>
        {/* Normal Menu */}
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path || pathname?.startsWith(item.path + "/");

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                sx={{
                  ...baseItemSx,
                  ...(isActive ? activeItemSx : {}),
                }}
              >
                <ListItemIcon
                  sx={{
                    ...iconBoxSx,
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    ...mainTextProps,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* ================= WIDGETS ================= */}

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            onClick={handleWidgetsToggle}
            sx={{
              ...baseItemSx,
              ...(pathname?.startsWith("/dashboard/widgets") ? activeItemSx : {}),
            }}
          >
            <ListItemIcon
              sx={{
                ...iconBoxSx,
              }}
            >
              <WidgetsIcon />
            </ListItemIcon>

            <ListItemText
              primary="Widgets"
              primaryTypographyProps={mainTextProps}
            />

            {openWidgets ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openWidgets} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {[
              // {
              //   label: "Numbers Widget",
              //   icon: <NumbersIcon />,
              //   path: "/dashboard/widgets/numberwidget",
              // },
              // {
              //   label: "About Widget",
              //   icon: <InfoIcon />,
              //   path: "/dashboard/widgets/about",
              // },
              // {
              //   label: "Programme Widget",
              //   icon: <ViewModuleIcon />,
              //   path: "/dashboard/widgets/programme",
              // },
              // {
              //   label: "Footer Widget",
              //   icon: <ViewModuleIcon />,
              //   path: "/dashboard/widgets/footer",
              // },
              // {
              //   label: "Toolkit Widget",
              //   icon: <BuildIcon />,
              //   path: "/dashboard/widgets/toolkit",
              // },
              // {
              //   label: "Regulation Widget",
              //   icon: <VideoLibraryIcon />,
              //   path: "/dashboard/widgets/regulation",
              // },
              {
                label: "Podcast Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/podcast",
              },
              {
                label: "Successful Cases Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/successful-cases",
              },
              {
                label: "Angel Slider Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/angel-slider",
              },
              {
                label: "News Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/news",
              },
              {
                label: "Blogs Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/blogs",
              },
              {
                label: "Footer Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/footer",
              },
              {
                label: "Testimonials Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/testimonials",
              },
              // {
              //   label: "AI Toolset Widget",
              //   icon: <SmartToyIcon />,
              //   path: "/dashboard/widgets/ai-toolset",
              // },
              // {
              //   label: "Speaker Widget",
              //   icon: <RecordVoiceOverIcon />,
              //   path: "/dashboard/widgets/speakers",
              // },
            ].map((widget) => (
              <ListItem key={widget.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={widget.path}
                  sx={{
                    ...subItemSx,
                    ...(isWidgetSubActive(widget.path) ? subActiveSx : {}),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 28,
                      "& svg": { fontSize: 18 },
                    }}
                  >
                    {widget.icon}
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                    primary={widget.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* ================= SETTINGS ================= */}

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            onClick={handleSettingsToggle}
            sx={{
              ...baseItemSx,
              ...(pathname?.startsWith("/dashboard/settings") ? activeItemSx : {}),
            }}
          >
            <ListItemIcon
              sx={{
                ...iconBoxSx,
              }}
            >
              <SettingsIcon />
            </ListItemIcon>

            <ListItemText
              primary="Settings"
              primaryTypographyProps={mainTextProps}
            />

            {openSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openSettings} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {[
              {
                label: "General Settings",
                icon: <SettingsIcon />,
                path: "/dashboard/settings/general",
              },
            ].map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  sx={{
                    ...subItemSx,
                    ...(isSettingsSubActive(item.path) ? subActiveSx : {}),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 28,
                      "& svg": { fontSize: 18 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                    primary={item.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton
            component={Link}
            href="/dashboard/team"
            sx={{
              ...baseItemSx,
              ...(pathname?.startsWith("/dashboard/team")
                ? { backgroundColor: "rgba(0,0,0,0.08)" }
                : {}),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: "inherit",
                "& svg": { fontSize: 20 },
              }}
            >
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                ...mainTextProps,
              }}
              primary="Team"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton
            component={Link}
            href="/dashboard/appointments"
            sx={{
              ...baseItemSx,
              ...(pathname?.startsWith("/dashboard/appointments")
                ? { backgroundColor: "rgba(0,0,0,0.08)" }
                : {}),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: "inherit",
                "& svg": { fontSize: 20 },
              }}
            >
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                ...mainTextProps,
              }}
              primary="Appointments"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            component={Link}
            href="/profile"
            sx={{
              ...baseItemSx,
              ...(pathname === "/profile" || pathname?.startsWith("/profile/")
                ? activeItemSx
                : {}),
            }}
          >
            <ListItemIcon
              sx={{
                ...iconBoxSx,
              }}
            >
              <PersonIcon />
            </ListItemIcon>

            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                ...mainTextProps,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* ================= ADMIN (SUPERADMIN) ================= */}

        {user?.user_role == "SUPERADMIN" && (
          <>
            <ListItem disablePadding sx={{ mt: 2 }}>
              <ListItemButton
                onClick={handleAdminToggle}
                sx={{
                  ...baseItemSx,
                  ...(pathname?.startsWith("/dashboard/users") ||
                  pathname?.startsWith("/dashboard/activity-logs")
                    ? activeItemSx
                    : {}),
                }}
              >
                <ListItemIcon sx={{ ...iconBoxSx }}>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Administration"
                  primaryTypographyProps={mainTextProps}
                />
                {openAdmin ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openAdmin} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/users"
                    sx={{
                      ...subItemSx,
                      ...(pathname?.startsWith("/dashboard/users")
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Users"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/activity-logs"
                    sx={{
                      ...subItemSx,
                      ...(pathname?.startsWith("/dashboard/activity-logs")
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Activity logs"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </>
        )}

        {/* ================= ARTICLES ================= */}

        {user?.user_role == "SUPERADMIN" && (
          <>
            <ListItem disablePadding sx={{ mt: 2 }}>
              <ListItemButton
                onClick={handleArticlesToggle}
                sx={{
                  ...baseItemSx,
                  ...(pathname?.startsWith("/dashboard/articles") ? activeItemSx : {}),
                }}
              >
                <ListItemIcon
                  sx={{
                    ...iconBoxSx,
                  }}
                >
                  <ArticleIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Articles"
                  primaryTypographyProps={mainTextProps}
                />

                {openArticles ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openArticles} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/articles/new"
                    sx={{
                      ...subItemSx,
                      ...(pathname?.startsWith("/dashboard/articles/new")
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="New Article"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/articles"
                    sx={{
                      ...subItemSx,
                      ...(pathname === "/dashboard/articles"
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="All Articles"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/articles/categories"
                    sx={{
                      ...subItemSx,
                      ...(pathname?.startsWith("/dashboard/articles/categories")
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Categories"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/articles/tags"
                    sx={{
                      ...subItemSx,
                      ...(pathname?.startsWith("/dashboard/articles/tags")
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tags"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/articles/authors"
                    sx={{
                      ...subItemSx,
                      ...(pathname?.startsWith("/dashboard/articles/authors")
                        ? subActiveSx
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, "& svg": { fontSize: 18 } }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Article Author"
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </>
        )}
      </List>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <Box
        sx={{
          width: 250,
          height: "100vh",
          backgroundColor: "#f5f5f5",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          position: "fixed",
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen || false}
        onClose={onMobileClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 280 },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
