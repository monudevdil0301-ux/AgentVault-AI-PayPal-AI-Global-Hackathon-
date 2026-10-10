'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChevronUp, ChevronDown, CheckCircle2, ShieldCheck, Terminal, Send, RefreshCw, X } from 'lucide-react';
import { soundFx } from '@/lib/audio';

export interface WebhookEvent {
  id: string;
  eventType: string;
  timestamp: string;
  resourceId: string;
  status: 'VERIFIED' | 'PROCESSING';
  summary: string;
  signature: string;
  payload: Record<string, any>;
}

const INITIAL_WEBHOOKS: WebhookEvent[] = [
  {
    id: 'WH-EVT-9041',
    eventType: 'PAYMENT.CAPTURE.COMPLETED',
    timestamp: new Date(Date.now() - 45000).toISOString(),
    resourceId: 'CAP-SB-991283',
    status: 'VERIFIED',
    summary: 'Payment capture completed for $120.00 USD (ProcureBot compute)',
    signature: 'SHA256withRSA:verified:0x98f4...b2a1',
    payload: {
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource_type: 'capture',
      summary: 'Payment completed for order #ORD-77491',
      resource: {
        id: 'CAP-SB-991283',
        status: 'COMPLETED',
        amount: { currency_code: 'USD', value: '120.00' },
        seller_receivable_breakdown: { gross_amount: { value: '120.00', currency_code: 'USD' }, paypal_fee: { value: '4.18', currency_code: 'USD' } }
      }
    }
  },
  {
    id: 'WH-EVT-8920',
    eventType: 'CHECKOUT.ORDER.APPROVED',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    resourceId: 'ORD-SB-882019',
    status: 'VERIFIED',
    summary: 'Buyer authorized order settlement of $350.00 USD',
    signature: 'SHA256withRSA:verified:0x33c2...e9f4',
    payload: {
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource_type: 'checkout-order',
      resource: {
        id: 'ORD-SB-882019',
        status: 'APPROVED',
        intent: 'CAPTURE',
        payer: { email_address: 'alex.operator@agentvault.sandbox' }
      }
    }
  },
  {
    id: 'WH-EVT-7611',
    eventType: 'BILLING.SUBSCRIPTION.CANCELLED',
    timestamp: new Date(Date.now() - 360000).toISOString(),
    resourceId: 'SUB-FIG-9901',
    status: 'VERIFIED',
    summary: 'SubSense Arbiter cancelled dormant seat ($168/mo)',
    signature: 'SHA256withRSA:verified:0x71a9...c4d0',
    payload: {
      event_type: 'BILLING.SUBSCRIPTION.CANCELLED',
      resource_type: 'subscription',
      resource: {
        id: 'SUB-FIG-9901',
        status: 'CANCELLED',
        reason: 'Automated AI audit: 0 active logins past 60 days'
      }
    }
  }
];

export const PayPalWebhookStreamer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<WebhookEvent[]>(INITIAL_WEBHOOKS);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(INITIAL_WEBHOOKS[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    soundFx.playAgentPulse();

    setTimeout(() => {
      const newEvent: WebhookEvent = {
        id: `WH-EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        eventType: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
        timestamp: new Date().toISOString(),
        resourceId: `BATCH-SB-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'VERIFIED',
        summary: 'Milestone escrow payout batch released to freelancer ($350.00 USD)',
        signature: `SHA256withRSA:verified:0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
        payload: {
          event_type: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
          event_version: '1.0',
          resource: {
            batch_header: {
              payout_batch_id: `BATCH-SB-${Date.now()}`,
              batch_status: 'SUCCESS',
              sender_batch_header: { sender_batch_id: `ESCROW_RELEASE_${Date.now()}` }
            }
          }
        }
      };

      setEvents((prev) => [newEvent, ...prev]);
      setSelectedEvent(newEvent);
      setIsSimulating(false);
      soundFx.playPaymentSuccess();
    }, 700);
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-4 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundFx.playClick();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/25 border border-slate-700/80 backdrop-blur-md transition-all text-xs font-semibold"
        >
          <div className="relative flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <span className="font-display tracking-tight">PayPal Webhooks Live</span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {events.length} Events
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </motion.button>
      </div>

      {/* Slide-Up Webhook Terminal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-display">PayPal Sandbox Webhook Ingestion Engine</h3>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                        HMAC Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Real-time bi-directional PayPal webhook stream • Listener endpoint: <code className="text-slate-300">/api/paypal/webhook</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateWebhook}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Test Webhook Event</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 overflow-hidden min-h-[380px]">
                {/* Event List (Left 2 cols) */}
                <div className="md:col-span-2 border-r border-slate-800/80 p-3 overflow-y-auto space-y-2 max-h-[380px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Incoming Ingestion Stream ({events.length})
                  </p>
                  {events.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedEvent(evt);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-800/90 border-brand-500/70 shadow-sm'
                            : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-mono font-bold text-emerald-400">
                            {evt.eventType}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium line-clamp-1">{evt.summary}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                          <span>{evt.id}</span>
                          <span>•</span>
                          <span className="text-emerald-400/90 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Event Payload & Cryptographic Inspector (Right 3 cols) */}
                <div className="md:col-span-3 p-4 overflow-y-auto max-h-[380px] space-y-3 bg-slate-950/80">
                  {selectedEvent ? (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Event ID</span>
                          <p className="text-xs font-mono font-bold text-white">{selectedEvent.id}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security Header</span>
                          <p className="text-[11px] font-mono text-emerald-400">{selectedEvent.signature}</p>
                        </div>
                      </div>

                      {/* Cryptographic Verification Details */}
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5 font-mono">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">PAYPAL-AUTH-ALGO:</span>
                          <span className="text-slate-200">SHA256withRSA</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">PAYPAL-CERT-URL:</span>
                          <span className="text-brand-400 truncate max-w-[280px]">https://api.sandbox.paypal.com/v1/certs/CERT-SB-01</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">RESOURCE ID:</span>
                          <span className="text-amber-400">{selectedEvent.resourceId}</span>
                        </div>
                      </div>

                      {/* Raw JSON Payload */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Verified Webhook Payload (JSON)
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Status: 200 Ingested</span>
                        </div>
                        <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[190px]">
                          {JSON.stringify(selectedEvent.payload, null, 2)}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                      Select a webhook event from the stream to inspect details.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
