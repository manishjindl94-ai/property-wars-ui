import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CurrencyText } from '../common/CurrencyText';
import { AlertTriangle, DollarSign, Building2 } from 'lucide-react';
import { ACTION_TYPES } from '../../types/engineContract';

export function SellModal({
  isOpen,
  onClose,
  property,
  dispatch
}) {
  if (!property) return null;

  const handleConfirmSell = () => {
    dispatch({
      type: ACTION_TYPES.SELL_PROPERTY,
      propertyId: property.id
    });
    onClose();
  };

  const liquidationPayout = property.liquidationValue || Math.round(property.currentValue * 0.85);
  const discountPenalty = property.currentValue - liquidationPayout;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Liquidate Asset: ${property.name}`}
      icon={AlertTriangle}
      id="modal-sell-property"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Keep Asset
          </Button>
          <Button
            variant="danger"
            icon={DollarSign}
            onClick={handleConfirmSell}
            id="btn-confirm-sell"
          >
            Sell for <CurrencyText amount={liquidationPayout} />
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-xs text-red-300 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
          <div>
            <strong>Warning — Liquidation Discount Applied:</strong>
            <p className="mt-0.5 text-slate-300">
              Selling an asset incurs an immediate 15% broker liquidation fee and halts recurring passive rental income (+₹{property.rentalIncomePerTurn}/turn).
            </p>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div 
          style={{
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid var(--border-subtle)'
          }}
          className="space-y-2 text-xs font-mono"
        >
          <div className="flex justify-between text-slate-300">
            <span>Asset Market Value:</span>
            <CurrencyText amount={property.currentValue} />
          </div>
          <div className="flex justify-between text-red-400">
            <span>Liquidation Spread (-15%):</span>
            <CurrencyText amount={-discountPenalty} showSign={true} />
          </div>
          <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm text-emerald-400">
            <span>Net Liquid Cash Payout:</span>
            <CurrencyText amount={liquidationPayout} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
