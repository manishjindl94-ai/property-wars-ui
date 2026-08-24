import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CurrencyText } from '../common/CurrencyText';
import { Trophy, Skull, RotateCcw, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACTION_TYPES } from '../../types/engineContract';

export function GameOverModal({
  isOpen,
  gameState,
  dispatch,
  onOpenDifficulty
}) {
  const { winner, winReason, portfolio } = gameState;
  const isPlayerWinner = winner === 'PLAYER';

  useEffect(() => {
    if (isOpen && isPlayerWinner) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback if confetti canvas fails
      }
    }
  }, [isOpen, isPlayerWinner]);

  if (!isOpen) return null;

  const playerStats = portfolio.PLAYER || { totalNetWorth: 0, liquidCash: 0, propertyEquity: 0, piecesCount: 0 };
  const computerStats = portfolio.COMPUTER || { totalNetWorth: 0, liquidCash: 0, propertyEquity: 0, piecesCount: 0 };

  const handlePlayAgain = () => {
    dispatch({ type: ACTION_TYPES.NEW_GAME });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={null} // Force explicit restart or difficulty action
      title={isPlayerWinner ? 'Victory — Real Estate Mogul' : 'Match Defeat — Bankruptcy'}
      icon={isPlayerWinner ? Trophy : Skull}
      id="modal-game-over"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onOpenDifficulty}
            id="btn-gameover-difficulty"
          >
            Change Difficulty
          </Button>
          <Button
            variant={isPlayerWinner ? 'primary' : 'gold'}
            icon={RotateCcw}
            onClick={handlePlayAgain}
            id="btn-gameover-replay"
          >
            Start New Campaign
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-center">
        {/* Outcome Badge */}
        <div 
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: isPlayerWinner ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 28, 46, 0.8) 100%)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(20, 28, 46, 0.8) 100%)',
            border: isPlayerWinner ? '1px solid var(--border-glow-emerald)' : '1px solid var(--border-glow-ruby)'
          }}
        >
          <div className="text-4xl mb-2">
            {isPlayerWinner ? '🏆' : '💀'}
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {isPlayerWinner ? 'Tactical & Financial Supremacy' : 'Capital Depleted'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            {winReason || (isPlayerWinner ? 'You dominated both the checkers grid and real estate market.' : 'Your reserves were exhausted and pieces captured.')}
          </p>
        </div>

        {/* Financial Comparison Summary Table */}
        <div 
          style={{
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid var(--border-subtle)'
          }}
          className="text-left space-y-2.5"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
            Final Match Analytics
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono border-b border-slate-700 pb-2">
            <span className="text-slate-400">Metric</span>
            <span className="text-emerald-400 font-bold text-right">Player</span>
            <span className="text-red-400 font-bold text-right">Computer</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <span className="text-slate-300">Final Net Worth</span>
            <span className="text-emerald-400 font-bold text-right"><CurrencyText amount={playerStats.totalNetWorth} /></span>
            <span className="text-red-400 font-bold text-right"><CurrencyText amount={computerStats.totalNetWorth} /></span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <span className="text-slate-300">Liquid Cash</span>
            <span className="text-slate-200 text-right"><CurrencyText amount={playerStats.liquidCash} /></span>
            <span className="text-slate-200 text-right"><CurrencyText amount={computerStats.liquidCash} /></span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <span className="text-slate-300">Property Equity</span>
            <span className="text-amber-400 text-right"><CurrencyText amount={playerStats.propertyEquity} /></span>
            <span className="text-amber-400 text-right"><CurrencyText amount={computerStats.propertyEquity} /></span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <span className="text-slate-300">Active Pieces Left</span>
            <span className="text-slate-200 text-right">{playerStats.piecesCount}</span>
            <span className="text-slate-200 text-right">{computerStats.piecesCount}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
