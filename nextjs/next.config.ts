import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Public runtime environment variables (exposed to browser)
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    APP_URL: process.env.APP_URL,
  },

  // Server runtime environment variables (server-side only)
  serverRuntimeConfig: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // Enable standalone output for Docker builds
  // output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  images: {
    domains: ["localhost", "test-s3-cli.kisaan.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Optimize images for production
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  experimental: {
    // Enable modern features
    optimizePackageImports: ["lucide-react"],
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Enable compression
  compress: true,

  // Optimize for production
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
