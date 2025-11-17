import React from 'react';
import { motion } from 'framer-motion';
import Piece from './Piece';

/**
 * Tray component - Holds available pieces for the player to use
 */
const Tray = ({ pieces, onDragStart, onDrag, onDragEnd, draggingIndex, dragPosition }) => {
  
  return (
    <motion.div 
      className="bg-gray-900/80 p-4 rounded-xl shadow-2xl border border-gray-700"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h2 className="text-white text-lg font-bold mb-4 text-center">Available Pieces</h2>
      
      <div className="flex gap-4 justify-center">
        {pieces.map((piece, index) => (
          <motion.div
            key={index}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Piece
              piece={piece}
              index={index}
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              isDragging={draggingIndex === index}
              position={draggingIndex === index ? dragPosition : null}
            />
          </motion.div>
        ))}
      </div>
      
      {pieces.length === 0 && (
        <motion.div 
          className="text-gray-400 text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Generating new pieces...
        </motion.div>
      )}
    </motion.div>
  );
};

export default Tray;