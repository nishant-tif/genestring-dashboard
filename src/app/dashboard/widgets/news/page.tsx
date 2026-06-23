"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import MediaWidgetEditor from "@/components/widgets/content/MediaWidgetEditor";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContentWidgets,
  saveNewsCards,
  setNewsCards,
} from "@/store/slices/contentWidgetsSlice";

export default function NewsWidgetPage() {
  const dispatch = useAppDispatch();
  const { newsCards } = useAppSelector((state) => state.contentWidgets);

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  return (
    <Layout
      title="News Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / News" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <MediaWidgetEditor
          title="News Widget"
          cards={newsCards}
          onCardsChange={(cards) => dispatch(setNewsCards(cards))}
          onSave={(cards) => dispatch(saveNewsCards(cards))}
        />
      </Box>
    </Layout>
  );
}
