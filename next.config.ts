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
  },  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  reactStrictMode: true,
  // pageExtensions: ["ts", "tsx"], // Removed this as it might be causing issues
};

export default nextConfig;
