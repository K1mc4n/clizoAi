/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Hanya terapkan pada build sisi klien (di browser)
    if (!isServer) {
      // Cari plugin Terser yang digunakan untuk minifikasi kode
      const terserPlugin = config.optimization.minimizer.find(
        (minimizer) => minimizer.constructor.name === 'TerserPlugin'
      );

      // Jika TerserPlugin ditemukan, tambahkan pengecualian
      if (terserPlugin) {
        terserPlugin.options.exclude = /HeartbeatWorker/;
      }
    }

    // Kembalikan konfigurasi yang sudah dimodifikasi
    return config;
  },
};

export default nextConfig;
