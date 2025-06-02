import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    apiUrl: process.env.API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;
