// src/components/ui/Footer.tsx

'use client';

// Tambahkan ikon Newspaper
import { Home, Star, Newspaper, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Tambahkan 'news' ke tipe Tab
export type Tab = 'home' | 'bookmarks' | 'news';

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

export function Footer() {
  const pathname = usePathname();

  const getActiveTab = (): Tab => {
    if (pathname.startsWith('/bookmarks')) return 'bookmarks';
    if (pathname.startsWith('/news')) return 'news';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto px-2">
        <FooterItem href="/app" icon={Home} label="Home" isActive={activeTab === 'home'} />
        {/* Tambahkan tombol News di sini */}
        <FooterItem href="/news" icon={Newspaper} label="News" isActive={activeTab === 'news'} />
        <FooterItem href="/bookmarks" icon={Star} label="Bookmarks" isActive={activeTab === 'bookmarks'} />
      </div>
    </footer>
  );
}
