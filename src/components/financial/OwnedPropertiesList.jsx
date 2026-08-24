import React from 'react';
import { Cpu, Building2, Gem, Container, TrendingUp, ChevronRight, Layers, ArrowUpRight, DollarSign } from 'lucide-react';
import { CurrencyText } from '../common/CurrencyText';
import { Button } from '../common/Button';

const ICONS = {
  Cpu,
  Building2,
  Gem,
  Container
};

export function OwnedPropertiesList({
  properties = [],
  owner = 'PLAYER',
  onSelectProperty,
  onInvest,
  onSell,
  isLocked = false
}) {
  const ownedList = properties.filter(p => p.owner === owner);

  if (ownedList.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
        <Building2 size={28} className="mx-auto mb-2 text-slate-600" />
        <div className="font-display font-semibold text-sm text-slate-400">No Properties Owned Yet</div>
        <div className="text-xs text-slate-400 mt-1">
          {owner === 'PLAYER' ? 'Acquire properties during the opening phase or capture property board squares.' : 'Opponent holds no registered property deeds.'}
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-card-list">
      {ownedList.map(prop => {
        const IconComponent = ICONS[prop.icon] || Building2;
        const categoryColorClass = 
          prop.category === 'TECH' ? 'cat-tech' :
          prop.category === 'COMMERCIAL' ? 'cat-commercial' :
          prop.category === 'LUXURY' ? 'cat-luxury' : 'cat-logistics';

        return (
          <div 
            key={prop.id}
            className="property-item-row"
            onClick={() => onSelectProperty && onSelectProperty(prop)}
            id={`owned-prop-${prop.id}`}
          >
            <div className="prop-meta-left">
              <div 
                className="prop-icon-box"
                style={{ 
                  background: 'var(--bg-surface-3)',
                  color: owner === 'PLAYER' ? 'var(--player-primary)' : 'var(--comp-primary)'
                }}
              >
                <IconComponent size={18} />
              </div>
              <div>
                <div className="prop-name-title">
                  <span>{prop.name}</span>
                  <span className={`property-category-indicator ${categoryColorClass}`} />
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  <span className="font-mono">Tier {prop.level}</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-400">+{prop.rentalYieldRate}% yield</span>
                </div>
              </div>
            </div>

            <div className="prop-meta-right flex items-center gap-3">
              <div>
                <CurrencyText amount={prop.currentValue} className="prop-val-text block" />
                <span className="prop-income-text block">
                  +₹{prop.rentalIncomePerTurn}/turn
                </span>
              </div>

              {owner === 'PLAYER' && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInvest(prop);
                    }}
                    disabled={isLocked}
                    title="Upgrade & Boost Yield"
                    style={{ padding: '0.35rem 0.6rem' }}
                  >
                    Upgrade
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSell(prop);
                    }}
                    disabled={isLocked}
                    title="Liquidate Property"
                    style={{ padding: '0.35rem 0.5rem', color: '#f87171' }}
                  >
                    Sell
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
