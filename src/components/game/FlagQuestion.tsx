import React from 'react';
import type { Schema } from '@/lib/db-types';

interface FlagQuestionProps {
  country: Schema["countries"];
}

export const FlagQuestion: React.FC<FlagQuestionProps> = ({ country }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-8xl mb-6 animate-bounce">
        {country.flag}
      </div>
      <h2 className="text-xl font-medium text-center">
        Which country does this flag represent?
      </h2>
    </div>
  );
};