import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "www.omi.me" },
      { protocol: "https", hostname: "www.typeless.com" },
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "iterm2.com" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
    ],
  },
};

export default nextConfig;
