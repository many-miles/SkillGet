import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typescript: {
  //  ignoreBuildErrors: false,
  // },
  //eslint: {
  //  ignoreDuringBuilds: false,
  // },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
