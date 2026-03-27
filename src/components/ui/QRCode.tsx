import React from 'react';
interface QRCodeProps {
  value: string;
  size?: number;
}
// A simple deterministic hash function to generate a pattern from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
export function QRCode({ value, size = 200 }: QRCodeProps) {
  const gridSize = 25; // 25x25 grid is typical for QR codes
  const cellSize = size / gridSize;
  const hash = hashString(value);
  // Generate deterministic pseudo-random bits based on the hash
  const getBit = (x: number, y: number) => {
    const seed = hash ^ x * 37 ^ y * 17;
    return Math.sin(seed) * 10000 % 1 > 0.5;
  };
  const isFinderPattern = (x: number, y: number) => {
    // Top-left
    if (x <= 6 && y <= 6) return true;
    // Top-right
    if (x >= gridSize - 7 && y <= 6) return true;
    // Bottom-left
    if (x <= 6 && y >= gridSize - 7) return true;
    return false;
  };
  const renderFinderPattern = (startX: number, startY: number) => {
    return (
      <g key={`finder-${startX}-${startY}`}>
        {/* Outer square */}
        <rect
          x={startX * cellSize}
          y={startY * cellSize}
          width={7 * cellSize}
          height={7 * cellSize}
          fill="black" />
        
        {/* Inner white square */}
        <rect
          x={(startX + 1) * cellSize}
          y={(startY + 1) * cellSize}
          width={5 * cellSize}
          height={5 * cellSize}
          fill="white" />
        
        {/* Center black square */}
        <rect
          x={(startX + 2) * cellSize}
          y={(startY + 2) * cellSize}
          width={3 * cellSize}
          height={3 * cellSize}
          fill="black" />
        
      </g>);

  };
  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!isFinderPattern(x, y) && getBit(x, y)) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            fill="black" />

        );
      }
    }
  }
  return (
    <div className="bg-white p-4 rounded-xl inline-block shadow-sm border border-gray-100">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" />
        {renderFinderPattern(0, 0)}
        {renderFinderPattern(gridSize - 7, 0)}
        {renderFinderPattern(0, gridSize - 7)}
        {cells}
      </svg>
    </div>);

}