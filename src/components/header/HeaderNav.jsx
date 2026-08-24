import React from 'react';
import { ShieldAlert, Landmark, Sparkles, BookOpen, Settings, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '../common/Button';

export function HeaderNav({
  gameState,
  onOpenTutorial,
  onOpenDifficulty,
  onRestartGame,
  onToggleDevDrawer,
  isDevDrawerOpen
}) {
  const { phase, currentTurn, turnNumber, difficulty, isInputLocked } = gameState;
  const isPlayerTurn = currentTurn === 'PLAYER';

  return (
    <header className="header-nav" role="banner">
      <div className="header-brand">
        <div className="brand-icon-box">
          <Landmark size={24} />
        </div>
        <div>
          <div className="brand-title">
            PROPERTY <span>WARS</span>
          </div>
          <div className="brand-subtitle">
            Tactical Checkers &amp; Asset Strategy
          </div>
        </div>
      </div>

      <div className="header-center-info">
        {phase === 'PLAYING' && (
          <div className={`turn-pill ${isPlayerTurn ? 'player-turn' : 'computer-turn'}`} id="header-turn-indicator">
            <span className="pulse-dot" />
            <span>
              {isPlayerTurn ? 'YOUR TURN' : 'COMPUTER TURN'}
            </span>
            <span className="opacity-50">|</span>
            <span className="font-mono text-xs font-normal">
              ROUND {turnNumber}
            </span>
          </div>
        )}

        {phase === 'ALLOCATION' && (
          <div className="turn-pill player-turn">
            <Sparkles size={15} />
            <span>OPENING ALLOCATION</span>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="turn-pill" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <Trophy size={15} />
            <span>MATCH CONCLUDED</span>
          </div>
        )}
      </div>

      <div className="header-actions">
        <Button
          variant="secondary"
          size="sm"
          icon={BookOpen}
          onClick={onOpenTutorial}
          id="btn-open-tutorial"
        >
          Rules &amp; Guide
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={Settings}
          onClick={onOpenDifficulty}
          id="btn-open-difficulty"
        >
          <span className="font-mono text-xs text-amber-400">{difficulty}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={RefreshCw}
          onClick={onRestartGame}
          id="btn-restart-game"
          title="Reset Match"
        >
          Restart
        </Button>

        <Button
          variant={isDevDrawerOpen ? 'gold' : 'secondary'}
          size="sm"
          icon={ShieldAlert}
          onClick={onToggleDevDrawer}
          id="btn-dev-scenarios"
        >
          Demo Scenarios
        </Button>
      </div>
    </header>
  );
}
