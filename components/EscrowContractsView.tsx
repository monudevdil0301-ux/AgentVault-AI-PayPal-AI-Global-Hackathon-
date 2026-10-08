'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Plus, X, FileCheck } from 'lucide-react';
import { EscrowMilestone } from '@/lib/store';
import { EscrowDiffInspector } from './EscrowDiffInspector';

interface EscrowContractsViewProps {
  contracts: EscrowMilestone[];
  onVerifyAndRelease: (id: string) => void;
  onCreateNewEscrow: (title: string, freelancer: string, amount: number) => void;
}

export const EscrowContractsView: React.FC<EscrowContractsViewProps> = ({
  contracts, onVerifyAndRelease, onCreateNewEscrow,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFreelancer, setNewFreelancer] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const statusStyles: Record<string, string> = {
    PENDING_SUBMISSION: 'bg-amber-50 text-amber-700 border-amber-200',
    AI_EVALUATING: 'bg-blue-50 text-blue-700 border-blue-200',
    UNDER_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200',
    APPROVED: 'bg-green-50 text-green-700 border-green-200',
    SETTLED: 'bg-green-50 text-green-700 border-green-200',
    DISPUTED: 'bg-red-50 text-red-700 border-red-200',
  };

  const handleCreate = () => {
    if (newTitle && newFreelancer && newAmount) {
      onCreateNewEscrow(newTitle, newFreelancer, parseFloat(newAmount));
      setIsCreateOpen(false);
      setNewTitle(''); setNewFreelancer(''); setNewAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Escrow Contracts</h2>
          <p className="text-xs text-gray-400 mt-0.5">AI-verified milestone payments via PayPal Payouts API</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Escrow
        </button>
      </div>

      <div className="space-y-3">
        {contracts.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-gray-200 shadow-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{c.contractTitle}</h3>
                  <p className="text-[11px] text-gray-400">Freelancer: {c.freelancerName} • Deliverable: {c.deliverableUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-gray-900">${c.amount.toLocaleString()}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyles[c.status] || 'bg-gray-50 text-gray-500'}`}>{c.status.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {(c.status === 'UNDER_REVIEW' || c.status === 'AI_EVALUATING') && (
              <div className="mb-3">
                <EscrowDiffInspector contractTitle={c.contractTitle} freelancerName={c.freelancerName} prUrl={c.deliverableUrl} />
              </div>
            )}

            {c.status !== 'SETTLED' && c.status !== 'APPROVED' && (
              <div className="flex justify-end">
                <button
                  onClick={() => onVerifyAndRelease(c.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Verify & Release Escrow
                </button>
              </div>
            )}

            {c.qualityScore !== null && c.qualityScore !== undefined && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                <span>Quality Score: <strong className="text-gray-700">{c.qualityScore}%</strong></span>
                {c.payoutTxId && <span>Payout TX: <strong className="text-brand-500 font-mono">{c.payoutTxId}</strong></span>}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Create New Escrow Contract</h3>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Contract title" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-50" />
                <input value={newFreelancer} onChange={(e) => setNewFreelancer(e.target.value)} placeholder="Freelancer name" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-50" />
                <input value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount (USD)" type="number" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-50" />
              </div>
              <button onClick={handleCreate} className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg transition-colors">Create Escrow Contract</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
