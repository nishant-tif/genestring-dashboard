"use client";

import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { resolveImageUrl } from "@/utils/imagePath";

interface Props {
  title: string;
  image: string;
}

export default function RegulationCard({ title, image }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        p: 2,
        height: 260,
      }}
    >
      <CardMedia
        component="img"
        image={resolveImageUrl(image)}
        sx={{
          borderRadius: 4,
          height: 150,
          objectFit: "cover",
        }}
      />

      <CardContent>
        <Typography fontWeight={600} fontSize={20}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
