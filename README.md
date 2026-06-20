# SuiGuard — Intent Engine for Safe DeFi on Sui

> **Sui Overflow 2026 · Agentic Web Track · Sub-track 3: Intent Engine**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Sui](https://img.shields.io/badge/Sui-Testnet-6fbcf0)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic-green)

---

## 🛡️ What is SuiGuard?

**SuiGuard** is an intent engine that makes DeFi on Sui safe and accessible for everyone — especially first-time users in emerging markets who lose money daily to three invisible dangers:

1. **Slippage they never calculated** — users accept defaults and lose value
2. **Stale price data** — pools serve outdated rates during volatile periods with no warning
3. **Unreadable transactions** — users sign hex blobs they cannot understand

### How SuiGuard Fixes This

The user types what they want in **plain English**. SuiGuard:

1. **Parses** their intent using GPT-4o-mini into a structured action
2. **Compiles** a Sui Programmable Transaction Block (PTB)
3. **Runs a 5-layer Guardian risk analysis** that catches slippage, stale oracle data, balance overreach, address validity, and large-trade concentration risk
4. **Shows a plain-English preview** of exactly what will happen
5. **Requires explicit confirmation** before a single byte goes to the blockchain

---

## 🏗️ Why Sui? (Critical Architectural Advantage)

**Sui's Programmable Transaction Blocks (PTBs) are a unique primitive** — they allow chaining N operations into a single atomic transaction. This is what makes the guardian check and execution **trustless**:

> The Guardian analyses the **SAME PTB** that gets executed. No re-construction, no bait-and-switch between preview and execution. No other L1 has this.

On Ethereum, a preview of "swap USDC → ETH" is just a *promise* — the actual transaction could do something entirely different. On Sui, the PTB **is** the transaction. What you see in the Guardian review is exactly what gets signed and submitted.

This architectural property enables:
- **Atomic composition**: Split coins + transfer + swap in one transaction
- **Same-object guarantee**: The PTB previewed = the PTB executed
- **Gas efficiency**: One signature, one execution, one fee

---

## 🧠 Architecture

```
┌──────────────┐     ┌─────────────────────────────────────────────┐
│   Frontend   │────▶│              LangGraph Pipeline             │
│  React/Vite  │     │                                             │
│              │     │  ① Intent Parser (GPT-4o-mini)              │
│  Plain       │     │       ↓                                     │
│  English     │     │  ② PTB Compiler (Sui Transaction Builder)   │
│  Input       │     │       ↓                                     │
│              │     │  ③ Guardian (5-Layer Risk Analysis)          │
│  Guardian    │◀────│       ↓                                     │
│  Review      │     │  ④ Human Confirmation (API boundary)        │
│              │     │       ↓                                     │
│  Success     │◀────│  ⑤ Executor (signAndExecuteTransaction)     │
└──────────────┘     └─────────────────────────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │   Sui Testnet    │
                              │   Blockchain     │
                              └──────────────────┘
```

### Guardian Risk Checks

| # | Check | What it catches |
|---|-------|----------------|
| 1 | **Slippage Analysis** | Large trades in shallow pools that would lose >1-5% to price impact |
| 2 | **Stale Oracle Detection** | Pool price data older than 5-15 minutes during volatile periods |
| 3 | **Balance Utilization** | Transactions that would use >80% of wallet balance or exceed it |
| 4 | **Recipient Validation** | Invalid address formats or addresses with no on-chain history |
| 5 | **Transaction Size** | Unusually large trades that should be split for safety |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- An OpenAI API key (GPT-4o-mini)
- A LangChain/LangSmith API key (free at [smith.langchain.com](https://smith.langchain.com))

### 1. Clone & Install

```bash
git clone https://github.com/adarshcod30/SuiGuard.git
cd SuiGuard

# Backend
cd backend
npm install
cp .env .env.local  # Edit with your API keys

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
OPENAI_API_KEY=sk-your-key-here
LANGCHAIN_API_KEY=lsv2_your-key-here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=suiguard-intent-engine
SUI_NETWORK=testnet
PORT=3001
```

### 3. Setup Wallet (Auto-generates + Funds)

```bash
cd backend
npm run setup-wallet
```

This will:
- Generate an Ed25519 keypair
- Save the private key to `.env`
- Request testnet SUI from the faucet

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 💬 Example Intents

| Input | Action |
|-------|--------|
| "Send 0.5 SUI to 0xabc..." | Transfer SUI to address |
| "Swap 10 SUI for USDC" | DEX swap with slippage check |
| "What is my balance?" | Read-only balance query |
| "Transfer 1 SUI to 0xdef..." | Transfer with recipient validation |

---

## 🔍 LangSmith Tracing

Every intent runs through LangGraph with full tracing on LangSmith:

- View the exact LLM prompts and parsed outputs
- See each node's execution time
- Debug guardian risk flag logic
- Monitor token usage and costs

Access your traces at: `https://smith.langchain.com/projects/p/suiguard-intent-engine`

---

## 📁 Project Structure

```
suiguard/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express API server
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── graph.ts           # LangGraph state machine
│   │   ├── nodes/
│   │   │   ├── intentParser.ts  # GPT-4o-mini intent extraction
│   │   │   ├── ptbCompiler.ts   # Sui PTB builder
│   │   │   ├── guardian.ts      # 5-layer risk analysis
│   │   │   └── executor.ts     # Transaction signer + submitter
│   │   └── sui/
│   │       ├── client.ts       # Sui testnet client
│   │       └── wallet.ts       # Keypair management + faucet
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main app with stage routing
│   │   ├── components/
│   │   │   ├── IntentInput.tsx   # Natural language input
│   │   │   ├── GuardianReview.tsx # Risk analysis display
│   │   │   ├── SuccessScreen.tsx  # Transaction result
│   │   │   └── LoadingState.tsx   # Pipeline progress
│   │   └── index.css           # Tailwind + custom styles
│   ├── index.html
│   └── vite.config.ts
└── README.md
```

---

## 🏆 Hackathon Track Alignment

### Agentic Web — Intent Engine (Sub-track 3)

> *"Build interfaces where users express goals in natural language and an agent handles the rest."*

SuiGuard is exactly this:
- **Natural language → Structured intent** (LLM parsing)
- **Intent → Executable transaction** (PTB compilation)
- **Safety-first execution** (Guardian risk analysis)
- **Human-in-the-loop** (explicit confirmation required)

### Judging Criteria Coverage

| Criteria (Weight) | How SuiGuard Addresses It |
|-------------------|--------------------------|
| **Real-World Application (50%)** | Solves actual DeFi user loss from slippage, stale data, and unreadable transactions. Targets emerging market users who are most vulnerable. |
| **Technical Implementation (20%)** | LangGraph state machine, Sui PTB compilation, 5-layer risk engine, LangSmith tracing, real testnet execution |
| **Product & UX (20%)** | Plain English input, visual risk scoring, step-by-step PTB preview, one-click confirmation |
| **Presentation & Vision (10%)** | Clear README, architecture diagrams, demo-ready with testnet transactions |

---

## 🛠️ Tech Stack

- **LLM**: GPT-4o-mini (via LangChain)
- **Agent Framework**: LangGraph (state machine with conditional edges)
- **Blockchain**: Sui (testnet) with @mysten/sui SDK
- **Backend**: Express.js + TypeScript
- **Frontend**: React + Vite + Tailwind CSS
- **Observability**: LangSmith tracing
- **Key Management**: Auto-generated Ed25519 keypair

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built with 🛡️ for Sui Overflow 2026**
