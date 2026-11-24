/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    // The original POC listing URL now lives under /category.
    return [{ source: "/headphones", destination: "/category/headphones", permanent: false }];
  },
};

export default nextConfig;
