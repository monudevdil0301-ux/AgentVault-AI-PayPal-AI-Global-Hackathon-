'use client';

import React from 'react';
import { Activity, CheckCircle2, Shield, Cpu, RefreshCw } from 'lucide-react';

interface PayPalNetworkHealthProps {
  isSandbox: boolean;
}

export const PayPalNetworkHealthWidget: React.FC<PayPalNetworkHealthProps> = ({ isSandbox }) => {
  const apis = [
    { name: 'PayPal Orders API v2', latency: '118ms', status: 'Operational', icon: '💳' },
    { name: 'PayPal Payouts API v1', latency: '142ms', status: 'Batch Ready', icon: '🛡️' },
    { name: 'PayPal Subscriptions API', latency: '96ms', status: 'Active Sync', icon: '⚡' },
    { name: 'Google Gemini 1.5 Flash', latency: '320ms', status: 'LLM Function Calling', icon: '🤖' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider">
              Network & API Telemetry
            </h3>
            <p className="text-[10px] text-slate-400">PayPal Sandbox & LLM Status</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>99.98% SLA</span>
        </div>
      </div>

      <div className="space-y-2">
        {apis.map((api, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs">{api.icon}</span>
              <span className="font-semibold text-slate-700 text-[11px]">{api.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">{api.latency}</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> {api.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
