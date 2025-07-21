// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Hanya gunakan PWA jika bukan di lingkungan pengembangan
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
// });
// module.exports = withPWA(nextConfig);

// Untuk sementara, ekspor langsung nextConfig tanpa PWA
module.exports = nextConfig;