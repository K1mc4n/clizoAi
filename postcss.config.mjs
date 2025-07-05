/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opsi ini untuk menonaktifkan Terser yang menyebabkan error.
  // Ini adalah jalan terakhir untuk melewati bug build yang spesifik.
  swcMinify: false,
};

export default nextConfig;
