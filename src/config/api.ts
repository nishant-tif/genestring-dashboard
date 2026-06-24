// API Configuration - Change this baseURL when real API is available
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://devapi.genestringlab.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Policies
  POLICIES: "/policies",
  POLICY_BY_ID: (id: string) => `/policies/${id}`,

  // Models
  MODELS: "/models",
  MODEL_BY_ID: (id: string) => `/models/${id}`,

  // Organizations
  ORGANIZATIONS: "/organizations",
  ORGANIZATION_BY_ID: (id: string) => `/organizations/${id}`,

  // Team
  TEAM: "/team",
  TEAM_BY_ID: (id: string) => `/team/${id}`,
  TEAM_BY_SLUG: (slug: string) => `/team/slug/${slug}`,

  // Testimonials
  TESTIMONIALS: "/testimonials",
  TESTIMONIAL_BY_ID: (id: string) => `/testimonials/${id}`,
  TESTIMONIALS_WIDGET: "/general/testimonials-widget",

  // articles
  ARTICLES: "/article",
  ARTICLE_BY_ID: (id: string) => `/article/${id}`,
  ARTICLE_SEARCH: "/article/search",

  // authors
  AUTHORS: "/authors",
  AUTHOR_BY_ID: (id: string) => `/authors/${id}`,
  AUTHOR_SEARCH: "/authors/search",

  // categories
  CATEGORIES: "/category",
  CATEGORY_SEARCH: "/category/search",
  CATEGORY_BY_ID: (id: string) => `/category/${id}`,

  // countries  COUNTRIES: "/country",
  COUNTRIES: "/country/search",
  COUNTRY_BY_ID: (id: string) => `/country/${id}`,

  // states
  STATES: "/state",
  STATE_SEARCH: "/state/search",
  STATE_BY_ID: (id: string) => `/state/${id}`,

  // cities
  CITIES: "/city",
  CITY_SEARCH: "/city/search",
  CITY_BY_ID: (id: string) => `/city/${id}`,
} as const;
