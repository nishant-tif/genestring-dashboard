import React from "react";
import * as ReactTesting from "@testing-library/react";
import Layout from "../layout/Layout";

// The testing helpers are loosely typed; this is acceptable in test code.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { render, screen } = ReactTesting as any;

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("Layout", () => {
  it("renders children correctly", () => {
    render(
      <Layout title="Test Page">
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Page")).toBeInTheDocument();
  });

  it("renders breadcrumbs when provided", () => {
    const breadcrumbs = [{ label: "Pages / Test" }];
    render(
      <Layout title="Test Page" breadcrumbs={breadcrumbs}>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText("Pages / Test")).toBeInTheDocument();
  });
});
