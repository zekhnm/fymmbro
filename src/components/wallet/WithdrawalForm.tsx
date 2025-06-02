import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { fine } from '@/lib/fine';
import { formatPeso, MIN_WITHDRAWAL, MAX_WITHDRAWAL } from '@/lib/game-utils';
// Removed postToChannel import because we'll do it in backend
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export const WithdrawalForm: React.FC = () => {
  const { user, refreshUser } = useUser();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(MIN_WITHDRAWAL / 100);
  const [gcashNumber, setGcashNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountInCentavos = Math.round(amount * 100);

    // Validate amount
    if (amountInCentavos < MIN_WITHDRAWAL) {
      toast({
        title: "Invalid amount",
        description: `Minimum withdrawal is ${formatPeso(MIN_WITHDRAWAL)}`,
        variant: "destructive"
      });
      return;
    }

    if (amountInCentavos > MAX_WITHDRAWAL) {
      toast({
        title: "Invalid amount",
        description: `Maximum withdrawal is ${formatPeso(MAX_WITHDRAWAL)}`,
        variant: "destructive"
      });
      return;
    }

    // Validate GCash number
    if (!gcashNumber || gcashNumber.length < 10) {
      toast({
        title: "Invalid GCash number",
        description: "Please enter a valid GCash number",
        variant: "destructive"
      });
      return;
    }

    // Check if user has enough balance
    if (!user || (user.balance || 0) < amountInCentavos) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API instead of doing fine DB and Telegram here
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amountInCentavos,
          gcashNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Withdrawal failed');
      }

      // Refresh user data after withdrawal
      await refreshUser();

      setShowSuccessDialog(true);

      // Reset form
      setAmount(MIN_WITHDRAWAL / 100);
      setGcashNumber('');
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your withdrawal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
  };

  const handleJoinChannel = () => {
    window.open('https://t.me/itGuess', '_blank');
    setShowSuccessDialog(false);
  };

  const canWithdraw = user && (user.balance || 0) >= MIN_WITHDRAWAL;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Withdraw Funds</CardTitle>
          <CardDescription>
            Minimum: {formatPeso(MIN_WITHDRAWAL)} | Maximum: {formatPeso(MAX_WITHDRAWAL)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₱)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={MIN_WITHDRAWAL / 100}
                max={MAX_WITHDRAWAL / 100}
                step={0.01}
                disabled={isLoading || !canWithdraw}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gcash">GCash Number</Label>
              <Input
                id="gcash"
                type="tel"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                placeholder="09XXXXXXXXX"
                disabled={isLoading || !canWithdraw}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !canWithdraw}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Withdraw"
              )}
            </Button>

            {!canWithdraw && (
              <p className="text-sm text-center text-muted-foreground">
                You need at least {formatPeso(MIN_WITHDRAWAL)} to withdraw
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdrawal Success</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Your withdrawal request has been submitted successfully.</p>
            <p className="mt-2">Processing Time: 24–72 hours.</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleJoinChannel} className="w-full">
              Join Channel
            </Button>
            <Button onClick={handleCloseDialog} variant="outline" className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
