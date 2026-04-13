import type { NextConfig } from "next";

const repoName = "Portfolio";
const nextConfig: NextConfig = {
  output: "export",
  //basePath: `/Portfolio`,
  //assetPrefix: `/${repoName}/`,
  // Allow requests to dev assets when accessing the app through LAN/proxy hosts.
  allowedDevOrigins: ["192.168.178.27", "localhost", "127.0.0.1"],
  reactStrictMode: true,

};

// module.exports = nextConfig;
export default nextConfig;
