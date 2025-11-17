import React from 'react';
import { motion } from 'framer-motion';

/**
 * Piece component - Renders a draggable game piece
 */
const Piece = ({ 
  piece, 
  index, 
  onDragStart, 
  onDrag, 
  onDragEnd, 
  isDragging,
  position 
}) => {
  
  const handlePointerDown = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    onDragStart(index, offsetX, offsetY);
  };
  
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    onDrag(e.clientX, e.clientY);
  };
  
  const handlePointerUp = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    onDragEnd();
  };
  
  // If this piece is being dragged, render it separately with absolute positioning
  if (isDragging && position) {
    return (
      <motion.div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          pointerEvents: 'none',
          zIndex: 1000,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <PieceGrid piece={piece} />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="cursor-grab active:cursor-grabbing bg-gray-800 p-3 rounded-lg shadow-md"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <PieceGrid piece={piece} />
    </motion.div>
  );
};

// Subcomponent to render the piece grid
const PieceGrid = ({ piece }) => {
  const rows = piece.shape.length;
  const cols = piece.shape[0].length;
  
  return (
    <div 
      className={`grid gap-1`}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {piece.shape.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              w-6 h-6 rounded-sm
              ${cell === 1 
                ? `${piece.color} shadow-inner border border-white/20` 
                : 'transparent'
              }
            `}
          />
        ))
      )}
    </div>
  );
};

export default Piece;