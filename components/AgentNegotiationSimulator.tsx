'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { TransactionRecord } from '@/lib/store';

interface AgentNegotiationSimulatorProps {
  onNewTransaction: (tx: TransactionRecord) => void;
  onUpdateAgentBalance: (agentId: string, amount: number) => void;
}

const SCENARIOS = [
  { id: 'gpu', label: 'H100 GPU Compute', budget: 450, asks: 520, desc: 'Procure 8x H100 GPU cluster hours for model fine-tuning' },
  { id: 'data', label: 'Fintech Training Data', budget: 180, asks: 220, desc: 'Acquire 50k verified SEC financial statement records' },
  { id: 'api', label: 'Bulk API Proxy Gateway', budget: 95, asks: 130, desc: 'Enterprise rate-limited egress proxy endpoints' },
];

export const AgentNegotiationSimulator: React.FC<AgentNegotiationSimulatorProps> = ({
  onNewTransaction, onUpdateAgentBalance,
}) => {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; price?: number }>>([]);
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const startNegotiation = async () => {
    setIsSimulating(true);
    setMessages([]);
    setDealClosed(false);
    setFinalPrice(null);

    const steps = [
      { sender: 'ProcureBot AI', text: `Initiating buy order for ${selectedScenario.label}. Max envelope: $${selectedScenario.budget}. Opening offer: $${Math.round(selectedScenario.budget * 0.75)}.`, price: Math.round(selectedScenario.budget * 0.75) },
      { sender: 'VendorAgent', text: `Counter-offer received. Standard spot rate is $${selectedScenario.asks}. Can offer volume discount down to $${Math.round(selectedScenario.asks * 0.9)}.`, price: Math.round(selectedScenario.asks * 0.9) },
      { sender: 'ProcureBot AI', text: `Counter unacceptable. Analyzing market comps... Best alternative is $${Math.round(selectedScenario.budget * 0.88)}. Proposing firm settlement at $${Math.round(selectedScenario.budget * 0.88)}.`, price: Math.round(selectedScenario.budget * 0.88) },
      { sender: 'VendorAgent', text: `Settlement terms accepted: $${Math.round(selectedScenario.budget * 0.88)}. Locking escrow via PayPal Orders API.`, price: Math.round(selectedScenario.budget * 0.88) },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setMessages((prev) => [...prev, steps[i]]);
    }

    const settled = Math.round(selectedScenario.budget * 0.88);
    setFinalPrice(settled);
    setDealClosed(true);
    setIsSimulating(false);

    const tx: TransactionRecord = {
      id: `TX-M2M-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentId: 'agent-procure',
      agentName: 'ProcureBot AI',
      merchant: 'VendorAgent Fleet',
      amount: settled,
      currency: 'USD',
      category: 'M2M Settlement',
      status: 'COMPLETED',
      type: 'M2M_TRANSFER',
      riskScore: 'LOW',
      rationale: `Autonomous price discovery: settled at $${settled} below ask of $${selectedScenario.asks}.`,
      aiConfidence: 0.96,
      paypalOrderId: `PAYPAL-M2M-${Date.now()}`,
    };
    onNewTransaction(tx);
    onUpdateAgentBalance('agent-procure', -settled);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">M2M Agentic Negotiation Simulator</h3>
            <p className="text-xs text-gray-400">Autonomous price discovery & PayPal settlement between AI agents</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedScenario(s); setMessages([]); setDealClosed(false); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedScenario.id === s.id
                  ? 'bg-white text-gray-900 shadow-card font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-800">{selectedScenario.desc}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Buyer Budget: <strong className="text-gray-700">${selectedScenario.budget}</strong> • Vendor Ask: <strong className="text-gray-700">${selectedScenario.asks}</strong></p>
        </div>
        <button
          onClick={startNegotiation}
          disabled={isSimulating}
          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {isSimulating ? 'Negotiating...' : 'Start Negotiation'} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {messages.length > 0 && (
        <div className="space-y-3 pt-2">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 text-xs ${
                m.sender === 'ProcureBot AI' ? '' : 'flex-row-reverse text-right'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${
                m.sender === 'ProcureBot AI' ? 'bg-brand-500' : 'bg-purple-600'
              }`}>
                {m.sender === 'ProcureBot AI' ? 'PB' : 'VA'}
              </div>
              <div className={`max-w-md rounded-xl p-3 ${
                m.sender === 'ProcureBot AI' ? 'bg-blue-50 text-blue-900 border border-blue-100' : 'bg-purple-50 text-purple-900 border border-purple-100'
              }`}>
                <p className="font-semibold text-[11px] mb-0.5">{m.sender}</p>
                <p className="text-gray-700 leading-relaxed">{m.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {dealClosed && finalPrice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs font-bold text-green-800">Deal Closed & Settled</p>
              <p className="text-[11px] text-green-600">Saved ${selectedScenario.asks - finalPrice} ({(100 - (finalPrice / selectedScenario.asks) * 100).toFixed(0)}% below ask)</p>
            </div>
          </div>
          <span className="text-base font-extrabold text-green-800">${finalPrice}.00 USD</span>
        </motion.div>
      )}
    </div>
  );
};
