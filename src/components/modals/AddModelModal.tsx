"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeModal } from "@/store/slices/uiSlice";
import {
  createModel,
  updateModel,
  setSelectedModel,
} from "@/store/slices/modelsSlice";
import type { Model } from "@/types";

/* =====================================
   EMPTY FORM (OUTSIDE COMPONENT)
===================================== */
type ModelForm = Omit<Model, "id" | "model_id">;

const emptyForm: ModelForm = {
  name: "",
  version: "",
  owner: "",
  organizations: "",
  framework: "",
  riskCategory: "High",
  artifactLocation: "",
  policy: "",
};

const AddModelModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeModal } = useAppSelector((state) => state.ui);
  const { selectedModel } = useAppSelector((state) => state.models);

  const isOpen = activeModal === "addModel";

  /* =====================================
     LOCAL STATE
  ===================================== */
  const [formData, setFormData] = useState<ModelForm>(emptyForm);

  const handleDialogEnter = () => {
    if (selectedModel && isOpen) {
      setFormData({
        name: selectedModel.name,
        version: selectedModel.version,
        owner: selectedModel.owner,
        organizations: selectedModel.organizations,
        framework: selectedModel.framework,
        riskCategory: selectedModel.riskCategory,
        artifactLocation: selectedModel.artifactLocation,
        policy: selectedModel.policy,
      });
    } else {
      setFormData({
        name: "",
        version: "",
        owner: "",
        organizations: "",
        framework: "",
        riskCategory: "High",
        artifactLocation: "",
        policy: "",
      });
    }
  };
  /* =====================================
     CLOSE HANDLER
  ===================================== */
  const handleClose = () => {
    dispatch(closeModal());
    dispatch(setSelectedModel(null));
    setFormData(emptyForm);
  };

  /* =====================================
     SUBMIT HANDLER
  ===================================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedModel) {
        await dispatch(
          updateModel({
            id: selectedModel.model_id ?? selectedModel.id,
            model: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(createModel(formData)).unwrap();
      }

      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error saving model:", err.message);
      }
    }
  };

  /* =====================================
     CHANGE HANDLER (SAFE UPDATE)
  ===================================== */
  const handleChange =
    (field: keyof typeof formData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value as string,
      }));
    };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionProps={{ onEnter: handleDialogEnter }} // ✅ SAFE RESET HERE
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          {selectedModel ? "Edit Model" : "Add New Model"}
        </Box>

        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Model Name"
              value={formData.name}
              onChange={handleChange("name")}
              fullWidth
              required
            />

            <TextField
              label="Version"
              value={formData.version}
              onChange={handleChange("version")}
              fullWidth
              required
            />

            <TextField
              label="Owner"
              value={formData.owner}
              onChange={handleChange("owner")}
              fullWidth
              required
            />

            <TextField
              label="Organizations"
              value={formData.organizations}
              onChange={handleChange("organizations")}
              fullWidth
              required
            />

            <TextField
              label="Framework"
              value={formData.framework}
              onChange={handleChange("framework")}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Risk Category</InputLabel>
              <Select
                value={formData.riskCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    riskCategory: e.target.value as Model["riskCategory"],
                  }))
                }
                label="Risk Category"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Artifact Location"
              value={formData.artifactLocation}
              onChange={handleChange("artifactLocation")}
              fullWidth
              required
            />

            <TextField
              label="Policy"
              value={formData.policy}
              onChange={handleChange("policy")}
              fullWidth
              required
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={handleClose} sx={{ color: "#666" }}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddModelModal;
