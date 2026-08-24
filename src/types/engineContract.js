/**
 * @file engineContract.js
 * @description Master specification and interface definitions for Property Wars.
 * 
 * ARCHITECTURAL CONTRACT:
 * - The UI is strictly a presentation layer.
 * - The UI reads `gameState` and dispatches `actions`.
 * - The external Game Engine is the authoritative owner of all rules, movement validations,
 *   capture mechanics, property arithmetic, rent accruals, and AI behavior.
 */

/**
 * @typedef {'ALLOCATION' | 'PLAYING' | 'GAME_OVER'} GamePhase
 * @typedef {'PLAYER' | 'COMPUTER'} TurnOwner
 * @typedef {'REGULAR' | 'KING'} PieceType
 * @typedef {'LIGHT' | 'DARK'} SquareColor
 * @typedef {'TECH' | 'COMMERCIAL' | 'LUXURY' | 'LOGISTICS'} PropertyCategory
 * @typedef {'LOW' | 'MEDIUM' | 'HIGH' | 'SPECULATIVE'} RiskLevel
 * @typedef {'EASY' | 'MEDIUM' | 'HARD' | 'WARREN_BUFFETT'} DifficultyLevel
 * 
 * @typedef {[number, number]} Coordinate // [row, col] where 0 <= row <= 7, 0 <= col <= 7
 * 
 * @typedef {Object} CheckersPiece
 * @property {string} id - Unique identifier for the piece (e.g., 'p-1', 'c-4')
 * @property {TurnOwner} owner - Player or Computer
 * @property {PieceType} type - Regular piece or promoted King
 * @property {Coordinate} position - Current [row, col] on the 8x8 grid
 * @property {boolean} isSelected - Whether UI currently has this piece selected
 * @property {boolean} hasCaptureAvailable - Whether this piece has an active capture opportunity
 * 
 * @typedef {Object} Property
 * @property {string} id - Unique property ID (e.g., 'prop-tech-hub', 'prop-downtown')
 * @property {string} name - Display name (e.g., 'Cyber Valley Tower', 'Metro Central Plaza')
 * @property {Coordinate} coordinate - Coordinate on the 8x8 checkers board
 * @property {PropertyCategory} category - Property asset category
 * @property {string} icon - Icon identifier
 * @property {number} baseValue - Baseline valuation in INR (₹)
 * @property {number} currentValue - Current dynamic valuation in INR (₹)
 * @property {number} currentInvestment - Total capital invested into upgrades
 * @property {number} level - Current upgrade level (1 to 5)
 * @property {number} rentalYieldRate - Rental yield per turn (% of current value)
 * @property {number} rentalIncomePerTurn - Absolute rental income in INR (₹) per turn
 * @property {RiskLevel} risk - Risk volatility rating
 * @property {TurnOwner | null} owner - Current owner ('PLAYER', 'COMPUTER', or null if unowned)
 * @property {string} description - Lore & strategic description
 * @property {number} upgradeCost - Cost required to advance to next upgrade level
 * @property {number} nextYieldBoost - Additional yield gain on next upgrade
 * @property {number} liquidationValue - Immediate cash payout if sold (e.g., 85% of valuation)
 * 
 * @typedef {Object} BoardSquare
 * @property {Coordinate} coordinate - [row, col]
 * @property {SquareColor} color - 'LIGHT' or 'DARK'
 * @property {string} algebraic - e.g., 'E4', 'A1', 'H8'
 * @property {CheckersPiece | null} piece - Piece occupying square, if any
 * @property {Property | null} property - Property tied to this square, if any
 * @property {boolean} isHighlighted - Highlighted for selection or target
 * @property {boolean} isLegalMoveTarget - Whether the currently selected piece can legally move here
 * @property {boolean} isLegalCaptureTarget - Whether the selected piece can capture an opponent here
 * @property {boolean} isLastMoveSource - Square where the most recent move originated
 * @property {boolean} isLastMoveTarget - Square where the most recent move landed
 * 
 * @typedef {Object} LegalAction
 * @property {'MOVE' | 'CAPTURE' | 'CHAIN_CAPTURE'} type
 * @property {Coordinate} from
 * @property {Coordinate} to
 * @property {Coordinate} [captureTarget] - Coordinate of opponent piece being captured
 * 
 * @typedef {Object} PortfolioMetrics
 * @property {number} liquidCash - Readily available cash in INR (₹)
 * @property {number} propertyEquity - Total valuation of all owned properties in INR (₹)
 * @property {number} totalNetWorth - liquidCash + propertyEquity
 * @property {number} passiveIncomePerTurn - Sum of all rental income generated per turn in INR (₹)
 * @property {number} piecesCount - Number of active pieces remaining on board
 * @property {number} kingsCount - Number of active kings remaining
 * 
 * @typedef {Object} AllocationState
 * @property {number} initialCashPool - Total starting cash (e.g. ₹10,000)
 * @property {number} remainingCash - Unallocated liquid cash remaining
 * @property {Record<string, number>} allocations - Map of propertyId -> allocated cash amount
 * @property {number} countdownSeconds - Time remaining before auto-confirmation
 * @property {boolean} isConfirmed - Whether player has locked in allocation
 * 
 * @typedef {Object} ActionLogEntry
 * @property {string} id
 * @property {string} text
 * @property {'move' | 'capture' | 'investment' | 'sale' | 'turn' | 'system' | 'dividend'} type
 * @property {string} timestamp
 * @property {TurnOwner} [author]
 * 
 * @typedef {Object} GameState
 * @property {GamePhase} phase - 'ALLOCATION' | 'PLAYING' | 'GAME_OVER'
 * @property {TurnOwner} currentTurn - Authoritative turn owner ('PLAYER' | 'COMPUTER')
 * @property {number} turnNumber - Turn counter
 * @property {boolean} isInputLocked - True when Computer is calculating or animations are playing
 * @property {DifficultyLevel} difficulty - AI difficulty setting
 * @property {AllocationState} allocation - State for Opening Cash Allocation phase
 * @property {BoardSquare[][]} board - 8x8 Board matrix [row][col]
 * @property {Property[]} properties - All properties defined in the game
 * @property {Record<TurnOwner, PortfolioMetrics>} portfolio - Financial metrics for Player and Computer
 * @property {Coordinate | null} selectedSquare - Currently selected square coordinates
 * @property {LegalAction[]} legalActions - Authoritative legal moves/captures calculated by engine
 * @property {ActionLogEntry[]} actionHistory - Feed of recent game actions & events
 * @property {TurnOwner | 'DRAW' | null} winner - Authoritative outcome when phase is GAME_OVER
 * @property {string | null} winReason - Strategic explanation for game over
 * @property {string | null} activeStatusBanner - Optional message shown in HUD (e.g. "Chain Capture Available!")
 */

/**
 * Standard Engine Action Dispatches supported by the UI:
 * 
 * @example
 * dispatch({ type: 'SET_ALLOCATION', propertyId: 'prop-tech-hub', amount: 2500 });
 * dispatch({ type: 'CONFIRM_ALLOCATION' });
 * dispatch({ type: 'SELECT_SQUARE', coordinate: [2, 3] });
 * dispatch({ type: 'EXECUTE_MOVE', from: [2, 3], to: [3, 4] });
 * dispatch({ type: 'EXECUTE_CAPTURE', from: [2, 3], to: [4, 5] });
 * dispatch({ type: 'INVEST_PROPERTY', propertyId: 'prop-tech-hub', amount: 1000 });
 * dispatch({ type: 'SELL_PROPERTY', propertyId: 'prop-tech-hub' });
 * dispatch({ type: 'SET_DIFFICULTY', difficulty: 'HARD' });
 * dispatch({ type: 'RESTART_GAME' });
 * dispatch({ type: 'NEW_GAME' });
 */

export const ACTION_TYPES = {
  SET_ALLOCATION: 'SET_ALLOCATION',
  CONFIRM_ALLOCATION: 'CONFIRM_ALLOCATION',
  SELECT_SQUARE: 'SELECT_SQUARE',
  EXECUTE_MOVE: 'EXECUTE_MOVE',
  EXECUTE_CAPTURE: 'EXECUTE_CAPTURE',
  INVEST_PROPERTY: 'INVEST_PROPERTY',
  SELL_PROPERTY: 'SELL_PROPERTY',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  RESTART_GAME: 'RESTART_GAME',
  NEW_GAME: 'NEW_GAME',
  DESELECT: 'DESELECT',
  TOGGLE_DEV_STATE: 'TOGGLE_DEV_STATE'
};
