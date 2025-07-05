/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ini memberitahu webpack untuk TIDAK mencoba mem-parse file worker dari walletconnect.
    // Ini adalah solusi langsung untuk error 'export' cannot be used outside of module code.
    config.module.noParse = [
      ...config.module.noParse || [],
      /node_modules\/@walletconnect\/ethereum-provider\/dist\/esm\/HeartbeatWorker\.js/,
    ];

    // Mengembalikan konfigurasi yang sudah dimodifikasi
    return config;
  },
};

export default nextConfig;
