# 🛡️ AgentVault AI: The Autonomous Financial Operating System for AI Agents & Commerce

> **Submission for "Build What's Next with PayPal and AI" Global Hackathon**
>
> 🏆 Targeting: **Best Overall**, **Best Use of Agentic Commerce**, **Best Use of PayPal + AI**, **Most Impactful**, and **Best Use of AG Grid**.

---

## 🌟 Executive Summary & Problem

As artificial intelligence agents evolve from conversational assistants into autonomous workers—procuring cloud servers, ordering software licenses, hiring freelance contractors, and trading datasets—they hit a fundamental wall: **How do we give AI agents the ability to spend and receive money safely without giving away unrestricted credit card access?**

**AgentVault AI** solves this by putting **PayPal** and **Google Gemini** at the center of the autonomous financial workflow. It establishes an enterprise-grade agentic financial operating system featuring **scoped budget envelopes**, **real-time LLM risk guardrails**, **AI deliverable-verifying escrows**, **automated SaaS dispute arbiters**, and an **interactive AG Grid command center**.

---

## 🚀 Key Innovations & Features

### 1. 🤖 Autonomous Agentic Commerce & Budget Vaults
- Dedicated subagent wallets (*ProcureBot AI*, *EscrowSentinel*, *SubSense Arbiter*, *FleetM2M MicroBot*).
- Dynamic auto-approval thresholds: Transactions under policy limit execute autonomously via **PayPal Orders API v2** & **Vault API**; larger transactions trigger human-in-the-loop guardrail approval.
- Granular purchasing envelopes (e.g. only permitted for *API Tokens* and *Dev Tools*).

### 2. 🛡️ AI Deliverable-Verifying Milestone Escrow
- Solves trust issues in the gig and agent-contractor economy.
- Gemini autonomously reviews submitted code artifacts, GitHub PRs, and test suites against strict acceptance criteria.
- Automatically calculates quality scores (0–100%) and dispatches instant milestone payouts using the **PayPal Payouts API**.

### 3. ⚡ SubSense: PayPal Subscription & Dispute Arbiter
- Real-time audit of active **PayPal Subscriptions API** billing agreements.
- Scans team telemetry logs to detect dormant "ghost" seats (<20% activity).
- One-click and automated remediation to pause seats, downgrade tiers, or file automated disputes to recover wasted cash flow.

### 4. 📊 Flagship AG Grid Financial & Telemetry Command Center
- Real-time transaction ledger powered by **AG Grid**.
- Custom cell renderers with glowing risk rating gauges (Safe/Moderate/High Risk).
- Inline actions to approve held transactions, inspect full Gemini Chain-of-Thought (CoT) reasoning steps, or file instant PayPal disputes.
- Instant multi-column filtering, quick search, and CSV export.

---

## 🛠️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │            Frontend: Next.js 14 + Tailwind CSS              │
   │  - AG Grid Dark Theme Data Grid with Custom Cell Renderers  │
   │  - 1-Click Interactive Multi-Agent Scenario Hub             │
   │  - Real-time Vault & Subscriptions Intelligence Dashboard   │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
   ┌──────────────────────────────▼──────────────────────────────┐
   │                  Agentic Backend & Orchestration             │
   │  - Google Gemini Function Calling & Multi-Agent Reasoning   │
   │  - Policy Verification Engine & Dynamic Guardrail Envelopes │
   └───────────────┬─────────────────────────────┬───────────────┘
                   │                             │
   ┌───────────────▼──────────────┐ ┌────────────▼───────────────┐
   │      PayPal Developer APIs   │ │     External Telemetry     │
   │  - Orders API v2 (Vault)     │ │  - GitHub PR / Code Check  │
   │  - Payouts API (Escrow)      │ │  - Team SaaS Activity Logs │
   │  - Subscriptions API         │ │  - M2M Agent Dataset P2P  │
   └──────────────────────────────┘ └────────────────────────────┘
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js 18+ (Tested on Node 20+)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-username/agentvault-paypal-ai.git
cd agentvault-paypal-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔑 Sandbox & API Configuration
Click the **Settings ⚙️** icon in the top right navbar to input your:
1. `PayPal Sandbox Client ID & Secret` (From [developer.paypal.com](https://developer.paypal.com/))
2. `Google Gemini API Key` (Optional — the app includes built-in intelligent heuristic reasoning out of the box).

---

## 🎬 3-Minute Demo Storyboard for Submission Video

1. **The Hook (0:00 - 0:30)**: Introduce the challenge of giving AI agents financial autonomy and show AgentVault's futuristic dashboard.
2. **Autonomous Procurement (0:30 - 1:15)**: Click *"Procure $120 OpenAI API tokens"*. Watch Gemini inspect the budget envelope, verify the policy threshold, and execute a PayPal Order v2 capture in real-time.
3. **Escrow Deliverable Verification (1:15 - 2:00)**: Switch to Milestone Escrow. Submit a deliverable PR, watch Gemini evaluate code coverage (96.5%), and auto-release the \$350 milestone via the PayPal Payouts API.
4. **SubSense SaaS Arbiter & AG Grid Audit (2:00 - 2:45)**: Demonstrate the AG Grid ledger, filter high-risk transactions, inspect the agent's Chain-of-Thought, and 1-click remediate \$247/mo in dormant subscriptions.
5. **Conclusion & Vision (2:45 - 3:00)**: The future of agentic commerce powered by PayPal.

---

## 📄 License
MIT License. Built for the **Build What's Next with PayPal and AI** Hackathon.
