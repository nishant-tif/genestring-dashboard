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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeModal } from "@/store/slices/uiSlice";
import {
  createTeamMember,
  updateTeamMember,
  setSelectedMember,
} from "@/store/slices/teamSlice";
import type { ExpertiseItem, JourneyItem, TeamMember } from "@/types/team";
import apiClient from "@/services/api";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";
import Image from "next/image";

const emptyJourney: JourneyItem = {
  label: "",
  title: "",
  subtitle: "",
  description: "",
};

const emptyExpertise: ExpertiseItem = {
  title: "",
  icon: "",
};

const emptyForm: TeamMember = {
  slug: "",
  image: "",
  detailImage: "",
  name: "",
  designation: "",
  organization: "",
  experience: "",
  qualification: "",
  certification: "",
  about: "",
  journey: [],
  expertise: [],
};

const AddTeamMemberModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeModal } = useAppSelector((state) => state.ui);
  const { selectedMember } = useAppSelector((state) => state.team);

  const isOpen = activeModal === "addTeamMember";
  const [formData, setFormData] = useState<TeamMember>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleDialogEnter = () => {
    if (selectedMember && isOpen) {
      setFormData({
        ...emptyForm,
        ...selectedMember,
        journey: selectedMember.journey || [],
        expertise: selectedMember.expertise || [],
      });
    } else {
      setFormData(emptyForm);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(setSelectedMember(null));
    setFormData(emptyForm);
  };

  const handleChange =
    (field: keyof TeamMember) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const uploadImage = async (
    file: File,
    field: "image" | "detailImage",
  ) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    const res = await apiClient.post("/upload", formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const filename = normalizeImagePath(
      res?.data?.data?.data?.file_name || res?.data?.data?.data?.path || "",
    );
    setFormData((prev) => ({ ...prev, [field]: filename }));
  };

  const uploadExpertiseIcon = async (index: number, file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    const res = await apiClient.post("/upload", formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const filename = normalizeImagePath(
      res?.data?.data?.data?.file_name || res?.data?.data?.data?.path || "",
    );
    setFormData((prev) => {
      const expertise = [...prev.expertise];
      expertise[index] = { ...expertise[index], icon: filename };
      return { ...prev, expertise };
    });
  };

  const updateJourney = (
    index: number,
    field: keyof JourneyItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const journey = [...prev.journey];
      journey[index] = { ...journey[index], [field]: value };
      return { ...prev, journey };
    });
  };

  const addJourney = () => {
    setFormData((prev) => ({
      ...prev,
      journey: [...prev.journey, { ...emptyJourney }],
    }));
  };

  const removeJourney = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      journey: prev.journey.filter((_, i) => i !== index),
    }));
  };

  const updateExpertise = (
    index: number,
    field: keyof ExpertiseItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const expertise = [...prev.expertise];
      expertise[index] = { ...expertise[index], [field]: value };
      return { ...prev, expertise };
    });
  };

  const addExpertise = () => {
    setFormData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, { ...emptyExpertise }],
    }));
  };

  const removeExpertise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedMember?.id) {
        await dispatch(
          updateTeamMember({ id: selectedMember.id, member: formData }),
        ).unwrap();
      } else {
        await dispatch(createTeamMember(formData)).unwrap();
      }
      handleClose();
    } catch (err) {
      console.error("Error saving team member:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionProps={{ onEnter: handleDialogEnter }}
      maxWidth="md"
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
          {selectedMember ? "Edit Team Member" : "Add Team Member"}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange("name")}
              required
              fullWidth
            />
            <TextField
              label="Slug"
              value={formData.slug}
              onChange={handleChange("slug")}
              required
              fullWidth
              helperText="URL-friendly identifier, e.g. dr-alpana-razdan"
            />
            <TextField
              label="Designation"
              value={formData.designation}
              onChange={handleChange("designation")}
              fullWidth
            />
            <TextField
              label="Organization"
              value={formData.organization}
              onChange={handleChange("organization")}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Experience (years)"
                value={formData.experience}
                onChange={handleChange("experience")}
                fullWidth
              />
              <TextField
                label="Qualification"
                value={formData.qualification}
                onChange={handleChange("qualification")}
                fullWidth
              />
            </Box>
            <TextField
              label="Certification"
              value={formData.certification}
              onChange={handleChange("certification")}
              fullWidth
            />
            <TextField
              label="About"
              value={formData.about}
              onChange={handleChange("about")}
              fullWidth
              multiline
              rows={5}
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Profile Image
                </Typography>
                {formData.image && (
                  <Image
                    src={resolveImageUrl(formData.image)}
                    alt="Profile"
                    width={80}
                    height={80}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />
                )}
                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                  Upload
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, "image");
                    }}
                  />
                </Button>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Detail Image
                </Typography>
                {formData.detailImage && (
                  <Image
                    src={resolveImageUrl(formData.detailImage)}
                    alt="Detail"
                    width={80}
                    height={80}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />
                )}
                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                  Upload
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, "detailImage");
                    }}
                  />
                </Button>
              </Box>
            </Box>

            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Journey
              </Typography>
              <Button startIcon={<AddIcon />} onClick={addJourney} size="small">
                Add Entry
              </Button>
            </Box>
            {formData.journey.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Entry {index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeJourney(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  label="Label"
                  value={item.label}
                  onChange={(e) =>
                    updateJourney(index, "label", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Title"
                  value={item.title}
                  onChange={(e) =>
                    updateJourney(index, "title", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Subtitle"
                  value={item.subtitle}
                  onChange={(e) =>
                    updateJourney(index, "subtitle", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Description (optional)"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateJourney(index, "description", e.target.value)
                  }
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />
              </Box>
            ))}

            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Expertise
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addExpertise}
                size="small"
              >
                Add Expertise
              </Button>
            </Box>
            {formData.expertise.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Expertise {index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeExpertise(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  label="Title"
                  value={item.title}
                  onChange={(e) =>
                    updateExpertise(index, "title", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {item.icon && (
                    <Image
                      src={resolveImageUrl(item.icon)}
                      alt="Icon"
                      width={32}
                      height={32}
                    />
                  )}
                  <Button variant="outlined" component="label" size="small">
                    Upload Icon
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadExpertiseIcon(index, file);
                      }}
                    />
                  </Button>
                </Box>
              </Box>
            ))}
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

export default AddTeamMemberModal;
