"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TablePagination,
} from "@mui/material";

import Layout from "@/components/layout/Layout";
import { AddPolicyModal } from "@/components/modals";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchPolicies,
  setSelectedPolicy,
  deletePolicy,
} from "@/store/slices/policiesSlice";

import { openModal } from "@/store/slices/uiSlice";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PolicyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { policies, loading } = useAppSelector((state) => state.policies);
  console.log("policies", policies);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchPolicies());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(setSelectedPolicy(null));
    dispatch(openModal("addPolicy"));
  };

  const handleEdit = (policy: (typeof policies)[0]) => {
    dispatch(setSelectedPolicy(policy));
    dispatch(openModal("addPolicy"));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      await dispatch(deletePolicy(id));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPolicies = policies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Layout
      title="Policy"
      breadcrumbs={[{ label: "Pages / Policy" }]}
      showSearch={true}
    >
      <Box>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box />

          <Button
            variant="contained"
            onClick={handleAddNew}
            sx={{
              backgroundColor: "#000",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Add New Policy
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Policy Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Metric Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Operator</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Expected Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedPolicies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No policies found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPolicies.map((policy) => (
                  <TableRow key={policy.id} hover>
                    <TableCell>{policy.policyName}</TableCell>
                    <TableCell>{policy.metricName}</TableCell>
                    <TableCell>{policy.operator}</TableCell>
                    <TableCell>{policy.expectedValue}</TableCell>

                    <TableCell>
                      <Chip
                        label={policy.severity}
                        color={
                          getSeverityColor(policy.severity) as
                            | "error"
                            | "warning"
                            | "success"
                            | "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>{policy.description}</TableCell>

                    {/* ACTION BUTTONS */}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(policy)}
                        sx={{
                          color: "#1976d2",
                          "&:hover": { backgroundColor: "#e3f2fd" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleDelete(policy.id)}
                        sx={{
                          color: "#d32f2f",
                          "&:hover": { backgroundColor: "#ffebee" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={policies.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <AddPolicyModal />
      </Box>
    </Layout>
  );
};

export default PolicyPage;
