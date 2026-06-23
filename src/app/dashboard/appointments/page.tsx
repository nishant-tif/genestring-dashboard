"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import Layout from "@/components/layout/Layout";
import apiClient from "@/services/api";

interface Appointment {
  appointment_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number: string;
  message?: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/general/appointments/search", {
        page: 1,
        size: 50,
        search,
      });
      setAppointments(res.data?.data?.data?.rows || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <Layout
      title="Appointments"
      breadcrumbs={[{ label: "Dashboard / Appointments" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Search by name, email, phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 320 }}
          />
          <Button variant="contained" onClick={fetchAppointments}>
            Search
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((item) => (
                <TableRow key={item.appointment_id}>
                  <TableCell>{item.appointment_id}</TableCell>
                  <TableCell>{`${item.first_name || ""} ${item.last_name || ""}`.trim()}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone_number}</TableCell>
                  <TableCell>{item.message || "-"}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && appointments.length === 0 ? (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No appointments found.
          </Typography>
        ) : null}
      </Box>
    </Layout>
  );
}
