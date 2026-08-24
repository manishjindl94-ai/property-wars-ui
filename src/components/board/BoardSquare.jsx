import React from 'react';
import { CheckersPiece } from './CheckersPiece';
import { Landmark, ShieldAlert, Zap } from 'lucide-react';

export function BoardSquare({
  square,
  isSelected,
  isLegalMove,
  isLegalCapture,
  onClick,
  onInspectProperty,
  disabled
}) {
  const { coordinate, color, algebraic, piece, property, isLastMoveSource, isLastMoveTarget } = square;
  const isDark = color === 'DARK';

  const categoryColorClass = property ? (
    property.category === 'TECH' ? 'cat-tech' :
    property.category === 'COMMERCIAL' ? 'cat-commercial' :
    property.category === 'LUXURY' ? 'cat-luxury' : 'cat-logistics'
  ) : '';

  const propertyOwnershipClass = property ? (
    property.owner === 'PLAYER' ? 'owned-player' :
    property.owner === 'COMPUTER' ? 'owned-computer' : 'unowned'
  ) : '';

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onClick(coordinate);
  };

  const handlePropertyBadgeClick = (e) => {
    e.stopPropagation();
    if (property && onInspectProperty) {
      onInspectProperty(property);
    }
  };

  return (
    <div
      className={`board-square ${isDark ? 'square-dark' : 'square-light'} ${isSelected ? 'is-selected' : ''} ${disabled ? 'disabled' : ''} ${isLastMoveTarget ? 'ring-1 ring-emerald-400/50' : ''}`}
      onClick={handleClick}
      data-algebraic={algebraic}
      data-row={coordinate[0]}
      data-col={coordinate[1]}
      id={`sq-${algebraic.toLowerCase()}`}
      title={`${algebraic}${property ? ` • ${property.name}` : ''}${piece ? ` • ${piece.owner} ${piece.type}` : ''}`}
    >
      {/* Property Category Color Dot */}
      {property && (
        <span 
          className={`property-category-indicator ${categoryColorClass}`} 
          title={`${property.category} Property`}
        />
      )}

      {/* Property Badge on Board Square */}
      {property && (
        <div 
          className={`property-tile-badge ${propertyOwnershipClass}`}
          onClick={handlePropertyBadgeClick}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          title={`Click to view ${property.name} stats`}
        >
          <Landmark size={10} />
          <span>{property.name.split(' ')[0]}</span>
        </div>
      )}

      {/* Checkers Piece if present */}
      {piece && <CheckersPiece piece={piece} />}

      {/* Legal Move Target Highlight Ring */}
      {isLegalMove && <div className="legal-move-marker" />}

      {/* Legal Capture Target Highlight Ring */}
      {isLegalCapture && <div className="legal-capture-marker" />}
    </div>
  );
}
