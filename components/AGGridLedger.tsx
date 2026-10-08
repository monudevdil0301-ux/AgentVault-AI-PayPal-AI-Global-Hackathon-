'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Download, Eye, X, Filter } from 'lucide-react';
import { TransactionRecord } from '@/lib/store';

interface AGGridLedgerProps {
  transactions: TransactionRecord[];
  onApproveTransaction: (txId: string) => void;
  onDisputeTransaction: (txId: string) => void;
  onRefundTransaction: (txId: string) => void;
}

export const AGGridLedger: React.FC<AGGridLedgerProps> = ({
  transactions, onApproveTransaction, onDisputeTransaction, onRefundTransaction,
}) => {
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter((t) => t.status === filter);
  }, [transactions, filter]);

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    PENDING_APPROVAL: 'bg-amber-50 text-amber-800 border-amber-200/70',
    DISPUTED: 'bg-rose-50 text-rose-700 border-rose-200/70',
    REFUNDED: 'bg-slate-100 text-slate-600 border-slate-200/70',
  };

  const columnDefs = useMemo(() => [
    { 
      headerName: 'Transaction ID', 
      field: 'id' as const, 
      width: 140, 
      cellRenderer: (p: any) => (
        <span className="font-mono text-xs font-semibold text-slate-500">{p.value}</span>
      )
    },
    { 
      headerName: 'Time', 
      field: 'timestamp' as const, 
      width: 140, 
      cellRenderer: (p: any) => (
        <span className="text-xs font-medium text-slate-500">{p.value}</span>
      )
    },
    { 
      headerName: 'Agent Identity', 
      field: 'agentName' as const, 
      width: 160, 
      cellRenderer: (p: any) => (
        <span className="text-xs font-bold font-display text-slate-800">{p.value}</span>
      )
    },
    { 
      headerName: 'Counterparty / Merchant', 
      field: 'merchant' as const, 
      width: 190, 
      cellRenderer: (p: any) => (
        <span className="text-xs font-medium text-slate-700">{p.value}</span>
      )
    },
    { 
      headerName: 'Amount (USD)', 
      field: 'amount' as const, 
      width: 130, 
      cellRenderer: (p: any) => (
        <span className="text-xs font-extrabold font-display text-slate-900 tracking-tight">
          ${p.value?.toFixed(2)}
        </span>
      )
    },
    { 
      headerName: 'Status', 
      field: 'status' as const, 
      width: 160, 
      cellRenderer: (p: any) => (
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[p.value] || 'bg-slate-50 text-slate-500'}`}>
          {p.value?.replace(/_/g, ' ')}
        </span>
      )
    },
    { 
      headerName: 'Risk Level', 
      field: 'riskScore' as const, 
      width: 110, 
      cellRenderer: (p: any) => (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
          p.value === 'HIGH' ? 'text-rose-700 bg-rose-50 border border-rose-200/60' : 
          p.value === 'MEDIUM' ? 'text-amber-700 bg-amber-50 border border-amber-200/60' : 
          'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
        }`}>
          {p.value}
        </span>
      )
    },
    { 
      headerName: 'Actions', 
      width: 90, 
      cellRenderer: (p: any) => (
        <button 
          onClick={() => setSelectedTx(p.data)} 
          className="text-brand-600 hover:text-brand-700 text-xs font-bold font-display flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Details
        </button>
      )
    },
  ], []);

  const filters = ['ALL', 'COMPLETED', 'PENDING_APPROVAL', 'DISPUTED', 'REFUNDED'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
            Transaction Ledger & Auditing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by AG Grid Enterprise Component — Real-time PayPal vault capture & payout logs
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-display text-slate-700 hover:bg-slate-50 shadow-subtle hover:shadow-card transition-all">
          <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV Audit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all ${
              filter === f
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* AG Grid Container */}
      <div className="ag-theme-quartz" style={{ height: 440, width: '100%' }}>
        <AgGridReact
          rowData={filtered}
          columnDefs={columnDefs}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          domLayout="normal"
        />
      </div>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 space-y-4 border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 tracking-tight">
                    Transaction Audit Record
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedTx.id}</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Settled Amount</span>
                  <span className="font-extrabold font-display text-base text-slate-900">
                    ${selectedTx.amount.toFixed(2)} {selectedTx.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Agent Party</span>
                  <span className="font-bold text-slate-800">{selectedTx.agentName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Counterparty</span>
                  <span className="font-medium text-slate-800">{selectedTx.merchant}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">PayPal Order / Settlement ID</span>
                  <span className="font-mono font-semibold text-brand-600">{selectedTx.paypalOrderId || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">State & Risk</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold px-2 py-0.5 rounded-full border text-[11px] ${statusColors[selectedTx.status]}`}>
                      {selectedTx.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Risk: {selectedTx.riskScore}
                    </span>
                  </div>
                </div>

                {selectedTx.rationale && (
                  <div className="pt-2.5 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      AI Intent & Rationale
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                      {selectedTx.rationale}
                    </p>
                  </div>
                )}

                {selectedTx.chainOfThought && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Execution Steps
                    </p>
                    <div className="space-y-1">
                      {selectedTx.chainOfThought.map((s, i) => (
                        <p key={i} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                          <span className="text-brand-500 font-bold">•</span>
                          <span>{s}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => { onApproveTransaction(selectedTx.id); setSelectedTx(null); }}
                  className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold font-display hover:bg-emerald-100 transition-colors"
                >
                  Confirm Settlement
                </button>
                <button
                  onClick={() => { onDisputeTransaction(selectedTx.id); setSelectedTx(null); }}
                  className="flex-1 py-2.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-bold font-display hover:bg-rose-100 transition-colors"
                >
                  File Dispute
                </button>
                <button
                  onClick={() => { onRefundTransaction(selectedTx.id); setSelectedTx(null); }}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 border border-slate-200/80 rounded-xl text-xs font-bold font-display hover:bg-slate-200 transition-colors"
                >
                  Initiate Refund
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
