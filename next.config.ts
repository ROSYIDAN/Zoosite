import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  experimental: {
    // Reduces webpack memory by freeing compiled module references
    webpackMemoryOptimizations: true,
    // Tree-shake heavy packages - only bundle what's actually imported
    optimizePackageImports: [
      "react-icons",
      "framer-motion",
      "swagger-ui-react",
      "zod",
      "react-hook-form",
      "@hookform/resolvers",
    ],
  },
};

export default nextConfig;
