'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, ChevronDown, Check, ExternalLink, Key, LogOut } from 'lucide-react';

export interface UserRole {
  id: string;
  name: string;
  email: string;
  role: string;
  badge: string;
  color: string;
}

export const USER_ROLES: UserRole[] = [
  {
    id: 'admin',
    name: 'Alex Vance',
    email: 'alex.operator@agentvault.sandbox',
    role: 'Treasury Admin & Fleet Operator',
    badge: 'Admin',
    color: 'bg-brand-50 text-brand-700 border-brand-200/60',
  },
  {
    id: 'procure',
    name: 'ProcureBot Controller',
    email: 'procurebot@sandbox.paypal.com',
    role: 'Autonomous Compute Buyer',
    badge: 'Buyer Agent',
    color: 'bg-blue-50 text-blue-700 border-blue-200/60',
  },
  {
    id: 'escrow',
    name: 'Escrow Sentinel',
    email: 'escrow.verifier@sandbox.paypal.com',
    role: 'AST Code Quality Auditor',
    badge: 'Auditor',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  },
  {
    id: 'freelancer',
    name: 'Sarah Jenkins',
    email: 'sarah.designer@sandbox.paypal.com',
    role: 'Freelance Lead Contractor',
    badge: 'Contractor',
    color: 'bg-purple-50 text-purple-700 border-purple-200/60',
  },
];

interface SandboxProfilePillProps {
  onOpenSettings?: () => void;
}

export const SandboxProfilePill: React.FC<SandboxProfilePillProps> = ({ onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(USER_ROLES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors shadow-subtle text-left"
        title="Active Sandbox User Profile"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
          {currentRole.name.charAt(0)}
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-none">
              {currentRole.name}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${currentRole.color}`}>
              {currentRole.badge}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono leading-none block mt-0.5 truncate max-w-[140px]">
            {currentRole.email}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Profile & Role Switcher Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-modal border border-slate-200/80 p-3 z-50 space-y-3"
          >
            {/* Header info */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sandbox Session</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{currentRole.name}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{currentRole.email}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="OAuth Live" />
            </div>

            {/* Role Switcher */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1.5">
                Switch Sandbox Persona
              </p>
              <div className="space-y-1">
                {USER_ROLES.map((r) => {
                  const isSelected = r.id === currentRole.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        isSelected 
                          ? 'bg-brand-50/70 text-brand-800 font-bold' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">{r.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${r.color}`}>
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-normal">{r.role}</p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              {onOpenSettings && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configure PayPal & Gemini API Keys</span>
                </button>
              )}
              <a
                href="https://developer.paypal.com/dashboard/applications/sandbox"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>PayPal Developer Dashboard</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
