'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileCode } from 'lucide-react';

interface EscrowDiffInspectorProps {
  contractTitle: string;
  freelancerName: string;
  prUrl: string;
}

export const EscrowDiffInspector: React.FC<EscrowDiffInspectorProps> = ({
  contractTitle, freelancerName, prUrl,
}) => {
  const [selectedFile, setSelectedFile] = useState<'tailwind' | 'auth' | 'test'>('test');

  const diffs = {
    test: {
      fileName: 'tests/e2e/payment-flow.spec.ts',
      additions: 42,
      deletions: 3,
      code: [
        { type: 'context', line: 12, text: 'describe("Autonomous PayPal Vault Settlement Flow", () => {' },
        { type: 'context', line: 13, text: '  let vaultAgent: AgentInstance;' },
        { type: 'deletion', line: 14, text: '- test.skip("requires sandbox token", async () => {' },
        { type: 'addition', line: 14, text: '+ test("verifies scoped budget cap ($200) and vault capture", async ({ request }) => {' },
        { type: 'addition', line: 15, text: '+   const res = await request.post("/api/paypal/create-order", {' },
        { type: 'addition', line: 16, text: '+     data: { amount: 120.00, currency: "USD", agentId: "agent-procure" }' },
        { type: 'addition', line: 17, text: '+   });' },
        { type: 'addition', line: 18, text: '+   expect(res.status()).toBe(200);' },
        { type: 'addition', line: 19, text: '+   expect(res.data.id).toMatch(/^PAYPAL-SB-/);' },
        { type: 'addition', line: 20, text: '+   expect(res.data.status).toBe("COMPLETED");' },
        { type: 'context', line: 21, text: '  });' },
        { type: 'context', line: 22, text: '});' }
      ]
    },
    auth: {
      fileName: 'lib/security/guardrail-policy.ts',
      additions: 28,
      deletions: 0,
      code: [
        { type: 'addition', line: 1, text: '+ export function validateAgentEnvelope(agent: AgentWallet, txAmount: number): boolean {' },
        { type: 'addition', line: 2, text: '+   if (!agent.autonomousEnabled) return false;' },
        { type: 'addition', line: 3, text: '+   if (txAmount > agent.autoApproveLimit) return false;' },
        { type: 'addition', line: 4, text: '+   return (agent.spentThisMonth + txAmount) <= agent.monthlyBudget;' },
        { type: 'addition', line: 5, text: '+ }' }
      ]
    },
    tailwind: {
      fileName: 'components/ui/PaymentBadge.tsx',
      additions: 18,
      deletions: 2,
      code: [
        { type: 'context', line: 5, text: 'export const PaymentBadge = ({ status }) => {' },
        { type: 'deletion', line: 6, text: '- return <div className="badge">{status}</div>;' },
        { type: 'addition', line: 6, text: '+ return <div className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-mono border border-blue-200">{status}</div>;' },
        { type: 'context', line: 7, text: '};' }
      ]
    }
  };

  const currentDiff = diffs[selectedFile];

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-2.5 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-1.5">
          {(['test', 'auth', 'tailwind'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedFile(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                selectedFile === key
                  ? 'bg-white text-gray-900 font-semibold shadow-card border border-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{diffs[key].fileName.split('/').pop()}</span>
            </button>
          ))}
        </div>
        <div className="text-[11px] flex items-center gap-2">
          <span className="text-green-600 font-bold">+{currentDiff.additions}</span>
          <span className="text-red-500 font-bold">-{currentDiff.deletions}</span>
        </div>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-2.5 overflow-x-auto text-[11px] leading-relaxed">
        {currentDiff.code.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 px-1 py-0.5 rounded ${
              line.type === 'addition'
                ? 'bg-green-50 text-green-800'
                : line.type === 'deletion'
                ? 'bg-red-50 text-red-600 line-through'
                : 'text-gray-500'
            }`}
          >
            <span className="w-5 text-right text-gray-300 select-none">{line.line}</span>
            <span className="whitespace-pre">{line.text}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>AST Scan: 0 vulnerabilities, 28/28 test suites passing</span>
        </div>
        <span className="text-[10px] font-bold uppercase bg-green-200 text-green-800 px-2 py-0.5 rounded">
          Verified
        </span>
      </div>
    </div>
  );
};
