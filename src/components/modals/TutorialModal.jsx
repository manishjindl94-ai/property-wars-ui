import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { BookOpen, ShieldCheck, Landmark, DollarSign, Crown, Zap, TrendingUp, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'board', label: '1. Checkers Rules', icon: ShieldCheck },
  { id: 'properties', label: '2. Real Estate & Rent', icon: Landmark },
  { id: 'economy', label: '3. Financial Strategy', icon: DollarSign }
];

export function TutorialModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('board');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Property Wars — Master Strategy Guide"
      icon={BookOpen}
      maxWidth="680px"
      id="modal-tutorial"
      footer={
        <Button variant="primary" onClick={onClose}>
          Understood &amp; Ready
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 pb-2 gap-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Checkers Board Mechanics */}
        {activeTab === 'board' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-display font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>Tactical Checkers Movement &amp; Captures</span>
              </h4>
              <p>
                • <strong>Forward Movement:</strong> Regular checkers pieces move diagonally forward one square onto adjacent dark squares.
              </p>
              <p>
                • <strong>Captures &amp; Bounties:</strong> Jump over an adjacent opponent piece into an empty square to capture it. Each capture rewards you with immediate liquid cash bounty!
              </p>
              <p>
                • <strong>King Promotion:</strong> Reaching the opponent's back row crowns your piece as a <strong>King</strong>, granting backwards diagonal movement and multi-directional jump flexibility.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Real Estate & Rent Yield */}
        {activeTab === 'properties' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-display font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <Landmark size={16} />
                <span>Property Deeds &amp; Passive Rental Dividends</span>
              </h4>
              <p>
                • <strong>Opening Allocation:</strong> Allocate starting cash (₹10,000) to secure early property ownership.
              </p>
              <p>
                • <strong>Passive Income:</strong> Every round, owned properties pay recurring rental yields directly into your liquid cash balance.
              </p>
              <p>
                • <strong>Asset Upgrading:</strong> Spend liquid cash to upgrade properties (Tier 1 to 5), significantly multiplying the rental yield rate and total asset valuation.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Financial Strategy */}
        {activeTab === 'economy' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-display font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <DollarSign size={16} />
                <span>Net Worth vs Liquid Cash Management</span>
              </h4>
              <p>
                • <strong>Net Worth Breakdown:</strong> Net Worth = Liquid Cash + Property Real Estate Valuation. Property value cannot be spent directly until liquidated.
              </p>
              <p>
                • <strong>Emergency Liquidation:</strong> You can liquidate properties at any time via the <strong>Sell</strong> interface at a 15% market spread penalty to raise instant liquid cash.
              </p>
              <p>
                • <strong>Victory Condition:</strong> Bankrupt the opponent's net worth or eliminate all rival checkers pieces on the board!
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
