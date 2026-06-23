"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchCountries } from "@/store/slices/countriesSlice";
import { fetchStates } from "@/store/slices/stateSlice";
import { fetchCities } from "@/store/slices/citySlice";
import { createArticle, updateArticle } from "@/store/slices/articleSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  categoryIdsFromArticle,
  tagIdsFromArticle,
} from "@/utils/articleFormCategoryTagIds";

import CategoryManagementModal from "@/components/article/CategoryManagementModal";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";
import { fetchAuthors } from "@/store/slices/authorSlice";
import { articleService } from "@/services/dataService";
import { fetchTags } from "@/store/slices/tagSlice";
import TagManagementModal from "@/components/article/TagManagementModal";
import apiClient from "@/services/api";
import { resolveImageUrl } from "@/utils/imagePath";
import Image from "next/image";
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false },
);
interface ArticleFormProps {
  article?: Article | null;
  onCancel: () => void;
  loading?: boolean;
}

interface Country {
  id: string | number;
  countryName: string;
}
interface State {
  id: string;
  state_id: string;
  stateName: string;
}
interface City {
  id: string;
  city_id: string;
  cityName: string;
  stateId?: string;
  countryId?: string;
}
const AddArticle: React.FC<ArticleFormProps> = ({
  article,
  onCancel,
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { authors } = useAppSelector((state) => state.author);
  const { categories } = useAppSelector((state) => state.categories);
  const { countries } = useAppSelector((state) => state.countries);
  const { states } = useAppSelector((state) => state.states);
  const { cities } = useAppSelector((state) => state.cities);
  const { tags } = useAppSelector((state) => state.tags);

  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    article_id: article?.article_id ?? "",
    article_title: article?.article_title ?? article?.title ?? "",
    article_slug: article?.article_slug ?? article?.slug ?? "",
    article_excerpt:
      article?.article_excerpt ?? article?.meta?.subheading ?? "",
    article_content:
      article?.article_content ?? (article as { content?: string })?.content ?? "",
    article_visibility:
      article?.article_visibility ??
      article?.visibility ??
      article?.visiblity ??
      "DRAFT",
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
    meta_tag: article?.meta_tag ?? "",
    country_id: article?.country_id ?? "",
    state_id: article?.state_id ?? "",
    city_id: article?.city_id ?? "",
    category_ids: categoryIdsFromArticle(article),
    tag_ids: tagIdsFromArticle(article),
    featured: article?.featured ?? false,
    show_gif: article?.show_gif ?? false,
    gif: article?.gif ?? "",
  });
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const cityAbortRef = useRef<AbortController | null>(null);
  const cityDebounceRef = useRef<number | null>(null);

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
    if (!article) return;
    setFormData((prev) => ({
      ...prev,
      article_id: article.article_id ?? "",
      article_title: article.article_title ?? article.title ?? "",
      article_slug: article.article_slug ?? article.slug ?? "",
      article_excerpt:
        article.article_excerpt ?? article.meta?.subheading ?? "",
      article_content:
        article.article_content ??
        (article as { content?: string }).content ??
        "",
      article_visibility:
        article.article_visibility ??
        article.visibility ??
        article.visiblity ??
        "DRAFT",
      author_id:
        article.author_id?.toString() ?? article.byLiner?.id?.toString() ?? "",
      article_thumbnail_image:
        article.article_thumbnail_image ?? article.featureImg ?? "",
      article_thumbnail_caption:
        article.article_thumbnail_caption ?? article.meta?.imgcaption ?? "",
      article_thumbnail_image_alt_text:
        article.article_thumbnail_image_alt_text ?? article.meta?.alt ?? "",
      meta_title: article.meta_title ?? article.meta?.meta_title ?? "",
      meta_description:
        article.meta_description ?? article.meta?.meta_description ?? "",
      meta_keywords: article.meta_keywords ?? article.meta?.keywords ?? "",
      meta_tag: article.meta_tag ?? "",
      country_id: article.country_id ?? "",
      state_id: article.state_id ?? "",
      city_id: article.city_id ?? "",
      category_ids: categoryIdsFromArticle(article),
      tag_ids: tagIdsFromArticle(article),
      featured: article.featured ?? false,
      show_gif: article.show_gif ?? false,
      gif: article.gif ?? "",
    }));
  }, [article]);

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

  /* ================= FETCH CITIES ================= */
  useEffect(() => {
    if (formData.state_id) {
      dispatch(fetchCities(formData.state_id));
    }
  }, [formData.state_id, dispatch]);

  const runCitySearch = async (query: string) => {
    // Abort any in-flight search before starting a new one.
    cityAbortRef.current?.abort();
    const controller = new AbortController();
    cityAbortRef.current = controller;

    try {
      setCityLoading(true);
      const res = await apiClient.post(
        "/general/cities-search",
        { search: query, page: 1, pageSize: 100 },
        { signal: controller.signal },
      );
      setCityOptions(res?.data?.data?.data?.rows || []);
    } catch {
      // Ignore aborted requests; keep UI stable for the latest query.
      if (controller.signal.aborted) return;
      setCityOptions([]);
    } finally {
      if (!controller.signal.aborted) setCityLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      cityAbortRef.current?.abort();
      if (cityDebounceRef.current) window.clearTimeout(cityDebounceRef.current);
    };
  }, []);

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
      const payload: typeof formData & {
        category_ids: string[];
        tag_ids: string[];
      } = {
        ...formData,
        category_ids: formData.category_ids ?? [],
        tag_ids: formData.tag_ids ?? [],
      };
      if (isPublishedLocked) {
        delete (payload as { article_slug?: string }).article_slug;
      }

      if (article?.article_id || article?.id) {
        await dispatch(
          updateArticle({
            id: String(article.article_id || article.id),
            article: payload,
          }),
        ).unwrap();
        toast.success("Article updated successfully!");
      } else {
        await dispatch(createArticle(payload)).unwrap();
        toast.success("Article created successfully!");
      }
      navigate.push("/dashboard/articles");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    }
  };

  /* ================= FILE UPLOAD ================= */
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

  const handleGifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    articleService
      .uploadThumbnail(file)
      .then((fileUrl) => {
        setFormData((prev) => ({
          ...prev,
          gif: fileUrl,
        }));
      })
      .catch(() => {
        toast.error("GIF upload failed");
      });
  };

  const handleEditorInit = (evt: unknown, editor: TinyMCEEditor) => {
    editorRef.current = editor;
  };
  const autosavePrefix = "tinymce-autosave-{path}{query}-{id}-";

  const h = 600;
  return (
    <Layout title="">
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
                        ...(isPublishedLocked
                          ? {}
                          : { article_slug: slugFromTitle(v) }),
                      }));
                    }}
                    placeholder="Enter article title (70 characters max)"
                    inputProps={{ maxLength: 70 }}
                    helperText={`${formData.article_title.length}/70 characters`}
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
                {/* <Grid>
                  <Button
                    variant="outlined"
                    onClick={generateSlug}
                    sx={{ mt: 1, height: 56 }}
                    fullWidth
                  >
                    Generate Slug
                  </Button>
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
                        justifyContent: "space-between",
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
                    </Button>
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
          {/* tiny content section */}
          <Grid sx={{ backgroundColor: "#fff" }}>
            <Editor
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              onInit={handleEditorInit}
              value={formData.article_content || ""}
              onEditorChange={(content) => {
                setFormData((prev) => ({
                  ...prev,
                  article_content: content,
                }));
              }}
              init={{
                menubar: "favs file edit view insert format tools table",
                paste_word_valid_elements:
                  "b,i,p,a[href],ol,ul,li,em,br,style,strong,bold",
                image_title: true,
                automatic_uploads: true,
                branding: false,
                autosave_interval: "5s",
                autosave_retention: "1000m",
                autosave_restore_when_empty: true,
                autosave_prefix: autosavePrefix,

                toolbar:
                  "inserttweet | insertpolls | insertbacklink | image | styleselect fontselect fontsizeselect | media | forecolor backcolor | dialog-timeline-btn | undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons",

                menu: {
                  favs: {
                    title: "Menu",
                    items: "visualaid | searchreplace | emoticons",
                  },
                },

                plugins: [
                  // "textcolor",
                  "advlist",
                  "autolink",
                  "link",
                  "image",
                  "lists",
                  "charmap",
                  "preview",
                  "anchor",
                  "pagebreak",
                  "searchreplace",
                  "wordcount",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "emoticons",
                  "codesample",
                  "autosave",
                  "media",
                ],

                media_live_embeds: true,

                invalid_elements: "script,strong",

                extended_valid_elements:
                  "b|style|div[class]|span|a[href|target=_blank]|br|iframe[src|title|width|height|allowfullscreen|frameborder]",

                height: h === undefined ? 600 : h,

                custom_elements: "style",

                image_caption: true,

                a11y_advanced_options: true,

                inline_styles: true,

                cleanup: true,

                formats: {
                  bold: { inline: "b" },
                  italic: { inline: "i" },
                  underline: { inline: "u" },
                },

                content_style:
                  "p { margin-top: 0; margin-bottom: 0; } a{color:#3598db}",
              }}
            />
          </Grid>
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

              {/* Categories multi-select */}
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
                  <TextField
                    {...params}
                    label="Categories"
                    placeholder="Select one or more"
                  />
                )}
              />

              <Box display="flex" justifyContent="space-between" mb={2} mt={3}>
                <Typography variant="h6">Tags</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenTagModal(true)}
                >
                  Manage Tags
                </Button>
              </Box>

              <Autocomplete
                multiple
                fullWidth
                disableCloseOnSelect
                options={tags}
                getOptionLabel={(option) => option.tag_name}
                isOptionEqualToValue={(a, b) =>
                  String(a.tag_id) === String(b.tag_id)
                }
                value={tags.filter((t) =>
                  formData.tag_ids.includes(String(t.tag_id)),
                )}
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
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Select one or more"
                  />
                )}
              />
            </CardContent>
          </Card>

          <CategoryManagementModal
            open={openCategoryModal}
            onClose={handleCloseCategoryModal}
          />
          <TagManagementModal
            open={openTagModal}
            onClose={handleCloseTagModal}
          />

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
                  <Autocomplete
                    options={countries || []}
                    getOptionLabel={(option: Country) => option.countryName}
                    value={
                      (countries || []).find(
                        (country: Country) =>
                          String(country?.id) === String(formData.country_id),
                      ) || null
                    }
                    onChange={(_, value: Country | null) => {
                      setFormData((prev) => ({
                        ...prev,
                        country_id: value ? String(value.id) : "",
                        state_id: "",
                        city_id: "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Country" />
                    )}
                    sx={{ minWidth: 240 }}
                  />
                </Grid>

                <Grid>
                  <Autocomplete
                    options={states || []}
                    disabled={!formData.country_id}
                    getOptionLabel={(option: State) => option.stateName}
                    value={
                      (states || []).find(
                        (state: State) =>
                          String(state.state_id || state.id) ===
                          String(formData.state_id),
                      ) || null
                    }
                    onChange={(_, value: State | null) => {
                      setFormData((prev) => ({
                        ...prev,
                        state_id: value
                          ? String(value.state_id || value.id)
                          : "",
                        city_id: "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="State" />
                    )}
                    sx={{ minWidth: 240 }}
                  />
                </Grid>

                <Grid>
                  <Autocomplete
                    options={
                      citySearch.trim().length ? cityOptions : cities || []
                    }
                    getOptionLabel={(option: City) => option.cityName}
                    value={
                      (citySearch.trim().length
                        ? cityOptions
                        : cities || []
                      ).find(
                        (city: City) =>
                          String(city.city_id || city.id) ===
                          String(formData.city_id),
                      ) || null
                    }
                    onInputChange={(_, value, reason) => {
                      if (reason !== "input") return;
                      setCitySearch(value);

                      const q = value.trim();
                      if (!q) {
                        setCityOptions([]);
                        return;
                      }

                      if (cityDebounceRef.current) {
                        window.clearTimeout(cityDebounceRef.current);
                      }
                      cityDebounceRef.current = window.setTimeout(() => {
                        runCitySearch(q);
                      }, 300);
                    }}
                    onChange={(_, value: City | null) => {
                      if (!value) {
                        setFormData((prev) => ({ ...prev, city_id: "" }));
                        return;
                      }

                      setCitySearch(value.cityName);
                      setFormData((prev) => ({
                        ...prev,
                        city_id: String(value.city_id || value.id),
                        state_id: value.stateId
                          ? String(value.stateId)
                          : prev.state_id,
                        country_id: value.countryId
                          ? String(value.countryId)
                          : prev.country_id,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {cityLoading ? (
                                <CircularProgress size={16} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    sx={{ minWidth: 260 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
                  {!isPublishedLocked ? (
                    <MenuItem value="DRAFT">Draft</MenuItem>
                  ) : null}
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                </Select>
              </FormControl>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!formData.featured}
                      onChange={(_, checked) =>
                        setFormData((prev) => ({ ...prev, featured: checked }))
                      }
                    />
                  }
                  label="Featured Status"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={!!formData.show_gif}
                      onChange={(_, checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          show_gif: checked,
                          gif: checked ? prev.gif : "",
                        }))
                      }
                    />
                  }
                  label="Enable GIF"
                />
              </Stack>

              {formData.show_gif ? (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Button component="label" variant="outlined">
                    Upload GIF
                    <input
                      hidden
                      type="file"
                      accept="image/gif"
                      onChange={handleGifChange}
                    />
                  </Button>
                  {formData.gif ? (
                    <Typography variant="caption" color="text.secondary">
                      Selected: {formData.gif}
                    </Typography>
                  ) : null}
                </Stack>
              ) : null}
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

                {/* <Grid>
                  <TextField
                    fullWidth
                    label="Meta Tag"
                    name="meta_tag"
                    value={formData.meta_tag}
                    onChange={handleInputChange}
                    placeholder="Primary meta tag"
                    variant="outlined"
                  />
                </Grid> */}

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
    </Layout>
  );
};

export default AddArticle;
