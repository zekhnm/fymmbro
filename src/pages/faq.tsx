import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  DAILY_GUESS_LIMIT, 
  INVITE_THRESHOLD_FOR_UNLIMITED, 
  COOLDOWN_MINUTES,
  MIN_WITHDRAWAL,
  formatPeso,
  CORRECT_GUESS_REWARD,
  REFERRAL_REWARD
} from '@/lib/game-utils';

const FAQ = () => {
  const { loading } = useUser();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  const faqItems = [
    {
      question: "How do I earn money?",
      answer: `You can earn money in three ways:
        1. Get ${formatPeso(CORRECT_GUESS_REWARD)} for each correct flag guess
        2. Earn ${formatPeso(REFERRAL_REWARD)} for each friend you invite
        3. New users automatically receive ₱10 welcome bonus`
    },
    {
      question: "How many guesses do I get per day?",
      answer: `You get ${DAILY_GUESS_LIMIT} guesses per day by default. If you invite ${INVITE_THRESHOLD_FOR_UNLIMITED} or more friends, you'll unlock unlimited guesses with a ${COOLDOWN_MINUTES}-minute cooldown between guesses.`
    },
    {
      question: "How do I withdraw my earnings?",
      answer: `You can withdraw your earnings via GCash once you reach the minimum withdrawal amount of ${formatPeso(MIN_WITHDRAWAL)}. Go to the Wallet tab, enter your GCash number and the amount you want to withdraw.`
    },
    {
      question: "How long do withdrawals take to process?",
      answer: "Withdrawals are typically processed within 24-72 hours."
    },
    {
      question: "How do I invite friends?",
      answer: "Go to the Invite tab, copy your unique invite link, and share it with your friends. You'll earn a reward when they join through your link."
    },
    {
      question: "Why didn't I earn after guessing?",
      answer: "You only earn for correct guesses. If you selected the wrong country, you won't receive a reward. Try again with another flag!"
    },
    {
      question: "When do my daily guesses reset?",
      answer: "Your daily guesses reset at 12:00 AM Philippines Time (PHT)."
    },
    {
      question: "Is there a maximum withdrawal amount?",
      answer: "Yes, the maximum withdrawal amount is ₱555 per transaction."
    }
  ];
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground pb-16">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <div className="whitespace-pre-line">{item.answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <Footer />
    </main>
  );
};

export default FAQ;