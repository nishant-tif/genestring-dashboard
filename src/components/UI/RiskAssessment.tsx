import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import riskAssessment from "@/config/Dashboard-risk.json";
import { useAppSelector } from "@/store";

const RiskAssessment = () => {
  const { data } = useAppSelector((state) => state.dashboard);

  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "1 1 calc(100% - 12px)" },
        minWidth: { xs: "100%", md: "400px" },
      }}
    >
      <Box
        sx={{
          bgcolor: "#f5f5f5",
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
            Risk Assessment
          </Typography>

          {/* Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {riskAssessment.riskAssessment.categories.map((item, index) => (
              <Card
                key={index}
                sx={{
                  width: "100%",
                  backgroundColor: item.color,
                  borderRadius: 2,
                  border: `1px solid ${item.borderColor}`,
                }}
              >
                <CardContent
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    px: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Text */}
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          fontSize: {
                            xs: "13px",
                            sm: "14px",
                            md: "15px",
                          },
                        }}
                      >
                        {item.level}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "12px",
                            md: "13px",
                          },
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    {/* Count */}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: {
                          xs: "14px",
                          sm: "15px",
                          md: "16px",
                        },
                      }}
                    >
                      {data?.riskAssessment?.critical?.count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Box>
    </Box>
  );
};

export default RiskAssessment;
