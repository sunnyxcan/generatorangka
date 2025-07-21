// next.config.ts
// Hapus import 'NextConfig' dari 'next' dan juga tipe 'NextConfig' pada variabel 'config'
// import type { NextConfig } from "next"; // Baris ini dihapus
import withPWA from "next-pwa";

// Hapus anotasi tipe NextConfig dari variabel config
const config = {
  /* config options here */
  // Pastikan Anda memindahkan atau menambahkan konfigurasi Next.js lainnya di sini
};

// Pastikan withPWA diketik dengan benar jika Anda ingin tetap menggunakan TypeScript
const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Sangat disarankan untuk pengembangan
})(config);

export default nextConfig;