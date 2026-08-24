import React from 'react';
import { Cpu, ShieldAlert, Sparkles } from 'lucide-react';

export function InputLockOverlay({ message = "Computer Calculating Tactical Decision..." }) {
  return (
    <div className="input-lock-overlay" id="board-input-lock-scrim">
      <div className="scanner-radar" />
      <div className="lock-label">
        <Cpu size={16} className="animate-spin" />
        <span>{message}</span>
      </div>
      <div className="font-mono text-xs text-slate-400">
        Board input locked until turn completion
      </div>
    </div>
  );
}
