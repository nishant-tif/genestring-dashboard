/**
 * DB stores only filenames (e.g. "1739123456-photo.jpg").
 * Use resolveImageUrl() when rendering; normalizeImagePath() before saving to API.
 */

export const normalizeImagePath = (value?: string | null): string => {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    try {
      const u = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    } catch {
      const parts = trimmed.replace(/\\/g, "/").split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    }
  }
  const clean = trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length > 1 && /^uploads$/i.test(parts[0])) {
    return parts[parts.length - 1];
  }
  if (parts.length === 1) return parts[0];
  return parts[parts.length - 1] || "";
};

const getAssetBaseUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  if (!raw) return "";
  const cleaned = raw.replace(/\/+$/, "");
  return cleaned.replace(/\/api$/i, "");
};

const getUploadsFolder = (): string =>
  (process.env.NEXT_PUBLIC_UPLOAD_FOLDER || "uploads").replace(/^\/+|\/+$/g, "");

/** Client-side mirror of backend PUBLIC_MEDIA_BASE_URL (or NEXT_PUBLIC_IMG_URI). */
const getPublicMediaBaseUrl = (): string => {
  const media = process.env.NEXT_PUBLIC_PUBLIC_MEDIA_BASE_URL?.trim();
  if (media) return media.replace(/\/+$/, "");
  const imgUri = process.env.NEXT_PUBLIC_IMG_URI?.trim();
  if (imgUri) return imgUri.replace(/\/+$/, "");
  return "";
};

export const resolveImageUrl = (value?: string | null): string => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";

  // Full URL from API/legacy rows — keep host (important when local UI points at prod API)
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  const filename = normalizeImagePath(trimmed);
  if (!filename) return "";

  const mediaBase = getPublicMediaBaseUrl();
  if (mediaBase) {
    return `${mediaBase}/${filename}`;
  }

  const base = getAssetBaseUrl();
  if (!base) return `/${getUploadsFolder()}/${filename}`;
  return `${base}/${getUploadsFolder()}/${filename}`;
};
