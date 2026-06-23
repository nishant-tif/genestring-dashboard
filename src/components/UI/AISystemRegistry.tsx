import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { useAppSelector } from "@/store";

const AISystemRegistry = () => {
  const { data } = useAppSelector((state) => state.dashboard);

  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" },
        minWidth: { xs: "100%", md: "400px" },
      }}
    >
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: {
                  xs: "15px",
                  sm: "16px",
                  md: "18px",
                },
              }}
            >
              AI System Registry
            </Typography>

            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#000",
                color: "white",
                fontSize: { xs: "11px", sm: "12px" },
                px: { xs: 1.5, sm: 2 },
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Add System
            </Button>
          </Box>

          {/* Table */}
          <TableContainer
            sx={{
              overflowX: "auto",
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: 600,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: { xs: 12, md: 13 } }}
                  >
                    System Name
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: { xs: 12, md: 13 } }}
                  >
                    Risk Level
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: { xs: 12, md: 13 } }}
                  >
                    Compliance
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: { xs: 12, md: 13 } }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: { xs: 12, md: 13 } }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(data?.aiSystems ?? []).map((system) => (
                  <TableRow key={system.id}>
                    <TableCell sx={{ fontSize: { xs: 12, md: 13 } }}>
                      {system.systemName}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={system.riskLevel}
                        size="small"
                        sx={{
                          backgroundColor: "#ffebee",
                          color: "#d32f2f",
                          fontWeight: 600,
                          fontSize: { xs: "10px", md: "11px" },
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontSize: { xs: 12, md: 13 } }}>
                      {system.compliance}%
                    </TableCell>

                    <TableCell sx={{ fontSize: { xs: 12, md: 13 } }}>
                      {system.status}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          bgcolor: "#3BCBBE59",
                          border: "1px solid #2EB67D",
                          fontSize: { xs: "10px", md: "11px" },
                          px: { xs: 1, sm: 1.5 },
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AISystemRegistry;
