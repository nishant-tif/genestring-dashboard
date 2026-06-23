"use client";

import Layout from "@/components/layout/Layout";
import { Box, Typography } from "@mui/material";
import TagManagementPanel from "@/components/article/TagManagementPanel";

export default function DashboardArticleTagsPage() {
  return (
    <Layout title="Article tags">
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Tags
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create and remove tags used when authoring articles.
        </Typography>
        <TagManagementPanel />
      </Box>
    </Layout>
  );
}
