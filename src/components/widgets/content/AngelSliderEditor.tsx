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
import { AngelCard } from "@/store/slices/contentWidgetsSlice";
import { useState } from "react";
import apiClient from "@/services/api";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";
import { toast } from "react-toastify";

interface Props {
  heading: string;
  cards: AngelCard[];
  onHeadingChange: (heading: string) => void;
  onCardsChange: (cards: AngelCard[]) => void;
  onSave: (heading: string, cards: AngelCard[]) => void | Promise<void>;
}

const emptyAngelCard: AngelCard = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
  alt_text: "",
};

export default function AngelSliderEditor({
  heading,
  cards,
  onHeadingChange,
  onCardsChange,
  onSave,
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<AngelCard>(emptyAngelCard);

  const openCreate = () => {
    setEditIndex(null);
    setDraft({ ...emptyAngelCard });
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

  const persistCards = async (nextCards: AngelCard[], successMessage?: string) => {
    const previous = cards;
    onCardsChange(nextCards);
    try {
      await onSave(heading, nextCards);
      if (successMessage) toast.success(successMessage);
    } catch {
      onCardsChange(previous);
      toast.error("Could not save angel slider. Changes were reverted.");
      throw new Error("save failed");
    }
  };

  const saveDraft = async () => {
    const updated = [...cards];
    if (editIndex === null) {
      updated.push(draft);
    } else {
      updated[editIndex] = draft;
    }
    try {
      await persistCards(updated);
      setEditorOpen(false);
    } catch {
      /* toast shown in persistCards */
    }
  };

  const removeSlide = async (index: number) => {
    if (!window.confirm("Remove this slide?")) return;
    const updated = cards.filter((_, i) => i !== index);
    if (editIndex === index) {
      setEditorOpen(false);
      setEditIndex(null);
    }
    try {
      await persistCards(updated, "Slide removed");
    } catch {
      /* reverted */
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Angel Slider Widget
          </Typography>
          <TextField
            label="Section Heading"
            value={heading}
            onChange={(e) => onHeadingChange(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Stack spacing={1.5}>
            {cards.map((card, index) => (
              <Box
                key={`angel-${index}`}
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
                    <Box
                      component="img"
                      src={resolveImageUrl(card.image)}
                      alt={card.alt_text || card.title || "angel image"}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
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
                  <Typography fontWeight={600}>{card.title || "Untitled"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.alt_text || "-"}
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
                  <IconButton color="error" onClick={() => removeSlide(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
              Add Slide
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await persistCards(cards, "Angel slider saved");
                } catch {
                  /* toast shown */
                }
              }}
            >
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth>
        <DialogTitle>{editIndex === null ? "Add Slide" : "Edit Slide"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
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
              label="Image Alt Text (Required)"
              value={draft.alt_text}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, alt_text: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Link (optional)"
              value={draft.link}
              onChange={(e) => setDraft((prev) => ({ ...prev, link: e.target.value }))}
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
              onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))}
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

      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1 }}>
          {activeImage ? (
            <Box
              component="img"
              src={activeImage}
              alt="Preview"
              sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
