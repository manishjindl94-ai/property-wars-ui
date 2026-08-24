import React from 'react';
import { User, Cpu, AlertCircle, Sparkles } from 'lucide-react';

export function TurnBanner({ gameState }) {
  const { currentTurn, isInputLocked, activeStatusBanner, phase } = gameState;
  const isPlayer = currentTurn === 'PLAYER';

  if (phase !== 'PLAYING') return null;

  return (
    <div 
      className="glass-panel w-full"
      style={{
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: isPlayer ? '4px solid var(--player-primary)' : '4px solid var(--comp-primary)',
        background: isPlayer ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 28, 46, 0.6) 100%)' : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(20, 28, 46, 0.6) 100%)'
      }}
      id="turn-status-banner"
    >
      <div className="flex items-center gap-3">
        <div 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isPlayer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: isPlayer ? 'var(--player-primary)' : 'var(--comp-primary)'
          }}
        >
          {isPlayer ? <User size={18} /> : <Cpu size={18} />}
        </div>
        <div>
          <div className="font-display font-bold text-sm tracking-wide flex items-center gap-2">
            <span>{isPlayer ? 'YOUR TACTICAL PHASE' : 'COMPUTER COMPUTATION IN PROGRESS'}</span>
            {isInputLocked && (
              <span className="pill-badge ruby text-xs">
                BOARD LOCKED
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-normal">
            {activeStatusBanner || (isPlayer ? 'Select your checker piece to reveal verified movement and capture corridors.' : 'Rival algorithm evaluating checkers jumps and yield investments...')}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-400">
        <Sparkles size={14} className="text-amber-400" />
        <span>Authoritative Engine Controlled</span>
      </div>
    </div>
  );
}
