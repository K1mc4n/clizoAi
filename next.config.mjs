/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan konfigurasi webpack ini
  webpack: (config) => {
    // Cari plugin Terser yang menyebabkan masalah
    const terserPlugin = config.optimization.minimizer.find(
      (plugin) => plugin.constructor.name === 'TerserPlugin'
    );

    // Jika pluginnya ada (seharusnya selalu ada saat build)
    if (terserPlugin) {
      // Beritahu Terser untuk MENGECUALIKAN file HeartbeatWorker
      terserPlugin.options.exclude = /HeartbeatWorker/;
    }

    return config;
  },
};

export default nextConfig;
