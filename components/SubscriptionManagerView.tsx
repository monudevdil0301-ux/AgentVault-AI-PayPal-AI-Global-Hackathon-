'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Pause, XCircle, Zap } from 'lucide-react';
import { SubscriptionItem } from '@/lib/store';

interface SubscriptionManagerViewProps {
  subscriptions: SubscriptionItem[];
  onCancelSubscription: (subId: string) => void;
  onPauseSubscription: (subId: string) => void;
  onAutoRemediateAllWaste: () => void;
}

export const SubscriptionManagerView: React.FC<SubscriptionManagerViewProps> = ({
  subscriptions, onCancelSubscription, onPauseSubscription, onAutoRemediateAllWaste,
}) => {
  const flagged = subscriptions.filter((s) => s.status === 'FLAGGED_WASTE');
  const totalWaste = flagged.reduce((a, b) => a + b.costMonthly, 0);

  const statusStyles: Record<string, string> = {
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    FLAGGED_WASTE: 'bg-red-50 text-red-700 border-red-200',
    PAUSED: 'bg-amber-50 text-amber-700 border-amber-200',
    CANCELLED: 'bg-gray-100 text-gray-400 border-gray-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Subscription Manager</h2>
          <p className="text-xs text-gray-400 mt-0.5">AI-powered SaaS spend audit via PayPal Subscriptions API</p>
        </div>
        {flagged.length > 0 && (
          <button
            onClick={onAutoRemediateAllWaste}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg transition-colors"
          >
            <Zap className="w-3.5 h-3.5" /> Auto-Cancel All Waste (${totalWaste}/mo)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {subscriptions.map((sub, i) => {
          const utilPercent = Math.min(sub.utilizationRate, 100);
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-xl border shadow-card p-5 space-y-3 ${
                sub.status === 'FLAGGED_WASTE' ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    {sub.name}
                    {sub.status === 'FLAGGED_WASTE' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{sub.id}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyles[sub.status]}`}>{sub.status.replace(/_/g, ' ')}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Monthly Cost</p>
                  <p className="text-sm font-bold text-gray-900">${sub.costMonthly}/mo</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Utilization</p>
                  <p className="text-sm font-bold text-gray-900">{sub.utilizationRate}%</p>
                </div>
              </div>

              <div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${utilPercent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    className={`h-full rounded-full ${utilPercent < 30 ? 'bg-red-400' : utilPercent < 60 ? 'bg-amber-400' : 'bg-green-400'}`}
                  />
                </div>
              </div>

              {sub.aiRecommendation && (
                <p className="text-[11px] text-gray-500 italic bg-gray-50 rounded-lg p-2 border border-gray-100">
                  🤖 {sub.aiRecommendation}
                </p>
              )}

              {sub.status !== 'CANCELLED' && (
                <div className="flex gap-2">
                  <button onClick={() => onPauseSubscription(sub.id)} className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors">
                    <Pause className="w-3 h-3" /> Pause
                  </button>
                  <button onClick={() => onCancelSubscription(sub.id)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors">
                    <XCircle className="w-3 h-3" /> Cancel
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
