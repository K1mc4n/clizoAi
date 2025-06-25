import { Dispatch, SetStateAction } from "react";
import { Tab } from "../Demo";
import { Home, Star, Wallet } from "lucide-react";

const FooterButton = ({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType; label: string; isActive: boolean; onClick: () => void; }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors ${ isActive ? "text-blue-500" : "text-gray-500 hover:text-blue-500" }`}>
    <Icon className="w-6 h-6 mb-1" />
    <span>{label}</span>
  </button>
);

export function Footer({ activeTab, setActiveTab, showWallet }: { activeTab: Tab; setActiveTab: Dispatch<SetStateAction<Tab>>; showWallet: boolean; }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around shadow-up">
      <FooterButton icon={Home} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
      <FooterButton icon={Star} label="Bookmarks" isActive={activeTab === 'bookmarks'} onClick={() => setActiveTab('bookmarks')} />
      {showWallet && ( <FooterButton icon={Wallet} label="Wallet" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} /> )}
    </div>
  );
}
