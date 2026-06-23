"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CategoryManagementPanel from "@/components/article/CategoryManagementPanel";

interface CategoryManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export const CategoryManagementModal: React.FC<
  CategoryManagementModalProps
> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Manage Categories</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <CategoryManagementPanel enabled={open} />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryManagementModal;
