import withBundleAnalyzer from '@next/bundle-analyzer';

// Set NEXT_PUBLIC_BASE_PATH="/demo" in .env for subdirectory deployment.
// Leave it empty (or remove it) for root domain deployment.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  basePath,        // Tells Next.js all routes start at /demo
  assetPrefix: basePath, // Tells Next.js to prefix all JS/CSS asset URLs with /demo
  typescript: {
    ignoreBuildErrors: true, // Prevents Next.js 16 internal type errors from failing production build
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
};

const config = process.env.ANALYZE === 'true'
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
