import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InviteCard } from '@/components/referral/InviteCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { REFERRAL_REWARD, formatPeso } from '@/lib/game-utils';

const Referrals = () => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground pb-16">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Invite Friends</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Share your invite link</p>
                  <p className="text-sm text-muted-foreground">
                    Send your unique invite link to friends
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Friends join Gue$$it</p>
                  <p className="text-sm text-muted-foreground">
                    They click your link and start playing
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">You earn {formatPeso(REFERRAL_REWARD)}</p>
                  <p className="text-sm text-muted-foreground">
                    For each friend who joins through your link
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <InviteCard />
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Referrals;