"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { authService } from "@/services/dataService";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updateUser } from "@/store/slices/userSlice";
import { useAppDispatch, type RootState } from "@/store";

const ProfilePage: React.FC = () => {
  const navigation = useRouter();
  const dispatch = useAppDispatch();

  const { currentUser, loading } = useSelector(
    (state: RootState) => state.user,
  );

  const [formData, setFormData] = useState(() => ({
    user_first_name: currentUser?.user_first_name ?? "",
    user_last_name: currentUser?.user_last_name ?? "",
    user_email: currentUser?.user_email ?? "",
    user_role: currentUser?.user_role ?? "",
  }));

  /* ================= FETCH USER ================= */

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  /* ================= SET FORM DATA ================= */

  // /* SET FORM DATA */
  // useEffect(() => {
  //   if (!currentUser) return;

  //   setFormData({
  //     user_first_name: currentUser.user_first_name ?? "",
  //     user_last_name: currentUser.user_last_name ?? "",
  //     user_email: currentUser.user_email ?? "",
  //     user_role: currentUser.user_role ?? "",
  //   });
  // }, [currentUser]); // ✅ SAFE DEPENDENCY
  // // }, [currentUser, dispatch]); --- IGNORE ---

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= UPDATE PROFILE ================= */

  const handleSave = async () => {
    if (!currentUser) return;

    await dispatch(
      updateUser({
        id: currentUser.user_id,
        user: {
          user_first_name: formData.user_first_name,
          user_last_name: formData.user_last_name,
          user_email: formData.user_email,
        },
      }),
    );
  };

  /* ================= LOGOUT ================= */

  const handleLogOut = async () => {
    try {
      await authService.logout();
      navigation.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const fullName = formData.user_first_name + " " + formData.user_last_name;

  const avatarLetter = formData.user_first_name
    ? formData.user_first_name[0]
    : "U";

  return (
    <Layout
      title="Profile"
      breadcrumbs={[{ label: "Pages / Profile" }]}
      showSearch={false}
    >
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          px: { xs: 2, sm: 0 },
        }}
      >
        <Card>
          <CardContent
            sx={{
              p: { xs: 2.5, sm: 3, md: 4 },
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: { xs: 3, md: 4 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 70, sm: 85, md: 100 },
                  height: { xs: 70, sm: 85, md: 100 },
                  bgcolor: "#000",
                  fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.5rem" },
                  mb: 2,
                }}
              >
                {avatarLetter}
              </Avatar>

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "18px", sm: "20px", md: "22px" },
                }}
              >
                {fullName || "User Profile"}
              </Typography>
            </Box>

            {/* Form */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="First Name"
                name="user_first_name"
                value={formData.user_first_name}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Last Name"
                name="user_last_name"
                value={formData.user_last_name}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Role"
                value={formData.user_role}
                disabled
                fullWidth
              />

              {/* Buttons */}
              <Box
                sx={{
                  pt: 2,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      backgroundColor: "#000",
                      color: "white",
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                  >
                    Save Changes
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      currentUser &&
                      setFormData({
                        user_first_name: currentUser.user_first_name,
                        user_last_name: currentUser.user_last_name,
                        user_email: currentUser.user_email,
                        user_role: currentUser.user_role,
                      })
                    }
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>

                {/* Logout */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FFEEEE",
                    border: "1px solid #FF7495",
                    color: "#D32F2F",
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      backgroundColor: "#FFCCCC",
                    },
                  }}
                  onClick={handleLogOut}
                >
                  Log Out
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default ProfilePage;
