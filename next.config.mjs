/** @type {import('next').NextConfig} */
const nextConfig = {
  // PERBAIKAN: Secara eksplisit menonaktifkan SWC minifier
  // dan mengkonfigurasi Terser untuk tidak menyebabkan error.
  swcMinify: false,
  webpack: (config) => {
    // Ini memastikan Terser digunakan, bukan SWC
    config.optimization.minimizer = config.optimization.minimizer.filter(
      (plugin) => plugin.constructor.name !== 'SwcJsMinimizerRspackPlugin'
    );
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
