import { API_ENDPOINTS } from "@/config/api";
import type {
  DashboardData,
  Policy,
  Model,
  Organization,
  LoginCredentials,
  LoginResponse,
  Category,
  Country,
  State,
  City,
} from "@/types";
import apiClient from "./api";
import { normalizeImagePath } from "@/utils/imagePath";
import {
  ArticleSearchResponse,
  PaginationParams,
  Article,
} from "@/types/article";
import { normalizeDashboardArticle } from "@/utils/normalizeDashboardArticle";

/* ===============================
   AUTH SERVICE
=============================== */

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);

    // expected backend response:
    // { data: { user, accessToken } }

    return {
      token: response.data.data.accessToken,
      user: response.data.data.user,
      message: response.data.message,
    };
  },
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
  },
  forgotPassword: async (user_email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { user_email });
  },
};

/* ===============================
   DASHBOARD SERVICE
=============================== */
export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    // In real app: return apiClient.get(API_ENDPOINTS.DASHBOARD).then(res => res.data)
    return {
      healthScore: 65,
      totalModels: 12,
      highRiskModels: 7,
      completeModels: 68,
      criticalIssues: 5,
      riskAssessment: {
        critical: { count: 2, items: ["Bias detected in loan approval model"] },
        high: { count: 6, items: ["Missing audit logs, privacy risks"] },
        medium: { count: 8, items: ["Documentation Gaps Identified"] },
        low: { count: 12, items: ["Minor updates needed"] },
      },
      compliance: {
        overall: 65,
        euAiAct: 72,
        iso42001: 85,
        indiaDpdpAct: 58,
        oecdPrinciples: 90,
      },
      activeAlerts: [
        {
          id: "1",
          title: "Missing Human Oversight",
          description: "Loan approval system violates EU AI Act Article 14.",
        },
        {
          id: "2",
          title: "Audit Log Gaps",
          description: "Loan approval system violates EU AI Act Article 14.",
        },
        {
          id: "3",
          title: "Missing Human Oversight",
          description: "Loan approval system violates EU AI Act Article 14.",
        },
      ],
      aiSystems: [
        {
          id: "1",
          systemName: "Claude Model",
          riskLevel: "High-Risk",
          compliance: 65,
          status: "Non-Complaint",
        },
        {
          id: "2",
          systemName: "Loan Approval AI",
          riskLevel: "High-Risk",
          compliance: 65,
          status: "Non-Complaint",
        },
        {
          id: "3",
          systemName: "FSI AI",
          riskLevel: "High-Risk",
          compliance: 65,
          status: "Non-Complaint",
        },
        {
          id: "4",
          systemName: "Claude Model",
          riskLevel: "High-Risk",
          compliance: 65,
          status: "Non-Complaint",
        },
        {
          id: "5",
          systemName: "Approval AI",
          riskLevel: "High-Risk",
          compliance: 65,
          status: "Non-Complaint",
        },
        {
          id: "6",
          systemName: "Loan Approval AI",
          riskLevel: "High-Risk",
          compliance: 65,
          status: "Non-Complaint",
        },
      ],
    };
  },
};

/* ===============================
   POLICY SERVICE
=============================== */
export const policyService = {
  getAll: async (): Promise<Policy[]> => {
    const response = await apiClient.get(API_ENDPOINTS.POLICIES);
    return response.data.data;
  },

  getById: async (id: string): Promise<Policy> => {
    const response = await apiClient.get(API_ENDPOINTS.POLICY_BY_ID(id));
    return response.data.data;
  },

  create: async (policy: Omit<Policy, "id">): Promise<Policy> => {
    const response = await apiClient.post(API_ENDPOINTS.POLICIES, policy);
    return response.data.data.policy;
  },

  update: async (id: string, policy: Partial<Policy>): Promise<Policy> => {
    const response = await apiClient.put(
      API_ENDPOINTS.POLICY_BY_ID(policy.policy_id || id),
      policy,
    );
    return response.data.data.policy;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.POLICY_BY_ID(id));
  },
};

/* ===============================
   MODEL SERVICE
=============================== */
export const modelService = {
  getAll: async (): Promise<Model[]> => {
    const response = await apiClient.get(API_ENDPOINTS.MODELS);
    return response.data.data;
  },

  getById: async (id: string): Promise<Model> => {
    const response = await apiClient.get(API_ENDPOINTS.MODEL_BY_ID(id));
    return response.data.data;
  },

  create: async (model: Omit<Model, "id">): Promise<Model> => {
    const response = await apiClient.post(API_ENDPOINTS.MODELS, model);
    return response.data.data.model;
  },

  update: async (id: string, model: Partial<Model>): Promise<Model> => {
    const response = await apiClient.put(API_ENDPOINTS.MODEL_BY_ID(id), model);
    return response.data.data.model;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.MODEL_BY_ID(id));
  },
};

/* ===============================
   ORGANIZATION SERVICE
=============================== */
export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ORGANIZATIONS);
    return response.data.data;
  },

  getById: async (id: string): Promise<Organization> => {
    const response = await apiClient.get(API_ENDPOINTS.ORGANIZATION_BY_ID(id));
    return response.data.data;
  },

  create: async (
    organization: Omit<Organization, "id">,
  ): Promise<Organization> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ORGANIZATIONS,
      organization,
    );
    return response.data.data.organization;
  },

  update: async (
    id: string,
    organization: Partial<Organization>,
  ): Promise<Organization> => {
    const response = await apiClient.put(
      API_ENDPOINTS.ORGANIZATION_BY_ID(id),
      organization,
    );
    return response.data.data.organization;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ORGANIZATION_BY_ID(id));
  },
};

/* ===============================
   ARTICLES SERVICE
=============================== */
export const articleService = {
  // Get all articles (search-based pagination)
  search: async (params: PaginationParams): Promise<ArticleSearchResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ARTICLE_SEARCH, // should map to "/article/search"
      params,
    );
    const env = response.data.data as ArticleSearchResponse &
      Record<string, unknown>;
    const rawList = Array.isArray(env.data)
      ? env.data
      : Array.isArray(env.rows)
        ? env.rows
        : Array.isArray(env.allData)
          ? env.allData
          : [];
    const rows = rawList.map((a) => normalizeDashboardArticle(a as Article));
    return { ...env, data: rows, allData: rows };
  },

  // Get article by ID
  getById: async (id: string): Promise<Article> => {
    const response = await apiClient.get(API_ENDPOINTS.ARTICLE_BY_ID(id), {
      params: { showContent: true },
    });
    return normalizeDashboardArticle(response.data.data.data as Article);
  },

  // Create article
  create: async (article: Omit<Article, "id">): Promise<Article> => {
    const response = await apiClient.post(API_ENDPOINTS.ARTICLES, article);
    return normalizeDashboardArticle(response.data.data.data as Article);
  },

  uploadThumbnail: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/article/upload-thumbnail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data.data.data as { file_name?: string; file_url?: string };
    if (data.file_name) return normalizeImagePath(data.file_name);
    return normalizeImagePath(data.file_url);
  },

  // Update article
  update: async (id: string, article: Partial<Article>): Promise<Article> => {
    const response = await apiClient.put(
      API_ENDPOINTS.ARTICLE_BY_ID(id),
      article,
    );
    return normalizeDashboardArticle(response.data.data.data as Article);
  },

  // Delete article
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ARTICLE_BY_ID(id));
  },
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return response.data.data;
  },

  getCountries: async (): Promise<Country[]> => {
    const response = await apiClient.get(API_ENDPOINTS.COUNTRIES);
    return response.data.data;
  },
  getStates: async (id: string): Promise<State[]> => {
    const response = await apiClient.get(API_ENDPOINTS.STATE_BY_ID(id));
    return response.data.data;
  },
  getCities: async (id: string): Promise<City[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CITY_BY_ID(id));
    return response.data.data;
  },
};

/* ===============================
   AUTHORS SERVICE
=============================== */

import type { Author } from "@/types/author";
import { WidgetType } from "@/types/widget";

export const authorService = {
  // Get all authors
  getAll: async (): Promise<Author[]> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTHORS);
    return response.data.data;
  },

  // Get author by ID
  getById: async (id: string): Promise<Author> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTHOR_BY_ID(id));
    return response.data.data;
  },

  // Create author
  create: async (author: Omit<Author, "author_id">): Promise<Author> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTHORS, author);
    return response.data.data.author;
  },

  // Update author
  update: async (id: string, author: Partial<Author>): Promise<Author> => {
    const response = await apiClient.put(
      API_ENDPOINTS.AUTHOR_BY_ID(id),
      author,
    );
    return response.data.data.author;
  },

  // Delete author (permanent)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.AUTHOR_BY_ID(id));
  },
};

/* ===============================
   widgets service
=============================== */

export const fetchWidgets = async (type: WidgetType) => {
  const res = await apiClient.get(`/get-widget?widget_type=${type}`);
  return res.data.data.data;
};

export const saveWidgets = async (data: unknown) => {
  const res = await apiClient.post(`/add-widget`, data);
  return res.data;
};

/* ===============================
   regulation service
=============================== */
export const regulationService = {
  getAll: async () => {
    const res = await apiClient.get("/regulations");
    return res.data.data;
  },

  save: async (cards: []) => {
    const res = await apiClient.post("/regulations", {
      regulation_cards: cards,
    });
    return res.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await apiClient.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.image;
  },
};
