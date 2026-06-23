"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  AngelCard,
  FooterAddress,
  MediaCard,
  fetchContentWidgets,
  saveAngelWidget,
  saveBlogCards,
  saveFooterAddresses,
  saveNewsCards,
  savePodcastCards,
  saveSuccessCaseCards,
  setAngelCards,
  setAngelHeading,
  setBlogCards,
  setFooterAddresses,
  setNewsCards,
  setPodcastCards,
  setSuccessCaseCards,
} from "@/store/slices/contentWidgetsSlice";
import { toast } from "react-toastify";

const emptyMediaCard: MediaCard = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
};

const emptyAngelCard: AngelCard = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
  alt_text: "",
};

const emptyFooterAddress: FooterAddress = {
  city: "",
  address: "",
};

function MediaSection({
  title,
  cards,
  setCards,
  onSave,
}: {
  title: string;
  cards: MediaCard[];
  setCards: (value: MediaCard[]) => void;
  onSave: () => void;
}) {
  const updateCard = (
    index: number,
    field: keyof MediaCard,
    value: string,
  ): void => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const addCard = () => setCards([...cards, { ...emptyMediaCard }]);
  const removeCard = (index: number) =>
    setCards(cards.filter((_, i) => i !== index));

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        <Stack spacing={2}>
          {cards.map((card, index) => (
            <Box key={`${title}-${index}`} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography fontWeight={600}>Item #{index + 1}</Typography>
                <IconButton color="error" onClick={() => removeCard(index)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={card.title}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Subtitle"
                  value={card.subtitle}
                  onChange={(e) => updateCard(index, "subtitle", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Image URL"
                  value={card.image}
                  onChange={(e) => updateCard(index, "image", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Link (optional)"
                  value={card.link}
                  onChange={(e) => updateCard(index, "link", e.target.value)}
                  fullWidth
                />
              </Stack>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addCard}>
            Add Item
          </Button>
          <Button variant="contained" onClick={onSave}>
            Save {title}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ContentWidgetsPage() {
  const dispatch = useAppDispatch();
  const {
    podcastCards,
    successCaseCards,
    angelHeading,
    angelCards,
    newsCards,
    blogCards,
    footerAddresses,
  } = useAppSelector((state) => state.contentWidgets);

  useEffect(() => {
    dispatch(fetchContentWidgets());
  }, [dispatch]);

  const updateAngelCard = (
    index: number,
    field: keyof AngelCard,
    value: string,
  ) => {
    const updated = [...angelCards];
    updated[index] = { ...updated[index], [field]: value };
    dispatch(setAngelCards(updated));
  };

  const updateFooterAddress = (
    index: number,
    field: keyof FooterAddress,
    value: string,
  ) => {
    const updated = [...footerAddresses];
    updated[index] = { ...updated[index], [field]: value };
    dispatch(setFooterAddresses(updated));
  };

  return (
    <Layout
      title="Website Content Widgets"
      breadcrumbs={[{ label: "Dashboard / Widgets / Content" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: 3, borderRadius: 3 }}>
        <MediaSection
          title="Podcast Widget"
          cards={podcastCards}
          setCards={(cards) => dispatch(setPodcastCards(cards))}
          onSave={() => dispatch(savePodcastCards(podcastCards))}
        />

        <MediaSection
          title="Successful Cases Widget"
          cards={successCaseCards}
          setCards={(cards) => dispatch(setSuccessCaseCards(cards))}
          onSave={() => dispatch(saveSuccessCaseCards(successCaseCards))}
        />

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Angel Slider Widget
            </Typography>
            <TextField
              label="Section Heading"
              value={angelHeading}
              onChange={(e) => dispatch(setAngelHeading(e.target.value))}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Stack spacing={2}>
              {angelCards.map((card, index) => (
                <Box key={`angel-${index}`} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography fontWeight={600}>Slide #{index + 1}</Typography>
                    <IconButton
                      color="error"
                      onClick={async () => {
                        if (!window.confirm("Remove this slide?")) return;
                        const updated = angelCards.filter((_, i) => i !== index);
                        dispatch(setAngelCards(updated));
                        try {
                          await dispatch(
                            saveAngelWidget({ heading: angelHeading, cards: updated }),
                          ).unwrap();
                          toast.success("Slide removed");
                        } catch {
                          dispatch(fetchContentWidgets());
                          toast.error("Could not save. List refreshed.");
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="Title"
                      value={card.title}
                      onChange={(e) =>
                        updateAngelCard(index, "title", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Subtitle"
                      value={card.subtitle}
                      onChange={(e) =>
                        updateAngelCard(index, "subtitle", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Image URL"
                      value={card.image}
                      onChange={(e) =>
                        updateAngelCard(index, "image", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Image Alt Text (Required)"
                      value={card.alt_text}
                      onChange={(e) =>
                        updateAngelCard(index, "alt_text", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Link (optional)"
                      value={card.link}
                      onChange={(e) => updateAngelCard(index, "link", e.target.value)}
                      fullWidth
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => dispatch(setAngelCards([...angelCards, emptyAngelCard]))}
              >
                Add Slide
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  dispatch(
                    saveAngelWidget({ heading: angelHeading, cards: angelCards }),
                  )
                }
              >
                Save Angel Slider
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <MediaSection
          title="News Widget"
          cards={newsCards}
          setCards={(cards) => dispatch(setNewsCards(cards))}
          onSave={() => dispatch(saveNewsCards(newsCards))}
        />

        <MediaSection
          title="Blogs Widget"
          cards={blogCards}
          setCards={(cards) => dispatch(setBlogCards(cards))}
          onSave={() => dispatch(saveBlogCards(blogCards))}
        />

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Footer Address Widget
            </Typography>
            <Stack spacing={2}>
              {footerAddresses.map((address, index) => (
                <Box key={`footer-${index}`} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography fontWeight={600}>Address #{index + 1}</Typography>
                    <IconButton
                      color="error"
                      onClick={() =>
                        dispatch(
                          setFooterAddresses(
                            footerAddresses.filter((_, i) => i !== index),
                          ),
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="City / Branch Name"
                      value={address.city}
                      onChange={(e) =>
                        updateFooterAddress(index, "city", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Address"
                      value={address.address}
                      onChange={(e) =>
                        updateFooterAddress(index, "address", e.target.value)
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  dispatch(
                    setFooterAddresses([...footerAddresses, emptyFooterAddress]),
                  )
                }
              >
                Add Address
              </Button>
              <Button
                variant="contained"
                onClick={() => dispatch(saveFooterAddresses(footerAddresses))}
              >
                Save Footer Addresses
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
