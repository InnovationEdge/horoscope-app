// Utility functions for metrics and calculations

// Calculate compatibility percentage between two signs
export function calculateCompatibility(signA: string, signB: string): number {
  // Simple compatibility matrix based on elements
  const elementMap: Record<string, string> = {
    aries: 'fire',
    leo: 'fire',
    sagittarius: 'fire',
    taurus: 'earth',
    virgo: 'earth',
    capricorn: 'earth',
    gemini: 'air',
    libra: 'air',
    aquarius: 'air',
    cancer: 'water',
    scorpio: 'water',
    pisces: 'water',
  };

  const elementA = elementMap[signA.toLowerCase()];
  const elementB = elementMap[signB.toLowerCase()];

  if (!elementA || !elementB) return 50; // Default compatibility

  // Element compatibility rules
  if (elementA === elementB) return 85; // Same element

  const fireCompatible = ['air'];
  const earthCompatible = ['water'];
  const airCompatible = ['fire'];
  const waterCompatible = ['earth'];

  const compatibilityRules: Record<string, string[]> = {
    fire: fireCompatible,
    earth: earthCompatible,
    air: airCompatible,
    water: waterCompatible,
  };

  if (compatibilityRules[elementA]?.includes(elementB)) {
    return Math.floor(Math.random() * 20) + 70; // 70-90%
  }

  return Math.floor(Math.random() * 30) + 40; // 40-70%
}

// Calculate life aspect scores based on sign and date
export function calculateLifeAspects(sign: string, date: Date): { love: number; career: number; health: number } {
  // Seed random based on sign and date for consistency
  const seed = sign.length + date.getDate() + date.getMonth();

  // Generate consistent scores between 60-95 for each aspect
  const baseScore = 60;
  const range = 35;

  const love = baseScore + ((seed * 7) % range);
  const career = baseScore + ((seed * 11) % range);
  const health = baseScore + ((seed * 13) % range);

  return { love, career, health };
}

// Generate lucky number based on sign and date
export function getLuckyNumber(sign: string, date: Date): number {
  const luckyNumbers: Record<string, number[]> = {
    aries: [1, 7, 8, 9, 17],
    taurus: [2, 6, 15, 20, 24],
    gemini: [3, 5, 12, 18, 21],
    cancer: [2, 4, 11, 16, 26],
    leo: [1, 5, 10, 19, 23],
    virgo: [3, 6, 14, 22, 27],
    libra: [4, 7, 13, 25, 29],
    scorpio: [8, 9, 11, 18, 30],
    sagittarius: [3, 9, 15, 21, 33],
    capricorn: [6, 10, 14, 26, 35],
    aquarius: [4, 11, 22, 29, 37],
    pisces: [7, 12, 16, 25, 39],
  };

  const numbers = luckyNumbers[sign.toLowerCase()] || [7, 13, 21];
  const index = date.getDate() % numbers.length;
  return numbers[index];
}

// Generate lucky color based on sign
export function getLuckyColor(sign: string): string {
  const luckyColors: Record<string, string[]> = {
    aries: ['Red', 'Orange', 'Scarlet'],
    taurus: ['Green', 'Pink', 'Blue'],
    gemini: ['Yellow', 'Silver', 'Grey'],
    cancer: ['White', 'Silver', 'Sea Green'],
    leo: ['Gold', 'Orange', 'Yellow'],
    virgo: ['Navy Blue', 'Grey', 'Brown'],
    libra: ['Pink', 'Blue', 'Pastel Green'],
    scorpio: ['Deep Red', 'Black', 'Maroon'],
    sagittarius: ['Purple', 'Turquoise', 'Blue'],
    capricorn: ['Black', 'Brown', 'Dark Green'],
    aquarius: ['Electric Blue', 'Silver', 'Aqua'],
    pisces: ['Sea Green', 'Lavender', 'Purple'],
  };

  const colors = luckyColors[sign.toLowerCase()] || ['Blue'];
  return colors[0];
}

// Generate mood based on sign and scores
export function getLuckyMood(sign: string, aspects: { love: number; career: number; health: number }): string {
  const avgScore = (aspects.love + aspects.career + aspects.health) / 3;

  const moods = {
    high: ['Confident', 'Optimistic', 'Energized', 'Inspired'],
    medium: ['Balanced', 'Focused', 'Calm', 'Steady'],
    low: ['Reflective', 'Cautious', 'Grounded', 'Thoughtful'],
  };

  let moodLevel: 'high' | 'medium' | 'low';
  if (avgScore >= 80) moodLevel = 'high';
  else if (avgScore >= 65) moodLevel = 'medium';
  else moodLevel = 'low';

  const moodList = moods[moodLevel];
  const index = sign.length % moodList.length;
  return moodList[index];
}
