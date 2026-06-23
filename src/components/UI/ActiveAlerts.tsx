import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useAppSelector } from "@/store";

const ActiveAlerts = () => {
  const { data } = useAppSelector((state) => state.dashboard);

  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" },
        minWidth: { xs: "100%", md: "400px" },
        borderRadius: 2,
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: {
                xs: "15px",
                sm: "16px",
                md: "18px",
              },
            }}
          >
            Active Alerts
          </Typography>

          {/* Alerts */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.2, sm: 1.5 },
            }}
          >
            {(data?.activeAlerts ?? []).map((alert) => (
              <Box
                key={alert.id}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  border: "1px solid #FD8A8A",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: { xs: 1, sm: 1.5 },
                  bgcolor: "#FFEBEB26",
                }}
              >
                <WarningIcon
                  sx={{
                    color: "#f44336",
                    mt: "2px",
                    fontSize: {
                      xs: 18,
                      sm: 20,
                      md: 22,
                    },
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: {
                        xs: "13px",
                        sm: "14px",
                        md: "15px",
                      },
                    }}
                  >
                    {alert.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        md: "13px",
                      },
                      lineHeight: 1.4,
                    }}
                  >
                    {alert.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActiveAlerts;
