import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json in C:\Users\Abhay
  // otherwise makes Turbopack infer the wrong root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
