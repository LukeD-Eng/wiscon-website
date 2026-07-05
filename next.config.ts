import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "assessment.wiscon.co.za" }],
        destination: "https://www.wiscon.co.za/audit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
