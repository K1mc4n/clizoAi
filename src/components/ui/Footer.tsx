// src/components/ui/Footer.tsx

'use client';

import { Home, Star, Wallet, BarChart3, Award, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Definisikan tipe untuk tab yang akan kita gunakan
export type Tab = 'home' | 'markets' | 'bookmarks' | 'wallet' | 'sponsors';

interface FooterItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const FooterItem = ({ href, icon: Icon, label, isActive }: FooterItemProps) => (
  <Link href={href} className="flex-1">
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
        isActive
          ? 'text-blue-500 bg-blue-50 dark:bg-gray-700'
          : 'text-gray-500 hover:text-blue-500'
      }`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  </Link>
);

export function Footer({ showWallet = false }: { showWallet?: boolean }) {
  const pathname = usePathname();

  // Tentukan tab aktif berdasarkan URL saat ini
  const getActiveTab = (): Tab => {
    if (pathname.startsWith('/markets')) return 'markets';
    if (pathname.startsWith('/bookmarks')) return 'bookmarks';
    if (pathname.startsWith('/wallet')) return 'wallet';
    if (pathname.startsWith('/sponsors')) return 'sponsors';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto px-2">
        <FooterItem href="/app" icon={Home} label="Home" isActive={activeTab === 'home'} />
        <FooterItem href="/markets" icon={BarChart3} label="Markets" isActive={activeTab === 'markets'} />
        <FooterItem href="/sponsors" icon={Award} label="Sponsors" isActive={activeTab === 'sponsors'} />
        <FooterItem href="/bookmarks" icon={Star} label="Bookmarks" isActive={activeTab === 'bookmarks'} />
        {showWallet && (
          <FooterItem href="/wallet" icon={Wallet} label="Wallet" isActive={activeTab === 'wallet'} />
        )}
      </div>
    </footer>
  );
}
