import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { formatPeso } from '@/lib/game-utils';
import { Wallet, Users, Home, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              Gue<span className="text-red-500">$$</span>it
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm font-medium">{formatPeso(user.balance || 0)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};