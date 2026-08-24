import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Settings, ShieldAlert, Cpu, Sparkles, Check } from 'lucide-react';
import { ACTION_TYPES } from '../../types/engineContract';

const DIFFICULTIES = [
  {
    id: 'EASY',
    name: 'Novice Investor',
    desc: 'Lenient AI calculations. Minimal aggressive checkers captures and predictable property bidding.',
    badge: 'Relaxed Pace',
    color: 'border-emerald-500/40 text-emerald-400'
  },
  {
    id: 'MEDIUM',
    name: 'Hedge Fund Manager',
    desc: 'Balanced tactics. Actively seeks checkers double-jumps and upgrades properties systematically.',
    badge: 'Standard Match',
    color: 'border-cyan-500/40 text-cyan-400'
  },
  {
    id: 'HARD',
    name: 'Real Estate Mogul',
    desc: 'Cutthroat AI. Prioritizes king promotions, predatory liquidation buyouts, and rent blockades.',
    badge: 'High Challenge',
    color: 'border-amber-500/40 text-amber-400'
  },
  {
    id: 'WARREN_BUFFETT',
    name: 'Warren Buffett AI',
    desc: 'Masterclass Quantitative Engine. Optimal minimax checkers depth and perfect capital allocation.',
    badge: 'Grandmaster',
    color: 'border-red-500/40 text-red-400'
  }
];

export function DifficultyModal({
  isOpen,
  onClose,
  currentDifficulty = 'MEDIUM',
  dispatch
}) {
  const handleSelect = (diffId) => {
    dispatch({
      type: ACTION_TYPES.SET_DIFFICULTY,
      difficulty: diffId
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Rival AI Difficulty"
      icon={Settings}
      id="modal-difficulty"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-slate-300">
          Difficulty alters both the checkers engine depth and real estate auction aggression.
        </p>

        <div className="space-y-2">
          {DIFFICULTIES.map(diff => {
            const isSelected = currentDifficulty === diff.id;

            return (
              <div
                key={diff.id}
                onClick={() => handleSelect(diff.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-slate-800 border-amber-400 shadow-md' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
                id={`diff-option-${diff.id.toLowerCase()}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-white">
                      {diff.name}
                    </span>
                    <span className={`pill-badge ${diff.color}`}>
                      {diff.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {diff.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 ml-3">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
