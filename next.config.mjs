/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ini adalah solusi untuk error build Terser.
    // Beberapa library (seperti WalletConnect) punya file worker
    // yang tidak boleh di-minify ulang oleh Next.js.
    // Konfigurasi ini memberitahu webpack untuk tidak menyentuhnya.
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      loader: 'worker-loader',
      options: {
        filename: 'static/media/[name].[contenthash].js',
      },
    });
    
    // Ini juga penting untuk memastikan file worker tidak diproses dua kali.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'worker-loader': false,
    };

    return config;
  },
};

export default nextConfig;
