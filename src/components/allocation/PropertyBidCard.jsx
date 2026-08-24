import React from 'react';
import { Cpu, Building2, Gem, Container, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { CurrencyText } from '../common/CurrencyText';

const ICONS = {
  Cpu,
  Building2,
  Gem,
  Container
};

export function PropertyBidCard({
  property,
  allocatedAmount = 0,
  maxAvailable = 10000,
  onAllocate,
  isLocked = false
}) {
  const IconComponent = ICONS[property.icon] || Building2;
  const isAllocated = allocatedAmount > 0;

  const categoryColorClass = 
    property.category === 'TECH' ? 'cat-tech' :
    property.category === 'COMMERCIAL' ? 'cat-commercial' :
    property.category === 'LUXURY' ? 'cat-luxury' : 'cat-logistics';

  const riskBadgeType = 
    property.risk === 'LOW' ? 'green' :
    property.risk === 'MEDIUM' ? 'cyan' :
    property.risk === 'HIGH' ? 'gold' : 'ruby';

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    onAllocate(property.id, val);
  };

  const handleQuickAdd = (delta) => {
    const target = allocatedAmount + delta;
    onAllocate(property.id, Math.min(target, allocatedAmount + maxAvailable));
  };

  const handleSetMax = () => {
    onAllocate(property.id, allocatedAmount + maxAvailable);
  };

  const handleClear = () => {
    onAllocate(property.id, 0);
  };

  // Projected rental income based on allocation
  const projectedIncome = Math.round((property.baseValue + allocatedAmount) * (property.rentalYieldRate / 100));

  return (
    <div className={`property-bid-card ${isAllocated ? 'has-allocation' : ''}`} id={`prop-bid-card-${property.id}`}>
      <div className="bid-card-header">
        <div className="flex items-center gap-2.5">
          <div 
            className="prop-icon-box"
            style={{ 
              background: 'var(--bg-surface-3)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <IconComponent size={18} />
          </div>
          <div>
            <div className="bid-prop-title">{property.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`property-category-indicator ${categoryColorClass}`} />
              <span className="font-mono text-xs text-slate-400">{property.category}</span>
            </div>
          </div>
        </div>

        <span className={`pill-badge ${riskBadgeType}`}>
          {property.risk} RISK
        </span>
      </div>

      <div className="text-xs text-slate-400 leading-relaxed">
        {property.description}
      </div>

      {/* Valuation & Yield Metrics */}
      <div 
        style={{
          background: 'var(--bg-surface-1)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 0.75rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <div className="text-xs text-slate-400 font-medium">Base Valuation</div>
          <CurrencyText amount={property.baseValue} className="text-amber-400 font-bold" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">Rental Yield</div>
          <div className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp size={13} />
            <span>{property.rentalYieldRate}% / turn</span>
          </div>
        </div>
      </div>

      {/* Allocation Slider Control */}
      <div className="bid-slider-control">
        <div className="slider-labels">
          <span>Staked Capital</span>
          <CurrencyText amount={allocatedAmount} className="text-emerald-400 font-bold" />
        </div>

        <input
          type="range"
          min="0"
          max={allocatedAmount + maxAvailable}
          step="500"
          value={allocatedAmount}
          onChange={handleSliderChange}
          disabled={isLocked}
          className="custom-range-slider"
          id={`slider-${property.id}`}
        />

        {/* Quick Increment Preset Chips */}
        <div className="quick-alloc-btn-row">
          <button 
            type="button" 
            className="quick-chip"
            onClick={() => handleQuickAdd(500)}
            disabled={isLocked || maxAvailable < 500}
          >
            +₹500
          </button>
          <button 
            type="button" 
            className="quick-chip"
            onClick={() => handleQuickAdd(1000)}
            disabled={isLocked || maxAvailable < 1000}
          >
            +₹1K
          </button>
          <button 
            type="button" 
            className="quick-chip"
            onClick={() => handleQuickAdd(2500)}
            disabled={isLocked || maxAvailable < 2500}
          >
            +₹2.5K
          </button>
          <button 
            type="button" 
            className="quick-chip"
            onClick={handleSetMax}
            disabled={isLocked || maxAvailable === 0}
          >
            MAX
          </button>
          {isAllocated && (
            <button 
              type="button" 
              className="quick-chip"
              onClick={handleClear}
              disabled={isLocked}
              style={{ color: '#f87171' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Projected Output Tag */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800 text-slate-400 font-mono">
        <span>Est. Rent Turn 1:</span>
        <CurrencyText amount={projectedIncome} className="text-emerald-400 font-bold" />
      </div>
    </div>
  );
}
