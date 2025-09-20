import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://vckkkupndydwilnzpjkc.supabase.co/**")],
  },
};

export default nextConfig;
