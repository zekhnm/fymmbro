import React, { createContext, useContext, useState, useEffect } from 'react';
import { fine } from '@/lib/fine';
import { getTelegramUser } from '@/lib/telegram-utils';
import { NEW_USER_BONUS } from '@/lib/game-utils';
import type { Schema } from '@/lib/db-types';

interface UserContextType {
  user: Schema["users"] | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Schema["users"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreateUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const telegramUser = getTelegramUser();
      
      if (!telegramUser) {
        throw new Error('Could not get Telegram user data');
      }
      
      // Try to find existing user
      const existingUsers = await fine.table("users")
        .select()
        .eq("telegramId", telegramUser.id.toString());
      
      if (existingUsers && existingUsers.length > 0) {
        // User exists, return it
        setUser(existingUsers[0]);
      } else {
        // Create new user
        const fullName = [telegramUser.first_name, telegramUser.last_name]
          .filter(Boolean)
          .join(' ');
          
        const newUser = {
          telegramId: telegramUser.id.toString(),
          name: fullName || 'Anonymous',
          balance: NEW_USER_BONUS, // New users get ₱10
          lastResetDate: new Date().toISOString().split('T')[0]
        };
        
        const createdUsers = await fine.table("users").insert(newUser).select();
        
        if (createdUsers && createdUsers.length > 0) {
          setUser(createdUsers[0]);
        } else {
          throw new Error('Failed to create user');
        }
      }
    } catch (err) {
      console.error('Error fetching/creating user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    
    try {
      const refreshedUsers = await fine.table("users")
        .select()
        .eq("id", user.id);
        
      if (refreshedUsers && refreshedUsers.length > 0) {
        setUser(refreshedUsers[0]);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  useEffect(() => {
    fetchOrCreateUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};