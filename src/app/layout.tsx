// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from 'next/font/google'; // Impor dari next/font
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";

// Konfigurasi font Inter
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Mencegah teks tak terlihat saat font dimuat
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}> {/* Terapkan kelas font ke <html> */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
