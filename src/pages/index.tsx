import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FlagQuestion } from '@/components/game/FlagQuestion';
import { AnswerOptions } from '@/components/game/AnswerOptions';
import { RewardPopup } from '@/components/game/RewardPopup';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initTelegramWebApp } from '@/lib/telegram-utils';
import { 
  getRandomCountries, 
  canMakeGuess, 
  recordGuess, 
  awardCorrectGuess,
  CORRECT_GUESS_REWARD,
  INVITE_THRESHOLD_FOR_UNLIMITED,
  DAILY_GUESS_LIMIT
} from '@/lib/game-utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { Schema } from '@/lib/db-types';

const Index = () => {
  const { user, loading, refreshUser } = useUser();
  const [countries, setCountries] = useState<Schema["countries"][]>([]);
  const [correctCountry, setCorrectCountry] = useState<Schema["countries"] | null>(null);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'answered' | 'error'>('loading');
  const [canGuessState, setCanGuessState] = useState<{ canGuess: boolean; reason?: string }>({ canGuess: false });
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Initialize Telegram WebApp
  useEffect(() => {
    initTelegramWebApp();
  }, []);
  
  // Load game data when user is loaded
  useEffect(() => {
    if (!loading && user) {
      loadGame();
    }
  }, [loading, user]);
  
  const loadGame = async () => {
    if (!user) return;
    
    setGameState('loading');
    
    try {
      // Check if user can make a guess
      const guessCheck = await canMakeGuess(user);
      setCanGuessState(guessCheck);
      
      // Get random countries for the game
      const randomCountries = await getRandomCountries(3);
      if (randomCountries.length < 3) {
        throw new Error('Not enough countries loaded');
      }
      
      // Set the correct country (first one)
      setCorrectCountry(randomCountries[0]);
      
      // Shuffle the countries for display
      const shuffled = [...randomCountries].sort(() => 0.5 - Math.random());
      setCountries(shuffled);
      
      setGameState('ready');
    } catch (error) {
      console.error('Error loading game:', error);
      setGameState('error');
    }
  };
  
  const handleAnswer = async (correct: boolean) => {
    if (!user || !correctCountry) return;
    
    setIsCorrect(correct);
    setGameState('answered');
    
    try {
      // Record the guess
      await recordGuess(user.id!);
      
      // If correct, award the user
      if (correct) {
        await awardCorrectGuess(user.id!);
      }
      
      // Refresh user data
      await refreshUser();
      
      // Show reward popup
      setShowReward(true);
    } catch (error) {
      console.error('Error processing answer:', error);
    }
  };
  
  const handleContinue = () => {
    setShowReward(false);
    loadGame();
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    await loadGame();
    setIsRefreshing(false);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground pb-16">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        {gameState === 'loading' && (
          <div className="flex justify-center items-center h-64">
            <LoadingScreen message="Loading game..." />
          </div>
        )}
        
        {gameState === 'error' && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load the game. Please try again.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        )}
        
        {gameState === 'ready' && !canGuessState.canGuess && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {canGuessState.reason || `You've used all your daily guesses (${DAILY_GUESS_LIMIT}). Come back tomorrow or invite ${INVITE_THRESHOLD_FOR_UNLIMITED} friends for unlimited guesses!`}
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        )}
        
        {gameState === 'ready' && canGuessState.canGuess && correctCountry && (
          <>
            <FlagQuestion country={correctCountry} />
            <AnswerOptions 
              options={countries} 
              correctAnswer={correctCountry} 
              onAnswer={handleAnswer} 
            />
          </>
        )}
        
        <RewardPopup 
          isOpen={showReward} 
          onClose={handleContinue} 
          isCorrect={isCorrect} 
          reward={isCorrect ? CORRECT_GUESS_REWARD : 0} 
        />
      </div>
      
      <Footer />
    </main>
  );
};

export default Index;