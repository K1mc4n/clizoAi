/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Nonaktifkan minifikasi kode sama sekali.
    // Ini akan membuat ukuran file output sedikit lebih besar,
    // tapi ini adalah cara paling pasti untuk melewati error dari Terser.
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
