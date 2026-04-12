import type { NextConfig } from "next";

const repoName = "Portfolio";
const nextConfig: NextConfig = {
  output: "export",
  basePath: `/Portfolio`,
  //assetPrefix: `/${repoName}/`,
  reactStrictMode: true,
};

// module.exports = nextConfig;
export default nextConfig;
