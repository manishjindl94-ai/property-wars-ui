import React from 'react';
import { Wallet, Clock, ArrowRight, ShieldCheck, PieChart, Sparkles } from 'lucide-react';
import { CurrencyText } from '../common/CurrencyText';
import { Button } from '../common/Button';

export function AllocationSummary({
  initialPool = 10000,
  remainingCash = 3500,
  allocations = {},
  countdownSeconds = 45,
  onConfirm,
  isLocked = false
}) {
  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const allocatedPercent = Math.min(100, Math.round((totalAllocated / initialPool) * 100));
  const remainingPercent = 100 - allocatedPercent;
  const isUrgent = countdownSeconds <= 15;

  return (
    <div className="allocation-hero" id="allocation-summary-hero">
      <div>
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles size={14} />
          <span>Capital Allocation Phase</span>
        </div>
        <h1 className="alloc-pool-title">
          Deploy Your Starting War Chest
        </h1>
        <p className="alloc-pool-desc">
          You hold an initial capital pool of <strong className="text-white">₹{initialPool.toLocaleString('en-IN')}</strong>. 
          Staking cash into prime real estate generates passive recurring rent each turn, but unallocated liquid cash is essential for board maneuvers and emergency buyouts.
        </p>

        {/* Progress breakdown bar */}
        <div className="mt-4 max-w-md">
          <div className="flex justify-between font-mono text-xs mb-1.5">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Liquid Cash: <CurrencyText amount={remainingCash} /> ({remainingPercent}%)
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Staked: <CurrencyText amount={totalAllocated} /> ({allocatedPercent}%)
            </span>
          </div>

          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${remainingPercent}%` }}
            />
            <div 
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${allocatedPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="alloc-stat-group flex-col md:flex-row">
        {/* Countdown Timer */}
        <div className={`alloc-timer-box ${isUrgent ? 'border-red-500/60 bg-red-950/30' : ''}`} id="alloc-timer">
          <div className="flex items-center gap-1.5 mb-1 text-slate-400">
            <Clock size={14} className={isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-400'} />
            <span className="alloc-timer-label">Auto Deploy In</span>
          </div>
          <div className={`alloc-timer-value ${isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            {String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:{String(countdownSeconds % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Confirm Action Button */}
        <Button
          variant="primary"
          size="lg"
          iconRight={ArrowRight}
          onClick={onConfirm}
          disabled={isLocked}
          id="btn-confirm-allocation"
          className="shadow-glow-player font-display text-base"
        >
          Confirm &amp; Start Match
        </Button>
      </div>
    </div>
  );
}
