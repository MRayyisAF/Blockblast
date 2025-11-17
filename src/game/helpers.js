/**
 * Check if a piece can be placed at the specified position
 * @param {number[][]} board - The game board (10x10)
 * @param {number[][]} piece - The piece shape to place
 * @param {number} startRow - Top row of placement
 * @param {number} startCol - Left column of placement
 * @returns {boolean} - Whether the piece can be placed
 */
export function canPlacePiece(board, piece, startRow, startCol) {
  const rows = piece.length;
  const cols = piece[0].length;
  
  // Check if piece fits within board boundaries
  if (startRow < 0 || startCol < 0 || startRow + rows > 10 || startCol + cols > 10) {
    return false;
  }
  
  // Check if all cells are empty where the piece would be placed
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (piece[r][c] === 1 && board[startRow + r][startCol + c] !== 0) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Place a piece on the board
 * @param {number[][]} board - The game board
 * @param {number[][]} piece - The piece to place
 * @param {number} startRow - Top row of placement
 * @param {number} startCol - Left column of placement
 * @param {number} value - Value to set (usually 1 for filled)
 * @returns {number[][]} - New board state
 */
export function placePiece(board, piece, startRow, startCol, value = 1) {
  const newBoard = board.map(row => [...row]);
  const rows = piece.length;
  const cols = piece[0].length;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (piece[r][c] === 1) {
        newBoard[startRow + r][startCol + c] = value;
      }
    }
  }
  
  return newBoard;
}

/**
 * Check and clear completed rows and columns
 * @param {number[][]} board - The game board
 * @returns {Object} - { newBoard: number[][], clearedLines: number, score: number }
 */
export function clearLines(board) {
  const newBoard = board.map(row => [...row]);
  let clearedLines = 0;
  let score = 0;
  
  // Check rows
  for (let r = 0; r < 10; r++) {
    if (newBoard[r].every(cell => cell !== 0)) {
      newBoard[r] = new Array(10).fill(0);
      clearedLines++;
      score += 100;
    }
  }
  
  // Check columns
  for (let c = 0; c < 10; c++) {
    const columnFull = newBoard.every(row => row[c] !== 0);
    if (columnFull) {
      for (let r = 0; r < 10; r++) {
        newBoard[r][c] = 0;
      }
      clearedLines++;
      score += 100;
    }
  }
  
  return { newBoard, clearedLines, score };
}

/**
 * Create an empty 10x10 board
 * @returns {number[][]} - Empty board
 */
export function createEmptyBoard() {
  return Array(10).fill().map(() => Array(10).fill(0));
}

/**
 * Calculate the best placement position for snapping
 * @param {number} x - Mouse X position
 * @param {number} y - Mouse Y position
 * @param {number} pieceRows - Number of rows in the piece
 * @param {number} pieceCols - Number of columns in the piece
 * @returns {Object} - { row: number, col: number }
 */
export function calculateGridPosition(x, y, pieceRows, pieceCols) {
  const cellSize = 40;
  const gap = 1;
  const totalSize = cellSize + gap;
  
  let col = Math.floor(x / totalSize);
  let row = Math.floor(y / totalSize);
  
  // Adjust for piece dimensions to center the placement
  col = Math.max(0, Math.min(col, 10 - pieceCols));
  row = Math.max(0, Math.min(row, 10 - pieceRows));
  
  return { row, col };
}

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

/**
 * Generate random pieces for the tray
 * @param {number} count - Number of pieces to generate
 * @returns {Array} - Array of random pieces
 */
export function getRandomPieces(count = 3) {
  const shuffled = [...PIECES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}