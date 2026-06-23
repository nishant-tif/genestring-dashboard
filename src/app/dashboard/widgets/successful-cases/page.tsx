"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import MediaWidgetEditor from "@/components/widgets/content/MediaWidgetEditor";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContentWidgets,
  saveSuccessCaseCards,
  setSuccessCaseCards,
} from "@/store/slices/contentWidgetsSlice";

export default function SuccessfulCasesWidgetPage() {
  const dispatch = useAppDispatch();
  const { successCaseCards } = useAppSelector((state) => state.contentWidgets);

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  return (
    <Layout
      title="Successful Cases Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / Successful Cases" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <MediaWidgetEditor
          title="Successful Cases Widget"
          cards={successCaseCards}
          onCardsChange={(cards) => dispatch(setSuccessCaseCards(cards))}
          onSave={(cards) => dispatch(saveSuccessCaseCards(cards))}
        />
      </Box>
    </Layout>
  );
}
