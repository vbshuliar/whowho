/**
 * Seed-based random number generator
 * Same seed always produces the same sequence of random numbers
 */
export class SeedRandom {
    private seed: number;

    constructor(seed: string | number) {
        // Convert string seed to number
        if (typeof seed === 'string') {
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                const char = seed.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            this.seed = Math.abs(hash);
        } else {
            this.seed = Math.abs(seed);
        }
    }

    /**
     * Generate next random number between 0 and 1
     */
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * Generate random integer between min (inclusive) and max (exclusive)
     */
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min)) + min;
    }

    /**
     * Shuffle array deterministically based on seed
     */
    shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

