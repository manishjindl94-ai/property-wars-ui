import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

export function CheckersPiece({ piece }) {
  if (!piece) return null;

  const { owner, type, isSelected, hasCaptureAvailable } = piece;
  const isPlayer = owner === 'PLAYER';
  const isKing = type === 'KING';

  return (
    <div 
      className={`checkers-piece ${isPlayer ? 'player' : 'computer'} ${isSelected ? 'selected' : ''} ${hasCaptureAvailable ? 'threatened' : ''}`}
      data-piece-id={piece.id}
      data-piece-owner={owner}
      data-piece-type={type}
    >
      <div className="piece-inner-ring" />

      {isKing ? (
        <div className="king-crown-badge" title={`${owner} King Piece`}>
          <Crown size={22} strokeWidth={2.5} />
        </div>
      ) : (
        <div 
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isPlayer ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.35)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
    </div>
  );
}
