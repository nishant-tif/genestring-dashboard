"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeModal } from "@/store/slices/uiSlice";
import {
  createTestimonial,
  updateTestimonial,
  setSelectedTestimonial,
} from "@/store/slices/testimonialsSlice";
import type { Testimonial } from "@/types/team";
import apiClient from "@/services/api";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";
import Image from "next/image";

const emptyForm: Testimonial = {
  text: "",
  rating: 5,
  reviewerName: "",
  reviewerAge: undefined,
  reviewerLocation: "",
  reviewerImage: "",
};

const AddTestimonialModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeModal } = useAppSelector((state) => state.ui);
  const { selectedTestimonial } = useAppSelector((state) => state.testimonials);

  const isOpen = activeModal === "addTestimonial";
  const [formData, setFormData] = useState<Testimonial>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleDialogEnter = () => {
    if (selectedTestimonial && isOpen) {
      setFormData({ ...emptyForm, ...selectedTestimonial });
    } else {
      setFormData(emptyForm);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(setSelectedTestimonial(null));
    setFormData(emptyForm);
  };

  const handleChange =
    (field: keyof Testimonial) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "reviewerAge"
          ? e.target.value
            ? Number(e.target.value)
            : undefined
          : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const uploadImage = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    const res = await apiClient.post("/upload", formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const filename = normalizeImagePath(
      res?.data?.data?.data?.file_name || res?.data?.data?.data?.path || "",
    );
    setFormData((prev) => ({ ...prev, reviewerImage: filename }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedTestimonial?.id) {
        await dispatch(
          updateTestimonial({
            id: selectedTestimonial.id,
            testimonial: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(createTestimonial(formData)).unwrap();
      }
      handleClose();
    } catch (err) {
      console.error("Error saving testimonial:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionProps={{ onEnter: handleDialogEnter }}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ fontWeight: 600 }}>
          {selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Testimonial Text"
              value={formData.text}
              onChange={handleChange("text")}
              required
              fullWidth
              multiline
              rows={4}
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Rating
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(_, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: value || 1,
                  }))
                }
              />
            </Box>

            <TextField
              label="Reviewer Name"
              value={formData.reviewerName}
              onChange={handleChange("reviewerName")}
              required
              fullWidth
            />
            <TextField
              label="Reviewer Age"
              type="number"
              value={formData.reviewerAge ?? ""}
              onChange={handleChange("reviewerAge")}
              fullWidth
            />
            <TextField
              label="Reviewer Location"
              value={formData.reviewerLocation}
              onChange={handleChange("reviewerLocation")}
              fullWidth
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Reviewer Avatar
              </Typography>
              {formData.reviewerImage && (
                <Image
                  src={resolveImageUrl(formData.reviewerImage)}
                  alt="Reviewer"
                  width={64}
                  height={64}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                Upload Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file);
                  }}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ backgroundColor: "#000", "&:hover": { backgroundColor: "#333" } }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTestimonialModal;
