import React from 'react';
import { BoardSquare } from './BoardSquare';
import { InputLockOverlay } from './InputLockOverlay';
import { ACTION_TYPES } from '../../types/engineContract';

const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROW_LABELS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function CheckersBoard({
  board = [],
  selectedSquare = null,
  legalActions = [],
  isInputLocked = false,
  dispatch,
  onInspectProperty
}) {
  const handleSquareClick = (coord) => {
    if (isInputLocked) return;

    const [row, col] = coord;
    const currentSquare = board[row]?.[col];

    // Check if clicked square is a legal move or capture action
    const legalAction = legalActions.find(
      action => action.to[0] === row && action.to[1] === col
    );

    if (legalAction && selectedSquare) {
      if (legalAction.type === 'CAPTURE') {
        dispatch({
          type: ACTION_TYPES.EXECUTE_CAPTURE,
          from: selectedSquare,
          to: coord,
          captureTarget: legalAction.captureTarget
        });
      } else {
        dispatch({
          type: ACTION_TYPES.EXECUTE_MOVE,
          from: selectedSquare,
          to: coord
        });
      }
      return;
    }

    // If clicking the already selected piece, deselect it
    if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
      dispatch({
        type: ACTION_TYPES.SELECT_SQUARE,
        coordinate: null
      });
      return;
    }

    // If clicking a square with a player piece, select it
    if (currentSquare?.piece?.owner === 'PLAYER') {
      dispatch({
        type: ACTION_TYPES.SELECT_SQUARE,
        coordinate: coord
      });
      return;
    }

    // Otherwise, clear selection if clicking empty square
    if (selectedSquare) {
      dispatch({
        type: ACTION_TYPES.SELECT_SQUARE,
        coordinate: null
      });
    }
  };

  return (
    <div className={`board-wrapper ${isInputLocked ? 'locked' : ''}`} id="main-checkers-board-wrapper">
      {isInputLocked && <InputLockOverlay />}

      <div className="board-container">
        {/* Top-Left Empty Corner */}
        <div />

        {/* Top Column Labels (A-H) */}
        <div className="board-coordinate-row">
          {COL_LABELS.map(col => (
            <span key={col} className="w-16 text-center">{col}</span>
          ))}
        </div>

        {/* Top-Right Empty Corner */}
        <div />

        {/* Left Row Labels (8-1) */}
        <div className="board-coordinate-col">
          {ROW_LABELS.map(row => (
            <span key={row} className="h-16 flex items-center justify-center">{row}</span>
          ))}
        </div>

        {/* 8x8 Grid Matrix */}
        <div className="board-grid" id="checkers-board-8x8">
          {board.map((rowArr, rIdx) =>
            rowArr.map((sq, cIdx) => {
              const isSelected = selectedSquare && selectedSquare[0] === rIdx && selectedSquare[1] === cIdx;
              const isLegalMove = legalActions.some(
                act => act.type === 'MOVE' && act.to[0] === rIdx && act.to[1] === cIdx
              );
              const isLegalCapture = legalActions.some(
                act => act.type === 'CAPTURE' && act.to[0] === rIdx && act.to[1] === cIdx
              );

              return (
                <BoardSquare
                  key={`${rIdx}-${cIdx}`}
                  square={sq}
                  isSelected={isSelected}
                  isLegalMove={isLegalMove}
                  isLegalCapture={isLegalCapture}
                  onClick={handleSquareClick}
                  onInspectProperty={onInspectProperty}
                  disabled={isInputLocked}
                />
              );
            })
          )}
        </div>

        {/* Right Row Labels (8-1) */}
        <div className="board-coordinate-col">
          {ROW_LABELS.map(row => (
            <span key={row} className="h-16 flex items-center justify-center">{row}</span>
          ))}
        </div>

        {/* Bottom-Left Empty Corner */}
        <div />

        {/* Bottom Column Labels (A-H) */}
        <div className="board-coordinate-row">
          {COL_LABELS.map(col => (
            <span key={col} className="w-16 text-center">{col}</span>
          ))}
        </div>

        {/* Bottom-Right Empty Corner */}
        <div />
      </div>
    </div>
  );
}
