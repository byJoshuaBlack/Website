import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [80, 85],
    // Photos top out at 1920px, except the zoomed home hero, which is stored larger and needs 2560 on desktop.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
