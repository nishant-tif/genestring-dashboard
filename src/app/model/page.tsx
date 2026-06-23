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
import { AddModelModal } from "@/components/modals";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchModels,
  setSelectedModel,
  deleteModel,
} from "@/store/slices/modelsSlice";

import { openModal } from "@/store/slices/uiSlice";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ModelPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { models, loading } = useAppSelector((state) => state.models);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(setSelectedModel(null));
    dispatch(openModal("addModel"));
  };

  const handleEdit = (model: (typeof models)[0]) => {
    dispatch(setSelectedModel(model));
    dispatch(openModal("addModel"));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this model?")) {
      await dispatch(deleteModel(id));
    }
  };

  const getRiskCategoryColor = (category: string) => {
    switch (category) {
      case "High":
        return { bg: "#ffebee", color: "#d32f2f" };
      case "Medium":
        return { bg: "#fff3e0", color: "#f57c00" };
      case "Good":
        return { bg: "#e8f5e9", color: "#388e3c" };
      case "Low":
        return { bg: "#e3f2fd", color: "#1976d2" };
      default:
        return { bg: "#f5f5f5", color: "#666" };
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

  const paginatedModels = models.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Layout
      title="Model"
      breadcrumbs={[{ label: "Pages / Model" }]}
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
            Add New Model
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Organizations</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Framework</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Risk Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Artifact Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Policy</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedModels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No models found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedModels.map((model) => {
                  const riskColor = getRiskCategoryColor(model.riskCategory);

                  return (
                    <TableRow key={model.id} hover>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.version}</TableCell>
                      <TableCell>{model.owner}</TableCell>
                      <TableCell>{model.organizations}</TableCell>
                      <TableCell>{model.framework}</TableCell>

                      <TableCell>
                        <Chip
                          label={model.riskCategory}
                          size="small"
                          sx={{
                            backgroundColor: riskColor.bg,
                            color: riskColor.color,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>

                      <TableCell>{model.artifactLocation}</TableCell>
                      <TableCell>{model.policy}</TableCell>

                      {/* ACTIONS */}
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(model)}
                          sx={{
                            color: "#1976d2",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDelete(model.model_id ?? model.id)
                          }
                          sx={{
                            color: "#d32f2f",
                            "&:hover": { backgroundColor: "#ffebee" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={models.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <AddModelModal />
      </Box>
    </Layout>
  );
};

export default ModelPage;
