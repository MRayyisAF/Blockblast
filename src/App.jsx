import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Board from './components/Board';
import Tray from './components/Tray';
import { createEmptyBoard, canPlacePiece, placePiece, clearLines, getRandomPieces, calculateGridPosition } from './game/helpers';

/**
 * Main App Component - Game controller and state management
 */
function App() {
  // Game state
  const [board, setBoard] = useState(createEmptyBoard());
  const [pieces, setPieces] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Drag state
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoverPosition, setHoverPosition] = useState(null);
  const [activePiece, setActivePiece] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const boardRef = useRef(null);

  // Initialize game
  useEffect(() => {
    generateNewPieces();
  }, []);

  // Generate new pieces for the tray
  const generateNewPieces = useCallback(() => {
    const newPieces = getRandomPieces(3);
    setPieces(newPieces);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((pieceIndex, offsetX, offsetY) => {
    setDraggingIndex(pieceIndex);
    setActivePiece(pieces[pieceIndex]);
    setDragOffset({ x: offsetX, y: offsetY });
  }, [pieces]);

  // Handle drag movement
  const handleDrag = useCallback((clientX, clientY) => {
    if (draggingIndex === null) return;
    
    // Update drag position
    setDragPosition({ 
      x: clientX - dragOffset.x, 
      y: clientY - dragOffset.y 
    });
    
    // Calculate grid hover position
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const relativeX = clientX - boardRect.left;
      const relativeY = clientY - boardRect.top;
      
      const pieceRows = activePiece.shape.length;
      const pieceCols = activePiece.shape[0].length;
      
      const { row, col } = calculateGridPosition(relativeX, relativeY, pieceRows, pieceCols);
      const isValid = canPlacePiece(board, activePiece.shape, row, col);
      
      setHoverPosition({ row, col, isValid });
    }
  }, [draggingIndex, activePiece, board, dragOffset]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (draggingIndex === null || !hoverPosition) return;
    
    const pieceIndex = draggingIndex;
    const piece = activePiece;
    
    // Reset drag state
    setDraggingIndex(null);
    setActivePiece(null);
    setHoverPosition(null);
    
    // Check if placement is valid
    if (hoverPosition.isValid) {
      // Place the piece on the board
      const newBoard = placePiece(board, piece.shape, hoverPosition.row, hoverPosition.col, pieces.indexOf(piece) + 1);
      
      // Clear completed lines and update score
      const { newBoard: clearedBoard, score: lineScore } = clearLines(newBoard);
      setBoard(clearedBoard);
      
      // Update score
      setScore(prev => {
        const newScore = prev + lineScore + 10; // +10 for placement
        // Level up every 500 points
        setLevel(Math.floor(newScore / 500) + 1);
        return newScore;
      });
      
      // Remove used piece from tray
      const newPieces = pieces.filter((_, index) => index !== pieceIndex);
      setPieces(newPieces);
      
      // Generate new pieces if tray is empty
      if (newPieces.length === 0) {
        setTimeout(() => {
          generateNewPieces();
        }, 500);
      }
    }
  }, [draggingIndex, activePiece, hoverPosition, board, pieces, generateNewPieces]);

  // Handle cell hover for better UX
  const handleCellHover = useCallback((e) => {
    if (draggingIndex === null || !boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const relativeX = e.clientX - boardRect.left;
    const relativeY = e.clientY - boardRect.top;
    
    const pieceRows = activePiece.shape.length;
    const pieceCols = activePiece.shape[0].length;
    
    const { row, col } = calculateGridPosition(relativeX, relativeY, pieceRows, pieceCols);
    const isValid = canPlacePiece(board, activePiece.shape, row, col);
    
    setHoverPosition({ row, col, isValid });
  }, [draggingIndex, activePiece, board]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    generateNewPieces();
  }, [generateNewPieces]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Block Blast
          </h1>
          <p className="text-gray-400">Drag and drop pieces to clear lines!</p>
        </motion.header>

        {/* Game Stats */}
        <motion.div 
          className="flex justify-center gap-8 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center bg-gray-800/50 px-6 py-3 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-cyan-400">{score}</div>
            <div className="text-gray-400 text-sm">Score</div>
          </div>
          <div className="text-center bg-gray-800/50 px-6 py-3 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">{level}</div>
            <div className="text-gray-400 text-sm">Level</div>
          </div>
          <div className="text-center bg-gray-800/50 px-6 py-3 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">{pieces.length}</div>
            <div className="text-gray-400 text-sm">Pieces Left</div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
          >
            <Board
              ref={boardRef}
              board={board}
              hoverPosition={hoverPosition}
              hoverPiece={activePiece}
              onCellHover={handleCellHover}
            />
          </motion.div>

          {/* Pieces Tray */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
          >
            <Tray
              pieces={pieces}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              draggingIndex={draggingIndex}
              dragPosition={dragPosition}
            />
          </motion.div>
        </div>

        {/* Game Controls */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-red-500/25"
          >
            Reset Game
          </button>
        </motion.div>

        {/* Game Instructions */}
        <motion.div 
          className="max-w-md mx-auto mt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>🎮 <strong>How to Play:</strong> Drag pieces from the tray onto the board. Clear rows and columns to score points!</p>
        </motion.div>
      </div>

      {/* Global event listeners for drag */}
      {draggingIndex !== null && (
        <div
          className="fixed inset-0 z-50 cursor-grabbing"
          onPointerMove={(e) => handleDrag(e.clientX, e.clientY)}
          onPointerUp={handleDragEnd}
          onPointerLeave={handleDragEnd}
        />
      )}
    </div>
  );
}

export default App;