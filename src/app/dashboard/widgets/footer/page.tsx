"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import FooterAddressesEditor from "@/components/widgets/content/FooterAddressesEditor";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContentWidgets,
  saveFooterAddresses,
  setFooterAddresses,
} from "@/store/slices/contentWidgetsSlice";

export default function FooterWidgetPage() {
  const dispatch = useAppDispatch();
  const { footerAddresses } = useAppSelector((state) => state.contentWidgets);

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  return (
    <Layout
      title="Footer Address Widget"
      breadcrumbs={[{ label: "Dashboard / Widgets / Footer Addresses" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <FooterAddressesEditor
          addresses={footerAddresses}
          onAddressesChange={(addresses) => dispatch(setFooterAddresses(addresses))}
          onSave={(addresses) => dispatch(saveFooterAddresses(addresses))}
        />
      </Box>
    </Layout>
  );
}
