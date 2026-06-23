import { Box, ListItemIcon } from "@mui/material";
import React from "react";
import Image from "next/image";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { summaryCards } from "../../config/SummaryCard";

const HealthScoreCard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        mb: 2,
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 3,
        bgcolor: "#ffffff",
        gap: { xs: 2, md: 3 },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#EBEBEB",
          borderRadius: 2,
          px: { xs: 4, sm: 6, md: 8, lg: 10 },
          py: { xs: 4, sm: 5, md: 7, lg: 9 },
          width: { xs: "100%", md: "auto" },
        }}
      >
        <Image
          src={"/assets/ogo.svg"}
          alt="Gauri-logo"
          width={100}
          height={100}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: "15px",
                sm: "16px",
                md: "18px",
                lg: "20px",
              },
            }}
          >
            AI Governance Health Score
          </Typography>

          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 2,
              color: "white",
              fontWeight: 600,
              fontSize: {
                xs: "11px",
                sm: "12px",
                md: "13px",
              },
              px: { xs: 1.5, sm: 2 },
            }}
          >
            Need Attention
          </Button>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {summaryCards.map((card) => (
            <Card
              key={card.key}
              sx={{
                borderRadius: 2,
                bgcolor: "#F8F9FA",
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: { xs: 26, sm: 30 },
                      minHeight: { xs: 26, sm: 30 },
                      bgcolor: "white",
                      borderRadius: "8px",
                      p: 0.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={14}
                      height={14}
                    />
                  </ListItemIcon>

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: {
                        xs: "13px",
                        sm: "14px",
                        md: "15px",
                        lg: "16px",
                      },
                      lineHeight: 1.2,
                    }}
                  >
                    {card.value} {card.title}
                  </Typography>
                </Box>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                      lg: "13px",
                    },
                    lineHeight: 1.4,
                  }}
                >
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HealthScoreCard;
