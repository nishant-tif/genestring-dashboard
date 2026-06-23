"use client";

import { Grid, Paper } from "@mui/material";
import NumbersForm from "@/components/widgets/numbers/NumbersForm";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

export default function WidgetDashboard() {
  const [selected, setSelected] = useState("Numbers Widget");

  return (
    <Layout
      title="Widget Dashboard"
      breadcrumbs={[{ label: "Pages / Widget Dashboard" }]}
    >
      <Grid container>
        <Grid>
          <Paper sx={{ p: 3 }}>
            {selected === "Numbers Widget" && <NumbersForm />}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
