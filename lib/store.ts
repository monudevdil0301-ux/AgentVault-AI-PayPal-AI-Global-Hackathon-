// Application Central State & Store

export interface AgentWallet {
  id: string;
  name: string;
  role: string;
  avatar: string;
  balance: number;
  monthlyBudget: number;
  spentThisMonth: number;
  autoApproveLimit: number;
  autonomousEnabled: boolean;
  allowedCategories: string[];
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  status: 'COMPLETED' | 'PENDING_APPROVAL' | 'REFUNDED' | 'DISPUTED';
  paypalOrderId: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  type: 'PROCUREMENT' | 'ESCROW_PAYOUT' | 'SUBSCRIPTION' | 'M2M_TRANSFER';
  chainOfThought?: string[];
  aiConfidence?: number;
}

export interface EscrowMilestone {
  id: string;
  contractTitle: string;
  freelancerName: string;
  freelancerEmail: string;
  amount: number;
  currency: string;
  milestoneNumber: number;
  totalMilestones: number;
  deliverableUrl: string;
  criteria: string[];
  qualityScore: number | null;
  status: 'PENDING_SUBMISSION' | 'AI_EVALUATING' | 'APPROVED' | 'DISPUTED' | 'UNDER_REVIEW' | 'SETTLED';
  payoutTxId?: string;
  evaluationSummary?: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  category: string;
  costMonthly: number;
  billingFrequency: 'Monthly' | 'Yearly';
  status: 'ACTIVE' | 'FLAGGED_WASTE' | 'PAUSED' | 'CANCELLED';
  utilizationRate: number; // 0 to 100%
  lastUsedDaysAgo: number;
  renewalDate: string;
  paypalAgreementId: string;
  aiRecommendation: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  agent: string;
  event: string;
  details: string;
  badgeType: 'success' | 'warning' | 'info' | 'error';
}

export const INITIAL_AGENTS: AgentWallet[] = [
  {
    id: 'agent-procure',
    name: 'ProcureBot AI',
    role: 'Autonomous SaaS & Hardware Buyer',
    avatar: '🤖',
    balance: 1420.50,
    monthlyBudget: 3000.00,
    spentThisMonth: 1579.50,
    autoApproveLimit: 200.00,
    autonomousEnabled: true,
    allowedCategories: ['SaaS', 'API Tokens', 'Cloud Compute', 'Dev Tools'],
  },
  {
    id: 'agent-escrow',
    name: 'EscrowSentinel',
    role: 'Code Quality & Milestone Verifier',
    avatar: '🛡️',
    balance: 3200.00,
    monthlyBudget: 5000.00,
    spentThisMonth: 1800.00,
    autoApproveLimit: 500.00,
    autonomousEnabled: true,
    allowedCategories: ['Freelance Engineering', 'Design Assets', 'Audits'],
  },
  {
    id: 'agent-sub',
    name: 'SubSense Arbiter',
    role: 'Subscription Optimizer & Dispute Copilot',
    avatar: '⚡',
    balance: 850.00,
    monthlyBudget: 1500.00,
    spentThisMonth: 650.00,
    autoApproveLimit: 100.00,
    autonomousEnabled: true,
    allowedCategories: ['Subscription Auditing', 'Refund Claims'],
  },
  {
    id: 'agent-m2m',
    name: 'FleetM2M MicroBot',
    role: 'Agent-to-Agent Micro-Settlements',
    avatar: '🌐',
    balance: 450.75,
    monthlyBudget: 1000.00,
    spentThisMonth: 549.25,
    autoApproveLimit: 50.00,
    autonomousEnabled: true,
    allowedCategories: ['P2P Compute', 'Dataset Sourcing', 'Subagent Calls'],
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TX-9042',
    timestamp: '2026-10-06 17:34:10',
    agentId: 'agent-procure',
    agentName: 'ProcureBot AI',
    merchant: 'OpenAI API Platform',
    amount: 120.00,
    currency: 'USD',
    category: 'API Tokens',
    status: 'COMPLETED',
    paypalOrderId: 'PAYPAL-SB-849204A',
    riskScore: 'LOW',
    rationale: 'Procured 10M gpt-4o token reserve within $200 policy threshold. Instant PayPal Vault execution.',
    type: 'PROCUREMENT',
    aiConfidence: 0.98,
    chainOfThought: ['Checked policy: threshold $200', 'Balance sufficient: $1420.50', 'Vault execution verified'],
  },
  {
    id: 'TX-9041',
    timestamp: '2026-10-06 16:15:22',
    agentId: 'agent-escrow',
    agentName: 'EscrowSentinel',
    merchant: 'Alex Chen (Freelance Lead)',
    amount: 450.00,
    currency: 'USD',
    category: 'Freelance Engineering',
    status: 'COMPLETED',
    paypalOrderId: 'PAYOUT-SB-771920B',
    riskScore: 'LOW',
    rationale: 'Verified Milestone #1 deliverables against PR #18 test suite (98.4% score). Released payout via PayPal Payouts API.',
    type: 'ESCROW_PAYOUT',
    aiConfidence: 0.98,
  },
  {
    id: 'TX-9040',
    timestamp: '2026-10-06 15:02:45',
    agentId: 'agent-procure',
    agentName: 'ProcureBot AI',
    merchant: 'Lambda Labs GPU Cloud',
    amount: 380.00,
    currency: 'USD',
    category: 'Cloud Compute',
    status: 'PENDING_APPROVAL',
    paypalOrderId: 'PAYPAL-SB-901842C',
    riskScore: 'HIGH',
    rationale: 'Requested 8x H100 GPU cluster reservation ($380.00). Exceeds $200 auto-approval limit. Awaiting human confirmation.',
    type: 'PROCUREMENT',
    aiConfidence: 0.74,
  },
  {
    id: 'TX-9039',
    timestamp: '2026-10-06 12:20:11',
    agentId: 'agent-m2m',
    agentName: 'FleetM2M MicroBot',
    merchant: 'DataScraper Fleet Bot #7',
    amount: 8.75,
    currency: 'USD',
    category: 'Dataset Sourcing',
    status: 'COMPLETED',
    paypalOrderId: 'PAYPAL-SB-110293D',
    riskScore: 'LOW',
    rationale: 'Autonomous micro-payout for 3,500 real-time enriched fintech leads.',
    type: 'M2M_TRANSFER',
    aiConfidence: 0.99,
  },
  {
    id: 'TX-9038',
    timestamp: '2026-10-06 09:40:00',
    agentId: 'agent-sub',
    agentName: 'SubSense Arbiter',
    merchant: 'Unused Analytics SaaS',
    amount: 79.00,
    currency: 'USD',
    category: 'SaaS',
    status: 'DISPUTED',
    paypalOrderId: 'DISPUTE-SB-330192E',
    riskScore: 'MEDIUM',
    rationale: 'Initiated PayPal dispute resolution: Zero active sessions recorded in past 60 days despite renewal.',
    type: 'SUBSCRIPTION',
    aiConfidence: 0.92,
  },
];

export const INITIAL_ESCROW_CONTRACTS: EscrowMilestone[] = [
  {
    id: 'escrow-1',
    contractTitle: 'Next-Gen Mobile App & Design System',
    freelancerName: 'Sarah Jenkins',
    freelancerEmail: 'sarah.designer@sandbox.paypal.com',
    amount: 350.00,
    currency: 'USD',
    milestoneNumber: 2,
    totalMilestones: 4,
    deliverableUrl: 'https://github.com/org/mobile-app/pull/42',
    criteria: [
      'Tailwind Figma token sync verified',
      'All 14 responsive screen states implemented',
      'Zero accessibility WCAG 2.1 AA violations'
    ],
    qualityScore: 96.5,
    status: 'APPROVED',
    payoutTxId: 'PAYOUT-SB-8920199',
    evaluationSummary: 'All criteria satisfied. Unit tests 100% passing. Automatic PayPal payout dispatched.',
  },
  {
    id: 'escrow-2',
    contractTitle: 'Rust High-Performance WebSocket Engine',
    freelancerName: 'Vikram Patel',
    freelancerEmail: 'vikram.rust@sandbox.paypal.com',
    amount: 600.00,
    currency: 'USD',
    milestoneNumber: 1,
    totalMilestones: 2,
    deliverableUrl: 'https://github.com/org/ws-core/pull/12',
    criteria: [
      'Sub-5ms message latency under 50k concurrent conns',
      'Memory footprint under 128MB resident set size',
      'Full benchmark report & CI integration'
    ],
    qualityScore: null,
    status: 'PENDING_SUBMISSION',
  },
];

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub-1',
    name: 'GitHub Enterprise Copilot',
    category: 'Developer Tools',
    costMonthly: 190.00,
    billingFrequency: 'Monthly',
    status: 'ACTIVE',
    utilizationRate: 94,
    lastUsedDaysAgo: 1,
    renewalDate: '2026-10-24',
    paypalAgreementId: 'I-SUB-89201A',
    aiRecommendation: 'High utilization (94%). Optimal ROI maintained.',
  },
  {
    id: 'sub-2',
    name: 'Figma Organization (Inactive Seats)',
    category: 'Design & Collaboration',
    costMonthly: 168.00,
    billingFrequency: 'Monthly',
    status: 'FLAGGED_WASTE',
    utilizationRate: 18,
    lastUsedDaysAgo: 48,
    renewalDate: '2026-10-12',
    paypalAgreementId: 'I-SUB-33921B',
    aiRecommendation: '4 unused seats detected ($168/mo). Recommend pausing or downgrading via PayPal Subscriptions API.',
  },
  {
    id: 'sub-3',
    name: 'Datadog APM Cluster Monitoring',
    category: 'DevOps & Observability',
    costMonthly: 310.00,
    billingFrequency: 'Monthly',
    status: 'ACTIVE',
    utilizationRate: 88,
    lastUsedDaysAgo: 0,
    renewalDate: '2026-11-01',
    paypalAgreementId: 'I-SUB-99482C',
    aiRecommendation: 'Essential telemetry infrastructure. Healthy consumption rate.',
  },
  {
    id: 'sub-4',
    name: 'Dormant SEO Keyword Tracker',
    category: 'Marketing',
    costMonthly: 79.00,
    billingFrequency: 'Monthly',
    status: 'FLAGGED_WASTE',
    utilizationRate: 4,
    lastUsedDaysAgo: 63,
    renewalDate: '2026-10-15',
    paypalAgreementId: 'I-SUB-11204D',
    aiRecommendation: 'Zero search queries in 60 days. Cancel immediately via PayPal API to reclaim $79/mo.',
  },
];

export const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'log-1',
    timestamp: '17:34:10',
    agent: 'ProcureBot AI',
    event: 'PayPal Vault Capture Settled',
    details: 'Order PAYPAL-SB-849204A for $120.00 USD processed instantly under auto-approve envelope.',
    badgeType: 'success',
  },
  {
    id: 'log-2',
    timestamp: '16:15:22',
    agent: 'EscrowSentinel',
    event: 'Milestone Quality Verified',
    details: 'PR #18 scored 98.4% by Gemini AST audit. Released $450.00 USD escrow via Payouts API.',
    badgeType: 'success',
  },
  {
    id: 'log-3',
    timestamp: '15:02:45',
    agent: 'ProcureBot AI',
    event: 'Policy Threshold Intercept',
    details: 'H100 GPU cluster ($380.00) exceeds $200.00 auto-approve envelope. Escalated to human dashboard.',
    badgeType: 'warning',
  },
  {
    id: 'log-4',
    timestamp: '12:20:11',
    agent: 'FleetM2M MicroBot',
    event: 'Machine-to-Machine Settlement',
    details: '3,500 leads delivered by DataScraper Fleet Bot #7. $8.75 USD settled via instant micro-transfer.',
    badgeType: 'info',
  },
  {
    id: 'log-5',
    timestamp: '09:40:00',
    agent: 'SubSense Arbiter',
    event: 'Subscription Waste Intercept',
    details: 'Zero activity on Analytics tool for 60d. Initiated PayPal Billing Agreement dispute for $79.00 USD.',
    badgeType: 'error',
  },
];
