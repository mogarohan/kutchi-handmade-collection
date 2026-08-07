import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow connections from other devices on the local network
  allowedDevOrigins: ["192.168.1.19", "localhost", "127.0.0.1"],
};

export default nextConfig;
