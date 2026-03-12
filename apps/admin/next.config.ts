import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@shelf-ai/ui", "@shelf-ai/shared"],
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default config;
