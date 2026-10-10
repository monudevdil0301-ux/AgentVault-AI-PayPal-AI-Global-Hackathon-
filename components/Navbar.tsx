import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Play, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { SandboxProfilePill } from './SandboxProfilePill';
import { soundFx } from '@/lib/audio';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalTreasury: number;
  onOpenSettings: () => void;
  onOpenTopup: () => void;
  isSandboxMode: boolean;
  onRunJudgeTour?: () => void;
  isTourRunning?: boolean;
}

const tabs = [
  { id: 'copilot', label: 'AI Copilot & Fleet', icon: '✦' },
  { id: 'ledger', label: 'AG Grid Ledger', icon: '☰' },
  { id: 'agents', label: 'Agent Wallets', icon: '◎' },
  { id: 'escrow', label: 'Milestone Escrow', icon: '◈' },
  { id: 'subscriptions', label: 'SubSense Arbiter', icon: '⚡' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalTreasury,
  onOpenSettings,
  onOpenTopup,
  isSandboxMode,
  onRunJudgeTour,
  isTourRunning,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playPaymentSuccess();
  };
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm shadow-brand-500/20">
            <span className="text-white font-extrabold text-sm tracking-tight">AV</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-display text-slate-900 tracking-tight">AgentVault</span>
              <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-full tracking-normal">
                PayPal + AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-normal -mt-0.5">Autonomous Financial OS</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-slate-100/90 rounded-xl p-1 gap-1 border border-slate-200/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all duration-150 ${
                activeTab === tab.id
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/40"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-[11px] opacity-75">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {onRunJudgeTour && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRunJudgeTour}
              disabled={isTourRunning}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                isTourRunning 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  : 'bg-gradient-to-r from-brand-600 to-blue-700 text-white shadow-sm shadow-brand-500/25 hover:brightness-105'
              }`}
              title="Run 1-Click Interactive Judge Demo Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTourRunning ? 'Tour In Progress...' : 'Judge Demo Tour'}</span>
            </motion.button>
          )}

          {isSandboxMode && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 tracking-tight">Sandbox Live</span>
            </div>
          )}

          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Value</div>
            <div className="text-base font-extrabold font-display text-slate-900 tracking-tight">
              ${totalTreasury.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTopup}
            className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-sm shadow-brand-500/20 hover:bg-brand-600 transition-colors"
            title="Add Sandbox Liquidity"
          >
            <Plus className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleSound}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
              soundEnabled
                ? 'bg-slate-100 text-slate-600 border-slate-200/70 hover:bg-slate-200/70 hover:text-slate-900'
                : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100'
            }`}
            title={soundEnabled ? 'Fintech Sound Effects: Enabled' : 'Fintech Sound Effects: Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 border border-slate-200/70 flex items-center justify-center hover:bg-slate-200/70 hover:text-slate-800 transition-colors"
            title="Configure Credentials"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          {/* Sandbox Profile & Role Switcher */}
          <SandboxProfilePill onOpenSettings={onOpenSettings} />
        </div>
      </div>
    </nav>
  );
};
