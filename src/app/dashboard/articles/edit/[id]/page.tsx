"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, CircularProgress } from "@mui/material";
import AddArticle from "@/components/article/AddArticle";
import type { Article } from "@/types/article";
import apiClient from "@/services/api";
import { normalizeDashboardArticle } from "@/utils/normalizeDashboardArticle";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = String(params?.id || "");
    if (!id) {
      setError("Invalid article id");
      setLoading(false);
      return;
    }
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get(`/article/${id}`, {
          params: { showContent: true },
        });
        const raw = res?.data?.data?.data;
        setArticle(raw ? normalizeDashboardArticle(raw as Article) : null);
      } catch {
        setError("Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params?.id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Article not found"}</Alert>
      </Box>
    );
  }

  return <AddArticle article={article} onCancel={() => router.push("/dashboard/articles")} />;
}

