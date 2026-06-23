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
import EditIcon from "@mui/icons-material/Edit";

import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";

import {
  fetchRegulations,
  saveRegulations,
  deleteRegulation,
} from "@/store/slices/regulationSlice";
import Layout from "@/components/layout/Layout";
import apiClient from "@/services/api";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";

export default function RegulationsPage() {
  const dispatch = useAppDispatch();

  const { regulations } = useAppSelector((state) => state.regulations);

  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchRegulations());
  }, [dispatch]);

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

  const handleSubmit = async () => {
    if (!title || !imagePreview) return;

    const newCard = {
      title,
      image: imagePreview,
    };

    const updatedCards = [...regulations];

    if (editIndex !== null) {
      updatedCards[editIndex] = newCard;
    } else {
      updatedCards.push(newCard);
    }

    await dispatch(saveRegulations(updatedCards));

    setEditIndex(null);
    setTitle("");
    setImagePreview(null);
  };

  const handleDelete = async (index: number) => {
    await dispatch(deleteRegulation(index));
  };

  const handleEdit = (index: number) => {
    const reg = regulations[index];

    setTitle(reg.title);
    setImagePreview(reg.image);
    setEditIndex(index);
  };

  return (
    <Layout
      title="Regulations"
      breadcrumbs={[{ label: "Pages / Regulations" }]}
    >
      <Box p={4}>
        <Typography variant="h5" mb={3}>
          Regulations
        </Typography>

        {/* ADD FORM */}

        <Card sx={{ borderRadius: 4, mb: 4 }}>
          <CardContent>
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
                  overflow: "hidden",
                }}
              >
                {imagePreview ? (
                  <CardMedia
                    component="img"
                    image={resolveImageUrl(imagePreview)}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Box textAlign="center">
                    <CloudUploadIcon />
                    <Typography fontSize={12}>Upload Image</Typography>
                  </Box>
                )}

                <input hidden type="file" onChange={handleImageUpload} />
              </Box>

              {/* TITLE */}

              <TextField
                label="Regulation Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: 320 }}
              />

              {/* BUTTON */}

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!title || !imagePreview}
                sx={{ height: 56 }}
              >
                {editIndex !== null ? "Update Regulation" : "Add Regulation"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* REGULATION CARDS */}

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(220px,1fr))"
          gap={3}
        >
          {regulations.map((reg, index) => (
            <Card key={index} sx={{ position: "relative" }}>
              <Box sx={{ width: "100%", height: 150, overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={resolveImageUrl(reg.image)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <CardContent>
                <Typography fontWeight={600}>{reg.title}</Typography>
              </CardContent>

              {/* DELETE */}

              <IconButton
                onClick={() => handleDelete(index)}
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                }}
              >
                <DeleteIcon />
              </IconButton>

              {/* EDIT */}

              <IconButton
                onClick={() => handleEdit(index)}
                sx={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                }}
              >
                <EditIcon />
              </IconButton>
            </Card>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
