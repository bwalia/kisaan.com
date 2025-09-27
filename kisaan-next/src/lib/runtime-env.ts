import getConfig from 'next/config';

// Get runtime configuration
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() || {};

// Runtime environment variables that can be changed without rebuilding
export const runtimeEnv = {
  // Public variables (available in browser)
  API_URL: publicRuntimeConfig?.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  STRIPE_PUBLISHABLE_KEY: publicRuntimeConfig?.STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  APP_URL: publicRuntimeConfig?.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Server-only variables (only available on server-side)
  ...(typeof window === 'undefined' && {
    STRIPE_SECRET_KEY: serverRuntimeConfig?.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '',
    JWT_SECRET: serverRuntimeConfig?.JWT_SECRET || process.env.JWT_SECRET || '',
    DATABASE_URL: serverRuntimeConfig?.DATABASE_URL || process.env.DATABASE_URL || '',
  }),
};

// Helper function to get runtime environment variables
export function getRuntimeEnv(key: keyof typeof runtimeEnv) {
  return runtimeEnv[key];
}

// Client-side safe function to get public runtime env vars
export function getPublicRuntimeEnv() {
  return {
    API_URL: runtimeEnv.API_URL,
    STRIPE_PUBLISHABLE_KEY: runtimeEnv.STRIPE_PUBLISHABLE_KEY,
    APP_URL: runtimeEnv.APP_URL,
  };
}