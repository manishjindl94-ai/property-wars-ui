import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CurrencyText } from '../common/CurrencyText';
import { TrendingUp, ArrowUpRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { ACTION_TYPES } from '../../types/engineContract';

export function InvestModal({
  isOpen,
  onClose,
  property,
  playerLiquidCash = 0,
  dispatch
}) {
  if (!property) return null;

  const defaultCost = property.upgradeCost || 1000;
  const [investAmount, setInvestAmount] = useState(defaultCost);
  const canAfford = playerLiquidCash >= investAmount;

  const handleConfirm = () => {
    dispatch({
      type: ACTION_TYPES.INVEST_PROPERTY,
      propertyId: property.id,
      amount: investAmount
    });
    onClose();
  };

  const newYield = property.rentalYieldRate + property.nextYieldBoost;
  const newValuation = property.currentValue + investAmount;
  const projectedIncome = Math.round(newValuation * (newYield / 100));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upgrade Asset: ${property.name}`}
      icon={TrendingUp}
      id="modal-invest-property"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gold"
            icon={Sparkles}
            onClick={handleConfirm}
            disabled={!canAfford || investAmount <= 0}
            id="btn-confirm-upgrade"
          >
            Invest <CurrencyText amount={investAmount} /> &amp; Upgrade
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-300 leading-relaxed">
          Infusing development capital raises the property tier level, elevates rental yield, and grows total equity.
        </p>

        {/* Current vs Projected Comparison Grid */}
        <div 
          style={{
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}
        >
          <div>
            <div className="text-xs text-slate-400 font-medium">Current Tier {property.level}</div>
            <div className="font-mono text-sm text-slate-200 mt-1">
              Valuation: <CurrencyText amount={property.currentValue} />
            </div>
            <div className="font-mono text-xs text-emerald-400 mt-0.5">
              Yield: {property.rentalYieldRate}% (+₹{property.rentalIncomePerTurn}/turn)
            </div>
          </div>

          <div className="border-l border-slate-700 pl-4">
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <ArrowUpRight size={14} />
              <span>Projected Tier {Math.min(5, property.level + 1)}</span>
            </div>
            <div className="font-mono text-sm text-slate-200 mt-1">
              Valuation: <CurrencyText amount={newValuation} />
            </div>
            <div className="font-mono text-xs text-emerald-400 mt-0.5">
              Yield: {newYield.toFixed(1)}% (+₹{projectedIncome}/turn)
            </div>
          </div>
        </div>

        {/* Upgrade Investment Amount Selector */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Investment Capital:</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Available Liquid:</span>
              <CurrencyText amount={playerLiquidCash} className="text-emerald-400 font-bold" />
            </div>
          </div>

          <div className="flex gap-2">
            {[property.upgradeCost, property.upgradeCost * 1.5, property.upgradeCost * 2].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className={`quick-chip ${investAmount === Math.round(preset) ? 'bg-amber-500/20 text-amber-300 border-amber-500' : ''}`}
                onClick={() => setInvestAmount(Math.round(preset))}
              >
                ₹{Math.round(preset).toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {!canAfford && (
            <div className="text-xs text-red-400 font-mono flex items-center gap-1 mt-1">
              Insufficient liquid cash to fund this investment.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
