"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/layout/Layout";
import { AddTestimonialModal } from "@/components/modals";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchTestimonialsWidget,
  saveTestimonialsWidgetSettings,
  setSelectedTestimonial,
  deleteTestimonial,
  setHeading,
  setDescription,
} from "@/store/slices/testimonialsSlice";
import { openModal } from "@/store/slices/uiSlice";
import { resolveImageUrl } from "@/utils/imagePath";
import { toast } from "react-toastify";

export default function TestimonialsWidgetPage() {
  const dispatch = useAppDispatch();
  const { heading, description, testimonials, loading } = useAppSelector(
    (state) => state.testimonials,
  );
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchTestimonialsWidget());
  }, [dispatch]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await dispatch(
        saveTestimonialsWidgetSettings({ heading, description }),
      ).unwrap();
      toast.success("Widget settings saved");
    } catch {
      toast.error("Failed to save widget settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddNew = () => {
    dispatch(setSelectedTestimonial(null));
    dispatch(openModal("addTestimonial"));
  };

  const handleEdit = (testimonial: (typeof testimonials)[0]) => {
    dispatch(setSelectedTestimonial(testimonial));
    dispatch(openModal("addTestimonial"));
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await dispatch(deleteTestimonial(id));
      toast.success("Testimonial deleted");
    }
  };

  return (
    <Layout
      title="Testimonials Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / Testimonials" }]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Widget Settings
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Heading"
                value={heading}
                onChange={(e) => dispatch(setHeading(e.target.value))}
                fullWidth
                placeholder="What Our Customers Are Saying About Us"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => dispatch(setDescription(e.target.value))}
                fullWidth
                multiline
                rows={3}
                placeholder="Want to know more about what our customers love about us..."
              />
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  sx={{
                    backgroundColor: "#000",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  {savingSettings ? "Saving..." : "Save Settings"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Testimonials
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddNew}
                sx={{
                  backgroundColor: "#000",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Add Testimonial
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Reviewer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Text</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : testimonials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No testimonials found
                      </TableCell>
                    </TableRow>
                  ) : (
                    testimonials.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <Avatar
                              src={resolveImageUrl(item.reviewerImage)}
                              alt={item.reviewerName}
                              sx={{ width: 36, height: 36 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {item.reviewerName}
                                {item.reviewerAge
                                  ? `, ${item.reviewerAge}`
                                  : ""}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.text}
                        </TableCell>
                        <TableCell>
                          <Rating value={item.rating} readOnly size="small" />
                        </TableCell>
                        <TableCell>{item.reviewerLocation}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      <AddTestimonialModal />
    </Layout>
  );
}
