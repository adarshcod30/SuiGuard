<div align="center">
  <img src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" width="100"/>
  <h1>🛡️ SuiGuard</h1>
  <p><strong>Intelligent AI Intent Engine & Pre-Flight Guardian for the Sui Network</strong></p>
  
  [![Built for Sui Overflow 2026](https://img.shields.io/badge/Built_for-Sui_Overflow_2026-6fbcf0?style=for-the-badge)](https://sui.io/)
  [![Powered by LangGraph](https://img.shields.io/badge/Powered_by-LangGraph-green?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
  [![Amazon Nova](https://img.shields.io/badge/LLM-Amazon_Nova-orange?style=for-the-badge)](https://aws.amazon.com/bedrock/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
  
</div>

---

## 📖 What is SuiGuard?

SuiGuard is an **Agentic Web Application** that revolutionizes how users interact with the Sui Blockchain. It replaces complex decentralized application (dApp) interfaces and manual wallet interactions with a unified, natural language **Intent Engine**.

Instead of manually calculating slippage, finding liquidity pools, and formatting raw transactions, users simply type what they want to do:
> *"Swap 10 SUI for USDC"* or *"Send 5 SUI to 0x123..."*

SuiGuard's LangGraph-powered AI agent parses the intent, automatically compiles the corresponding **Programmable Transaction Block (PTB)** using the Sui TypeScript SDK, and runs it through a robust **5-Tier Pre-Flight Guardian Simulator** to ensure the transaction is completely safe before the user ever signs it.

---

## ✨ Core Features

### 🧠 1. Agentic Intent Engine (Powered by Amazon Nova)
Powered by AWS Bedrock's lightweight and lightning-fast **Amazon Nova** models, our LangGraph agent extracts complex financial goals from unstructured natural language and maps them perfectly to Sui actions. 
- **Understands Context:** Handles swaps, transfers, staking, and balance queries.
- **Auto-Correction:** Intelligently corrects token symbols and formatting errors.

### 🔨 2. Automated PTB Compiler
The Sui blockchain relies on Programmable Transaction Blocks (PTBs) to batch operations. Our backend completely abstracts this complexity.
- Translates AI intents directly into native `@mysten/sui` Transaction objects.
- Dynamically splits coins, calculates network fees, and prepares safe module routes (e.g., Cetus / Turbos testnet routers).

### 🛡️ 3. Pre-Flight Guardian Simulator
Before presenting the compiled PTB to the user, SuiGuard runs it through a 5-tier safety simulator to catch catastrophic risks *before* execution:
1. **Slippage Analytics:** Simulates pool depth to block trades with >5% price impact.
2. **Oracle Staleness:** Verifies Sui Network epoch timestamps to prevent trading on stale price data.
3. **Balance Utilization:** Ensures the user retains enough reserve SUI for future gas fees.
4. **Large Transaction Warnings:** Flags oversized market orders to prevent sandwich attacks.
5. **Address Verification:** Cross-checks recipient addresses against on-chain transaction history.

### 🔎 4. Verifiable AI Trace
Transparency is critical in Agentic Web applications. SuiGuard includes a built-in **Live Backend Trace Terminal**.
- **In-App Terminal:** Users and judges can expand a terminal UI to watch the AI's internal monologue, see the exact JSON schemas extracted, and view the Guardian score logs live.
- **LangSmith Integration:** Every single LLM prompt, token usage metric, and latency timestamp is securely logged and verifiable on LangSmith.

---

## 🏗️ Architecture

SuiGuard is a full-stack monorepo consisting of:

1. **Frontend (Vite + React + TailwindCSS):** 
   A stunning, responsive, and glassmorphism-inspired UI designed to feel premium and trustworthy. Deployed on Vercel.
2. **Backend (Node.js + Express + LangGraph):** 
   The brain of the operation. Manages the state machine, talks to AWS Bedrock, interfaces with the Sui Testnet, and processes all PTB compilations safely off-client. Deployed on Render.

---

## 🚀 Quick Start Guide (Run Locally)

Want to run SuiGuard on your own machine? It's incredibly easy.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- An AWS Account with Bedrock Amazon Nova model access
- A LangSmith account (for tracing)

### 1. Clone the Repository
```bash
git clone https://github.com/adarshcod30/SuiGuard.git
cd SuiGuard
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
# AWS Bedrock credentials (Amazon Nova models)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# LangSmith Tracing
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_api_key
LANGCHAIN_PROJECT=suiguard-intent-engine

# Network (testnet or mainnet)
SUI_NETWORK=testnet
PORT=3001
```
Start the backend server:
```bash
npm run dev
```
*(Note: On the first run, the backend will automatically generate a Sui Wallet, write the private key to your `.env`, and request free Testnet SUI from the faucet!)*

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory (Optional if running locally):
```env
VITE_API_URL=http://localhost:3001
```
Start the frontend:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🛠️ Built With

- **[Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript):** For all on-chain interactions, wallet management, and Programmable Transaction Block (PTB) building.
- **[LangGraph JS](https://langchain-ai.github.io/langgraphjs/):** For orchestrating the robust, multi-step Agentic AI pipeline (Parsing -> Compiling -> Guardian -> Executing).
- **[AWS Bedrock (Amazon Nova)](https://aws.amazon.com/bedrock/nova/):** The core Large Language Model parsing natural language efficiently and cheaply.
- **[React & TailwindCSS](https://react.dev/):** For building the deeply informative, highly responsive, and beautiful user interface.
- **[Vite](https://vitejs.dev/):** For lightning-fast frontend compilation.

---

## 🤝 Contributing

Contributions are always welcome! 
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

<div align="center">
  <p>Built with ❤️ for <strong>Sui Overflow 2026</strong></p>
</div>
