import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPeso } from '@/lib/game-utils';
import { useUser } from '@/contexts/UserContext';

export const BalanceCard: React.FC = () => {
  const { user } = useUser();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <span className="text-4xl font-bold">
            {formatPeso(user?.balance || 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};