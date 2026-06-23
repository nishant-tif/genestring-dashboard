import {
  authService,
  dashboardService,
  policyService,
  modelService,
  organizationService,
} from "../dataService";

describe("dummyData services", () => {
  describe("authService", () => {
    it("should login successfully with valid credentials", async () => {
      const credentials = {
        user_email: "test@example.com",
        user_password: "password",
      };
      const response = await authService.login(credentials);

      expect(response).toHaveProperty("token");
      expect(response).toHaveProperty("user");
      expect(response.user.email).toBe("test@example.com");
    });

    it("should reject login with invalid credentials", async () => {
      const credentials = { user_email: "", user_password: "" };

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe("dashboardService", () => {
    it("should fetch dashboard data", async () => {
      const data = await dashboardService.getDashboardData();

      expect(data).toHaveProperty("healthScore");
      expect(data).toHaveProperty("totalModels");
      expect(data).toHaveProperty("riskAssessment");
      expect(data).toHaveProperty("compliance");
    });
  });

  describe("policyService", () => {
    it("should fetch all policies", async () => {
      const policies = await policyService.getAll();

      expect(Array.isArray(policies)).toBe(true);
      expect(policies.length).toBeGreaterThan(0);
      expect(policies[0]).toHaveProperty("id");
      expect(policies[0]).toHaveProperty("policyName");
    });

    it("should create a new policy", async () => {
      const newPolicy = {
        policyName: "New Policy",
        metricName: "Accuracy",
        operator: ">=",
        expectedValue: "0.8",
        severity: "High" as const,
        description: "New Description",
      };

      const created = await policyService.create(newPolicy);

      expect(created).toHaveProperty("id");
      expect(created.policyName).toBe(newPolicy.policyName);
    });
  });

  describe("modelService", () => {
    it("should fetch all models", async () => {
      const models = await modelService.getAll();

      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      expect(models[0]).toHaveProperty("id");
      expect(models[0]).toHaveProperty("name");
    });
  });

  describe("organizationService", () => {
    it("should fetch all organizations", async () => {
      const organizations = await organizationService.getAll();

      expect(Array.isArray(organizations)).toBe(true);
      expect(organizations.length).toBeGreaterThan(0);
      expect(organizations[0]).toHaveProperty("id");
      expect(organizations[0]).toHaveProperty("name");
    });
  });
});
