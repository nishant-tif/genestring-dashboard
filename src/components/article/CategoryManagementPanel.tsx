"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Alert,
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

import {
  fetchCategories,
  createCategory,
  deleteCategory,
  clearCategoryError,
} from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store";

interface CategoryManagementPanelProps {
  /** When false, skips initial fetch (e.g. modal closed). */
  enabled?: boolean;
}

export const CategoryManagementPanel: React.FC<
  CategoryManagementPanelProps
> = ({ enabled = true }) => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.categories,
  );
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const canDelete = currentUser?.user_role === "SUPERADMIN";

  const [categoryName, setCategoryName] = useState("");
  const [metaTag, setMetaTag] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    dispatch(fetchCategories({ page: 1, size: 100 }));
  }, [dispatch, enabled]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const slug = categoryName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    setAdding(true);
    try {
      await dispatch(
        createCategory({
          category_name: categoryName.trim(),
          category_slug: slug,
          meta_tag: metaTag,
          meta_description: metaDescription,
        }),
      ).unwrap();
      setCategoryName("");
      setMetaTag("");
      setMetaDescription("");
    } catch {
      // Error surfaced via slice
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await dispatch(deleteCategory(categoryId.toString()));
  };

  return (
    <>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearCategoryError())}
        >
          {error}
        </Alert>
      )}

      <form
        onSubmit={handleAddCategory}
        style={{ marginBottom: 20, marginTop: 10 }}
      >
        <div
          style={{ display: "flex", gap: 8, marginBottom: 16, paddingTop: 2 }}
        >
          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Meta Tag"
            value={metaTag}
            onChange={(e) => setMetaTag(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Meta Description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || adding}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {adding ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </div>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>Category Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading &&
              categories?.map((category) => (
                <TableRow key={category?.category_id}>
                  <TableCell>{category?.category_name}</TableCell>
                  <TableCell align="center">
                    {canDelete ? (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDeleteCategory(String(category?.category_id))
                        }
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

            {!loading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoryManagementPanel;
