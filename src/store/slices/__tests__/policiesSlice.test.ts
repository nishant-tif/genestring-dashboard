import policiesReducer, {
  fetchPolicies,
  createPolicy,
  setSelectedPolicy,
} from "../policiesSlice";
import type { Policy } from "@/types";

jest.mock("@/services/dummyData");

describe("policiesSlice", () => {
  const initialState = {
    policies: [],
    loading: false,
    error: null,
    selectedPolicy: null,
  };

  const mockPolicy: Policy = {
    id: "1",
    policyName: "Test Policy",
    metricName: "Accuracy",
    operator: ">=",
    expectedValue: "0.8",
    severity: "High",
    description: "Test Description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the initial state", () => {
    expect(policiesReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("should handle fetchPolicies.pending", () => {
    const action = { type: fetchPolicies.pending.type };
    const state = policiesReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should handle fetchPolicies.fulfilled", () => {
    const policies = [mockPolicy];
    const action = { type: fetchPolicies.fulfilled.type, payload: policies };
    const state = policiesReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.policies).toEqual(policies);
  });

  it("should handle createPolicy.fulfilled", () => {
    const action = { type: createPolicy.fulfilled.type, payload: mockPolicy };
    const state = policiesReducer(initialState, action);
    expect(state.policies).toContainEqual(mockPolicy);
  });

  it("should handle setSelectedPolicy", () => {
    const action = setSelectedPolicy(mockPolicy);
    const state = policiesReducer(initialState, action);
    expect(state.selectedPolicy).toEqual(mockPolicy);
  });
});
