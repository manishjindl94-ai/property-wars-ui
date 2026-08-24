import React from 'react';
import { AllocationSummary } from './AllocationSummary';
import { PropertyBidCard } from './PropertyBidCard';
import { ACTION_TYPES } from '../../types/engineContract';

export function AllocationScreen({ gameState, dispatch }) {
  const { allocation, properties, isInputLocked } = gameState;
  const { initialCashPool, remainingCash, allocations, countdownSeconds } = allocation;

  const handleAllocate = (propertyId, amount) => {
    dispatch({
      type: ACTION_TYPES.SET_ALLOCATION,
      propertyId,
      amount
    });
  };

  const handleConfirm = () => {
    dispatch({
      type: ACTION_TYPES.CONFIRM_ALLOCATION
    });
  };

  return (
    <div className="allocation-container animate-fade-in" id="screen-allocation">
      <AllocationSummary
        initialPool={initialCashPool}
        remainingCash={remainingCash}
        allocations={allocations}
        countdownSeconds={countdownSeconds}
        onConfirm={handleConfirm}
        isLocked={isInputLocked}
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg text-slate-200">
            Available Real Estate Stakes (Tier 1 – Tier 4)
          </h2>
          <span className="font-mono text-xs text-slate-400">
            {properties.length} Core Properties Listed
          </span>
        </div>

        <div className="properties-bidding-grid">
          {properties.map(property => (
            <PropertyBidCard
              key={property.id}
              property={property}
              allocatedAmount={allocations[property.id] || 0}
              maxAvailable={remainingCash}
              onAllocate={handleAllocate}
              isLocked={isInputLocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
