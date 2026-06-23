"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchArticles,
  deleteArticle,
  clearError,
} from "@/store/slices/articleSlice";
import { Article } from "@/types/article";
import { ArticleTable } from "@/components/article/ArticleTable";
import Layout from "../layout/Layout";
import { useRouter } from "next/navigation";

export const ArticlesPage: React.FC = () => {
  const navigate = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { articles, loading, error, total, page, limit } =
    useSelector((state: RootState) => state.articles);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const canDeleteRecords = currentUser?.user_role === "SUPERADMIN";

  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (article: Article) => {
    navigate.push(`/dashboard/articles/edit/${article.article_id || article.id}`);
  };

  const handleDelete = async (articleId: string) => {
    await dispatch(deleteArticle(articleId));
  };

  useEffect(() => {
    dispatch(
      fetchArticles({
        page,
        search: searchQuery,
      }),
    );
  }, [dispatch, page, limit, searchQuery]);

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchArticles({
        page: newPage,
        search: searchQuery,
      }),
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(
      fetchArticles({
        page: 1,
        search: query,
      }),
    );
  };

  const handleNavigation = () => {
    navigate.push("/dashboard/articles/new");
  };

  return (
    <Layout title="">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: { xs: 2.5, md: 4 } }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              fontSize: {
                xs: "22px",
                sm: "26px",
                md: "32px",
              },
            }}
          >
            Articles
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNavigation}
            sx={{
              background: "#000",
              color: "white",
              fontWeight: 600,
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              textTransform: "none",
              fontSize: { xs: "13px", md: "14px" },
              "&:hover": {
                background: "#333",
              },
            }}
          >
            New Article
          </Button>
        </Stack>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && !articles.length && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Table */}
        {(!loading || articles.length > 0) && (
          <ArticleTable
            articles={articles}
            onEdit={handleEdit}
            onDelete={canDeleteRecords ? handleDelete : undefined}
            loading={loading}
            totalCount={total}
            currentPage={page}
            pageSize={limit}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
          />
        )}
      </Paper>

    </Layout>
  );
};

export default ArticlesPage;
