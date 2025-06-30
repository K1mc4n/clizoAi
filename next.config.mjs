/** @type {import('next').NextConfig} */
const nextConfig = {
  // Instruksi untuk Next.js agar memproses ulang paket-paket ini
  // Ini akan memperbaiki error build terkait wallet.
  transpilePackages: [
    '@wagmi/core',
    '@walletconnect/ethereum-provider',
  ],

  // Pengaturan gambar, biarkan seperti ini
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
