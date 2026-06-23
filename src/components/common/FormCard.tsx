import { Card, CardContent } from "@mui/material";

export default function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
