"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/store";
import { createTag, deleteTag, fetchTags } from "@/store/slices/tagSlice";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

interface TagManagementPanelProps {
  enabled?: boolean;
}

export const TagManagementPanel: React.FC<TagManagementPanelProps> = ({
  enabled = true,
}) => {
  const dispatch = useAppDispatch();
  const { tags, loading } = useAppSelector((state) => state.tags);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const canDelete = currentUser?.user_role === "SUPERADMIN";
  const [name, setName] = useState("");
  const [metaTag, setMetaTag] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    dispatch(fetchTags({ page: 1, size: 100 }));
  }, [dispatch, enabled]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await dispatch(
        createTag({
          tag_name: name.trim(),
          tag_slug: slugify(name),
          meta_tag: metaTag.trim(),
          meta_description: metaDescription.trim(),
        }),
      ).unwrap();
      setName("");
      setMetaTag("");
      setMetaDescription("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <form onSubmit={handleAdd} style={{ marginBottom: 20, marginTop: 10 }}>
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          <TextField
            label="Tag Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <TextField
            label="Meta Tag"
            value={metaTag}
            onChange={(e) => setMetaTag(e.target.value)}
            size="small"
          />
          <TextField
            label="Meta Description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            size="small"
          />
          <Button type="submit" variant="contained" disabled={loading || adding}>
            {adding ? <CircularProgress size={20} /> : "Add Tag"}
          </Button>
        </div>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>Tag Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Meta Tag</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.tag_id}>
                <TableCell>{tag.tag_name}</TableCell>
                <TableCell>{tag.meta_tag || "-"}</TableCell>
                <TableCell align="center">
                  {canDelete ? (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => dispatch(deleteTag(String(tag.tag_id)))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TagManagementPanel;
