import React from 'react';
import { motion } from 'framer-motion';

/**
 * Board component - Renders the 10x10 game grid
 */
const Board = React.forwardRef(({ 
  board, 
  hoverPosition, 
  hoverPiece, 
  onCellHover 
}, ref) => {
  
  return (
    <div 
      ref={ref}
      className="grid grid-cols-10 grid-rows-10 gap-1 bg-gray-800 p-2 rounded-lg shadow-lg"
      style={{ width: 'fit-content' }}
      onMouseMove={onCellHover}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isHoverCell = hoverPiece && hoverPosition && 
            (() => {
              const pieceRows = hoverPiece.shape.length;
              const pieceCols = hoverPiece.shape[0].length;
              const relativeRow = rowIndex - hoverPosition.row;
              const relativeCol = colIndex - hoverPosition.col;
              
              return (relativeRow >= 0 && relativeRow < pieceRows && 
                      relativeCol >= 0 && relativeCol < pieceCols && 
                      hoverPiece.shape[relativeRow][relativeCol] === 1);
            })();
          
          const isValidHover = hoverPosition?.isValid;
          
          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-10 h-10 border-2 border-gray-600 rounded
                ${cell !== 0 
                  ? `${getColorClass(cell)} border-transparent shadow-md` 
                  : 'bg-gray-700'
                }
                ${isHoverCell 
                  ? `${isValidHover ? 'bg-green-500/30' : 'bg-red-500/30'} border-dashed` 
                  : ''
                }
              `}
              whileHover={{ scale: cell === 0 ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          );
        })
      )}
    </div>
  );
});

// Helper function to get color class based on cell value
function getColorClass(value) {
  const colors = [
    'bg-gray-400',    // 0 - empty (shouldn't occur)
    'bg-yellow-400',  // 1
    'bg-blue-400',    // 2
    'bg-orange-400',  // 3
    'bg-cyan-400',    // 4
    'bg-purple-400',  // 5
    'bg-red-400',     // 6
    'bg-green-400',   // 7
    'bg-pink-400',    // 8
    'bg-indigo-400',  // 9
    'bg-teal-400',    // 10
    'bg-amber-400',   // 11
  ];
  return colors[value] || colors[0];
}

export default Board;