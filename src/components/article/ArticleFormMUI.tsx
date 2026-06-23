"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Stack,
  Autocomplete,
  Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Article, Country, State, City } from "@/types/article";
import { createArticle, updateArticle } from "@/store/slices/articleSlice";
import { AppDispatch, RootState, useAppSelector } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "@/utils/toast";
import { articleService } from "@/services/dataService";
import { SelectChangeEvent } from "@mui/material/Select";
import { categoryIdsFromArticle, tagIdsFromArticle } from "@/utils/articleFormCategoryTagIds";
import CategoryManagementModal from "./CategoryManagementModal";
import TagManagementModal from "./TagManagementModal";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchTags } from "@/store/slices/tagSlice";
import { fetchCountries } from "@/store/slices/countriesSlice";
import { fetchStates } from "@/store/slices/stateSlice";
import { fetchCities } from "@/store/slices/citySlice";
import { fetchAuthors } from "@/store/slices/authorSlice";
import { resolveImageUrl } from "@/utils/imagePath";
import Image from "next/image";
interface ArticleFormProps {
  article?: Article | null;
  onCancel: () => void;
}

function buildArticleFormFields(article?: Article | null) {
  return {
    article_id: article?.article_id ?? "",
    article_title: article?.article_title ?? article?.title ?? "",
    article_slug: article?.article_slug ?? article?.slug ?? "",
    article_excerpt: article?.article_excerpt ?? article?.meta?.subheading ?? "",
    article_content: article?.article_content ?? "",
    article_visibility:
      article?.article_visibility ?? article?.visibility ?? article?.visiblity ?? "DRAFT",
    author_id:
      article?.author_id?.toString() ?? article?.byLiner?.id?.toString() ?? "",
    article_thumbnail_image:
      article?.article_thumbnail_image ?? article?.featureImg ?? "",
    article_thumbnail_caption:
      article?.article_thumbnail_caption ?? article?.meta?.imgcaption ?? "",
    article_thumbnail_image_alt_text:
      article?.article_thumbnail_image_alt_text ?? article?.meta?.alt ?? "",
    meta_title: article?.meta_title ?? article?.meta?.meta_title ?? "",
    meta_description:
      article?.meta_description ?? article?.meta?.meta_description ?? "",
    meta_keywords: article?.meta_keywords ?? article?.meta?.keywords ?? "",
    category_ids: categoryIdsFromArticle(article),
    tag_ids: tagIdsFromArticle(article),
    country_id: article?.country_id ?? "",
    state_id: article?.state_id ?? "",
    city_id: article?.city_id ?? "",
  };
}

const ArticleFormMUIInner: React.FC<ArticleFormProps> = ({
  article,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.articles);

  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState(() => buildArticleFormFields(article));
  const { authors } = useAppSelector((state) => state.author);
  const { categories } = useAppSelector((state) => state.categories);
  const { tags } = useAppSelector((state) => state.tags);
  const { countries } = useAppSelector((state) => state.countries);
  const { states } = useAppSelector((state) => state.states);
  const { cities } = useAppSelector((state) => state.cities);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);

  const isPublishedLocked = useMemo(() => {
    const v =
      article?.article_visibility ??
      article?.visibility ??
      (article as { visiblity?: string })?.visiblity;
    return v === "PUBLISHED";
  }, [article]);

  const slugFromTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleOpenCategoryModal = () => {
    setOpenCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
    dispatch(fetchCategories({ page: 1, size: 100 }));
  };

  const handleCloseTagModal = () => {
    setOpenTagModal(false);
    dispatch(fetchTags({ page: 1, size: 100 }));
  };
  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, size: 100 }));
    dispatch(fetchCountries());
    dispatch(fetchAuthors({ page: 1, size: 100 }));
    dispatch(fetchTags({ page: 1, size: 100 }));
  }, [dispatch]);

  /* ================= FETCH STATES ================= */
  useEffect(() => {
    if (formData.country_id) {
      dispatch(fetchStates(formData.country_id));
    }
  }, [formData.country_id, dispatch]);

  /* ================= STATE CHANGE ================= */
  /* ================= FETCH CITIES ================= */
  useEffect(() => {
    if (formData.state_id) {
      dispatch(fetchCities(formData.state_id));
    }
  }, [formData.state_id, dispatch]);

  /* ================= INPUT CHANGE ================= */
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "author_id") {
        return {
          ...prev,
          author_id: value,
        };
      }
      if (name === "country_id") {
        return {
          ...prev,
          country_id: value,
          state_id: "",
          city_id: "",
        };
      }

      if (name === "state_id") {
        return {
          ...prev,
          state_id: value,
          city_id: "",
        };
      }

      return {
        ...prev,
        [name as keyof typeof prev]: value,
      };
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.article_title ||
      !formData.article_slug ||
      !formData.article_content
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        ...formData,
        category_ids: formData.category_ids ?? [],
        tag_ids: formData.tag_ids ?? [],
      };
      if (article && isPublishedLocked) {
        delete payload.article_slug;
      }
      if (article) {
        await dispatch(
          updateArticle({
            id: String(article.article_id || article.id),
            article: payload as Partial<Article>,
          }),
        ).unwrap();
      } else {
        await dispatch(createArticle(payload)).unwrap();
      }

      toast.success("Article saved successfully");
      onCancel();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    }
  };

  /* ================= FILE ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    articleService
      .uploadThumbnail(file)
      .then((fileUrl) => {
        setFormData((prev) => ({
          ...prev,
          article_thumbnail_image: fileUrl,
        }));
      })
      .catch(() => {
        toast.error("Thumbnail upload failed");
      });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        {article ? "Edit Article" : "Create New Article"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <Card sx={{ mb: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid
              spacing={2}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Grid>
                <TextField
                  fullWidth
                  label="Title"
                  name="article_title"
                  value={formData.article_title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      article_title: v,
                      ...(isPublishedLocked ? {} : { article_slug: slugFromTitle(v) }),
                    }));
                  }}
                  placeholder="Enter article title"
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  label="Slug"
                  name="article_slug"
                  value={formData.article_slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated-from-title"
                  required
                  helperText={
                    isPublishedLocked
                      ? "This slug is fixed now that the article is published."
                      : "URL-friendly version of the title (auto-generated, but you can edit it)"
                  }
                  variant="outlined"
                  InputProps={{ readOnly: isPublishedLocked }}
                />
              </Grid>
              {!isPublishedLocked ? (
              <Grid>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      article_slug: slugFromTitle(prev.article_title),
                    }))
                  }
                  sx={{ mt: 1, height: 56 }}
                  fullWidth
                >
                  Generate Slug
                </Button>
              </Grid>
              ) : null}

              {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Excerpt"
                    name="article_excerpt"
                    value={formData.article_excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the article"
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid> */}

              {/* ================= THUMBNAIL (UPDATED DESIGN) ================= */}
              <Grid>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Thumbnail Image *
                </Typography>

                <Typography sx={{ color: "#f78fb3", mb: 2 }}>
                  Widget Image
                </Typography>

                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    border: "2px dashed #f8a5c2",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    mb: 2,
                    overflow: "hidden",
                  }}
                >
                  {formData.article_thumbnail_image ? (
                    <Image
                      width={200}
                      height={200}
                      key={formData.article_thumbnail_image}
                      src={resolveImageUrl(formData.article_thumbnail_image)}
                      alt={
                        formData.article_thumbnail_image_alt_text ||
                        formData.article_title ||
                        "Article thumbnail"
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: 40, color: "#ccc" }}>
                      📷
                    </Typography>
                  )}
                </Box>

                <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                  Widget image: max image size 100–200 kb.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    border: "1px solid #f8a5c2",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Button
                    component="label"
                    sx={{
                      flex: 1,
                      justifyContent: "flex-start",
                      textTransform: "none",
                      color: "#777",
                    }}
                  >
                    Choose File
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>

                  <Box
                    sx={{
                      backgroundColor: "#f78fb3",
                      color: "#fff",
                      px: 3,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    BROWSE
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Thumbnail Caption"
                  name="article_thumbnail_caption"
                  value={formData.article_thumbnail_caption}
                  onChange={handleInputChange}
                  placeholder="Caption shown with thumbnail"
                  variant="outlined"
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="Thumbnail Image Alt Text"
                  name="article_thumbnail_image_alt_text"
                  value={formData.article_thumbnail_image_alt_text}
                  onChange={handleInputChange}
                  placeholder="Accessibility alt text for thumbnail image"
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
            {/* </Grid> */}
          </CardContent>
        </Card>

        {/* SEO & Meta Information Section */}
        <Card sx={{ mb: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              SEO & Meta Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid
              spacing={2}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Grid>
                <TextField
                  fullWidth
                  label="Meta Title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="Meta title for search engines (50-60 characters)"
                  inputProps={{ maxLength: 60 }}
                  helperText={`${formData.meta_title.length}/60 characters`}
                  variant="outlined"
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  label="Meta Description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="Meta description for search engines (150-160 characters)"
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 160 }}
                  helperText={`${formData.meta_description.length}/160 characters`}
                  variant="outlined"
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  label="Meta Keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleInputChange}
                  placeholder="Comma-separated keywords (e.g., keyword1, keyword2, keyword3)"
                  helperText="Separate keywords with commas"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Categories Section */}
        <Card>
          <CardContent>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Categories</Typography>

              <Button
                variant="contained"
                size="small"
                onClick={handleOpenCategoryModal}
              >
                Manage Categories
              </Button>
            </Box>

            <Autocomplete
              multiple
              fullWidth
              disableCloseOnSelect
              options={categories}
              getOptionLabel={(option) => option.category_name}
              isOptionEqualToValue={(a, b) =>
                String(a.category_id) === String(b.category_id)
              }
              value={categories.filter((c) =>
                formData.category_ids.includes(String(c.category_id)),
              )}
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  category_ids: newValue.map((c) => String(c.category_id)),
                }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={String(option.category_id)}
                    label={option.category_name}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Categories" placeholder="Select one or more" />
              )}
            />

            <Box display="flex" justifyContent="space-between" mb={2} mt={3}>
              <Typography variant="h6">Tags</Typography>
              <Button variant="contained" size="small" onClick={() => setOpenTagModal(true)}>
                Manage Tags
              </Button>
            </Box>

            <Autocomplete
              multiple
              fullWidth
              disableCloseOnSelect
              options={tags}
              getOptionLabel={(option) => option.tag_name}
              isOptionEqualToValue={(a, b) => String(a.tag_id) === String(b.tag_id)}
              value={tags.filter((t) => formData.tag_ids.includes(String(t.tag_id)))}
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  tag_ids: newValue.map((t) => String(t.tag_id)),
                }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={String(option.tag_id)}
                    label={option.tag_name}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Select one or more" />
              )}
            />
          </CardContent>
        </Card>

        <CategoryManagementModal
          open={openCategoryModal}
          onClose={handleCloseCategoryModal}
        />
        <TagManagementModal open={openTagModal} onClose={handleCloseTagModal} />

        {/* Author Section */}
        <Card>
          <CardContent>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Author</Typography>
            </Box>

            {/* Author Select */}
            <FormControl fullWidth>
              <InputLabel>Author</InputLabel>

              <Select
                name="author_id"
                value={formData?.author_id || ""}
                label="Author"
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>Select Author</em>
                </MenuItem>

                {authors.map((author) => (
                  <MenuItem key={author?.author_id} value={author?.author_id}>
                    {author?.author_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        {/* Location Section */}
        <Card sx={{ mb: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Location
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country_id"
                    aria-placeholder="country"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    label="Country"
                    sx={{
                      width: formData.country_id ? "auto" : "7rem",
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Country</em>
                    </MenuItem>
                    {countries &&
                      countries?.map((country: Country) => (
                        <MenuItem key={country?.id} value={country?.id}>
                          {country?.countryName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid>
                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={!formData.country_id}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                    label="State"
                    sx={{
                      width: formData.state_id ? "auto" : "7rem",
                    }}
                  >
                    <MenuItem value="">
                      <em>Select State</em>
                    </MenuItem>
                    {states.map((state: State) => (
                      <MenuItem
                        key={state.state_id || state.id}
                        value={state.state_id || state.id}
                      >
                        {state.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid>
                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={!formData.state_id}
                >
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    label="City"
                    sx={{
                      width: formData.city_id ? "auto" : "7rem",
                    }}
                  >
                    <MenuItem value="">
                      <em>Select City</em>
                    </MenuItem>
                    {cities.map((city: City) => (
                      <MenuItem
                        key={city.city_id || city.id}
                        value={city.city_id || city.id}
                      >
                        {city.cityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid sx={{ backgroundColor: "#fff" }}>
          <TextField
            fullWidth
            label="Content"
            name="article_content"
            value={formData.article_content}
            onChange={handleInputChange}
            placeholder="Article content"
            multiline
            rows={8}
            required
            variant="outlined"
          />
        </Grid>
        {/* Visibility & Publishing Section */}
        <Card sx={{ mb: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Visibility & Publishing
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                name="article_visibility"
                value={formData.article_visibility}
                onChange={handleInputChange}
                label="Status"
              >
                {!isPublishedLocked ? <MenuItem value="DRAFT">Draft</MenuItem> : null}
                <MenuItem value="PUBLISHED">Published</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            size="large"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            size="large"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : article ? (
              "Update Article"
            ) : (
              "Create Article"
            )}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

/** Remount inner form when switching articles so state resets without setState-in-effect. */
export const ArticleFormMUI: React.FC<ArticleFormProps> = (props) => {
  const k = props.article
    ? String(props.article.article_id ?? props.article.id ?? "")
    : "new";
  return <ArticleFormMUIInner key={k} {...props} />;
};

export default ArticleFormMUI;
