import type { Schema } from "./db-types";
import { fine } from "./fine";

// Constants
export const DAILY_GUESS_LIMIT = 2;
export const INVITE_THRESHOLD_FOR_UNLIMITED = 8;
export const COOLDOWN_MINUTES = 30;
export const NEW_USER_BONUS = 1000; // ₱10 in centavos
export const CORRECT_GUESS_REWARD = 2800; // ₱28 in centavos
export const REFERRAL_REWARD = 4800; // ₱48 in centavos
export const MIN_WITHDRAWAL = 15000; // ₱150 in centavos
export const MAX_WITHDRAWAL = 55500; // ₱555 in centavos

// Format amount in centavos to Philippine Peso
export function formatPeso(amount: number): string {
  return `₱${(amount / 100).toFixed(2)}`;
}

// Check if user can make a guess
export async function canMakeGuess(user: Schema["users"]): Promise<{ canGuess: boolean; reason?: string }> {
  // Check if daily guesses need to be reset
  const today = new Date().toISOString().split('T')[0];
  if (user.lastResetDate !== today) {
    // Reset daily guesses
    await fine.table("users").update({
      dailyGuessCount: 0,
      lastResetDate: today
    }).eq("id", user.id);
    
    // Update local user object
    user.dailyGuessCount = 0;
    user.lastResetDate = today;
  }
  
  // Check if user has unlimited guesses (8+ invites)
  const hasUnlimitedGuesses = (user.inviteCount || 0) >= INVITE_THRESHOLD_FOR_UNLIMITED;
  
  if (hasUnlimitedGuesses) {
    // Check cooldown period
    if (user.lastGuessTime) {
      const lastGuess = new Date(user.lastGuessTime);
      const now = new Date();
      const minutesSinceLastGuess = (now.getTime() - lastGuess.getTime()) / (1000 * 60);
      
      if (minutesSinceLastGuess < COOLDOWN_MINUTES) {
        const minutesLeft = Math.ceil(COOLDOWN_MINUTES - minutesSinceLastGuess);
        return { 
          canGuess: false, 
          reason: `Please wait ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} before your next guess.` 
        };
      }
    }
    
    return { canGuess: true };
  } else {
    // Check daily guess limit
    if ((user.dailyGuessCount || 0) >= DAILY_GUESS_LIMIT) {
      return { 
        canGuess: false, 
        reason: `You've used all your daily guesses. Come back tomorrow or invite ${INVITE_THRESHOLD_FOR_UNLIMITED - (user.inviteCount || 0)} more friends for unlimited guesses!` 
      };
    }
    
    return { canGuess: true };
  }
}

// Get random countries for the game
export async function getRandomCountries(count: number = 3): Promise<Schema["countries"][]> {
  const allCountries = await fine.table("countries").select();
  
  // Shuffle the array
  const shuffled = [...allCountries].sort(() => 0.5 - Math.random());
  
  // Return the first 'count' elements
  return shuffled.slice(0, count);
}

// Record a guess
export async function recordGuess(userId: number): Promise<void> {
  await fine.table("users").update({
    lastGuessTime: new Date().toISOString(),
    dailyGuessCount: fine.raw("dailyGuessCount + 1")
  }).eq("id", userId);
}

// Award user for correct guess
export async function awardCorrectGuess(userId: number): Promise<void> {
  await fine.table("users").update({
    balance: fine.raw(`balance + ${CORRECT_GUESS_REWARD}`)
  }).eq("id", userId);
}

// Process referral
export async function processReferral(referrerId: number, referredId: number): Promise<void> {
  // Create referral record
  await fine.table("referrals").insert({
    referrerId,
    referredId,
    rewarded: true
  });
  
  // Update inviter's balance and invite count
  await fine.table("users").update({
    balance: fine.raw(`balance + ${REFERRAL_REWARD}`),
    inviteCount: fine.raw("inviteCount + 1")
  }).eq("id", referrerId);
}

// Get Philippines time
export function getPhilippinesTime(): Date {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const phTime = new Date(utcTime + (8 * 60 * 60 * 1000)); // UTC+8 for Philippines
  return phTime;
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-PH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}