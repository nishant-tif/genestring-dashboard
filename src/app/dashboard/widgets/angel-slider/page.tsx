"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import AngelSliderEditor from "@/components/widgets/content/AngelSliderEditor";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContentWidgets,
  saveAngelWidget,
  setAngelCards,
  setAngelHeading,
} from "@/store/slices/contentWidgetsSlice";
export default function AngelSliderWidgetPage() {
  const dispatch = useAppDispatch();
  const { angelHeading, angelCards } = useAppSelector(
    (state) => state.contentWidgets,
  );

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  return (
    <Layout
      title="Angel Slider Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / Angel Slider" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <AngelSliderEditor
          heading={angelHeading}
          cards={angelCards}
          onHeadingChange={(heading) => dispatch(setAngelHeading(heading))}
          onCardsChange={(cards) => dispatch(setAngelCards(cards))}
          onSave={async (heading, cards) => {
            await dispatch(saveAngelWidget({ heading, cards })).unwrap();
          }}
        />
      </Box>
    </Layout>
  );
}
