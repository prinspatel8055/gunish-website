import withBundleAnalyzer from '@next/bundle-analyzer';

// Set NEXT_PUBLIC_BASE_PATH="/demo" in .env for subdirectory deployment.
// Leave it empty (or remove it) for root domain deployment.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Hide 'X-Powered-By: Next.js' header from attackers
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

const config = process.env.ANALYZE === 'true'
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
