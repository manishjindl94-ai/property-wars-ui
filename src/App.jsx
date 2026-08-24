import React, { useState } from 'react';
import { useMockEngineHarness, SCENARIO_KEYS } from './mock/mockHarness';
import { HeaderNav } from './components/header/HeaderNav';
import { TurnBanner } from './components/header/TurnBanner';
import { AllocationScreen } from './components/allocation/AllocationScreen';
import { CheckersBoard } from './components/board/CheckersBoard';
import { FinancialDashboard } from './components/financial/FinancialDashboard';
import { ActionLogFeed } from './components/financial/ActionLogFeed';
import { GameOverModal } from './components/modals/GameOverModal';
import { DifficultyModal } from './components/modals/DifficultyModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { PropertyDetailModal } from './components/modals/PropertyDetailModal';
import { InvestModal } from './components/financial/InvestModal';
import { SellModal } from './components/financial/SellModal';
import { DevScenarioDrawer } from './components/dev/DevScenarioDrawer';
import { ACTION_TYPES } from './types/engineContract';
import { Landmark, ShieldAlert, Cpu, Sparkles, Building2 } from 'lucide-react';
import { Button } from './components/common/Button';

export function App() {
  const { gameState, dispatch, activeScenarioKey, switchScenario } = useMockEngineHarness();

  // Modal Visibility State
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState(false);
  const [inspectedProperty, setInspectedProperty] = useState(null);
  const [investTargetProperty, setInvestTargetProperty] = useState(null);
  const [sellTargetProperty, setSellTargetProperty] = useState(null);

  const { phase, portfolio, board, properties, selectedSquare, legalActions, isInputLocked, actionHistory } = gameState;

  return (
    <div className="app-container">
      {/* 1. Header Navigation Bar */}
      <HeaderNav
        gameState={gameState}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenDifficulty={() => setIsDifficultyOpen(true)}
        onRestartGame={() => dispatch({ type: ACTION_TYPES.RESTART_GAME })}
        onToggleDevDrawer={() => setIsDevDrawerOpen(prev => !prev)}
        isDevDrawerOpen={isDevDrawerOpen}
      />

      {/* 2. Opening Cash Allocation Screen */}
      {phase === 'ALLOCATION' && (
        <main className="w-full flex-1 flex flex-col justify-center">
          <AllocationScreen gameState={gameState} dispatch={dispatch} />
        </main>
      )}

      {/* 3. Main Gameplay Grid (Board + Dashboard + Activity Feed) */}
      {(phase === 'PLAYING' || phase === 'GAME_OVER') && (
        <main className="w-full flex-1 space-y-4">
          <TurnBanner gameState={gameState} />

          <div className="game-grid-layout">
            {/* Left Column: Player Financial Portfolio Dashboard */}
            <aside aria-label="Player Financial Portfolio">
              <FinancialDashboard
                portfolio={portfolio}
                properties={properties}
                onSelectProperty={(prop) => setInspectedProperty(prop)}
                onInvest={(prop) => setInvestTargetProperty(prop)}
                onSell={(prop) => setSellTargetProperty(prop)}
                isLocked={isInputLocked}
              />
            </aside>

            {/* Center Column: 8x8 Tactical Checkers Board */}
            <section className="center-stage" aria-label="Game Board">
              <CheckersBoard
                board={board}
                selectedSquare={selectedSquare}
                legalActions={legalActions}
                isInputLocked={isInputLocked}
                dispatch={dispatch}
                onInspectProperty={(prop) => setInspectedProperty(prop)}
              />

              {/* Bottom Quick Help Bar */}
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Player Piece
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  Computer Piece
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Crown: King Promoted
                </span>
              </div>
            </section>

            {/* Right Column: Live Match Events & Strategic Quick Actions */}
            <aside className="flex flex-col gap-3" aria-label="Action Logs and Actions">
              {/* Quick Actions Panel */}
              <div className="glass-panel p-4 flex flex-col gap-2.5">
                <div className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Financial Action Center</span>
                </div>
                <div className="text-xs text-slate-400">
                  Select an owned property from the left panel to invest development capital or execute emergency liquidation.
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => {
                      const firstOwned = properties.find(p => p.owner === 'PLAYER');
                      if (firstOwned) setInvestTargetProperty(firstOwned);
                    }}
                    disabled={isInputLocked || !properties.some(p => p.owner === 'PLAYER')}
                    id="btn-quick-invest"
                  >
                    Upgrade Asset
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const firstOwned = properties.find(p => p.owner === 'PLAYER');
                      if (firstOwned) setSellTargetProperty(firstOwned);
                    }}
                    disabled={isInputLocked || !properties.some(p => p.owner === 'PLAYER')}
                    id="btn-quick-sell"
                  >
                    Liquidate
                  </Button>
                </div>
              </div>

              {/* Match Activity Log Feed */}
              <ActionLogFeed actionHistory={actionHistory} />
            </aside>
          </div>
        </main>
      )}

      {/* =========================================================================
          MODALS & OVERLAYS
          ========================================================================= */}
      
      {/* Game Over Modal */}
      <GameOverModal
        isOpen={phase === 'GAME_OVER'}
        gameState={gameState}
        dispatch={dispatch}
        onOpenDifficulty={() => setIsDifficultyOpen(true)}
      />

      {/* Difficulty Settings Modal */}
      <DifficultyModal
        isOpen={isDifficultyOpen}
        onClose={() => setIsDifficultyOpen(false)}
        currentDifficulty={gameState.difficulty}
        dispatch={dispatch}
      />

      {/* Rules & Tutorial Guide Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* Property Deep Inspection Modal */}
      <PropertyDetailModal
        isOpen={!!inspectedProperty}
        onClose={() => setInspectedProperty(null)}
        property={inspectedProperty}
        onOpenInvest={(prop) => setInvestTargetProperty(prop)}
        onOpenSell={(prop) => setSellTargetProperty(prop)}
        isLocked={isInputLocked}
      />

      {/* Invest / Upgrade Modal */}
      <InvestModal
        isOpen={!!investTargetProperty}
        onClose={() => setInvestTargetProperty(null)}
        property={investTargetProperty}
        playerLiquidCash={portfolio.PLAYER?.liquidCash || 0}
        dispatch={dispatch}
      />

      {/* Sell / Liquidation Modal */}
      <SellModal
        isOpen={!!sellTargetProperty}
        onClose={() => setSellTargetProperty(null)}
        property={sellTargetProperty}
        dispatch={dispatch}
      />

      {/* Dev Scenario Switcher Drawer */}
      <DevScenarioDrawer
        isOpen={isDevDrawerOpen}
        onClose={() => setIsDevDrawerOpen(false)}
        activeScenarioKey={activeScenarioKey}
        onSelectScenario={(scenarioKey) => {
          switchScenario(scenarioKey);
          setIsDevDrawerOpen(false);
        }}
      />
    </div>
  );
}

export default App;
