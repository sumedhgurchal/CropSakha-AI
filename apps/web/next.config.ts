import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://frequency-material-approx-fuel.trycloudflare.com/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
