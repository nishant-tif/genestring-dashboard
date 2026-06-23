"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";

import {
  addLocalRegulation,
  saveRegulations,
} from "@/store/slices/regulationSlice";
import apiClient from "@/services/api";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";

export default function AddRegulationForm() {
  const dispatch = useAppDispatch();
  const { regulations } = useAppSelector((state) => state.regulations);

  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  console.log("regulations", regulations);
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setImagePreview(
      normalizeImagePath(
        res?.data?.data?.data?.file_name || res?.data?.data?.data?.path || "",
      ),
    );
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!title || !imagePreview) return;

    const newCard = {
      title,
      image: imagePreview,
    };

    const updatedCards = [...regulations, newCard];

    dispatch(addLocalRegulation(newCard));

    await dispatch(saveRegulations(updatedCards));

    setTitle("");
    setImagePreview(null);
  };

  return (
    <Card sx={{ borderRadius: 4, mb: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={3}>
          Add Regulation
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* IMAGE UPLOAD */}
          <Box
            component="label"
            sx={{
              width: 180,
              height: 140,
              border: "2px dashed #ccc",
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              background: "#fafafa",
              "&:hover": {
                borderColor: "#1976d2",
              },
            }}
          >
            {imagePreview ? (
              <>
                <CardMedia
                  component="img"
                  image={resolveImageUrl(imagePreview)}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    removeImage();
                  }}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Box textAlign="center">
                <CloudUploadIcon color="action" />
                <Typography fontSize={12}>Upload Image</Typography>
              </Box>
            )}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Box>

          {/* TITLE */}
          <TextField
            label="Regulation Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: 320 }}
          />

          {/* ADD BUTTON */}
          <Button
            variant="contained"
            disabled={!title || !imagePreview}
            onClick={handleSubmit}
            sx={{ height: 56, borderRadius: 3, px: 4 }}
          >
            Add Regulation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
