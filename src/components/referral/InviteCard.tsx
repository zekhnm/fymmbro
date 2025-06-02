import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { INVITE_THRESHOLD_FOR_UNLIMITED, REFERRAL_REWARD, formatPeso } from '@/lib/game-utils';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const InviteCard: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user || !user.telegramId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please sign in with Telegram to generate your referral link.
          </p>
        </CardContent>
      </Card>
    );
  }

  const inviteLink = `${window.location.origin}/start?ref=${user.telegramId}`;
  const inviteCount = user.inviteCount || 0;
  const hasUnlimitedGuesses = inviteCount >= INVITE_THRESHOLD_FOR_UNLIMITED;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "Invite link copied to clipboard"
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Copy failed:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy the invite link",
          variant: "destructive"
        });
      });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Gue$$it!',
        text: 'Play Gue$$it and earn real money! Use my invite link:',
        url: inviteLink
      }).catch(err => console.error('Share failed:', err));
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Invite Friends</CardTitle>
        <CardDescription>
          Earn {formatPeso(REFERRAL_REWARD)} for each friend who joins!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Your Invites</p>
              <p className="text-2xl font-bold">{inviteCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Unlimited Guesses</p>
              <p className="text-lg font-semibold">
                {hasUnlimitedGuesses ? (
                  <span className="text-green-500">Unlocked! ✓</span>
                ) : (
                  <span>{inviteCount}/{INVITE_THRESHOLD_FOR_UNLIMITED}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-center">
            {hasUnlimitedGuesses
              ? "You've unlocked unlimited guesses! (30-min cooldown applies)"
              : `Invite ${INVITE_THRESHOLD_FOR_UNLIMITED - inviteCount} more friends to unlock unlimited guesses!`}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleCopyLink} className="flex-1" variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
