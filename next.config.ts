import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "www.omi.me" },
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "wisprflow.ai" },
      { protocol: "https", hostname: "iterm2.com" },
    ],
  },
};

export default nextConfig;
