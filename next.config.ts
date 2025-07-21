// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js configurations can go here
  // For example, to enable strict mode:
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);