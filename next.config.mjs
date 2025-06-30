/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opsi ini akan tetap ada, tidak ada salahnya
  transpilePackages: [
    'viem',
    'wagmi',
  ],

  // PERBAIKAN: Menambahkan konfigurasi Webpack kustom
  webpack: (config, { isServer }) => {
    // Memberitahu Webpack untuk tidak memproses (parse) modul tertentu.
    // Ini akan mencegah Terser (minifier) dari mencoba memproses file yang bermasalah.
    config.module.noParse = [
      ...config.module.noParse || [],
      /@walletconnect\/ethereum-provider/,
    ];

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
