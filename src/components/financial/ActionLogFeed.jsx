import React from 'react';
import { History, Zap, ShieldAlert, Sparkles, TrendingUp, DollarSign } from 'lucide-react';

export function ActionLogFeed({ actionHistory = [] }) {
  return (
    <div className="glass-panel p-4 flex flex-col gap-2.5 max-h-[300px] overflow-hidden" id="action-log-feed">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-slate-300">
          <History size={14} className="text-emerald-400" />
          <span>Match Activity Feed</span>
        </div>
        <span className="font-mono text-xs text-slate-400">{actionHistory.length} events</span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: '220px' }}>
        {actionHistory.map((item) => {
          const isCapture = item.type === 'capture';
          const isDividend = item.type === 'dividend';
          const isInvest = item.type === 'investment';
          const isSale = item.type === 'sale';

          const icon = 
            isCapture ? <Zap size={13} className="text-red-400 shrink-0 mt-0.5" /> :
            isDividend ? <TrendingUp size={13} className="text-emerald-400 shrink-0 mt-0.5" /> :
            isInvest ? <Sparkles size={13} className="text-amber-400 shrink-0 mt-0.5" /> :
            isSale ? <DollarSign size={13} className="text-cyan-400 shrink-0 mt-0.5" /> :
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5 inline-block" />;

          return (
            <div 
              key={item.id} 
              className="text-xs flex items-start gap-2 p-1.5 rounded bg-slate-900/40 border border-slate-800/60"
            >
              {icon}
              <div className="flex-1">
                <span className="text-slate-300 leading-snug">{item.text}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
