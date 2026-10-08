'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelemetryLog } from '@/lib/store';

interface LiveActivityFeedProps {
  logs: TelemetryLog[];
}

const badgeStyles: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/70',
  error: 'bg-rose-50 text-rose-700 border-rose-200/70',
  info: 'bg-blue-50 text-blue-700 border-blue-200/70',
};

const dotStyles: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
  info: 'bg-blue-500',
};

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <h3 className="text-xs font-bold font-display text-slate-700 uppercase tracking-wider">
            Live Agent Activity
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          {logs.length} events
        </span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.slice(0, 12).map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              transition={{ duration: 0.25, delay: i === 0 ? 0 : 0 }}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotStyles[log.badgeType]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-800 truncate">{log.agent}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${badgeStyles[log.badgeType]}`}>
                    {log.event}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 flex-shrink-0 font-mono">{log.timestamp}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
