import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [80, 85],
    // Stored photos top out at 1920px, so no larger candidate is worth generating.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
