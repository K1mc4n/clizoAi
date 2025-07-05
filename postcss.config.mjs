/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Aturan ini khusus untuk menangani file worker agar tidak di-bundle
    // oleh webpack utama, yang menyebabkan error Terser.
    // Ini adalah cara yang direkomendasikan untuk Next.js 13+
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    });

    // Modifikasi untuk Web Worker agar bisa bekerja di server-side dan client-side
    if (!isServer) {
      config.output.publicPath = '/_next/';
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "fs": false, // Menghindari error file-system di browser
      };
    }

    return config;
  },
};

export default nextConfig;
