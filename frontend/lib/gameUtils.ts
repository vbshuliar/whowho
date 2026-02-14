import { SeedRandom } from './seedRandom';

/**
 * Generate a short seed code (digits only)
 */
export function generateSeed(): string {
  const chars = '0123456789';
  const random = new SeedRandom(Date.now().toString());
  let seed = '';
  for (let i = 0; i < 5; i++) {
    seed += chars[random.nextInt(0, chars.length)];
  }
  return seed;
}

/**
 * Get image URL for a character by index
 * Using a placeholder service that can generate consistent images
 * Supports unlimited indices - same index always shows same character
 */
export function getCharacterImageUrl(index: number): string {
  // Using DiceBear API with seed-based generation for consistent images
  // This ensures same index always shows same character
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=character${index}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * List of first names for characters
 */
const FIRST_NAMES = [
  'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley', 'Gray', 'Harper', 'Jordan', 'Kai',
  'Logan', 'Morgan', 'Noah', 'Parker', 'Quinn', 'Riley', 'Sage', 'Taylor', 'Val', 'Winter',
  'Avery', 'Brooke', 'Cameron', 'Dakota', 'Ellis', 'Frankie', 'Grey', 'Hayden', 'Indigo', 'Jamie',
  'Kendall', 'Lane', 'Micah', 'Nico', 'Ocean', 'Peyton', 'Reese', 'Skyler', 'Tatum', 'Wren',
  'Adrian', 'Blair', 'Carter', 'Dylan', 'Eden', 'Flynn', 'Gage', 'Haven', 'Ivy', 'Jules',
  'Kade', 'Lennox', 'Marlowe', 'Nash', 'Oakley', 'Phoenix', 'River', 'Sawyer', 'Tyler', 'Wade',
  'Aiden', 'Brynn', 'Cody', 'Dane', 'Echo', 'Felix', 'Gwen', 'Harlow', 'Iris', 'Jade',
  'Kane', 'Luca', 'Mason', 'Nova', 'Orion', 'Piper', 'Quinn', 'Rowan', 'Sage', 'Troy',
  'Asher', 'Briar', 'Cove', 'Dune', 'Elm', 'Fox', 'Gale', 'Haze', 'Ivy', 'Jett',
  'Koa', 'Lake', 'Moss', 'Nyx', 'Onyx', 'Pine', 'Quill', 'Ridge', 'Storm', 'Thorn'
];

/**
 * List of last names for characters
 */
const LAST_NAMES = [
  'Anderson', 'Baker', 'Carter', 'Davis', 'Evans', 'Foster', 'Gray', 'Harris', 'Irwin', 'Jones',
  'Kelly', 'Lee', 'Miller', 'Nelson', 'Owens', 'Parker', 'Quinn', 'Reed', 'Smith', 'Taylor',
  'Underwood', 'Vance', 'Watson', 'Young', 'Adams', 'Bell', 'Clark', 'Dunn', 'Ellis', 'Fox',
  'Grant', 'Hill', 'Ives', 'James', 'King', 'Lane', 'Moore', 'Nash', 'Owen', 'Price',
  'Rose', 'Scott', 'Turner', 'Ward', 'Allen', 'Brooks', 'Cook', 'Doyle', 'Eaton', 'Ford',
  'Green', 'Hall', 'Ivy', 'Jackson', 'Knight', 'Lewis', 'Martin', 'North', 'Oliver', 'Perry',
  'Rivers', 'Stone', 'Tucker', 'Wells', 'Archer', 'Blake', 'Cross', 'Dale', 'Echo', 'Frost',
  'Grove', 'Hawk', 'Iris', 'Jade', 'Kane', 'Lake', 'Marsh', 'Noble', 'Oak', 'Pine',
  'Quill', 'Ridge', 'Swift', 'Thorne', 'Vale', 'West', 'York', 'Zane', 'Ash', 'Bloom'
];

/**
 * Generate unique names for the 24 selected images based on seed
 * Returns a Map from image index to unique name
 * Ensures all 24 names are unique within this single game
 */
export function generateUniqueNames(seed: string, imageIndices: number[]): Map<number, string> {
  const rng = new SeedRandom(seed + '-names');
  const nameMap = new Map<number, string>();
  const availableNames = [...FIRST_NAMES];
  const shuffledNames = rng.shuffle(availableNames);
  
  // Take first 24 unique names from shuffled array (we have 100 names, only need 24)
  // Since array is shuffled, first 24 will be unique
  const uniqueNames = shuffledNames.slice(0, 24);
  
  // Assign unique names to each image index
  imageIndices.forEach((imageIndex, position) => {
    nameMap.set(imageIndex, uniqueNames[position]);
  });
  
  return nameMap;
}

/**
 * Get a deterministic random first name for a character by index
 * Same index always returns the same name
 * @deprecated Use getCharacterNameFromMap instead for unique names
 */
export function getCharacterName(imageIndex: number): string {
  const rng = new SeedRandom(imageIndex.toString());
  const firstName = FIRST_NAMES[rng.nextInt(0, FIRST_NAMES.length)];
  return firstName;
}

/**
 * Select 24 unique images from unlimited pool based on seed
 * Same seed always produces the same 24 indices
 */
export function selectGameImages(seed: string): number[] {
  const rng = new SeedRandom(seed);
  const MAX_INDEX = 999999; // Effectively unlimited pool
  const NUM_IMAGES = 24;
  const selected = new Set<number>();
  
  // Generate 24 unique indices deterministically
  while (selected.size < NUM_IMAGES) {
    const index = rng.nextInt(0, MAX_INDEX);
    selected.add(index);
  }
  
  return Array.from(selected);
}

