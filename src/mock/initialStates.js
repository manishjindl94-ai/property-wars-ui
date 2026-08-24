/**
 * @file initialStates.js
 * @description Isolated test states for demonstrating Property Wars UI.
 * 
 * NOTE: These are strictly presentation fixtures. The real game engine
 * will supply state snapshots via the future engine adapter.
 */

export const INITIAL_PROPERTIES = [
  {
    id: 'prop-tech-1',
    name: 'Cyber Valley Tech Park',
    coordinate: [2, 1], // row 2, col 1 (Dark square C3)
    category: 'TECH',
    icon: 'Cpu',
    baseValue: 4000,
    currentValue: 4500,
    currentInvestment: 1200,
    level: 2,
    rentalYieldRate: 7.5,
    rentalIncomePerTurn: 337,
    risk: 'MEDIUM',
    owner: 'PLAYER',
    description: 'High-growth AI research hub providing consistent tech dividend yields.',
    upgradeCost: 1500,
    nextYieldBoost: 2.0,
    liquidationValue: 3825
  },
  {
    id: 'prop-comm-1',
    name: 'Metro Central Plaza',
    coordinate: [5, 4], // row 5, col 4 (Dark square F5)
    category: 'COMMERCIAL',
    icon: 'Building2',
    baseValue: 3500,
    currentValue: 4000,
    currentInvestment: 800,
    level: 1,
    rentalYieldRate: 8.5,
    rentalIncomePerTurn: 340,
    risk: 'LOW',
    owner: 'PLAYER',
    description: 'Prime downtown retail and office spaces with solid recurring tenant rent.',
    upgradeCost: 1200,
    nextYieldBoost: 2.5,
    liquidationValue: 3400
  },
  {
    id: 'prop-lux-1',
    name: 'Grand Riviera Towers',
    coordinate: [3, 6], // row 3, col 6 (Dark square D7)
    category: 'LUXURY',
    icon: 'Gem',
    baseValue: 5000,
    currentValue: 5800,
    currentInvestment: 2000,
    level: 3,
    rentalYieldRate: 10.0,
    rentalIncomePerTurn: 580,
    risk: 'HIGH',
    owner: 'COMPUTER',
    description: 'Ultra-luxury waterfront penthouses with steep capital appreciation.',
    upgradeCost: 2500,
    nextYieldBoost: 3.5,
    liquidationValue: 4930
  },
  {
    id: 'prop-log-1',
    name: 'Global Gateway Logistics',
    coordinate: [4, 3], // row 4, col 3 (Dark square E4)
    category: 'LOGISTICS',
    icon: 'Container',
    baseValue: 4500,
    currentValue: 4500,
    currentInvestment: 0,
    level: 1,
    rentalYieldRate: 6.5,
    rentalIncomePerTurn: 292,
    risk: 'LOW',
    owner: null, // Unowned / Neutral
    description: 'Container hub connecting trade networks across the metropolitan grid.',
    upgradeCost: 1000,
    nextYieldBoost: 1.8,
    liquidationValue: 3825
  }
];

/**
 * Creates an empty 8x8 checkers board matrix with standard square coloring and algebraic notation.
 */
export function createBaseBoard(properties = INITIAL_PROPERTIES) {
  const board = [];
  const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (let r = 0; r < 8; r++) {
    const row = [];
    for (let c = 0; c < 8; c++) {
      const isDark = (r + c) % 2 === 1;
      const algebraic = `${colLetters[c]}${8 - r}`;
      const propOnSquare = properties.find(p => p.coordinate[0] === r && p.coordinate[1] === c) || null;

      row.push({
        coordinate: [r, c],
        color: isDark ? 'DARK' : 'LIGHT',
        algebraic,
        piece: null,
        property: propOnSquare,
        isHighlighted: false,
        isLegalMoveTarget: false,
        isLegalCaptureTarget: false,
        isLastMoveSource: false,
        isLastMoveTarget: false
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Scenario 1: Opening Allocation Screen (₹10,000 Pool)
 */
export const SCENARIO_ALLOCATION = {
  phase: 'ALLOCATION',
  currentTurn: 'PLAYER',
  turnNumber: 0,
  isInputLocked: false,
  difficulty: 'MEDIUM',
  activeStatusBanner: 'Opening Cash Allocation Phase — Allocate your starting capital (₹10,000) to acquire real estate stakes before board deployment.',
  allocation: {
    initialCashPool: 10000,
    remainingCash: 3500,
    allocations: {
      'prop-tech-1': 3000,
      'prop-comm-1': 2000,
      'prop-lux-1': 1500,
      'prop-log-1': 0
    },
    countdownSeconds: 42,
    isConfirmed: false
  },
  board: createBaseBoard(),
  properties: INITIAL_PROPERTIES,
  portfolio: {
    PLAYER: {
      liquidCash: 3500,
      propertyEquity: 6500,
      totalNetWorth: 10000,
      passiveIncomePerTurn: 420,
      piecesCount: 12,
      kingsCount: 0
    },
    COMPUTER: {
      liquidCash: 4000,
      propertyEquity: 6000,
      totalNetWorth: 10000,
      passiveIncomePerTurn: 380,
      piecesCount: 12,
      kingsCount: 0
    }
  },
  selectedSquare: null,
  legalActions: [],
  actionHistory: [
    { id: '1', text: 'Game Initialized: Opening Allocation phase active.', type: 'system', timestamp: '00:01' },
    { id: '2', text: 'You allocated ₹3,000 to Cyber Valley Tech Park.', type: 'investment', timestamp: '00:15' },
    { id: '3', text: 'You allocated ₹2,000 to Metro Central Plaza.', type: 'investment', timestamp: '00:22' }
  ],
  winner: null,
  winReason: null
};

/**
 * Scenario 2: Active Playing — Player's Turn with Selected Piece & Legal Highlights
 */
export function createPlayerTurnScenario() {
  const board = createBaseBoard(INITIAL_PROPERTIES);

  // Place Computer pieces (rows 0, 1, 2)
  board[0][1].piece = { id: 'c-1', owner: 'COMPUTER', type: 'REGULAR', position: [0, 1], isSelected: false, hasCaptureAvailable: false };
  board[0][3].piece = { id: 'c-2', owner: 'COMPUTER', type: 'KING', position: [0, 3], isSelected: false, hasCaptureAvailable: false };
  board[0][5].piece = { id: 'c-3', owner: 'COMPUTER', type: 'REGULAR', position: [0, 5], isSelected: false, hasCaptureAvailable: false };
  board[0][7].piece = { id: 'c-4', owner: 'COMPUTER', type: 'REGULAR', position: [0, 7], isSelected: false, hasCaptureAvailable: false };
  board[1][0].piece = { id: 'c-5', owner: 'COMPUTER', type: 'REGULAR', position: [1, 0], isSelected: false, hasCaptureAvailable: false };
  board[1][2].piece = { id: 'c-6', owner: 'COMPUTER', type: 'REGULAR', position: [1, 2], isSelected: false, hasCaptureAvailable: false };
  board[1][6].piece = { id: 'c-7', owner: 'COMPUTER', type: 'REGULAR', position: [1, 6], isSelected: false, hasCaptureAvailable: false };
  board[2][5].piece = { id: 'c-8', owner: 'COMPUTER', type: 'REGULAR', position: [2, 5], isSelected: false, hasCaptureAvailable: false };
  // Threat piece positioned for capture demonstration
  board[4][3].piece = { id: 'c-9', owner: 'COMPUTER', type: 'REGULAR', position: [4, 3], isSelected: false, hasCaptureAvailable: false };

  // Place Player pieces (rows 5, 6, 7)
  board[7][0].piece = { id: 'p-1', owner: 'PLAYER', type: 'REGULAR', position: [7, 0], isSelected: false, hasCaptureAvailable: false };
  board[7][2].piece = { id: 'p-2', owner: 'PLAYER', type: 'REGULAR', position: [7, 2], isSelected: false, hasCaptureAvailable: false };
  board[7][4].piece = { id: 'p-3', owner: 'PLAYER', type: 'REGULAR', position: [7, 4], isSelected: false, hasCaptureAvailable: false };
  board[7][6].piece = { id: 'p-4', owner: 'PLAYER', type: 'REGULAR', position: [7, 6], isSelected: false, hasCaptureAvailable: false };
  board[6][1].piece = { id: 'p-5', owner: 'PLAYER', type: 'KING', position: [6, 1], isSelected: false, hasCaptureAvailable: false };
  board[6][5].piece = { id: 'p-6', owner: 'PLAYER', type: 'REGULAR', position: [6, 5], isSelected: false, hasCaptureAvailable: false };
  board[6][7].piece = { id: 'p-7', owner: 'PLAYER', type: 'REGULAR', position: [6, 7], isSelected: false, hasCaptureAvailable: false };
  
  // Selected piece at [5, 2]
  board[5][2].piece = { id: 'p-8', owner: 'PLAYER', type: 'REGULAR', position: [5, 2], isSelected: true, hasCaptureAvailable: true };
  board[5][2].isHighlighted = true;

  // Move targets
  board[4][1].isLegalMoveTarget = true;
  // Capture target jumping over [4, 3] into [3, 4]
  board[3][4].isLegalCaptureTarget = true;

  return {
    phase: 'PLAYING',
    currentTurn: 'PLAYER',
    turnNumber: 5,
    isInputLocked: false,
    difficulty: 'HARD',
    activeStatusBanner: 'Your Turn: Selected Piece at C3. Valid tactical moves & capture opportunities highlighted.',
    allocation: SCENARIO_ALLOCATION.allocation,
    board,
    properties: INITIAL_PROPERTIES,
    portfolio: {
      PLAYER: {
        liquidCash: 4250,
        propertyEquity: 8500,
        totalNetWorth: 12750,
        passiveIncomePerTurn: 677,
        piecesCount: 8,
        kingsCount: 1
      },
      COMPUTER: {
        liquidCash: 3800,
        propertyEquity: 5800,
        totalNetWorth: 9600,
        passiveIncomePerTurn: 580,
        piecesCount: 9,
        kingsCount: 1
      }
    },
    selectedSquare: [5, 2],
    legalActions: [
      { type: 'MOVE', from: [5, 2], to: [4, 1] },
      { type: 'CAPTURE', from: [5, 2], to: [3, 4], captureTarget: [4, 3] }
    ],
    actionHistory: [
      { id: '1', text: 'Turn 5: Player selected checker at C3', type: 'move', timestamp: '03:14' },
      { id: '2', text: 'Turn 4: Computer moved from E7 to D6', type: 'move', timestamp: '03:02' },
      { id: '3', text: 'Turn 4: Rent collected +₹677 (Tech Park & Central Plaza)', type: 'dividend', timestamp: '03:00' },
      { id: '4', text: 'Turn 3: Player captured Computer checker at D4 (+₹250 Bounty)', type: 'capture', timestamp: '02:30' }
    ],
    winner: null,
    winReason: null
  };
}

/**
 * Scenario 3: Computer Turn (Locked UI Scrim + Thinking Scanner)
 */
export function createComputerTurnScenario() {
  const base = createPlayerTurnScenario();
  return {
    ...base,
    currentTurn: 'COMPUTER',
    isInputLocked: true,
    activeStatusBanner: 'Computer Thinking... Analyzing Board Capture Paths & Portfolio Yield Options.',
    selectedSquare: null,
    legalActions: []
  };
}

/**
 * Scenario 4: Game Over Victory
 */
export function createVictoryScenario() {
  const base = createPlayerTurnScenario();
  return {
    ...base,
    phase: 'GAME_OVER',
    winner: 'PLAYER',
    winReason: 'Decisive Victory: Computer Bankrupted and all rival pieces eliminated!',
    isInputLocked: true,
    portfolio: {
      PLAYER: {
        liquidCash: 16500,
        propertyEquity: 14300,
        totalNetWorth: 30800,
        passiveIncomePerTurn: 1250,
        piecesCount: 7,
        kingsCount: 2
      },
      COMPUTER: {
        liquidCash: 0,
        propertyEquity: 0,
        totalNetWorth: 0,
        passiveIncomePerTurn: 0,
        piecesCount: 0,
        kingsCount: 0
      }
    }
  };
}

/**
 * Scenario 5: Game Over Defeat
 */
export function createDefeatScenario() {
  const base = createPlayerTurnScenario();
  return {
    ...base,
    phase: 'GAME_OVER',
    winner: 'COMPUTER',
    winReason: 'Defeat: Player liquid reserves exhausted and pieces cornered.',
    isInputLocked: true,
    portfolio: {
      PLAYER: {
        liquidCash: 0,
        propertyEquity: 0,
        totalNetWorth: 0,
        passiveIncomePerTurn: 0,
        piecesCount: 0,
        kingsCount: 0
      },
      COMPUTER: {
        liquidCash: 18200,
        propertyEquity: 15400,
        totalNetWorth: 33600,
        passiveIncomePerTurn: 1420,
        piecesCount: 8,
        kingsCount: 3
      }
    }
  };
}
