"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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
import { FooterAddress } from "@/store/slices/contentWidgetsSlice";
import { useState } from "react";

interface Props {
  addresses: FooterAddress[];
  onAddressesChange: (addresses: FooterAddress[]) => void;
  onSave: (addresses: FooterAddress[]) => void;
}

const emptyFooterAddress: FooterAddress = {
  city: "",
  address: "",
};

export default function FooterAddressesEditor({
  addresses,
  onAddressesChange,
  onSave,
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<FooterAddress>(emptyFooterAddress);

  const openCreate = () => {
    setEditIndex(null);
    setDraft({ ...emptyFooterAddress });
    setEditorOpen(true);
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setDraft({ ...addresses[index] });
    setEditorOpen(true);
  };

  const saveDraft = () => {
    const updated = [...addresses];
    if (editIndex === null) {
      updated.push(draft);
    } else {
      updated[editIndex] = draft;
    }
    onAddressesChange(updated);
    onSave(updated);
    setEditorOpen(false);
  };

  return (
    <>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Footer Address Widget
          </Typography>
          <Stack spacing={1.5}>
            {addresses.map((address, index) => (
              <Box
                key={`footer-${index}`}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>
                    {address.city || "Untitled City"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address.address || "-"}
                  </Typography>
                </Box>
                <Stack direction="row">
                  <IconButton onClick={() => openEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      const updated = addresses.filter((_, i) => i !== index);
                      onAddressesChange(updated);
                      onSave(updated);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              Add Address
            </Button>
            <Button variant="contained" onClick={() => onSave(addresses)}>
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth>
        <DialogTitle>{editIndex === null ? "Add Address" : "Edit Address"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="City / Branch Name"
              value={draft.city}
              onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Address"
              value={draft.address}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, address: e.target.value }))
              }
              fullWidth
              multiline
              minRows={3}
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
    </>
  );
}
