'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Wallet, ArrowUpRight } from 'lucide-react';
import { AgentWallet } from '@/lib/store';

interface FleetGuardrailsWidgetProps {
  agents: AgentWallet[];
  onOpenSettings: () => void;
  onOpenTopup: () => void;
}

export const FleetGuardrailsWidget: React.FC<FleetGuardrailsWidgetProps> = ({
  agents,
  onOpenSettings,
  onOpenTopup,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider">
              Spending Envelopes & Guardrails
            </h3>
            <p className="text-[10px] text-slate-400">Autonomous PayPal Vault Limits</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Lock className="w-2.5 h-2.5" /> 100% Guarded
        </span>
      </div>

      {/* Agents Mini List */}
      <div className="space-y-2.5">
        {agents.map((ag) => {
          const percent = ag.monthlyBudget > 0 ? Math.min((ag.spentThisMonth / ag.monthlyBudget) * 100, 100) : 0;
          return (
            <div key={ag.id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{ag.avatar}</span>
                  <span className="font-bold font-display text-slate-800 text-[11px]">{ag.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500">Auto-Cap: </span>
                  <span className="font-extrabold font-display text-[11px] text-slate-900">${ag.autoApproveLimit}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>Spent: ${ag.spentThisMonth.toFixed(0)}</span>
                <span>Budget: ${ag.monthlyBudget.toFixed(0)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${percent > 80 ? 'bg-rose-500' : percent > 50 ? 'bg-amber-500' : 'bg-brand-500'}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={onOpenTopup}
          className="flex-1 py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold font-display rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Top Up Fleet</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
        >
          <span>Policy</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
