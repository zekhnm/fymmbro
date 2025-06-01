import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { WithdrawalForm } from '@/components/wallet/WithdrawalForm';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fine } from '@/lib/fine';
import { formatPeso, formatDate } from '@/lib/game-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Withdrawal {
  id: number;
  amount: number;
  status: string;
  gcashNumber: string;
  createdAt: string;
}

const Wallet = () => {
  const { user, loading } = useUser();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState<boolean>(true);
  
  useEffect(() => {
    if (user?.id) {
      loadWithdrawals();
    }
  }, [user]);
  
  const loadWithdrawals = async () => {
    if (!user?.id) return;
    
    setLoadingWithdrawals(true);
    
    try {
      const data = await fine.table("withdrawals")
        .select()
        .eq("userId", user.id)
        .order("createdAt", { ascending: false });
      
      setWithdrawals(data as Withdrawal[]);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoadingWithdrawals(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground pb-16">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        
        <div className="space-y-6">
          <BalanceCard />
          
          <Tabs defaultValue="withdraw">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="withdraw" className="mt-4">
              <WithdrawalForm />
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingWithdrawals ? (
                    <div className="flex justify-center py-8">
                      <p>Loading...</p>
                    </div>
                  ) : withdrawals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No withdrawal history yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {withdrawals.map((withdrawal) => (
                        <div 
                          key={withdrawal.id} 
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">{formatPeso(withdrawal.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(withdrawal.createdAt)}
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              withdrawal.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {withdrawal.status === 'completed' ? 'Completed' : 'Processing'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Wallet;