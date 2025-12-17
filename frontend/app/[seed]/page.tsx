'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import { selectGameImages, generateUniqueNames } from '@/lib/gameUtils';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const seed = params?.seed as string;
  
  const [imageIndices, setImageIndices] = useState<number[]>([]);
  const [nameMap, setNameMap] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (seed && /^\d{5}$/.test(seed)) {
      const indices = selectGameImages(seed);
      const names = generateUniqueNames(seed, indices);
      setImageIndices(indices);
      setNameMap(names);
      setIsLoading(false);
    } else {
      // Invalid seed, redirect to home
      router.push('/');
    }
  }, [seed, router]);

  if (isLoading || !seed || imageIndices.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-gray-300 text-xs font-bold uppercase">Loading...</p>
      </div>
    );
  }

  return <GameBoard seed={seed} imageIndices={imageIndices} nameMap={nameMap} />;
}

