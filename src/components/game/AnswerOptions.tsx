import React from 'react';
import { Button } from '@/components/ui/button';
import type { Schema } from '@/lib/db-types';

interface AnswerOptionsProps {
  options: Schema["countries"][];
  correctAnswer: Schema["countries"];
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({ 
  options, 
  correctAnswer, 
  onAnswer,
  disabled = false
}) => {
  const handleClick = (selectedCountry: Schema["countries"]) => {
    const isCorrect = selectedCountry.id === correctAnswer.id;
    onAnswer(isCorrect);
  };
  
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {options.map((country) => (
        <Button
          key={country.id}
          onClick={() => handleClick(country)}
          className="py-6 text-lg"
          disabled={disabled}
        >
          {country.name}
        </Button>
      ))}
    </div>
  );
};