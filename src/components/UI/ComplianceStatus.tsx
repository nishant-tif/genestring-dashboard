import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useAppSelector } from "@/store";

/**
 * Circular ring using conic-gradient
 */
const CircularRing = ({ value }: { value: number }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: 110, sm: 120, md: 140 },
        height: { xs: 110, sm: 120, md: 140 },
        borderRadius: "50%",
        background: `conic-gradient(
          #000 ${value * 3.6}deg,
          #e6e6e6 ${value * 3.6}deg
        )`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Inner cutout */}
      <Box
        sx={{
          width: { xs: 85, sm: 95, md: 110 },
          height: { xs: 85, sm: 95, md: 110 },
          borderRadius: "50%",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 22, sm: 26, md: 36 },
            fontWeight: 600,
            color: "#2f2f46",
          }}
        >
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

const ProgressRow = ({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) => (
  <Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        {/* icon */}
        <Box
          sx={{
            width: { xs: 22, sm: 26, md: 28 },
            height: { xs: 22, sm: 26, md: 28 },
            borderRadius: 2,
            backgroundColor: "#5cc5b8",
            mr: 1,
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: 12, sm: 13, md: 14 },
            flexGrow: 1,
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: 12, sm: 13, md: 14 },
        }}
      >
        {value}%
      </Typography>
    </Box>

    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 4,
        borderRadius: 2,
        backgroundColor: "#e5e9f0",
        "& .MuiLinearProgress-bar": {
          backgroundColor: danger ? "#c94b4b" : "#5cc5b8",
        },
      }}
    />
  </Box>
);

const ComplianceStatus = () => {
  const { data } = useAppSelector((state) => state.dashboard);

  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" },
        minWidth: { xs: "100%", md: 400 },
      }}
    >
      <Card sx={{ borderRadius: 3 }}>
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: 15, sm: 16, md: 18 },
            }}
          >
            Compliance Status
          </Typography>

          {/* Gray panel */}
          <Box
            sx={{
              backgroundColor: "#f3f3f3",
              borderRadius: 3,
              py: { xs: 3, md: 4 },
              mb: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularRing value={data?.compliance?.overall ?? 0} />
          </Box>

          {/* Bottom rows */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr 1fr 1fr",
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            <ProgressRow
              label="EU AI Act"
              value={data?.compliance?.euAiAct ?? 0}
            />

            <ProgressRow
              label="ISO 42001"
              value={data?.compliance?.iso42001 ?? 0}
            />

            <ProgressRow
              label="India DPDP Act"
              value={data?.compliance?.indiaDpdpAct ?? 0}
              danger
            />

            <ProgressRow
              label="OECD Principles"
              value={data?.compliance?.oecdPrinciples ?? 0}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComplianceStatus;
