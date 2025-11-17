// Predefined block pieces (similar to Block Blast/Tetris)
export const PIECES = [
  // 2x2 Square
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-400'
  },
  // 3x3 L Shape
  {
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'bg-blue-400'
  },
  // 3x3 Reverse L
  {
    shape: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'bg-orange-400'
  },
  // 4x1 Line
  {
    shape: [
      [1],
      [1],
      [1],
      [1]
    ],
    color: 'bg-cyan-400'
  },
  // T Shape
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-purple-400'
  },
  // Z Shape
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-red-400'
  },
  // S Shape
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'bg-green-400'
  },
  // Cross
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    color: 'bg-pink-400'
  },
  // Small L
  {
    shape: [
      [1, 0],
      [1, 1]
    ],
    color: 'bg-indigo-400'
  },
  // Dot
  {
    shape: [[1]],
    color: 'bg-gray-400'
  },
  // Corner
  {
    shape: [
      [1, 1],
      [1, 0]
    ],
    color: 'bg-teal-400'
  },
  // Small T
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    color: 'bg-amber-400'
  }
];

// Generate random pieces for the tray
export function getRandomPieces(count = 3) {
  const shuffled = [...PIECES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}