"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Article } from "@/types/article";
import { getArticleAuthorDisplayName } from "@/utils/normalizeDashboardArticle";
import { resolveImageUrl } from "@/utils/imagePath";
import Image from "next/image";

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete?: (articleId: string) => void;
  loading?: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, newPageSize: number) => void;
  onSearch?: (query: string) => void;
}

export const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  onEdit,
  onDelete,
  loading = false,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedArticleId && onDelete) {
      onDelete(selectedArticleId);
    }
    setDeleteDialogOpen(false);
    setSelectedArticleId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedArticleId(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const getVisibilityChip = (visibility: string | undefined) => {
    const displayVisibility = visibility || "N/A";
    return (
      <Chip
        label={displayVisibility}
        sx={{
          backgroundColor:
            displayVisibility === "PUBLISHED" ? "#d4edda" : "#e2e3e5",
          color: displayVisibility === "PUBLISHED" ? "#155724" : "#383d41",
          fontWeight: 600,
          fontSize: "12px",
        }}
      />
    );
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1, pageSize);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onPageChange(1, parseInt(event.target.value, 10));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {onSearch && (
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search articles..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ flex: 1, maxWidth: 300 }}
          />
        </Box>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell
                sx={{ fontWeight: 700, fontSize: "13px", color: "#333" }}
              >
                Thumbnail
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, fontSize: "13px", color: "#333" }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, fontSize: "13px", color: "#333" }}
              >
                Author
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, fontSize: "13px", color: "#333" }}
              >
                Visibility
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, fontSize: "13px", color: "#333" }}
              >
                Published Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, fontSize: "13px", color: "#333" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : articles?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 4, color: "#999" }}
                >
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              articles?.map((article: Article) => {
                const thumb =
                  article.article_thumbnail_image || article.featureImg;
                const title = article.article_title || article.title;
                return (
                <TableRow key={article.article_id || article.id} hover>
                  <TableCell sx={{ width: "100px" }}>
                    {thumb ? (
                      <Image
                        width={100}
                        height={100}
                        src={resolveImageUrl(thumb)}
                        alt={
                          article.article_thumbnail_image_alt_text ||
                          title ||
                          "Article thumbnail"
                        }
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 80,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 1,
                          fontSize: 24,
                        }}
                      >
                        📷
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Box sx={{ wordBreak: "break-word" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {title}
                      </Typography>
                      {article.article_thumbnail_caption ? (
                        <Typography variant="caption" color="text.secondary">
                          {article.article_thumbnail_caption}
                        </Typography>
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>
                    {getArticleAuthorDisplayName(article)}
                  </TableCell>
                  <TableCell>
                    {getVisibilityChip(
                      article.article_visibility ??
                        article.visibility ??
                        article.visiblity,
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>
                    {formatDate(article.published_at)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(article)}
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    {onDelete ? (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        handleDeleteClick(
                          String(article.article_id || article.id || ""),
                        )
                      }
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sx={{
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
        }}
      />

      {onDelete ? (
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove article</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this article? It will be hidden from
            the site (soft delete).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      ) : null}
    </Box>
  );
};

export default ArticleTable;
