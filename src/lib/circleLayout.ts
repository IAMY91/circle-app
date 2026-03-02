export interface Position {
  x: number; // px offset from container center
  y: number; // px offset from container center
}

/**
 * Returns N evenly-spaced positions on a circle.
 * offsetDeg=-90 puts the first participant at 12 o'clock.
 */
export function getCirclePositions(n: number, radius: number, offsetDeg = -90): Position[] {
  if (n === 0) return [];
  const offset = (offsetDeg * Math.PI) / 180;
  return Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n + offset;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

/** Scale tile size based on participant count */
export function getTileSize(count: number): number {
  if (count <= 4) return 140;
  if (count <= 8) return 120;
  if (count <= 12) return 96;
  return 80;
}
