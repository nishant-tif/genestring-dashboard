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
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/layout/Layout";
import { AddTeamMemberModal } from "@/components/modals";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchTeamMembers,
  setSelectedMember,
  deleteTeamMember,
} from "@/store/slices/teamSlice";
import { openModal } from "@/store/slices/uiSlice";

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const { members, loading } = useAppSelector((state) => state.team);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(setSelectedMember(null));
    dispatch(openModal("addTeamMember"));
  };

  const handleEdit = (member: (typeof members)[0]) => {
    dispatch(setSelectedMember(member));
    dispatch(openModal("addTeamMember"));
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this team member?")) {
      await dispatch(deleteTeamMember(id));
    }
  };

  const paginated = members.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Layout
      title="Team Members"
      breadcrumbs={[{ label: "Dashboard / Team" }]}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddNew}
            sx={{
              backgroundColor: "#000",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Add Team Member
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Designation</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No team members found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.designation}</TableCell>
                    <TableCell>{member.organization}</TableCell>
                    <TableCell>
                      <Chip label={member.slug} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{member.experience} yrs</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(member)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(member.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={members.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      <AddTeamMemberModal />
    </Layout>
  );
}
