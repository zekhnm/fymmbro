import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatPeso } from '@/lib/game-utils';

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
  reward?: number;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({ 
  isOpen, 
  onClose, 
  isCorrect,
  reward = 0
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isCorrect ? '🎉 Correct! 🎉' : '❌ Wrong Answer ❌'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {isCorrect ? (
            <>
              <div className="text-5xl mb-4">💰</div>
              <p className="text-center mb-2">
                You earned {formatPeso(reward)}!
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Keep playing to earn more!
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">😢</div>
              <p className="text-center mb-2">
                Better luck next time!
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Try again with another flag.
              </p>
            </>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button onClick={onClose}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};