// src/components/ui/Footer.tsx

'use client';

// Hapus CircleDollarSign
import { Home, Newspaper, BarChart3, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Hapus 'degen' dari tipe Tab
export type Tab = 'home' | 'news' | 'leaderboard';

interface FooterItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const FooterItem = ({ href, icon: Icon, label, isActive }: FooterItemProps) => (
    // ... (tidak ada perubahan di sini)
);

export function Footer() {
  const pathname = usePathname();

  const getActiveTab = (): Tab => {
    if (pathname.startsWith('/news')) return 'news';
    // Hapus baris degen-checker
    if (pathname.startsWith('/leaderboard')) return 'leaderboard';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto px-2">
        <FooterItem href="/app" icon={Home} label="Home" isActive={activeTab === 'home'} />
        <FooterItem href="/leaderboard" icon={BarChart3} label="Board" isActive={activeTab === 'leaderboard'} />
        {/* Hapus item Degen */}
        <FooterItem href="/news" icon={Newspaper} label="News" isActive={activeTab === 'news'} />
      </div>
    </footer>
  );
}
