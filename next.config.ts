import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Cache bust: v2-tropical
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
