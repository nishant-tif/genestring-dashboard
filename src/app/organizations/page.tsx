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
  IconButton,
  TablePagination,
} from "@mui/material";

import Layout from "@/components/layout/Layout";
import { AddOrganizationModal } from "@/components/modals";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrganizations,
  setSelectedOrganization,
  deleteOrganization,
} from "@/store/slices/organizationsSlice";

import { openModal } from "@/store/slices/uiSlice";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const OrganizationsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { organizations, loading } = useAppSelector(
    (state) => state.organizations,
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(setSelectedOrganization(null));
    dispatch(openModal("addOrganization"));
  };

  const handleEdit = (organization: (typeof organizations)[0]) => {
    dispatch(setSelectedOrganization(organization));
    dispatch(openModal("addOrganization"));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      await dispatch(deleteOrganization(id));
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

  const paginatedOrganizations = organizations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Layout
      title="Organizations"
      breadcrumbs={[{ label: "Pages / Organizations" }]}
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
            Add New Organizations
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Organizations Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>State</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
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
              ) : paginatedOrganizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrganizations.map((organization) => (
                  <TableRow key={organization.organization_id} hover>
                    <TableCell>{organization.name}</TableCell>
                    <TableCell>{organization.organizationsName}</TableCell>
                    <TableCell>{organization.email}</TableCell>
                    <TableCell>{organization.address}</TableCell>
                    <TableCell>{organization?.state?.stateName}</TableCell>
                    <TableCell>{organization?.city?.cityName}</TableCell>

                    {/* ACTION BUTTONS */}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(organization)}
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
                          handleDelete(organization?.organization_id)
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
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={organizations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <AddOrganizationModal />
      </Box>
    </Layout>
  );
};

export default OrganizationsPage;
