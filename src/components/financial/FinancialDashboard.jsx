import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { OwnedPropertiesList } from './OwnedPropertiesList';
import { Wallet, Landmark, TrendingUp, ShieldCheck, Crown, Cpu, DollarSign } from 'lucide-react';
import { CurrencyText } from '../common/CurrencyText';

export function FinancialDashboard({
  portfolio,
  properties = [],
  onSelectProperty,
  onInvest,
  onSell,
  isLocked = false
}) {
  const playerMetrics = portfolio.PLAYER || {
    liquidCash: 0,
    propertyEquity: 0,
    totalNetWorth: 0,
    passiveIncomePerTurn: 0,
    piecesCount: 12,
    kingsCount: 0
  };

  const computerMetrics = portfolio.COMPUTER || {
    liquidCash: 0,
    propertyEquity: 0,
    totalNetWorth: 0,
    passiveIncomePerTurn: 0,
    piecesCount: 12,
    kingsCount: 0
  };

  // Asset Breakdown Percentage
  const totalAssets = playerMetrics.totalNetWorth || 1;
  const cashPct = Math.round((playerMetrics.liquidCash / totalAssets) * 100);
  const equityPct = 100 - cashPct;

  const playerOwnedCount = properties.filter(p => p.owner === 'PLAYER').length;

  return (
    <div className="metrics-stack" id="financial-dashboard-panel">
      {/* 1. Total Net Worth Hero Metric */}
      <MetricCard
        label="Total Net Worth"
        value={playerMetrics.totalNetWorth}
        variant="networth"
        icon={Landmark}
        badge="+18.4% Return"
        badgeType="cyan"
        subtext={
          <div className="ratio-bar-container w-full">
            <div className="ratio-bar-track">
              <div className="ratio-fill-cash" style={{ width: `${cashPct}%` }} title={`Liquid Cash: ${cashPct}%`} />
              <div className="ratio-fill-equity" style={{ width: `${equityPct}%` }} title={`Property Equity: ${equityPct}%`} />
            </div>
            <div className="ratio-legend">
              <span className="text-emerald-400">Cash: {cashPct}%</span>
              <span className="text-amber-400">Real Estate: {equityPct}%</span>
            </div>
          </div>
        }
      />

      {/* 2. Liquid Cash (Available to Spend) */}
      <MetricCard
        label="Liquid Cash Reserves"
        value={playerMetrics.liquidCash}
        variant="liquid"
        icon={Wallet}
        badge={`+₹${playerMetrics.passiveIncomePerTurn}/turn`}
        badgeType="green"
        subtext={
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 text-xs">
            <TrendingUp size={13} />
            <span>Passive Rent Inflow Active</span>
          </div>
        }
      />

      {/* 3. Property Equity (Illiquid Real Estate) */}
      <MetricCard
        label="Real Estate Equity"
        value={playerMetrics.propertyEquity}
        variant="equity"
        icon={Landmark}
        badge={`${playerOwnedCount} Deeds`}
        badgeType="gold"
        subtext="Not liquid cash — generate rental yield or liquidate via Sell action"
      />

      {/* 4. Army Strength (Pieces & Kings) */}
      <div 
        className="glass-panel p-3 flex items-center justify-between"
        style={{ background: 'var(--bg-surface-2)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={16} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Checkers Force</div>
            <div className="font-mono text-sm font-bold text-slate-200">
              {playerMetrics.piecesCount} Active Pieces
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
          <Crown size={14} />
          <span>{playerMetrics.kingsCount} Kings</span>
        </div>
      </div>

      {/* 5. Owned Real Estate Portfolio */}
      <div className="glass-panel p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Landmark size={14} className="text-amber-400" />
            <span>Property Holdings</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {playerOwnedCount} Assets
          </span>
        </div>

        <OwnedPropertiesList
          properties={properties}
          owner="PLAYER"
          onSelectProperty={onSelectProperty}
          onInvest={onInvest}
          onSell={onSell}
          isLocked={isLocked}
        />
      </div>

      {/* 6. Opponent Intelligence Summary */}
      <div 
        className="glass-panel p-3 flex items-center justify-between border-l-2 border-red-500"
        style={{ background: 'rgba(239, 68, 68, 0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Cpu size={16} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Rival Portfolio</div>
            <div className="font-mono text-xs font-bold text-red-400">
              Net Worth: <CurrencyText amount={computerMetrics.totalNetWorth} />
            </div>
          </div>
        </div>

        <div className="font-mono text-xs text-slate-400 text-right">
          <div>Pieces: {computerMetrics.piecesCount}</div>
          <div className="text-red-400">Rent: +₹{computerMetrics.passiveIncomePerTurn}</div>
        </div>
      </div>
    </div>
  );
}
