"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import MediaWidgetEditor from "@/components/widgets/content/MediaWidgetEditor";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContentWidgets,
  savePodcastCards,
  setPodcastCards,
} from "@/store/slices/contentWidgetsSlice";

export default function PodcastWidgetPage() {
  const dispatch = useAppDispatch();
  const { podcastCards } = useAppSelector((state) => state.contentWidgets);

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  return (
    <Layout
      title="Podcast Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / Podcast" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <MediaWidgetEditor
          title="Podcast Widget"
          cards={podcastCards}
          onCardsChange={(cards) => dispatch(setPodcastCards(cards))}
          onSave={(cards) => dispatch(savePodcastCards(cards))}
        />
      </Box>
    </Layout>
  );
}
