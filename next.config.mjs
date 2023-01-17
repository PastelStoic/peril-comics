// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/7hS4sKQF7BL7LhNZepM_8g/**'
      }
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    appDir: false,
  }
};
export default config;
