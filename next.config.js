/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
