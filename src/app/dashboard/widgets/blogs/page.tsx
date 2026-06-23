"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import MediaWidgetEditor from "@/components/widgets/content/MediaWidgetEditor";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContentWidgets,
  saveBlogCards,
  setBlogCards,
} from "@/store/slices/contentWidgetsSlice";

export default function BlogsWidgetPage() {
  const dispatch = useAppDispatch();
  const { blogCards } = useAppSelector((state) => state.contentWidgets);

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  return (
    <Layout
      title="Blogs Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / Blogs" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <MediaWidgetEditor
          title="Blogs Widget"
          cards={blogCards}
          onCardsChange={(cards) => dispatch(setBlogCards(cards))}
          onSave={(cards) => dispatch(saveBlogCards(cards))}
        />
      </Box>
    </Layout>
  );
}
