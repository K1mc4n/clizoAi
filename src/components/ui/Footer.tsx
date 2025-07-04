// Lokasi: src/components/ui/Footer.tsx

'use client';

import { Home, Newspaper, Pencil, ScrollText, type LucideIcon } from 'lucide-react'; // Tambahkan ikon
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type Tab = 'home' | 'news' | 'scribe' | 'ledger'; // Tambahkan tab baru

// ... (Interface dan komponen FooterItem tidak perlu diubah)

export function Footer() {
  const pathname = usePathname();

  const getActiveTab = (): Tab => {
    if (pathname.startsWith('/news')) return 'news';
    if (pathname.startsWith('/scribe')) return 'scribe'; // Tambahkan kondisi
    if (pathname.startsWith('/ledger')) return 'ledger'; // Tambahkan kondisi
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto px-2">
        <FooterItem href="/app" icon={Home} label="Home" isActive={activeTab === 'home'} />
        <FooterItem href="/scribe" icon={Pencil} label="Scribe" isActive={activeTab === 'scribe'} /> {/* Tambahkan Tombol */}
        <FooterItem href="/ledger" icon={ScrollText} label="Ledger" isActive={activeTab === 'ledger'} /> {/* Tambahkan Tombol */}
        <FooterItem href="/news" icon={Newspaper} label="News" isActive={activeTab === 'news'} />
      </div>
    </footer>
  );
}
