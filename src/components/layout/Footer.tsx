import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, Users, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Play', path: '/' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Users, label: 'Invite', path: '/referrals' },
    { icon: HelpCircle, label: 'FAQ', path: '/faq' },
  ];
  
  return (
    <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center px-4 py-2 ${
                isActive(item.path) ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};