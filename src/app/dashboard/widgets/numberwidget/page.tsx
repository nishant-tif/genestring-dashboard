"use client";

import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  fetchNumbersWidget,
  saveNumbersWidget,
  deleteNumberCard,
  NumberCard,
} from "@/store/slices/numberWidgetSlice";

import Layout from "@/components/layout/Layout";
import { RootState, useAppDispatch } from "@/store";

export default function NumbersWidgetPage() {
  const dispatch = useAppDispatch();
  const { cards } = useSelector((state: RootState) => state.numbersWidget);

  const [localCards, setLocalCards] = useState<NumberCard[]>([]);

  useEffect(() => {
    dispatch(fetchNumbersWidget());
  }, []);

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleChange = (
    index: number,
    field: keyof NumberCard,
    value: string | number,
  ) => {
    const updated = [...localCards];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCards(updated);
  };

  const addCard = () => {
    setLocalCards([
      ...localCards,
      {
        title: "",
        value: 0,
        prefix: "",
        suffix: "",
        subtitle: "",
        color: "primary",
      },
    ]);
  };

  const removeCard = (index: number) => {
    dispatch(deleteNumberCard(index));
  };

  const handleSave = () => {
    dispatch(saveNumbersWidget(localCards));
  };

  return (
    <Layout
      title="Numbers Widget Details"
      breadcrumbs={[{ label: "Dashboard / Numbers Widget" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Edit Numbers Widget
        </Typography>

        {/* Preview Section */}
        <Typography variant="subtitle1" mb={2}>
          Preview
        </Typography>

        <Grid container spacing={2} mb={4}>
          {localCards.map((card, index) => (
            <Grid key={index}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  background: "#f1f3f5",
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {card.title || "TITLE"}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  color={
                    card.color === "success"
                      ? "success.main"
                      : card.color === "error"
                        ? "error.main"
                        : "primary.main"
                  }
                >
                  {card.prefix}
                  {card.value}
                  {card.suffix}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {card.subtitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Form Cards */}
        {localCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              position: "relative",
            }}
          >
            <Typography fontWeight={600} mb={2}>
              Number Item #{index + 1}
            </Typography>

            <IconButton
              sx={{ position: "absolute", right: 15, top: 15 }}
              color="error"
              onClick={() => removeCard(index)}
            >
              <DeleteIcon />
            </IconButton>

            <Grid container spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  label="Heading"
                  value={card.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  label="Count"
                  type="number"
                  value={card.value}
                  onChange={(e) =>
                    handleChange(index, "value", Number(e.target.value))
                  }
                />
              </Grid>

              <Grid>
                <TextField
                  select
                  fullWidth
                  label="Prefix (Optional)"
                  value={card.prefix}
                  onChange={(e) =>
                    handleChange(index, "prefix", e.target.value)
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="+">+</MenuItem>
                  <MenuItem value="$">$</MenuItem>
                </TextField>
              </Grid>

              <Grid>
                <TextField
                  select
                  fullWidth
                  label="Suffix (Optional)"
                  value={card.suffix}
                  onChange={(e) =>
                    handleChange(index, "suffix", e.target.value)
                  }
                >
                  <MenuItem value="">No Suffix</MenuItem>
                  <MenuItem value="+">+</MenuItem>
                  <MenuItem value="%">%</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                </TextField>
              </Grid>

              <Grid>
                <TextField
                  select
                  fullWidth
                  label="Color"
                  value={card.color}
                  onChange={(e) => handleChange(index, "color", e.target.value)}
                >
                  <MenuItem value="primary">Blue</MenuItem>
                  <MenuItem value="secondary">Purple</MenuItem>
                  <MenuItem value="success">Green</MenuItem>
                  <MenuItem value="error">Pink</MenuItem>
                </TextField>
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  label="Subtitle"
                  value={card.subtitle}
                  onChange={(e) =>
                    handleChange(index, "subtitle", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Card>
        ))}

        {/* Add Button */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addCard}>
            Add Another Number
          </Button>
        </Box>

        {/* Bottom Buttons */}
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            sx={{
              background: "#000",
              "&:hover": { background: "#333" },
            }}
            onClick={handleSave}
          >
            Update Numbers Widget
          </Button>

          <Button variant="outlined">Cancel</Button>
        </Box>
      </Box>
    </Layout>
  );
}
