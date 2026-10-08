'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AgentWallet } from '@/lib/store';

interface AgentWalletsViewProps {
  agents: AgentWallet[];
  onToggleAutonomous: (id: string) => void;
  onUpdateLimit: (id: string, limit: number) => void;
  onTopUpWallet: (id: string, amount: number) => void;
}

export const AgentWalletsView: React.FC<AgentWalletsViewProps> = ({
  agents, onToggleAutonomous, onUpdateLimit, onTopUpWallet,
}) => {
  const totalBalance = agents.reduce((a, b) => a + b.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Agent Wallets</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage autonomous agent spending limits and budgets</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-card px-4 py-2">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Treasury</span>
          <p className="text-lg font-extrabold text-gray-900">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent, i) => {
          const spentPercent = agent.monthlyBudget > 0 ? Math.min((agent.spentThisMonth / agent.monthlyBudget) * 100, 100) : 0;
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-xl border border-gray-200 shadow-card p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">{agent.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleAutonomous(agent.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    agent.autonomousEnabled
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {agent.autonomousEnabled ? 'Autonomous ON' : 'Manual'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 mb-0.5">Balance</p>
                  <p className="text-sm font-extrabold text-gray-900">${agent.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 mb-0.5">Auto-Approve</p>
                  <p className="text-sm font-bold text-gray-700">${agent.autoApproveLimit}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 mb-0.5">Monthly Budget</p>
                  <p className="text-sm font-bold text-gray-700">${agent.monthlyBudget.toLocaleString()}</p>
                </div>
              </div>

              {/* Budget Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">Spent this month</span>
                  <span className="text-[10px] font-semibold text-gray-600">${agent.spentThisMonth.toLocaleString()} / ${agent.monthlyBudget.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${spentPercent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${spentPercent > 80 ? 'bg-red-400' : spentPercent > 50 ? 'bg-amber-400' : 'bg-brand-500'}`}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onTopUpWallet(agent.id, 500)}
                  className="flex-1 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <ArrowUpRight className="w-3 h-3" /> Top Up $500
                </button>
                <button
                  onClick={() => onUpdateLimit(agent.id, agent.autoApproveLimit + 50)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Shield className="w-3 h-3" /> Raise Limit
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
