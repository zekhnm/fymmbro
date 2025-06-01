import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Gue$$it" }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <h1 className="text-4xl font-bold mb-4">
        Gue
        <span className="text-red-500 animate-pulse">
          $$
        </span>
        it
      </h1>
      <div className="mt-4">
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

// Add the animation to the tailwind config
// This will be added to the tailwind.config.js file
// animation: {
//   loading: 'loading 1.5s ease-in-out infinite',
// },
// keyframes: {
//   loading: {
//     '0%': { width: '0%', marginLeft: '0%' },
//     '50%': { width: '100%', marginLeft: '0%' },
//     '100%': { width: '0%', marginLeft: '100%' },
//   },
// },