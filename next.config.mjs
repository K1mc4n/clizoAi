/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan konfigurasi ini untuk memperbaiki error build dari walletconnect/wagmi
  transpilePackages: [
    '@walletconnect/ethereum-provider', 
    '@walletconnect/universal-provider',
    'viem'
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
