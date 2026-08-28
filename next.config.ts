import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json in C:\Users\Abhay
  // otherwise makes Turbopack infer the wrong root.
  turbopack: {
    root: __dirname,
    // Turbopack is the only bundler in Next 16 and does not run webpack
    // plugins. `type: "raw"` is the supported way to import a shader as
    // a string -- there is no glslify/raw-loader step.
    rules: {
      "*.glsl": { type: "raw" },
    },
  },
  experimental: {
    // drei is a large barrel; without this every named import drags the
    // whole package into the scene chunk.
    optimizePackageImports: ["@react-three/drei"],
  },
};

export default nextConfig;
