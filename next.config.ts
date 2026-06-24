import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIXED: ignoreBuildErrors must be inside the typescript object
  typescript: {
    // ignoreBuildErrors: true,
  },

  // Ignores ESLint during builds
  eslint: {
    // ignoreDuringBuilds: true,
  },

  experimental: {
    reactCompiler: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "images.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "devapi.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devapi.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prodapi.genestringlab.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
