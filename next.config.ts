import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Portraits are 2400px wide; product shots stop at 1080px.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600, 1920, 2400],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
