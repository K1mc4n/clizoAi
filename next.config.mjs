/** @type {import('next').NextConfig} */
const nextConfig = {
  // PERBAIKAN: Memperluas daftar paket yang akan di-transpile
  // untuk memastikan semua dependensi terkait wallet diproses dengan benar.
  transpilePackages: [
    'viem',
    'wagmi',
    '@wagmi/core',
    '@wagmi/connectors',
    '@walletconnect/ethereum-provider',
    '@walletconnect/modal',
    '@walletconnect/universal-provider',
  ],
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
