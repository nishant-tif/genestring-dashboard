import React from "react";
import * as ReactTesting from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import Home from "../page";

// The testing helpers are loosely typed; this is acceptable in test code.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { render, screen, fireEvent, waitFor } = ReactTesting as any;
import * as router from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock auth service
jest.mock("@/services/dummyData", () => ({
  authService: {
    login: jest.fn().mockResolvedValue({
      token: "test-token",
      user: { id: "1", email: "test@example.com", name: "Test User" },
    }),
  },
}));

describe("Home (Login) Page", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("renders login form", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /SIGN IN/i }),
    ).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const mockReplace = jest.fn();
    jest.spyOn(router, "useRouter").mockReturnValue({
      push: jest.fn(),
      replace: mockReplace,
    } as unknown as ReturnType<typeof router.useRouter>);

    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /SIGN IN/i });

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard/widgets/podcast");
    });
  });
});
