/**
 * @file mockHarness.js
 * @description Isolated UI Sandbox & State Dispatch Provider for Property Wars.
 * 
 * IMPORTANT: This file acts purely as a temporary mock harness to enable
 * rich interactive testing of the UI presentation layer until the actual
 * separate game engine is connected.
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  SCENARIO_ALLOCATION, 
  createPlayerTurnScenario, 
  createComputerTurnScenario, 
  createVictoryScenario, 
  createDefeatScenario 
} from './initialStates';
import { ACTION_TYPES } from '../types/engineContract';

export const SCENARIO_KEYS = {
  ALLOCATION: 'Allocation Phase (₹10,000 Pool)',
  PLAYER_TURN: 'Player Turn (Move & Capture Highlighted)',
  COMPUTER_TURN: 'Computer Turn (Locked UI + AI Radar)',
  VICTORY: 'Game Over — Victory Screen',
  DEFEAT: 'Game Over — Bankruptcy / Defeat'
};

export function useMockEngineHarness() {
  const [activeScenarioKey, setActiveScenarioKey] = useState(SCENARIO_KEYS.PLAYER_TURN);
  const [gameState, setGameState] = useState(() => createPlayerTurnScenario());

  // Switch between canned scenario snapshots for rapid UI inspection
  const switchScenario = useCallback((scenarioKey) => {
    setActiveScenarioKey(scenarioKey);
    switch (scenarioKey) {
      case SCENARIO_KEYS.ALLOCATION:
        setGameState(SCENARIO_ALLOCATION);
        break;
      case SCENARIO_KEYS.PLAYER_TURN:
        setGameState(createPlayerTurnScenario());
        break;
      case SCENARIO_KEYS.COMPUTER_TURN:
        setGameState(createComputerTurnScenario());
        break;
      case SCENARIO_KEYS.VICTORY:
        setGameState(createVictoryScenario());
        break;
      case SCENARIO_KEYS.DEFEAT:
        setGameState(createDefeatScenario());
        break;
      default:
        setGameState(createPlayerTurnScenario());
    }
  }, []);

  // Allocation countdown timer simulation if in allocation phase
  useEffect(() => {
    if (gameState.phase !== 'ALLOCATION' || gameState.allocation.countdownSeconds <= 0) return;
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.phase !== 'ALLOCATION') return prev;
        const nextSec = prev.allocation.countdownSeconds - 1;
        if (nextSec <= 0) {
          // Auto confirm
          return {
            ...createPlayerTurnScenario(),
            activeStatusBanner: 'Allocation timer elapsed — Portfolio locked in. Game begun!'
          };
        }
        return {
          ...prev,
          allocation: {
            ...prev.allocation,
            countdownSeconds: nextSec
          }
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.phase, gameState.allocation?.countdownSeconds]);

  // Dispatch Action Handler
  const dispatch = useCallback((action) => {
    console.log('[Engine Action Dispatched]:', action);

    setGameState(prev => {
      switch (action.type) {
        case ACTION_TYPES.SET_ALLOCATION: {
          const { propertyId, amount } = action;
          const currentTotal = Object.entries(prev.allocation.allocations).reduce(
            (sum, [id, val]) => (id === propertyId ? sum : sum + val),
            0
          );
          const maxAllowed = prev.allocation.initialCashPool - currentTotal;
          const clampedAmount = Math.max(0, Math.min(amount, maxAllowed));
          
          const newAllocations = {
            ...prev.allocation.allocations,
            [propertyId]: clampedAmount
          };
          const totalAllocated = Object.values(newAllocations).reduce((a, b) => a + b, 0);
          const remainingCash = prev.allocation.initialCashPool - totalAllocated;

          return {
            ...prev,
            allocation: {
              ...prev.allocation,
              allocations: newAllocations,
              remainingCash
            },
            portfolio: {
              ...prev.portfolio,
              PLAYER: {
                ...prev.portfolio.PLAYER,
                liquidCash: remainingCash,
                propertyEquity: totalAllocated,
                totalNetWorth: prev.allocation.initialCashPool
              }
            }
          };
        }

        case ACTION_TYPES.CONFIRM_ALLOCATION: {
          return {
            ...createPlayerTurnScenario(),
            activeStatusBanner: 'Capital deployed successfully. Checkers tactical phase started.'
          };
        }

        case ACTION_TYPES.SELECT_SQUARE: {
          const [row, col] = action.coordinate || [];
          if (row === undefined || col === undefined) {
            // Deselect
            const cleanBoard = prev.board.map(r => r.map(sq => ({
              ...sq,
              isHighlighted: false,
              isLegalMoveTarget: false,
              isLegalCaptureTarget: false
            })));
            return {
              ...prev,
              selectedSquare: null,
              legalActions: [],
              board: cleanBoard
            };
          }

          const targetSquare = prev.board[row][col];
          const hasPlayerPiece = targetSquare.piece && targetSquare.piece.owner === 'PLAYER';

          if (!hasPlayerPiece) return prev;

          // Highlight selected square
          const updatedBoard = prev.board.map((r, rIdx) => r.map((sq, cIdx) => {
            const isTarget = rIdx === row && cIdx === col;
            return {
              ...sq,
              isHighlighted: isTarget,
              piece: sq.piece ? { ...sq.piece, isSelected: isTarget } : null
            };
          }));

          return {
            ...prev,
            selectedSquare: [row, col],
            board: updatedBoard
          };
        }

        case ACTION_TYPES.EXECUTE_MOVE:
        case ACTION_TYPES.EXECUTE_CAPTURE: {
          const { from, to } = action;
          const isCapture = action.type === ACTION_TYPES.EXECUTE_CAPTURE;
          const [fromR, fromC] = from;
          const [toR, toC] = to;

          const newBoard = prev.board.map(r => r.map(sq => ({ ...sq })));
          const movingPiece = newBoard[fromR][fromC].piece;
          
          if (movingPiece) {
            newBoard[fromR][fromC].piece = null;
            newBoard[fromR][fromC].isLastMoveSource = true;
            newBoard[toR][toC].piece = {
              ...movingPiece,
              position: [toR, toC],
              isSelected: false
            };
            newBoard[toR][toC].isLastMoveTarget = true;
          }

          // If capture, remove captured piece
          if (isCapture && action.captureTarget) {
            const [capR, capC] = action.captureTarget;
            newBoard[capR][capC].piece = null;
          }

          // Clear highlights
          const clearedBoard = newBoard.map(r => r.map(sq => ({
            ...sq,
            isHighlighted: false,
            isLegalMoveTarget: false,
            isLegalCaptureTarget: false
          })));

          const newLog = {
            id: String(Date.now()),
            text: isCapture 
              ? `Turn ${prev.turnNumber}: You captured Computer piece at ${prev.board[toR][toC].algebraic} (+₹250 Bounty)!`
              : `Turn ${prev.turnNumber}: You moved checker to ${prev.board[toR][toC].algebraic}`,
            type: isCapture ? 'capture' : 'move',
            timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
          };

          return {
            ...prev,
            currentTurn: 'COMPUTER',
            isInputLocked: true,
            activeStatusBanner: 'Computer Thinking... Analyzing tactical moves.',
            selectedSquare: null,
            legalActions: [],
            board: clearedBoard,
            actionHistory: [newLog, ...prev.actionHistory]
          };
        }

        case ACTION_TYPES.INVEST_PROPERTY: {
          const { propertyId, amount } = action;
          const updatedProps = prev.properties.map(p => {
            if (p.id === propertyId) {
              const newLevel = Math.min(5, p.level + 1);
              const newVal = p.currentValue + amount;
              return {
                ...p,
                level: newLevel,
                currentValue: newVal,
                currentInvestment: p.currentInvestment + amount,
                rentalYieldRate: p.rentalYieldRate + p.nextYieldBoost,
                rentalIncomePerTurn: Math.round(newVal * ((p.rentalYieldRate + p.nextYieldBoost) / 100))
              };
            }
            return p;
          });

          const newPlayerCash = Math.max(0, prev.portfolio.PLAYER.liquidCash - amount);
          const newPlayerEquity = updatedProps
            .filter(p => p.owner === 'PLAYER')
            .reduce((sum, p) => sum + p.currentValue, 0);

          const log = {
            id: String(Date.now()),
            text: `Upgraded ${updatedProps.find(p => p.id === propertyId)?.name} (-₹${amount.toLocaleString()})`,
            type: 'investment',
            timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
          };

          return {
            ...prev,
            properties: updatedProps,
            portfolio: {
              ...prev.portfolio,
              PLAYER: {
                ...prev.portfolio.PLAYER,
                liquidCash: newPlayerCash,
                propertyEquity: newPlayerEquity,
                totalNetWorth: newPlayerCash + newPlayerEquity
              }
            },
            actionHistory: [log, ...prev.actionHistory]
          };
        }

        case ACTION_TYPES.SELL_PROPERTY: {
          const { propertyId } = action;
          const targetProp = prev.properties.find(p => p.id === propertyId);
          if (!targetProp) return prev;

          const payout = targetProp.liquidationValue;
          const updatedProps = prev.properties.map(p => {
            if (p.id === propertyId) {
              return { ...p, owner: null, currentInvestment: 0 };
            }
            return p;
          });

          const newPlayerCash = prev.portfolio.PLAYER.liquidCash + payout;
          const newPlayerEquity = updatedProps
            .filter(p => p.owner === 'PLAYER')
            .reduce((sum, p) => sum + p.currentValue, 0);

          const log = {
            id: String(Date.now()),
            text: `Liquidated ${targetProp.name} (+₹${payout.toLocaleString()})`,
            type: 'sale',
            timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
          };

          return {
            ...prev,
            properties: updatedProps,
            portfolio: {
              ...prev.portfolio,
              PLAYER: {
                ...prev.portfolio.PLAYER,
                liquidCash: newPlayerCash,
                propertyEquity: newPlayerEquity,
                totalNetWorth: newPlayerCash + newPlayerEquity
              }
            },
            actionHistory: [log, ...prev.actionHistory]
          };
        }

        case ACTION_TYPES.SET_DIFFICULTY: {
          return {
            ...prev,
            difficulty: action.difficulty
          };
        }

        case ACTION_TYPES.RESTART_GAME:
        case ACTION_TYPES.NEW_GAME: {
          return {
            ...SCENARIO_ALLOCATION,
            allocation: {
              ...SCENARIO_ALLOCATION.allocation,
              countdownSeconds: 45
            }
          };
        }

        default:
          return prev;
      }
    });
  }, []);

  return {
    gameState,
    dispatch,
    activeScenarioKey,
    switchScenario
  };
}
