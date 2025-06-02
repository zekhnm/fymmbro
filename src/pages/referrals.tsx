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

  if (loading || !user) {
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
              {[
                {
                  step: "1",
                  title: "Share your invite link",
                  description: "Send your unique invite link to friends",
                },
                {
                  step: "2",
                  title: "Friends join Gue$$it",
                  description: "They click your link and start playing",
                },
                {
                  step: "3",
                  title: `You earn ${formatPeso(REFERRAL_REWARD)}`,
                  description: "For each friend who joins through your link",
                },
              ].map(({ step, title, description }) => (
                <div key={step} className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
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
