"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MediaCard } from "@/store/slices/contentWidgetsSlice";
import { useState } from "react";
import apiClient from "@/services/api";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";
import Image from "next/image";

interface Props {
  title: string;
  cards: MediaCard[];
  onCardsChange: (cards: MediaCard[]) => void;
  onSave: (cards: MediaCard[]) => void;
}

const emptyMediaCard: MediaCard = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
};

export default function MediaWidgetEditor({
  title,
  cards,
  onCardsChange,
  onSave,
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<MediaCard>(emptyMediaCard);

  const openCreate = () => {
    setEditIndex(null);
    setDraft({ ...emptyMediaCard });
    setEditorOpen(true);
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setDraft({ ...cards[index] });
    setEditorOpen(true);
  };
  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setDraft((prev) => ({
      ...prev,
      image: normalizeImagePath(
        res?.data?.data?.data?.file_name || res?.data?.data?.data?.path || "",
      ),
    }));
  };

  const saveDraft = () => {
    const updated = [...cards];
    if (editIndex === null) {
      updated.push(draft);
    } else {
      updated[editIndex] = draft;
    }
    onCardsChange(updated);
    onSave(updated);
    setEditorOpen(false);
  };

  const removeCard = (index: number) => {
    const updated = cards.filter((_, i) => i !== index);
    onCardsChange(updated);
    onSave(updated);
  };

  return (
    <>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            {title}
          </Typography>
          <Stack spacing={1.5}>
            {cards.map((card, index) => (
              <Box
                key={`${title}-${index}`}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 72,
                    flexShrink: 0,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    bgcolor: "#fafafa",
                  }}
                >
                  {card.image ? (
                    <Image
                      src={resolveImageUrl(card.image)}
                      alt={card.title || "widget image"}
                      fill
                      sizes="100px"
                      style={{
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setActiveImage(resolveImageUrl(card.image));
                        setViewerOpen(true);
                      }}
                    />
                  ) : null}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>
                    {card.title || "Untitled"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.subtitle || "-"}
                  </Typography>
                </Box>
                <Stack direction="row">
                  <IconButton
                    onClick={() => {
                      setActiveImage(resolveImageUrl(card.image));
                      setViewerOpen(true);
                    }}
                    disabled={!card.image}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => openEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeCard(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              Add Item
            </Button>
            <Button variant="contained" onClick={() => onSave(cards)}>
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth>
        <DialogTitle>
          {editIndex === null ? "Add Item" : "Edit Item"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Subtitle"
              value={draft.subtitle}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Link (optional)"
              value={draft.link}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, link: e.target.value }))
              }
              fullWidth
            />
            <Button component="label" variant="outlined">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </Button>
            <TextField
              label="Image URL / Base64"
              value={draft.image}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, image: e.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveDraft}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 1 }}>
          {activeImage ? (
            <Image
              // fill
              sizes="100px"
              height={500}
              width={1000}
              style={{
                objectFit: "cover",
                cursor: "pointer",
                height: "80vh",
              }}
              src={activeImage}
              alt="Preview"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
