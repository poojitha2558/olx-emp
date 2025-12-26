import type { NextConfig } from "next";
// import withPWAInit from "@ducanh2912/next-pwa";

// Temporarily disabled PWA to avoid Turbopack/Webpack conflicts with MongoDB
// const withPWA = withPWAInit({
//   dest: "public",
//   register: true,
//   disable: false,
// });

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
    ],
  },
};

export default nextConfig;
