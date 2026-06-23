"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCurrentUser } from "@/store/slices/userSlice";
import apiClient from "@/services/api";

interface AuditRow {
  audit_id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string | null;
  actor_email: string | null;
  actor_role: string | null;
  createdAt: string;
}

interface UpdateLogRow {
  log_id: number;
  table_name: string;
  record_id: number;
  before_data: unknown;
  after_data: unknown;
  user_info: unknown;
  createdAt?: string;
}

export default function ActivityLogsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user.currentUser);

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);
  const [legacyRows, setLegacyRows] = useState<UpdateLogRow[]>([]);

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((u) => {
        if (u.user_role !== "SUPERADMIN") router.replace("/dashboard");
      })
      .catch(() => router.replace("/"));
  }, [dispatch, router]);

  useEffect(() => {
    if (currentUser?.user_role !== "SUPERADMIN") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [a, u] = await Promise.all([
          apiClient.post("/audit-logs/search", { page: 1, size: 100 }),
          apiClient.get("/updateLogs?page=1&size=100"),
        ]);
        if (cancelled) return;
        setAuditRows(a.data?.data?.data?.rows ?? []);
        setLegacyRows(u.data?.data?.data?.rows ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.user_role]);

  if (currentUser?.user_role && currentUser.user_role !== "SUPERADMIN") {
    return null;
  }

  return (
    <Layout title="Activity logs">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 3, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Activity logs
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Audit trail" />
          <Tab label="Record change log (legacy)" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : tab === 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Summary</TableCell>
                  <TableCell>Actor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditRows.map((r) => (
                  <TableRow key={r.audit_id}>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{r.action}</TableCell>
                    <TableCell>
                      {r.entity_type} {r.entity_id ? `#${r.entity_id}` : ""}
                    </TableCell>
                    <TableCell>{r.summary || "—"}</TableCell>
                    <TableCell>
                      {r.actor_email || "—"} ({r.actor_role || "—"})
                    </TableCell>
                  </TableRow>
                ))}
                {auditRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No audit entries yet
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell>Record</TableCell>
                  <TableCell>User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {legacyRows.map((r) => (
                  <TableRow key={r.log_id}>
                    <TableCell>
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>{r.table_name}</TableCell>
                    <TableCell>{r.record_id}</TableCell>
                    <TableCell>
                      {typeof r.user_info === "object" && r.user_info && "user_email" in r.user_info
                        ? String((r.user_info as { user_email?: string }).user_email)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {legacyRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No update logs
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
}
