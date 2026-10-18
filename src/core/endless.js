// Endless mode: after the last designed island, seeded random islands keep coming.
import { generateLevel } from './world.js';

export function endlessGenerator(levels) {
  const biomes = ['cloud', 'stars', 'aurora', 'sunset'];
  return (index) => {
    const k = index - levels.length;
    const lv = generateLevel(7000 + k * 131, {
      id: 'endless_' + k,
      biome: biomes[k % biomes.length],
      surface: biomes[k % biomes.length] === 'cloud' ? 'cloud' : 'snow',
      name: { ko: `끝없는 하늘 ${k + 1}`, en: `Endless Sky ${k + 1}` },
      features: ['ice', 'wind', 'geyser', 'ring'],
      amp: 1.15,
      blizzard: { speed: 1800 + k * 50, accel: 10 },
    });
    return lv;
  };
}
