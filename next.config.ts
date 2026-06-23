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
        hostname: "api.drgauriagarwal.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "images.drgauriagarwal.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "devapi.drgauriagarwal.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.drgauriagarwal.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.drgauriagarwal.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devapi.drgauriagarwal.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prodapi.drgauriagarwal.com",
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
