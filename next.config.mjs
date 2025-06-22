/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use remotePatterns for external images (replaces domains for Next.js 13+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
    // Optional: Keep domains for backward compatibility if needed, but not required with remotePatterns
    // domains: ["randomuser.me"],
    minimumCacheTTL: 60, // Cache images for 60 seconds to reduce 502 errors from frequent requests
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Maintain this for server actions if needed
    },
  },
};

export default nextConfig;