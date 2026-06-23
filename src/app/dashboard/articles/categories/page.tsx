"use client";

import Layout from "@/components/layout/Layout";
import { Box, Typography } from "@mui/material";
import CategoryManagementPanel from "@/components/article/CategoryManagementPanel";

export default function DashboardArticleCategoriesPage() {
  return (
    <Layout title="Article categories">
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Categories
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create and remove categories used when authoring articles.
        </Typography>
        <CategoryManagementPanel />
      </Box>
    </Layout>
  );
}
