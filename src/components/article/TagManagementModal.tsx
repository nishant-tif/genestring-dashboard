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
import TagManagementPanel from "@/components/article/TagManagementPanel";

interface TagManagementModalProps {
  open: boolean;
  onClose: () => void;
}

const TagManagementModal: React.FC<TagManagementModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Manage Tags</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TagManagementPanel enabled={open} />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagManagementModal;
