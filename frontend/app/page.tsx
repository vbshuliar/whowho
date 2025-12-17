'use client';

import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import GameBoard from '@/components/GameBoard';
import { selectGameImages, generateUniqueNames } from '@/lib/gameUtils';

export default function Home() {
  const [gameSeed, setGameSeed] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<number[]>([]);
  const [nameMap, setNameMap] = useState<Map<number, string>>(new Map());

  const handleStartGame = (seed: string) => {
    const indices = selectGameImages(seed);
    const names = generateUniqueNames(seed, indices);
    setImageIndices(indices);
    setNameMap(names);
    setGameSeed(seed);
  };

  const handleBackToStart = () => {
    setGameSeed(null);
    setImageIndices([]);
    setNameMap(new Map());
  };

  if (gameSeed && imageIndices.length > 0) {
    return <GameBoard seed={gameSeed} imageIndices={imageIndices} nameMap={nameMap} onBack={handleBackToStart} />;
  }

  return <StartScreen onStartGame={handleStartGame} />;
}
