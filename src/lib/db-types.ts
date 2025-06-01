export type Schema = {
  users: {
    id?: number;
    telegramId: string;
    name: string;
    balance?: number;
    inviteCount?: number;
    lastGuessTime?: string | null;
    dailyGuessCount?: number;
    lastResetDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
  
  withdrawals: {
    id?: number;
    userId: number;
    amount: number;
    status?: string;
    gcashNumber: string;
    createdAt?: string;
  };
  
  referrals: {
    id?: number;
    referrerId: number;
    referredId: number;
    rewarded?: boolean;
    createdAt?: string;
  };
  
  countries: {
    id?: number;
    code: string;
    name: string;
    flag: string;
  };
}