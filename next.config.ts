import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false, // Disable react compiler which can cause issues
};

export default nextConfig;