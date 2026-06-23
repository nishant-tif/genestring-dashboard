"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "@/components/layout/Layout";
import apiClient from "@/services/api";
import { toast } from "react-toastify";
import Image from "next/image";
import { normalizeImagePath, resolveImageUrl } from "@/utils/imagePath";

type GeneralSettings = {
  site_name?: string;
  site_title?: string;
  meta_description?: string;
  content_type?: string;
  website_color?: string;
  font_color?: string;
  tertiary_border_color?: string;
  border_color?: string;
  logo_url?: string;
  favicon_url?: string;
  login_background_image_url?: string;
  loading_image_url?: string;
  website_url?: string;
  dashboard_url?: string;
  support_email?: string;
  footer_message?: string;
};

const defaultColors = {
  website_color: "#000000",
  font_color: "#000000",
  border_color: "#000000",
  tertiary_border_color: "#000000",
} as const;

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post("/general-setting/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = res.data.data.data as { file_name?: string; file_url?: string };
  return data.file_name || data.file_url || "";
};

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>({});
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/general-setting");
      const data = res.data?.data?.data || {};
      setSettings({
        ...data,
        logo_url: normalizeImagePath(data.logo_url),
        favicon_url: normalizeImagePath(data.favicon_url),
        login_background_image_url: normalizeImagePath(data.login_background_image_url),
        loading_image_url: normalizeImagePath(data.loading_image_url),
      });
    } catch {
      setSettings({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange =
    (key: keyof GeneralSettings) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleUpload =
    (key: keyof GeneralSettings) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const url = normalizeImagePath(await uploadFile(file));
        setSettings((prev) => ({ ...prev, [key]: url }));
        toast.success("Uploaded successfully");
      } catch {
        toast.error("Upload failed");
      }
    };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiClient.put("/general-setting", settings);
      toast.success("Settings saved");
      await fetchSettings();
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const ColorField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="#000000"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              component="input"
              type="color"
              value={value}
              onChange={(e) => onChange((e.target as HTMLInputElement).value)}
              style={{
                width: 34,
                height: 24,
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            />
          </InputAdornment>
        ),
      }}
    />
  );

  const UploadRow = ({
    label,
    keyName,
    hint,
  }: {
    label: string;
    keyName: keyof GeneralSettings;
    hint?: string;
  }) => (
    <Box>
      <Typography fontWeight={600} mb={0.5}>
        {label}
      </Typography>
      {hint ? (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      ) : null}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={settings[keyName] || ""}
          onChange={handleChange(keyName)}
          placeholder="Uploaded URL"
        />
        <Button
          component="label"
          variant="contained"
          sx={{ whiteSpace: "nowrap", background: "#000", "&:hover": { background: "#333" } }}
        >
          Upload
          <input hidden type="file" accept="image/*" onChange={handleUpload(keyName)} />
        </Button>
      </Box>
      {settings[keyName] ? (
        <>
        <Box sx={{mt:1 , ml:1}}>
        <Image
          height={70}
          width={70}
          src={resolveImageUrl(settings[keyName])}
          alt={label}
        />
        </Box>

        </>
      ) : null}
    </Box>
  );

  return (
    <Layout
      title="General Settings"
      breadcrumbs={[{ label: "Dashboard / Settings / General Settings" }]}
    >
      <Box sx={{ background: "#f7f7f7", p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Site Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage global branding, colors and footer details.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ background: "#000", "&:hover": { background: "#333" } }}
              >
                Save
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography fontWeight={800} mb={1}>
                  Basic
                </Typography>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Site Name"
                  value={settings.site_name || ""}
                  onChange={handleChange("site_name")}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Site Title"
                  value={settings.site_title || ""}
                  onChange={handleChange("site_title")}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={settings.meta_description || ""}
                  onChange={handleChange("meta_description")}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Content Type"
                  value={settings.content_type || ""}
                  onChange={handleChange("content_type")}
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1", mt: 0.5 }}>
                <Divider />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography fontWeight={800} mb={1}>
                  Colors
                </Typography>
              </Box>
              <Box>
                <ColorField
                  label="Website Color"
                  value={settings.website_color || defaultColors.website_color}
                  onChange={(v) =>
                    setSettings((p) => ({ ...p, website_color: v }))
                  }
                />
              </Box>
              <Box>
                <ColorField
                  label="Font Color"
                  value={settings.font_color || defaultColors.font_color}
                  onChange={(v) => setSettings((p) => ({ ...p, font_color: v }))}
                />
              </Box>
              <Box>
                <ColorField
                  label="Tertiary Border Color"
                  value={
                    settings.tertiary_border_color ||
                    defaultColors.tertiary_border_color
                  }
                  onChange={(v) =>
                    setSettings((p) => ({ ...p, tertiary_border_color: v }))
                  }
                />
              </Box>
              <Box>
                <ColorField
                  label="Border Color"
                  value={settings.border_color || defaultColors.border_color}
                  onChange={(v) => setSettings((p) => ({ ...p, border_color: v }))}
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1", mt: 0.5 }}>
                <Divider />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography fontWeight={800} mb={1}>
                  Branding & Images
                </Typography>
              </Box>
              <Box>
                <UploadRow label="Logo" keyName="logo_url" hint="Used in header & dashboard." />
              </Box>
              <Box>
                <UploadRow label="Favicon" keyName="favicon_url" hint="Used in browser tab." />
              </Box>
              <Box>
                <UploadRow
                  label="Login Background"
                  keyName="login_background_image_url"
                  hint="Shown on dashboard login page."
                />
              </Box>
              <Box>
                <UploadRow
                  label="Loading Image"
                  keyName="loading_image_url"
                  hint="Displayed while content loads."
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1", mt: 0.5 }}>
                <Divider />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography fontWeight={800} mb={1}>
                  Links & Footer
                </Typography>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Website URL"
                  value={settings.website_url || ""}
                  onChange={handleChange("website_url")}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Dashboard URL"
                  value={settings.dashboard_url || ""}
                  onChange={handleChange("dashboard_url")}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Support Email Address"
                  value={settings.support_email || ""}
                  onChange={handleChange("support_email")}
                />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  fullWidth
                  label="Footer Message"
                  value={settings.footer_message || ""}
                  onChange={handleChange("footer_message")}
                  multiline
                  minRows={3}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

