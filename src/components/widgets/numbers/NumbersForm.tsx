"use client";

import { Box, Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

export default function NumbersForm() {
  const [items, setItems] = useState([{ heading: "", count: "", color: "" }]);

  const addItem = () => {
    setItems([...items, { heading: "", count: "", color: "" }]);
  };

  return (
    <Box>
      {items.map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid>
            <TextField label="Heading" fullWidth />
          </Grid>

          <Grid>
            <TextField label="Count" fullWidth />
          </Grid>

          <Grid>
            <TextField label="Color" fullWidth />
          </Grid>
        </Grid>
      ))}

      <Button variant="outlined" onClick={addItem}>
        Add Number
      </Button>
    </Box>
  );
}
