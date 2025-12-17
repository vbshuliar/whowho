'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCharacterImageUrl } from '@/lib/gameUtils';

interface GameBoardProps {
  seed: string;
  imageIndices: number[];
  nameMap: Map<number, string>;
  onBack?: () => void;
}

export default function GameBoard({ seed, imageIndices, nameMap, onBack }: GameBoardProps) {
  const router = useRouter();
  const [hiddenImages, setHiddenImages] = useState<Set<number>>(new Set());
  const [secretImage, setSecretImage] = useState<number | null>(null);

  // Load secret image from localStorage on mount
  useEffect(() => {
    const savedSecret = localStorage.getItem(`secret-image-${seed}`);
    if (savedSecret !== null) {
      const index = parseInt(savedSecret, 10);
      // Verify the saved index is still valid for current game
      if (index >= 0 && index < imageIndices.length) {
        setSecretImage(index);
      }
    }
  }, [seed, imageIndices.length]);

  // Save secret image to localStorage whenever it changes
  useEffect(() => {
    if (secretImage !== null) {
      localStorage.setItem(`secret-image-${seed}`, secretImage.toString());
    } else {
      localStorage.removeItem(`secret-image-${seed}`);
    }
  }, [secretImage, seed]);

  const toggleHidden = (index: number) => {
    setHiddenImages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleImageClick = (index: number) => {
    // If no secret is selected, clicking makes it secret
    // If secret is already selected, clicking toggles hide/show
    if (secretImage === null) {
      setSecretImage(index);
    } else {
      toggleHidden(index);
    }
  };

  const handleImageLongPress = (index: number) => {
    // Long press to select/clear secret
    if (secretImage === null) {
      // No secret selected: set this as secret
      setSecretImage(index);
    } else if (secretImage === index) {
      // Long pressing current secret: clear it
      setSecretImage(null);
    } else {
      // Secret exists but different character: replace it
      setSecretImage(index);
    }
  };

  const isHidden = (index: number) => hiddenImages.has(index);
  const isSecret = (index: number) => secretImage === index;

  return (
    <div className="min-h-screen bg-gray-900 px-3 sm:px-4 pb-6 sm:pb-8 pt-2 sm:pt-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
          <code className="px-2 sm:px-3 py-2 sm:py-1.5 bg-blue-900/50 rounded border border-blue-700 text-xs sm:text-sm font-mono font-bold uppercase text-blue-300">{seed}</code>
          <button
            onClick={() => router.push('/')}
            className="px-4 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-bold uppercase bg-gray-800 active:bg-gray-700 text-gray-100 rounded transition-colors touch-manipulation min-h-[44px]"
          >
            Menu
          </button>
        </div>

        {/* Secret Image Display */}
        <div className="mb-3 sm:mb-4 flex justify-center">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div 
              className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-yellow-400 bg-gray-800 cursor-pointer active:opacity-80 transition-opacity touch-manipulation"
              onClick={() => {
                if (secretImage !== null) {
                  setSecretImage(null);
                }
              }}
            >
              {secretImage !== null && (
                <Image
                  src={getCharacterImageUrl(imageIndices[secretImage])}
                  alt="Secret"
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <p className="text-xs sm:text-xs font-bold uppercase text-gray-300 min-h-[1rem] text-center">
              {secretImage !== null ? (nameMap.get(imageIndices[secretImage]) || 'Unknown') : ''}
            </p>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
          {imageIndices.map((imageIndex, gridIndex) => {
            const hidden = isHidden(gridIndex);
            const secret = isSecret(gridIndex);
            const name = nameMap.get(imageIndex) || 'Unknown';

            return (
              <div
                key={gridIndex}
                className="flex flex-col gap-1"
              >
                <div
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 touch-manipulation ${
                    hidden && secretImage !== null
                      ? 'opacity-30 grayscale'
                      : 'opacity-100 active:scale-95'
                  } ${secretImage === null ? 'ring-2 ring-yellow-400' : ''}`}
                  onClick={() => handleImageClick(gridIndex)}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const startTime = Date.now();
                    const startY = touch.clientY;
                    
                    const handleTouchEnd = () => {
                      const endTime = Date.now();
                      const duration = endTime - startTime;
                      // Long press if held for more than 500ms
                      if (duration > 500) {
                        handleImageLongPress(gridIndex);
                      }
                      document.removeEventListener('touchend', handleTouchEnd);
                    };
                    
                    document.addEventListener('touchend', handleTouchEnd, { once: true });
                  }}
                >
                  <Image
                    src={getCharacterImageUrl(imageIndex)}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {hidden && secretImage !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-white text-4xl font-bold">✕</div>
                    </div>
                  )}
                </div>
                <p className={`text-xs sm:text-xs text-center text-gray-300 font-bold uppercase truncate px-1 ${hidden && secretImage !== null ? 'invisible' : ''}`}>
                  {name}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

