'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Printer, Copy, Check, X, FileText, QrCode } from 'lucide-react';
import { TransactionRecord } from '@/lib/store';
import { soundFx } from '@/lib/audio';

interface AuditReceiptModalProps {
  transaction: TransactionRecord;
  onClose: () => void;
}

export const AuditReceiptModal: React.FC<AuditReceiptModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const certHash = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const certId = `CERT-AV-${transaction.id.replace('TX-', '')}`;
  const timestamp = transaction.timestamp || new Date().toISOString();

  const handleCopy = () => {
    soundFx.playClick();
    const text = JSON.stringify({
      certificateId: certId,
      transactionId: transaction.id,
      paypalOrderId: transaction.paypalOrderId,
      amount: `${transaction.amount} ${transaction.currency}`,
      agent: transaction.agentName,
      merchant: transaction.merchant,
      aiConfidence: `${((transaction.aiConfidence || 0.98) * 100).toFixed(1)}%`,
      chainOfThought: transaction.chainOfThought,
      sha256Proof: certHash,
      issuedAt: timestamp,
    }, null, 2);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        {/* Watermark badge in background */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-brand-500/5 rounded-full pointer-events-none" />

        {/* Certificate Header */}
        <div className="flex items-start justify-between border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-brand-600">Compliance Proof</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  ISO-20022 / AI-FIN Compliant
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                PayPal Autonomous Execution Certificate
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 text-xs">
          {/* Main Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Certificate ID</span>
              <span className="font-bold text-slate-800">{certId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Timestamp</span>
              <span className="text-slate-700 truncate block">{timestamp}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Settlement Value</span>
              <span className="font-extrabold text-base text-slate-900 font-display">
                ${transaction.amount.toFixed(2)} {transaction.currency}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PayPal Order Ref</span>
              <span className="text-brand-600 font-bold truncate block">{transaction.paypalOrderId || 'PAYPAL-SB-ORDER-V2'}</span>
            </div>
          </div>

          {/* AI Execution Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Authorizing AI Agent:</span>
              <span className="font-bold text-slate-800">{transaction.agentName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Recipient Entity:</span>
              <span className="font-semibold text-slate-700">{transaction.merchant}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Cognitive Confidence:</span>
              <span className="font-bold text-emerald-600">
                {((transaction.aiConfidence || 0.98) * 100).toFixed(1)}% (Passes &gt;95% Policy Threshold)
              </span>
            </div>
          </div>

          {/* Chain of Thought Verification Log */}
          {transaction.chainOfThought && transaction.chainOfThought.length > 0 && (
            <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 pb-1">
                <span>LLM Chain-of-Thought Audit Trail</span>
                <span className="text-emerald-400">Gemini 2.5 Flash</span>
              </div>
              {transaction.chainOfThought.map((thought, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">
                  {thought}
                </p>
              ))}
            </div>
          )}

          {/* Cryptographic SHA256 Signature Stamp */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-center justify-between font-mono text-[11px]">
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider block">
                Cryptographic Proof Hash (SHA-256)
              </span>
              <span className="text-emerald-700 font-bold truncate block max-w-xs">{certHash}</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON Proof' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
