'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PayPalTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export const PayPalTopupModal: React.FC<PayPalTopupModalProps> = ({
  isOpen, onClose, onSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatedCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(selectedAmount);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-6 rounded-2xl bg-white shadow-modal space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-extrabold text-white text-sm">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">PayPal Sandbox Treasury Top-up</h3>
              <p className="text-[11px] text-gray-400">Direct Sandbox Vault Liquidity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Top-up Amount</label>
          <div className="grid grid-cols-3 gap-2">
            {[250, 500, 1000, 2500, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                  selectedAmount === amt
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                ${amt.toLocaleString()} USD
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleSimulatedCheckout}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing PayPal Sandbox...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay with PayPal Sandbox (${selectedAmount.toLocaleString()})</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>256-bit Sandbox Encrypted Vault Settlement</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
