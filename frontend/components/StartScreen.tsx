'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateSeed } from '@/lib/gameUtils';

interface StartScreenProps {
  onStartGame?: (seed: string) => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const router = useRouter();
  const [seed, setSeed] = useState('');

  const handleGenerate = () => {
    const newSeed = generateSeed();
    router.push(`/${newSeed}`);
  };

  const handleJoin = () => {
    if (seed.length === 5) {
      router.push(`/${seed}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 5 digits
    if (digitsOnly.length <= 5) {
      setSeed(digitsOnly);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 pb-6 sm:pb-8 pt-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl sm:text-2xl font-bold text-center text-gray-100 uppercase">
          WhoWho
        </h1>
        
        <button
          onClick={handleGenerate}
          className="w-full py-4 sm:py-3 px-6 bg-blue-600 active:bg-blue-700 text-white text-sm sm:text-xs font-bold uppercase rounded-lg transition-colors touch-manipulation min-h-[56px] sm:min-h-[44px]"
        >
          Generate Game
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={seed}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && seed.length === 5) {
                handleJoin();
              }
            }}
            placeholder="Code"
            className="flex-1 px-4 py-4 sm:py-3 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-800 text-gray-100 text-center text-base sm:text-xs font-mono uppercase placeholder-gray-500 min-h-[56px] sm:min-h-[44px]"
            maxLength={5}
          />
          <button
            onClick={handleJoin}
            disabled={seed.length !== 5}
            className="px-6 sm:px-6 py-4 sm:py-3 bg-indigo-600 active:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm sm:text-xs font-bold uppercase rounded-lg transition-colors touch-manipulation min-h-[56px] sm:min-h-[44px]"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

