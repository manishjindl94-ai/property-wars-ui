import React from 'react';
import { SCENARIO_KEYS } from '../../mock/mockHarness';
import { ShieldAlert, Play, CheckCircle2, X } from 'lucide-react';

export function DevScenarioDrawer({
  isOpen,
  onClose,
  activeScenarioKey,
  onSelectScenario
}) {
  if (!isOpen) return null;

  return (
    <div className="dev-drawer" id="dev-scenario-drawer">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider text-amber-400">
          <ShieldAlert size={15} />
          <span>UI State Switcher</span>
        </div>
        <button
          className="text-slate-400 hover:text-white"
          onClick={onClose}
          aria-label="Close drawer"
        >
          <X size={15} />
        </button>
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">
        Instant snapshot injector to test presentation states without running full game engine calculations.
      </p>

      <div className="flex flex-col gap-1.5">
        {Object.entries(SCENARIO_KEYS).map(([key, label]) => {
          const isActive = activeScenarioKey === label;
          return (
            <button
              key={key}
              type="button"
              className={`dev-scenario-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectScenario(label)}
              id={`dev-scenario-btn-${key.toLowerCase()}`}
            >
              <span>{label}</span>
              {isActive && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
