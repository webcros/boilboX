import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false, // Disable react compiler which can cause issues
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/studio",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;