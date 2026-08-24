import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CurrencyText } from '../common/CurrencyText';
import { Landmark, TrendingUp, ShieldAlert, Cpu, Building2, Gem, Container, ArrowUpRight, DollarSign } from 'lucide-react';

const ICONS = { Cpu, Building2, Gem, Container };

export function PropertyDetailModal({
  isOpen,
  onClose,
  property,
  onOpenInvest,
  onOpenSell,
  isLocked = false
}) {
  if (!property) return null;

  const Icon = ICONS[property.icon] || Building2;
  const isPlayer = property.owner === 'PLAYER';
  const isComputer = property.owner === 'COMPUTER';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={property.name}
      icon={Landmark}
      id="modal-property-detail"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          {isPlayer && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  onClose();
                  onOpenSell(property);
                }}
                disabled={isLocked}
                style={{ color: '#f87171' }}
              >
                Liquidate
              </Button>
              <Button
                variant="gold"
                icon={ArrowUpRight}
                onClick={() => {
                  onClose();
                  onOpenInvest(property);
                }}
                disabled={isLocked}
              >
                Upgrade Asset
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Header summary badge */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
              <Icon size={22} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">{property.name}</div>
              <div className="font-mono text-xs text-slate-400">Category: {property.category} • Tier {property.level}</div>
            </div>
          </div>

          <div>
            <span className={`pill-badge ${isPlayer ? 'green' : isComputer ? 'ruby' : 'gold'}`}>
              {isPlayer ? 'YOUR ASSET' : isComputer ? 'RIVAL OWNED' : 'NEUTRAL TILE'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {property.description}
        </p>

        {/* Detailed Metrics Table */}
        <div 
          style={{
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid var(--border-subtle)'
          }}
          className="space-y-2.5 text-xs font-mono"
        >
          <div className="flex justify-between text-slate-300">
            <span>Current Asset Valuation:</span>
            <CurrencyText amount={property.currentValue} className="text-amber-400 font-bold" />
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Rental Yield Rate:</span>
            <span className="text-emerald-400 font-bold">+{property.rentalYieldRate}% / round</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Cash Dividend Inflow:</span>
            <span className="text-emerald-400 font-bold">+₹{property.rentalIncomePerTurn} per turn</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Total Capital Staked:</span>
            <CurrencyText amount={property.currentInvestment} />
          </div>
          <div className="flex justify-between text-slate-300 border-t border-slate-700 pt-2">
            <span>Immediate Liquidation Payout:</span>
            <CurrencyText amount={property.liquidationValue} className="text-red-300" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
