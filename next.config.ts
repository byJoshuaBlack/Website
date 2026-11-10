import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only Next.js badge sat on top of the dock; production never shows it.
  devIndicators: false,
  images: {
    formats: ["image/webp"],
    qualities: [80, 85],
    // Photos top out at 1920px, except the zoomed home hero, which is stored larger and needs 2560 on desktop.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 2678400,
    // Photos uploaded through Payload, served from the media bucket's public domain.
    remotePatterns: [{ protocol: "https", hostname: "media.byjoshuablack.com", pathname: "/**" }],
  },
  // Packages with code written for the Workers runtime.
  serverExternalPackages: ["jose", "pg-cloudflare"],
  // Payload's sources import TypeScript files with .js extensions.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
