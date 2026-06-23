"use client";

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardData } from "@/store/slices/dashboardSlice";
import HealthScoreCard from "@/components/UI/HealthScoreCard";
import RiskAssessment from "@/components/UI/RiskAssessment";
import AISystemRegistry from "@/components/UI/AISystemRegistry";
import ActiveAlerts from "@/components/UI/ActiveAlerts";
import ComplianceStatus from "@/components/UI/ComplianceStatus";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <Layout title="Dashboard" breadcrumbs={[{ label: "Pages / Dashboard" }]}>
        <Box>Loading...</Box>
      </Layout>
    );
  }
  return (
    <Layout title="Dashboard" breadcrumbs={[{ label: "Pages / Dashboard" }]}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Health Score Cards */}
        <HealthScoreCard />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {/* Risk Assessment */}
          <RiskAssessment />
          {/* Compliance Status */}
          <ComplianceStatus />
          {/* Active Alerts */}
          <ActiveAlerts />
          {/* AI System Registry */}
          <AISystemRegistry />
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
