import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json in C:\Users\Abhay
  // otherwise makes Turbopack infer the wrong root.
  //
  // This is the whole config. Two other blocks used to live here and
  // both described a build that does not exist: a `*.glsl` raw-import
  // rule for shaders (every shader in this repo is an inline template
  // literal -- there is not one .glsl, .vert or .frag file) and an
  // optimizePackageImports entry for drei, which was never imported
  // anywhere. Configuration that optimises nothing still has to be
  // read and believed by whoever opens this file next.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
